import { and, desc, eq, ilike, or } from "drizzle-orm";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { getDb } from "./db/client";
import { registries, users } from "./db/schema";
import { slugify } from "./format";
import { resolveGiftImageUrl } from "./amazon-image";
import { enrichProductUrl } from "./enrich";
import {
  amazonNeedsImageResolve,
  sanitizeProductImageUrl,
} from "./product-image";
import type {
  CashFund,
  GiftCategory,
  GiftItem,
  Occasion,
  Registry,
  RegistryPhoto,
  SessionUser,
} from "./types";

function rowToRegistry(row: typeof registries.$inferSelect): Registry {
  const items = (((row.items as GiftItem[] | null) ?? []) as GiftItem[]).map(
    (item) => ({
      ...item,
      imageUrl: sanitizeProductImageUrl(item.imageUrl),
    }),
  );
  const categories = (
    ((row as { categories?: GiftCategory[] | null }).categories as
      | GiftCategory[]
      | null) ?? []
  ).map((c, index) => ({
    ...c,
    imageUrl: sanitizeProductImageUrl(c.imageUrl),
    sortOrder: c.sortOrder ?? index,
  }));
  return {
    id: row.id,
    slug: row.slug,
    ownerId: row.ownerId,
    title: row.title,
    occasion: row.occasion as Occasion,
    story: row.story,
    coverImageUrl: row.coverImageUrl,
    photos: (row.photos as RegistryPhoto[] | null) ?? [],
    eventDate: row.eventDate ?? undefined,
    location: row.location ?? undefined,
    upiId: row.upiId ?? undefined,
    upiName: row.upiName ?? undefined,
    isPublic: row.isPublic ?? true,
    categories,
    items,
    funds: ((row.funds as CashFund[] | null) ?? []) as CashFund[],
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

async function hydrateRegistryItems(registry: Registry): Promise<Registry> {
  let changed = false;
  const items = await Promise.all(
    registry.items.map(async (item) => {
      let next = {
        ...item,
        imageUrl: sanitizeProductImageUrl(item.imageUrl),
      };

      if (!next.imageUrl && amazonNeedsImageResolve(item)) {
        const imageUrl = await resolveGiftImageUrl({
          imageUrl: item.imageUrl,
          productUrl: item.productUrl,
        });
        if (imageUrl) {
          next = { ...next, imageUrl };
          changed = true;
        }
      }

      // Backfill missing store prices (FirstCry often needs MRP + Dis parsing).
      if (
        (!next.price || next.price <= 0) &&
        next.productUrl &&
        /firstcry\.com|flipkart\.com|myntra\.com/i.test(next.productUrl)
      ) {
        try {
          const enriched = await enrichProductUrl(next.productUrl);
          if (enriched.price && enriched.price > 0) {
            next = {
              ...next,
              price: enriched.price,
              imageUrl: next.imageUrl || enriched.imageUrl,
              title:
                next.title === "Amazon gift" ||
                next.title === `${next.storeName} gift`
                  ? enriched.title
                  : next.title,
            };
            changed = true;
          }
        } catch {
          /* keep existing */
        }
      }

      if (next.imageUrl !== item.imageUrl || next.price !== item.price) {
        changed = true;
      }
      return next;
    }),
  );

  if (!changed) return { ...registry, items };

  const db = await getDb();
  await db
    .update(registries)
    .set({ items, updatedAt: new Date() })
    .where(eq(registries.id, registry.id));

  return { ...registry, items };
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<SessionUser> {
  const email = input.email.toLowerCase().trim();
  const db = await getDb();
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (existing) {
    throw new Error("An account with this email already exists.");
  }
  const id = nanoid();
  await db.insert(users).values({
    id,
    name: input.name.trim(),
    email,
    passwordHash: await bcrypt.hash(input.password, 10),
  });
  return { id, name: input.name.trim(), email };
}

export async function verifyUser(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  const db = await getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase().trim()),
  });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return { id: user.id, name: user.name, email: user.email };
}

export async function getUserById(id: string): Promise<SessionUser | null> {
  const db = await getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email };
}

export async function listRegistriesForOwner(ownerId: string) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(registries)
    .where(eq(registries.ownerId, ownerId))
    .orderBy(desc(registries.updatedAt));
  return rows.map(rowToRegistry);
}

export async function getRegistryBySlug(slug: string) {
  const db = await getDb();
  const row = await db.query.registries.findFirst({
    where: eq(registries.slug, slug),
  });
  if (!row) return null;
  return hydrateRegistryItems(rowToRegistry(row));
}

export async function getRegistryById(id: string) {
  const db = await getDb();
  const row = await db.query.registries.findFirst({
    where: eq(registries.id, id),
  });
  if (!row) return null;
  return hydrateRegistryItems(rowToRegistry(row));
}

