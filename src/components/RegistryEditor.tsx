"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { BabyArrivalTheme, GiftItem, Registry } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { categoryImage, groupItemsByCategory } from "@/lib/categories";
import { isUsableProductImage } from "@/lib/product-image";
import {
  BABY_ARRIVAL_DEFAULTS,
  COVER_IMAGE_GUIDE,
  isBabyArrivalOccasion,
  resolveBabyArrivalTheme,
} from "@/lib/baby-arrival-template";

export function RegistryEditor({ initial }: { initial: Registry }) {
  const [registry, setRegistry] = useState({
    ...initial,
    categories: initial.categories || [],
  });
  const babyArrival = isBabyArrivalOccasion(registry.occasion);
  const resolvedTheme = resolveBabyArrivalTheme(registry.theme);
  const [title, setTitle] = useState(initial.title);
  const [story, setStory] = useState(initial.story);
  const [location, setLocation] = useState(initial.location || "");
  const [eventDate, setEventDate] = useState(initial.eventDate || "");
  const [upiId, setUpiId] = useState(initial.upiId || "");
  const [themeDraft, setThemeDraft] = useState<Required<BabyArrivalTheme>>({
    ...resolvedTheme,
  });
  const [productUrl, setProductUrl] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{
    title: string;
    price: string;
    categoryId: string;
  }>({ title: "", price: "", categoryId: "" });
  const [fundTitle, setFundTitle] = useState(
    babyArrival ? BABY_ARRIVAL_DEFAULTS.cashGiftTitle : "",
  );
  const [fundGoal, setFundGoal] = useState(25000);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coverDragging, setCoverDragging] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const grouped = useMemo(() => groupItemsByCategory(registry), [registry]);

  function flash(ok: string) {
    setMessage(ok);
    setError("");
  }

  function fail(e: unknown) {
    setError(e instanceof Error ? e.message : "Failed");
    setMessage("");
  }

  async function saveBasics() {
    setBusy(true);
    try {
      const res = await fetch(`/api/registries/${registry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          story,
          location: location.trim() || undefined,
          eventDate: eventDate || undefined,
          upiId,
          upiName: title.trim() || registry.title,
          theme: babyArrival ? themeDraft : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setRegistry(data.registry);
      if (data.registry.theme) {
        setThemeDraft(resolveBabyArrivalTheme(data.registry.theme));
      }
      flash("Saved page details");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  async function uploadCoverFile(file: File) {
    setBusy(true);
    setMessage("Uploading cover image…");
    try {
      const body = new FormData();
      body.append("file", file);
      const up = await fetch("/api/upload", { method: "POST", body });
      const uploaded = await up.json();
      if (!up.ok) throw new Error(uploaded.error || "Upload failed");
      const res = await fetch(`/api/registries/${registry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverImageUrl: uploaded.url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save cover");
      setRegistry(data.registry);
      flash("Cover image updated");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  async function createCategory() {
    if (!newCategoryName.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/registries/${registry.id}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create category");
      setRegistry((prev) => ({
        ...prev,
        categories: [...prev.categories, data.category],
      }));
      setSelectedCategoryId(data.category.id);
      setNewCategoryName("");
      flash(`Category “${data.category.name}” created`);
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  async function renameCategory(categoryId: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/registries/${registry.id}/categories`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not rename");
      setRegistry((prev) => ({
        ...prev,
        categories: prev.categories.map((c) =>
          c.id === categoryId ? data.category : c,
        ),
      }));
      flash("Category updated");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  async function removeCategory(categoryId: string) {
    if (
      !confirm(
        "Delete this category? Gifts inside it stay, but become uncategorized.",
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/registries/${registry.id}/categories`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not delete category");
      setRegistry((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c.id !== categoryId),
        items: prev.items.map((item) =>
          item.categoryId === categoryId
            ? { ...item, categoryId: undefined }
            : item,
        ),
      }));
      if (selectedCategoryId === categoryId) setSelectedCategoryId("");
      flash("Category removed");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  async function addProduct() {
    if (!productUrl) return;
    setBusy(true);
    setMessage("Reading product…");
    try {
      const enrichRes = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl }),
      });
      const enrichData = await enrichRes.json();
      if (!enrichRes.ok) throw new Error(enrichData.error || "Enrich failed");
      const p = enrichData.product;
      const res = await fetch(`/api/registries/${registry.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: p.title,
          description: p.description,
          imageUrl: p.imageUrl,
          price: p.price,
          storeName: p.storeName,
          productUrl: p.productUrl,
          categoryId: selectedCategoryId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add item");
      setRegistry((prev) => ({
        ...prev,
        items: [data.item, ...prev.items],
      }));
      setProductUrl("");
      flash(
        p.partial
          ? "Gift added — store blocked full details; you can edit it below."
          : "Gift added",
      );
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  function startEdit(item: GiftItem) {
    setEditingItemId(item.id);
    setEditDraft({
      title: item.title,
      price: item.price != null ? String(item.price) : "",
      categoryId: item.categoryId || "",
    });
  }

  async function saveEdit(itemId: string) {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/registries/${registry.id}/items/${itemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editDraft.title.trim(),
            price: editDraft.price ? Number(editDraft.price) : null,
            categoryId: editDraft.categoryId || null,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not update gift");
      setRegistry((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === itemId ? data.item : i)),
      }));
      setEditingItemId(null);
      flash("Gift updated");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  async function deleteItem(itemId: string) {
    if (!confirm("Remove this gift from the registry?")) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/registries/${registry.id}/items/${itemId}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not delete gift");
      setRegistry((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== itemId),
      }));
      if (editingItemId === itemId) setEditingItemId(null);
      flash("Gift removed");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  async function addFund() {
    if (!fundTitle) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/registries/${registry.id}/funds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: fundTitle,
          goalAmount: fundGoal,
          description: "Contribute any amount via UPI",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add fund");
      setRegistry((prev) => ({ ...prev, funds: [data.fund, ...prev.funds] }));
      setFundTitle("");
      flash("Fund added");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }

  function renderGiftRow(item: GiftItem) {
    const editing = editingItemId === item.id;
    return (
      <li
        key={item.id}
        className="rounded-2xl border border-mist bg-paper/40 p-3"
      >
        <div className="flex gap-3">
          {isUsableProductImage(item.imageUrl) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt=""
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="h-16 w-16 shrink-0 rounded-xl bg-mist" />
          )}
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="space-y-2">
                <input
                  value={editDraft.title}
                  onChange={(e) =>
                    setEditDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  className="w-full rounded-xl border border-mist px-3 py-2 text-sm outline-none focus:border-rose"
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="number"
                    value={editDraft.price}
                    onChange={(e) =>
                      setEditDraft((d) => ({ ...d, price: e.target.value }))
                    }
                    placeholder="Price (INR)"
                    className="rounded-xl border border-mist px-3 py-2 text-sm outline-none focus:border-rose"
                  />
                  <select
                    value={editDraft.categoryId}
                    onChange={(e) =>
                      setEditDraft((d) => ({
                        ...d,
                        categoryId: e.target.value,
                      }))
                    }
                    className="rounded-xl border border-mist bg-white px-3 py-2 text-sm outline-none focus:border-rose"
                  >
                    <option value="">Uncategorized</option>
                    {registry.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void saveEdit(item.id)}
                    className="rounded-full bg-rose px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItemId(null)}
                    className="rounded-full bg-mist px-4 py-1.5 text-xs font-medium text-ink"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="font-medium text-ink">{item.title}</p>
                <p className="text-sm text-ink/55">
                  {item.storeName}
                  {item.price ? ` · ${formatINR(item.price)}` : ""}
                  {item.status === "purchased" ? " · Gifted" : ""}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => startEdit(item)}
                    className="rounded-full border border-mist px-3 py-1 text-xs font-medium text-ink hover:bg-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void deleteItem(item.id)}
                    className="rounded-full border border-rose/30 px-3 py-1 text-xs font-medium text-rose hover:bg-petal"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </li>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard" className="text-sm text-ink/60 hover:text-ink">
          ← Dashboard
        </Link>
        <Link
          href={`/r/${registry.slug}`}
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper"
        >
          View live page
        </Link>
      </div>

      <h1 className="mt-6 font-display text-4xl text-ink">{registry.title}</h1>
      <p className="mt-1 text-sm text-ink/55">giftus.in/r/{registry.slug}</p>
      {babyArrival ? (
        <p className="mt-2 text-sm text-grove">
          Baby Arrival template — edit names, dates, cover, story, and gifts
          below. Guests see the whimsical live page.
        </p>
      ) : null}

      {(message || error) && (
        <p className={`mt-4 text-sm ${error ? "text-rose" : "text-sage"}`}>
          {error || message}
        </p>
      )}

      <section className="mt-10 space-y-4 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(28,20,16,0.05)]">
        <div>
          <h2 className="font-display text-2xl">
            {babyArrival ? "Page details" : "Story & UPI"}
          </h2>
          {babyArrival ? (
            <p className="mt-1 text-sm text-ink/60">
              Everything here appears on your public Baby Arrival page.
            </p>
          ) : null}
        </div>
        <label className="block text-sm">
          <span className="text-ink/60">Registry title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Shraddha's Baby Arrival"
            className="mt-1 w-full rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-ink/60">City</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink/60">Event date</span>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
            />
          </label>
        </div>
        {babyArrival ? (
          <>
            <label className="block text-sm">
              <span className="text-ink/60">Script line (invite card)</span>
              <input
                value={themeDraft.scriptLine}
                onChange={(e) =>
                  setThemeDraft((t) => ({ ...t, scriptLine: e.target.value }))
                }
                placeholder={BABY_ARRIVAL_DEFAULTS.scriptLine}
                className="mt-1 w-full rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink/60">Invite supporting line</span>
              <textarea
                value={themeDraft.inviteLede}
                onChange={(e) =>
                  setThemeDraft((t) => ({ ...t, inviteLede: e.target.value }))
                }
                rows={2}
                className="mt-1 w-full rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink/60">Story section heading</span>
              <input
                value={themeDraft.storyHeading}
                onChange={(e) =>
                  setThemeDraft((t) => ({ ...t, storyHeading: e.target.value }))
                }
                className="mt-1 w-full rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
              />
            </label>
          </>
        ) : null}
        <label className="block text-sm">
          <span className="text-ink/60">Your story</span>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink/60">UPI ID</span>
          <input
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="yourname@oksbi"
            className="mt-1 w-full rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
          />
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={() => void saveBasics()}
          className="rounded-full bg-rose px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          Save page details
        </button>
      </section>

      <section className="mt-6 space-y-4 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(28,20,16,0.05)]">
        <div>
          <h2 className="font-display text-2xl">Hero cover image</h2>
          <p className="mt-1 text-sm text-ink/60">
            This is the main photo under the navbar on your public page. Uploads
            go to Neon Object Storage; the image URL is saved on your registry in
            Neon Postgres.
          </p>
          <div className="mt-3 rounded-2xl border border-grove/15 bg-parchment/70 px-4 py-3 text-sm text-grove-deep">
            <p className="font-medium">{COVER_IMAGE_GUIDE.label}</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-grove/80">
              <li>Aspect: {COVER_IMAGE_GUIDE.aspect}</li>
              <li>Recommended size: {COVER_IMAGE_GUIDE.recommended}</li>
              <li>Minimum: {COVER_IMAGE_GUIDE.minimum}</li>
              <li>{COVER_IMAGE_GUIDE.maxDisplay}</li>
              <li>{COVER_IMAGE_GUIDE.tip}</li>
            </ul>
          </div>
        </div>
        {registry.coverImageUrl ? (
          <div className="overflow-hidden rounded-2xl border border-mist bg-mist/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={registry.coverImageUrl}
              alt=""
              className="aspect-[4/3] w-full max-w-md object-cover"
            />
          </div>
        ) : null}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={busy}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadCoverFile(file);
            e.currentTarget.value = "";
          }}
        />
        <div
          role="button"
          tabIndex={0}
          onClick={() => coverInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              coverInputRef.current?.click();
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setCoverDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setCoverDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setCoverDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setCoverDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file?.type.startsWith("image/")) void uploadCoverFile(file);
          }}
          className={`cursor-pointer rounded-[1.35rem] border border-dashed px-5 py-8 text-center transition ${
            coverDragging
              ? "border-grove bg-sage-soft/50"
              : "border-grove/30 bg-parchment/40 hover:border-grove/55 hover:bg-parchment/70"
          } ${busy ? "pointer-events-none opacity-60" : ""}`}
        >
          <p className="font-display text-lg text-grove-deep">
            {registry.coverImageUrl
              ? "Replace cover photo"
              : "Upload cover photo"}
          </p>
          <p className="mt-1 text-sm text-grove/70">
            Drag & drop, or click to choose a JPG / PNG / WebP
          </p>
          <span className="mt-4 inline-flex rounded-full bg-grove px-5 py-2.5 text-sm font-semibold text-parchment">
            {busy ? "Uploading…" : "Choose photo"}
          </span>
        </div>
      </section>

      <section className="mt-6 space-y-5 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(28,20,16,0.05)]">
        <div>
          <h2 className="font-display text-2xl">Gifts & categories</h2>
          <p className="mt-1 text-sm text-ink/60">
            Name categories like “Bedroom”, “Kitchen”, or “Baby clothes”, then
            drop store links into them. Category covers use a product image from
            that group.
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
                  void createCategory();
                }
              }}
            />
            <button
              type="button"
              disabled={busy || !newCategoryName.trim()}
              onClick={() => void createCategory()}
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper disabled:opacity-50"
            >
              Add category
            </button>
          </div>
        </div>

        {registry.categories.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {grouped.groups.map(({ category, items, imageUrl }) => {
              const cover =
                imageUrl || categoryImage(category, registry.items);
              return (
                <div
                  key={category.id}
                  className={`overflow-hidden rounded-2xl border ${
                    selectedCategoryId === category.id
                      ? "border-rose shadow-[0_10px_28px_rgba(184,74,94,0.15)]"
                      : "border-mist"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedCategoryId(category.id)}
                    className="relative block w-full text-left"
                  >
                    <div className="relative aspect-[16/9] bg-mist">
                      {isUsableProductImage(cover) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-petal to-sage-soft text-sm text-ink/50">
                          Add a gift for cover
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                        <p className="font-display text-lg">{category.name}</p>
                        <p className="text-xs text-white/80">
                          {items.length} gift{items.length === 1 ? "" : "s"}
                          {selectedCategoryId === category.id
                            ? " · selected"
                            : ""}
                        </p>
                      </div>
                    </div>
                  </button>
                  <div className="flex gap-2 border-t border-mist bg-white p-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        const next = prompt("Rename category", category.name);
                        if (next) void renameCategory(category.id, next);
                      }}
                      className="flex-1 rounded-full px-3 py-1.5 text-xs font-medium text-ink hover:bg-mist"
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void removeCategory(category.id)}
                      className="flex-1 rounded-full px-3 py-1.5 text-xs font-medium text-rose hover:bg-petal"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
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
                {registry.categories.map((c) => (
                  <option key={c.id} value={c.id}>
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
                disabled={busy || !productUrl}
                onClick={() => void addProduct()}
                className="rounded-full bg-rose px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Add gift
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {grouped.groups.map(({ category, items }) =>
            items.length > 0 ? (
              <div key={category.id}>
                <h3 className="font-display text-xl text-ink">{category.name}</h3>
                <ul className="mt-3 space-y-3">
                  {items.map((item) => renderGiftRow(item))}
                </ul>
              </div>
            ) : null,
          )}
          {grouped.uncategorized.length > 0 ? (
            <div>
              <h3 className="font-display text-xl text-ink">Uncategorized</h3>
              <ul className="mt-3 space-y-3">
                {grouped.uncategorized.map((item) => renderGiftRow(item))}
              </ul>
            </div>
          ) : null}
          {registry.items.length === 0 ? (
            <p className="text-sm text-ink/55">No gifts yet.</p>
          ) : null}
        </div>
      </section>

      <section className="mt-6 space-y-4 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(28,20,16,0.05)]">
        <div>
          <h2 className="font-display text-2xl">
            {babyArrival ? "Cash gift" : "Cash fund"}
          </h2>
          {babyArrival ? (
            <p className="mt-1 text-sm text-ink/60">
              Guests can send money via UPI. Rename the gift title guests see.
            </p>
          ) : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={fundTitle}
            onChange={(e) => setFundTitle(e.target.value)}
            placeholder={
              babyArrival ? "A little something special" : "Nursery fund"
            }
            className="rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
          />
          <input
            type="number"
            value={fundGoal}
            onChange={(e) => setFundGoal(Number(e.target.value))}
            className="rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
          />
        </div>
        <button
          type="button"
          disabled={busy || !fundTitle}
          onClick={() => void addFund()}
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper disabled:opacity-50"
        >
          {babyArrival ? "Add cash gift" : "Add fund"}
        </button>
        <ul className="space-y-2 text-sm text-ink/70">
          {registry.funds.map((f) => (
            <li key={f.id}>
              {f.title}
              {f.goalAmount ? ` — soft goal ${formatINR(f.goalAmount)}` : ""}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
