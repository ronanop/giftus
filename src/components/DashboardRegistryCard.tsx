"use client";

import Link from "next/link";
import { useState } from "react";
import { occasionLabel } from "@/lib/format";

export function DashboardRegistryCard({
  id,
  title,
  occasion,
  slug,
  itemCount,
  fundCount,
}: {
  id: string;
  title: string;
  occasion: string;
  slug: string;
  itemCount: number;
  fundCount: number;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/r/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this registry link:", url);
    }
  }

  return (
    <div className="gift-card flex flex-col gap-3 rounded-[1.5rem] border border-mist/60 bg-white/90 p-5 shadow-[0_10px_30px_rgba(28,20,16,0.05)] sm:flex-row sm:items-center sm:justify-between">
      <Link href={`/dashboard/${id}`} className="min-w-0 flex-1">
        <p className="text-sm text-sage">{occasionLabel(occasion)}</p>
        <h2 className="font-display text-2xl text-ink">{title}</h2>
        <p className="mt-1 text-sm text-ink/55">
          {itemCount} gifts · {fundCount} funds · /r/{slug}
        </p>
      </Link>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={copyLink}
          className="rounded-full border border-mist px-4 py-2 text-sm font-medium text-ink/80 transition hover:border-grove/40 hover:bg-parchment/70"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        <Link
          href={`/dashboard/${id}`}
          className="rounded-full px-4 py-2 text-sm font-medium text-rose transition hover:bg-petal"
        >
          Edit →
        </Link>
      </div>
    </div>
  );
}
