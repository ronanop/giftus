"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import type { Occasion } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { isUsableProductImage } from "@/lib/product-image";
import {
  BABY_ARRIVAL_CATEGORY_NAMES,
  BABY_ARRIVAL_STORY_DEFAULT,
  COVER_IMAGE_GUIDE,
  isBabyArrivalOccasion,
} from "@/lib/baby-arrival-template";

const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: "baby_shower", label: "Baby Arrival" },
  { value: "wedding", label: "Wedding" },
  { value: "housewarming", label: "Housewarming" },
  { value: "anniversary", label: "Anniversary" },
  { value: "birthday", label: "Birthday" },
];

type LocalCategory = { localId: string; name: string };
type LocalGift = {
  localId: string;
  categoryLocalId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  storeName?: string;
  productUrl: string;
};

function starterCategories(occasion: Occasion): LocalCategory[] {
  if (!isBabyArrivalOccasion(occasion)) return [];
  return BABY_ARRIVAL_CATEGORY_NAMES.map((name) => ({
    localId: nanoid(),
    name,
  }));
}

export default function NewRegistryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [occasion, setOccasion] = useState<Occasion>("baby_shower");
  const [story, setStory] = useState(BABY_ARRIVAL_STORY_DEFAULT);
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [upiId, setUpiId] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [categories, setCategories] = useState<LocalCategory[]>(() =>
    starterCategories("baby_shower"),
  );
  const [gifts, setGifts] = useState<LocalGift[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const babyArrival = isBabyArrivalOccasion(occasion);

  const giftsByCategory = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        items: gifts.filter((g) => g.categoryLocalId === category.localId),
      }))
      .filter((group) => group.items.length > 0);
  }, [categories, gifts]);

  const uncategorizedGifts = useMemo(
    () => gifts.filter((g) => !g.categoryLocalId),
    [gifts],
  );

  function onOccasionChange(next: Occasion) {
    setOccasion(next);
    if (isBabyArrivalOccasion(next) && !story.trim()) {
      setStory(BABY_ARRIVAL_STORY_DEFAULT);
    }
    if (isBabyArrivalOccasion(next) && categories.length === 0) {
      setCategories(starterCategories(next));
    }
  }

  function addCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    const category = { localId: nanoid(), name };
    setCategories((prev) => [...prev, category]);
    setSelectedCategoryId(category.localId);
    setNewCategoryName("");
  }

  function removeCategory(localId: string) {
    setCategories((prev) => prev.filter((c) => c.localId !== localId));
    setGifts((prev) =>
      prev.map((g) =>
        g.categoryLocalId === localId ? { ...g, categoryLocalId: "" } : g,
      ),
    );
    if (selectedCategoryId === localId) setSelectedCategoryId("");
  }

  async function addGift() {
    if (!productUrl.trim()) return;
    setBusy(true);
    setError("");
    setMessage("Reading product…");
    try {
      const enrichRes = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl.trim() }),
      });
      const enrichData = await enrichRes.json();
      if (!enrichRes.ok) throw new Error(enrichData.error || "Enrich failed");
      const p = enrichData.product;
      setGifts((prev) => [
        {
          localId: nanoid(),
          categoryLocalId: selectedCategoryId,
          title: p.title,
          description: p.description,
          imageUrl: p.imageUrl,
          price: p.price,
          storeName: p.storeName,
          productUrl: p.productUrl,
        },
        ...prev,
      ]);
      setProductUrl("");
      setMessage(
        p.partial
          ? "Gift queued — store blocked full details; you can edit after create."
          : "Gift added",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add gift");
      setMessage("");
    } finally {
      setBusy(false);
    }
  }

  function removeGift(localId: string) {
    setGifts((prev) => prev.filter((g) => g.localId !== localId));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("Creating registry…");
    try {
      const res = await fetch("/api/registries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          occasion,
          story,
          location,
          eventDate,
          upiId,
          coverImageUrl: coverImageUrl || undefined,
          upiName: title,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create");
      const registryId = data.registry.id as string;

      const categoryIdMap = new Map<string, string>();
      for (const category of categories) {
        setMessage(`Saving category “${category.name}”…`);
        const catRes = await fetch(`/api/registries/${registryId}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: category.name }),
        });
        const catData = await catRes.json();
        if (!catRes.ok) {
          throw new Error(catData.error || "Could not save category");
        }
        categoryIdMap.set(category.localId, catData.category.id);
      }

      for (const gift of [...gifts].reverse()) {
        setMessage(`Saving gift “${gift.title}”…`);
        const itemRes = await fetch(`/api/registries/${registryId}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: gift.title,
            description: gift.description,
            imageUrl: gift.imageUrl,
            price: gift.price,
            storeName: gift.storeName,
            productUrl: gift.productUrl,
            categoryId: gift.categoryLocalId
              ? categoryIdMap.get(gift.categoryLocalId)
              : undefined,
          }),
        });
        const itemData = await itemRes.json();
        if (!itemRes.ok) {
          throw new Error(itemData.error || "Could not save gift");
        }
      }

      router.push(`/dashboard/${registryId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setMessage("");
    } finally {
      setBusy(false);
    }
  }

  function renderGiftRow(gift: LocalGift) {
    return (
      <li
        key={gift.localId}
        className="flex gap-3 rounded-2xl border border-mist bg-white p-3"
      >
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-mist">
          {isUsableProductImage(gift.imageUrl) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={gift.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{gift.title}</p>
          <p className="mt-0.5 text-xs text-ink/55">
            {[gift.storeName, gift.price ? formatINR(gift.price) : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => removeGift(gift.localId)}
          className="self-start rounded-full px-3 py-1.5 text-xs font-medium text-rose hover:bg-petal disabled:opacity-50"
        >
          Remove
        </button>
      </li>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
      <Link href="/dashboard" className="text-sm text-ink/60 hover:text-ink">
        ← Dashboard
      </Link>
      <h1 className="mt-6 font-display text-4xl text-ink">New registry</h1>
      <p className="mt-2 text-ink/65">
        {babyArrival
          ? "Start from the Baby Arrival template — add cover details, categories, and gifts here."
          : "Add your story, categories, and store gifts before you publish."}
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm">
          <span className="text-ink/60">Title</span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink/60">Occasion</span>
          <select
            value={occasion}
            onChange={(e) => onOccasionChange(e.target.value as Occasion)}
            className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
          >
            {OCCASIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        {babyArrival ? (
          <div className="rounded-2xl border border-grove/15 bg-parchment/80 px-4 py-3 text-sm text-grove-deep">
            <p className="font-medium">Baby Arrival template included</p>
            <p className="mt-1 text-grove/80">
              Invitation card, category explorer, gift grid, and cash gift are
              ready. Starter categories are listed below — add gifts anytime.
            </p>
          </div>
        ) : null}
        <label className="block text-sm">
          <span className="text-ink/60">Your story</span>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={4}
            placeholder="A few lines for your guests…"
            className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-ink/60">City</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink/60">Event date</span>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
            />
          </label>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">
            <span className="text-ink/60">Cover image URL</span>
            <input
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://… (or upload after creating)"
              className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
            />
          </label>
          <div className="rounded-2xl border border-grove/15 bg-parchment/70 px-4 py-3 text-sm text-grove-deep">
            <p className="font-medium">{COVER_IMAGE_GUIDE.label} size</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-grove/80">
              <li>Aspect: {COVER_IMAGE_GUIDE.aspect}</li>
              <li>Recommended: {COVER_IMAGE_GUIDE.recommended}</li>
              <li>Minimum: {COVER_IMAGE_GUIDE.minimum}</li>
              <li>{COVER_IMAGE_GUIDE.tip}</li>
            </ul>
            <p className="mt-2 text-grove/70">
              After create, you can also upload the cover file on the edit page.
            </p>
          </div>
        </div>
        <label className="block text-sm">
          <span className="text-ink/60">Your UPI ID</span>
          <input
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="name@oksbi"
            className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
          />
        </label>

        <section className="space-y-5 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(28,20,16,0.05)]">
          <div>
            <h2 className="font-display text-2xl">Gifts & categories</h2>
            <p className="mt-1 text-sm text-ink/60">
              Name categories, then paste store links — same flow as the main
              registry editor.
            </p>
          </div>

          <div className="rounded-2xl border border-mist bg-petal/40 p-4">
            <p className="text-sm font-medium text-ink">New category</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Living room"
                className="rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCategory();
                  }
                }}
              />
              <button
                type="button"
                disabled={busy || !newCategoryName.trim()}
                onClick={addCategory}
                className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper disabled:opacity-50"
              >
                Add category
              </button>
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <div
                  key={category.localId}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                    selectedCategoryId === category.localId
                      ? "border-rose bg-petal text-ink"
                      : "border-mist bg-white text-ink/80"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedCategoryId(category.localId)}
                    className="font-medium"
                  >
                    {category.name}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => removeCategory(category.localId)}
                    className="text-xs text-rose/80 hover:text-rose"
                    aria-label={`Remove ${category.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-mist px-4 py-6 text-center text-sm text-ink/55">
              No categories yet — create one above, or add gifts uncategorized.
            </p>
          )}

          <div className="border-t border-mist pt-5">
            <p className="text-sm font-medium text-ink">Add gift from any store</p>
            <p className="mt-1 text-sm text-ink/60">
              Paste an Amazon, Flipkart, Myntra, FirstCry, or any product link.
            </p>
            <div className="mt-3 grid gap-3">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-ink">
                  Choose category for gift
                </span>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="rounded-2xl border border-mist bg-white px-4 py-3 text-sm outline-none focus:border-rose"
                >
                  <option value="">Uncategorized</option>
                  {categories.map((c) => (
                    <option key={c.localId} value={c.localId}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="https://www.amazon.in/…"
                  className="rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
                />
                <button
                  type="button"
                  disabled={busy || !productUrl.trim()}
                  onClick={() => void addGift()}
                  className="rounded-full bg-rose px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Add gift
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {giftsByCategory.map(({ category, items }) => (
              <div key={category.localId}>
                <h3 className="font-display text-xl text-ink">{category.name}</h3>
                <ul className="mt-3 space-y-3">
                  {items.map((gift) => renderGiftRow(gift))}
                </ul>
              </div>
            ))}
            {uncategorizedGifts.length > 0 ? (
              <div>
                <h3 className="font-display text-xl text-ink">Uncategorized</h3>
                <ul className="mt-3 space-y-3">
                  {uncategorizedGifts.map((gift) => renderGiftRow(gift))}
                </ul>
              </div>
            ) : null}
            {gifts.length === 0 ? (
              <p className="text-sm text-ink/55">No gifts yet.</p>
            ) : null}
          </div>
        </section>

        {message ? <p className="text-sm text-grove">{message}</p> : null}
        {error ? <p className="text-sm text-rose">{error}</p> : null}
        <button
          disabled={busy}
          type="submit"
          className="rounded-full bg-rose px-6 py-3 text-sm font-semibold text-white hover:bg-rose-deep disabled:opacity-50"
        >
          {busy
            ? message || "Creating…"
            : babyArrival
              ? "Create Baby Arrival page"
              : "Create & customize"}
        </button>
      </form>
    </div>
  );
}
