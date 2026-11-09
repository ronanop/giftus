import { and, desc, eq, ilike, or } from "drizzle-orm";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { getDb } from "./db/client";
import { registries, users } from "./db/schema";
import { slugify } from "./format";
import type {
  CashFund,
  GiftItem,
  Occasion,
  Registry,
  RegistryPhoto,
  SessionUser,
} from "./types";

function rowToRegistry(row: typeof registries.$inferSelect): Registry {
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
    items: ((row.items as GiftItem[] | null) ?? []) as GiftItem[],
    funds: ((row.funds as CashFund[] | null) ?? []) as CashFund[],
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
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
  return row ? rowToRegistry(row) : null;
}

export async function getRegistryById(id: string) {
  const db = await getDb();
  const row = await db.query.registries.findFirst({
    where: eq(registries.id, id),
  });
  return row ? rowToRegistry(row) : null;
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