export async function searchPublicRegistries(query: string) {
  const db = await getDb();
  const q = query.toLowerCase().trim();
  const rows = q
    ? await db
        .select()
        .from(registries)
        .where(
          and(
            eq(registries.isPublic, true),
            or(
              ilike(registries.title, `%${q}%`),
              ilike(registries.location, `%${q}%`),
              ilike(registries.slug, `%${q}%`),
            ),
          ),
        )
        .orderBy(desc(registries.createdAt))
        .limit(24)
    : await db
        .select()
        .from(registries)
        .where(eq(registries.isPublic, true))
        .orderBy(desc(registries.createdAt))
        .limit(24);
  return rows.map(rowToRegistry);
}

async function uniqueSlug(base: string) {
  let slug = slugify(base) || "registry";
  let i = 0;
  while (await getRegistryBySlug(slug)) {
    i += 1;
    slug = `${slugify(base)}-${i}`;
  }
  return slug;
}

export async function createRegistry(input: {
  ownerId: string;
  title: string;
  occasion: Occasion;
  story?: string;
  coverImageUrl?: string;
  eventDate?: string;
  location?: string;
  upiId?: string;
  upiName?: string;
}) {
  const db = await getDb();
  const id = nanoid();
  const slug = await uniqueSlug(input.title);
  const now = new Date();
  await db.insert(registries).values({
    id,
    slug,
    ownerId: input.ownerId,
    title: input.title.trim(),
    occasion: input.occasion,
    story:
      input.story?.trim() ||
      "Thank you for celebrating with us. Your presence is the greatest gift.",
    coverImageUrl:
      input.coverImageUrl ||
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1600&q=80",
    photos: [],
    eventDate: input.eventDate,
    location: input.location,
    upiId: input.upiId,
    upiName: input.upiName || input.title,
    isPublic: true,
    categories: [],
    items: [],
    funds: [],
    createdAt: now,
    updatedAt: now,
  });
  const created = await getRegistryById(id);
  if (!created) throw new Error("Failed to create registry");
  return created;
}

export async function updateRegistry(
  id: string,
  ownerId: string,
  patch: Partial<
    Pick<
      Registry,
      | "title"
      | "story"
      | "coverImageUrl"
      | "photos"
      | "eventDate"
      | "location"
      | "upiId"
      | "upiName"
      | "isPublic"
      | "occasion"
      | "categories"
      | "items"
      | "funds"
    >
  >,
) {
  const existing = await getRegistryById(id);
  if (!existing || existing.ownerId !== ownerId) return null;
  const db = await getDb();
  await db
    .update(registries)
    .set({
      ...patch,
      updatedAt: new Date(),
    })
    .where(and(eq(registries.id, id), eq(registries.ownerId, ownerId)));
  return getRegistryById(id);
}

export async function addGiftItem(
  registryId: string,
  ownerId: string,
  item: Omit<GiftItem, "id" | "status" | "currency"> & { currency?: "INR" },
) {
  const registry = await getRegistryById(registryId);
  if (!registry || registry.ownerId !== ownerId) return null;
  const gift: GiftItem = {
    ...item,
    id: nanoid(),
    currency: "INR",
    status: "available",
  };
  const items = [gift, ...registry.items];
  await updateRegistry(registryId, ownerId, { items });
  return gift;
}

export async function updateGiftItem(
  registryId: string,
  ownerId: string,
  itemId: string,
  patch: {
    title?: string;
    description?: string;
    imageUrl?: string | null;
    price?: number | null;
    storeName?: string;
    productUrl?: string;
    categoryId?: string | null;
    status?: GiftItem["status"];
  },
) {
  const registry = await getRegistryById(registryId);
  if (!registry || registry.ownerId !== ownerId) return null;
  const idx = registry.items.findIndex((i) => i.id === itemId);
  if (idx < 0) return null;
  const current = registry.items[idx];
  const next: GiftItem = {
    ...current,
    title: patch.title ?? current.title,
    description:
      patch.description !== undefined ? patch.description : current.description,
    storeName: patch.storeName ?? current.storeName,
    productUrl: patch.productUrl ?? current.productUrl,
    status: patch.status ?? current.status,
    imageUrl:
      patch.imageUrl === undefined
        ? current.imageUrl
        : sanitizeProductImageUrl(patch.imageUrl || undefined),
    price:
      patch.price === undefined
        ? current.price
        : patch.price == null
          ? undefined
          : patch.price,
    categoryId:
      patch.categoryId === undefined
        ? current.categoryId
        : patch.categoryId || undefined,
  };
  const items = [...registry.items];
  items[idx] = next;
  await updateRegistry(registryId, ownerId, { items });
  return next;
}

export async function deleteGiftItem(
  registryId: string,
  ownerId: string,
  itemId: string,
) {
  const registry = await getRegistryById(registryId);
  if (!registry || registry.ownerId !== ownerId) return null;
  const items = registry.items.filter((i) => i.id !== itemId);
  if (items.length === registry.items.length) return null;
  await updateRegistry(registryId, ownerId, { items });
  return true;
}

