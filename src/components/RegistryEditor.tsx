"use client";

import Link from "next/link";
import { useState } from "react";
import { nanoid } from "nanoid";
import type { Registry } from "@/lib/types";
import { formatINR } from "@/lib/format";

export function RegistryEditor({ initial }: { initial: Registry }) {
  const [registry, setRegistry] = useState(initial);
  const [story, setStory] = useState(initial.story);
  const [upiId, setUpiId] = useState(initial.upiId || "");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [fundTitle, setFundTitle] = useState("");
  const [fundGoal, setFundGoal] = useState(25000);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function saveBasics() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/registries/${registry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story, upiId, upiName: registry.title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setRegistry(data.registry);
      setMessage("Saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function addPhoto() {
    if (!photoUrl) return;
    setBusy(true);
    setError("");
    try {
      const photos = [
        ...registry.photos,
        { id: nanoid(), url: photoUrl, caption: photoCaption || undefined },
      ];
      const res = await fetch(`/api/registries/${registry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add photo");
      setRegistry(data.registry);
      setPhotoUrl("");
      setPhotoCaption("");
      setMessage("Photo added");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function uploadPhotoFile(file: File) {
    setBusy(true);
    setError("");
    setMessage("Uploading to Neon Object Storage…");
    try {
      const body = new FormData();
      body.append("file", file);
      const up = await fetch("/api/upload", { method: "POST", body });
      const uploaded = await up.json();
      if (!up.ok) throw new Error(uploaded.error || "Upload failed");
      const photos = [
        ...registry.photos,
        { id: nanoid(), url: uploaded.url, caption: photoCaption || undefined },
      ];
      const res = await fetch(`/api/registries/${registry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save photo");
      setRegistry(data.registry);
      setPhotoCaption("");
      setMessage("Photo uploaded");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setMessage("");
    } finally {
      setBusy(false);
    }
  }

  async function addProduct() {
    if (!productUrl) return;
    setBusy(true);
    setError("");
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
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add item");
      setRegistry((prev) => ({ ...prev, items: [data.item, ...prev.items] }));
      setProductUrl("");
      setMessage("Gift added");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setMessage("");
    } finally {
      setBusy(false);
    }
  }

  async function addFund() {
    if (!fundTitle) return;
    setBusy(true);
    setError("");
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
      setMessage("Fund added");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
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

      {(message || error) && (
        <p className={`mt-4 text-sm ${error ? "text-rose" : "text-sage"}`}>
          {error || message}
        </p>
      )}

      <section className="mt-10 space-y-4 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(28,20,16,0.05)]">
        <h2 className="font-display text-2xl">Story & UPI</h2>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
        />
        <input
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="yourname@oksbi"
          className="w-full rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
        />
        <button
          type="button"
          disabled={busy}
          onClick={saveBasics}
          className="rounded-full bg-rose px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          Save
        </button>
      </section>

      <section className="mt-6 space-y-4 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(28,20,16,0.05)]">
        <h2 className="font-display text-2xl">Family photos</h2>
        <input
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadPhotoFile(file);
            e.currentTarget.value = "";
          }}
          className="block w-full text-sm text-ink/70"
        />
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="Or paste a photo URL"
            className="rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
          />
          <button
            type="button"
            disabled={busy}
            onClick={addPhoto}
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper disabled:opacity-50"
          >
            Add photo
          </button>
        </div>
        <input
          value={photoCaption}
          onChange={(e) => setPhotoCaption(e.target.value)}
          placeholder="Caption (optional)"
          className="w-full rounded-2xl border border-mist px-4 py-3 outline-none focus:border-rose"
        />
        <div className="grid grid-cols-3 gap-3">
          {registry.photos.map((p) => (
            <img key={p.id} src={p.url} alt="" className="aspect-square rounded-2xl object-cover" />
          ))}
        </div>
      </section>

      <section className="mt-6 space-y-4 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(28,20,16,0.05)]">
        <h2 className="font-display text-2xl">Add gift from any store</h2>
        <p className="text-sm text-ink/60">
          Paste an Amazon, Flipkart, Myntra, FirstCry, or any product link. We’ll
          fetch title, image, and price into a card.
        </p>
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
            onClick={addProduct}
            className="rounded-full bg-rose px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            Add gift
          </button>
        </div>
        <ul className="space-y-3">
          {registry.items.map((item) => (
            <li key={item.id} className="flex gap-3 rounded-2xl border border-mist p-3">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-xl bg-mist" />
              )}
              <div>
                <p className="font-medium text-ink">{item.title}</p>
                <p className="text-sm text-ink/55">
                  {item.storeName}
                  {item.price ? ` · ${formatINR(item.price)}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 space-y-4 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(28,20,16,0.05)]">
        <h2 className="font-display text-2xl">Cash fund</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={fundTitle}
            onChange={(e) => setFundTitle(e.target.value)}
            placeholder="Nursery fund"
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
          onClick={addFund}
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper disabled:opacity-50"
        >
          Add fund
        </button>
        <ul className="space-y-2 text-sm text-ink/70">
          {registry.funds.map((f) => (
            <li key={f.id}>
              {f.title} — goal {formatINR(f.goalAmount)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
