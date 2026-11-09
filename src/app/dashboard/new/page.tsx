"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Occasion } from "@/lib/types";

const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: "baby_shower", label: "Baby shower" },
  { value: "wedding", label: "Wedding" },
  { value: "housewarming", label: "Housewarming" },
  { value: "anniversary", label: "Anniversary" },
  { value: "birthday", label: "Birthday" },
];

export default function NewRegistryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [occasion, setOccasion] = useState<Occasion>("baby_shower");
  const [story, setStory] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [upiId, setUpiId] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
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
      router.push(`/dashboard/${data.registry.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 md:px-8">
      <Link href="/dashboard" className="text-sm text-ink/60 hover:text-ink">
        ← Dashboard
      </Link>
      <h1 className="mt-6 font-display text-4xl text-ink">New registry</h1>
      <p className="mt-2 text-ink/65">Start with the story. Gifts come next.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm">
          <span className="text-ink/60">Title</span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Aanya's Baby Shower"
            className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink/60">Occasion</span>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value as Occasion)}
            className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
          >
            {OCCASIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
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
        <label className="block text-sm">
          <span className="text-ink/60">Cover image URL</span>
          <input
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://…"
            className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink/60">Your UPI ID</span>
          <input
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="name@oksbi"
            className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
          />
        </label>
        {error ? <p className="text-sm text-rose">{error}</p> : null}
        <button
          disabled={busy}
          type="submit"
          className="rounded-full bg-rose px-6 py-3 text-sm font-semibold text-white hover:bg-rose-deep disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create & customize"}
        </button>
      </form>
    </div>
  );
}