export async function addGiftCategory(
  registryId: string,
  ownerId: string,
  input: { name: string; imageUrl?: string },
) {
  const registry = await getRegistryById(registryId);
  if (!registry || registry.ownerId !== ownerId) return null;
  const category: GiftCategory = {
    id: nanoid(),
    name: input.name.trim(),
    imageUrl: sanitizeProductImageUrl(input.imageUrl),
    sortOrder: registry.categories.length,
  };
  const categories = [...registry.categories, category];
  await updateRegistry(registryId, ownerId, { categories });
  return category;
}

export async function updateGiftCategory(
  registryId: string,
  ownerId: string,
  categoryId: string,
  patch: Partial<Pick<GiftCategory, "name" | "imageUrl" | "sortOrder">>,
) {
  const registry = await getRegistryById(registryId);
  if (!registry || registry.ownerId !== ownerId) return null;
  const idx = registry.categories.findIndex((c) => c.id === categoryId);
  if (idx < 0) return null;
  const categories = [...registry.categories];
  categories[idx] = {
    ...categories[idx],
    ...patch,
    name: patch.name?.trim() || categories[idx].name,
    imageUrl:
      patch.imageUrl !== undefined
        ? sanitizeProductImageUrl(patch.imageUrl)
        : categories[idx].imageUrl,
  };
  await updateRegistry(registryId, ownerId, { categories });
  return categories[idx];
}

export async function deleteGiftCategory(
  registryId: string,
  ownerId: string,
  categoryId: string,
) {
  const registry = await getRegistryById(registryId);
  if (!registry || registry.ownerId !== ownerId) return null;
  const categories = registry.categories.filter((c) => c.id !== categoryId);
  if (categories.length === registry.categories.length) return null;
  // Detach gifts from removed category
  const items = registry.items.map((item) =>
    item.categoryId === categoryId ? { ...item, categoryId: undefined } : item,
  );
  await updateRegistry(registryId, ownerId, { categories, items });
  return true;
}

export async function addCashFund(
  registryId: string,
  ownerId: string,
  fund: Omit<CashFund, "id" | "raisedAmount" | "contributors">,
) {
  const registry = await getRegistryById(registryId);
  if (!registry || registry.ownerId !== ownerId) return null;
  const created: CashFund = {
    ...fund,
    id: nanoid(),
    raisedAmount: 0,
    contributors: [],
  };
  const funds = [created, ...registry.funds];
  await updateRegistry(registryId, ownerId, { funds });
  return created;
}

export async function claimGift(input: {
  slug: string;
  itemId: string;
  name: string;
  message?: string;
  confirm: boolean;
}) {
  const registry = await getRegistryBySlug(input.slug);
  if (!registry) throw new Error("Registry not found");
  const items = [...registry.items];
  const idx = items.findIndex((i) => i.id === input.itemId);
  if (idx < 0) throw new Error("Gift not found");
  const item = { ...items[idx] };

  if (!input.confirm) {
    if (item.status === "reserved") {
      item.status = "available";
      item.giftedBy = undefined;
      item.giftedAt = undefined;
      items[idx] = item;
      const db = await getDb();
      await db
        .update(registries)
        .set({ items, updatedAt: new Date() })
        .where(eq(registries.id, registry.id));
    }
    return { registry: { ...registry, items }, item };
  }

  if (item.status === "purchased") {
    throw new Error("This gift was already claimed.");
  }
  item.status = "purchased";
  item.giftedBy = input.name.trim() || "Someone special";
  item.giftMessage = input.message?.trim() || undefined;
  item.giftedAt = new Date().toISOString();
  items[idx] = item;
  const db = await getDb();
  await db
    .update(registries)
    .set({ items, updatedAt: new Date() })
    .where(eq(registries.id, registry.id));
  return { registry: { ...registry, items }, item };
}

export async function confirmContribution(input: {
  slug: string;
  fundId: string;
  name: string;
  amount: number;
  message?: string;
  confirm: boolean;
}) {
  const registry = await getRegistryBySlug(input.slug);
  if (!registry) throw new Error("Registry not found");
  const funds = [...registry.funds];
  const idx = funds.findIndex((f) => f.id === input.fundId);
  if (idx < 0) throw new Error("Fund not found");
  const fund = { ...funds[idx], contributors: [...funds[idx].contributors] };

  if (!input.confirm) return { registry, fund };
  if (!input.amount || input.amount <= 0) {
    throw new Error("Enter a valid amount.");
  }
  fund.raisedAmount += input.amount;
  fund.contributors.unshift({
    name: input.name.trim() || "Someone special",
    amount: input.amount,
    message: input.message?.trim() || undefined,
    at: new Date().toISOString(),
  });
  funds[idx] = fund;
  const db = await getDb();
  await db
    .update(registries)
    .set({ funds, updatedAt: new Date() })
    .where(eq(registries.id, registry.id));
  return { registry: { ...registry, funds }, fund };
}
