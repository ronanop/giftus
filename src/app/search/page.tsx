"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Registry } from "@/lib/types";
import { occasionLabel } from "@/lib/format";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/registries?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setRegistries(data.registries || []);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
      <Link href="/" className="font-display text-2xl text-ink">
        Giftus
      </Link>
      <h1 className="mt-8 font-display text-4xl text-ink">Find a registry</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name or city"
        className="mt-6 w-full rounded-full border border-mist bg-white px-5 py-4 outline-none focus:border-rose"
      />
      <div className="mt-8 space-y-3">
        {loading ? <p className="text-sm text-ink/50">Searching…</p> : null}
        {registries.map((r) => (
          <Link
            key={r.id}
            href={`/r/${r.slug}`}
            className="block rounded-[1.5rem] bg-white p-5 shadow-[0_10px_30px_rgba(28,20,16,0.05)]"
          >
            <p className="text-sm text-sage">{occasionLabel(r.occasion)}</p>
            <h2 className="font-display text-2xl text-ink">{r.title}</h2>
            <p className="text-sm text-ink/55">
              {[r.location, r.eventDate].filter(Boolean).join(" · ")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
