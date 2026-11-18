"use client";

import { useState } from "react";

export function CopyPublicLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
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
    <button
      type="button"
      onClick={() => void copyLink()}
      className="rounded-full border border-mist px-4 py-2 text-sm font-medium text-ink hover:bg-white"
    >
      {copied ? "Copied" : "Copy public link"}
    </button>
  );
}
