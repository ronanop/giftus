"use client";

import { useState } from "react";
import type { GiftItem } from "@/lib/types";
import { formatINR } from "@/lib/format";

type Props = {
  open: boolean;
  item: GiftItem | null;
  slug: string;
  onClose: () => void;
  onClaimed: (item: GiftItem) => void;
};

export function GiftClaimModal({ open, item, slug, onClose, onClaimed }: Props) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"shop" | "confirm">("shop");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!open || !item) return null;

  async function submit(confirm: boolean) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/gift/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          itemId: item!.id,
          name,
          message,
          confirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      if (confirm) {
        onClaimed(data.item);
        onClose();
        setStep("shop");
        setName("");
        setMessage("");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-4 sm:items-center">
      <button className="absolute inset-0 cursor-default" aria-label="Close" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-paper p-6 shadow-[0_30px_80px_rgba(28,20,16,0.3)]">
        <p className="text-sm text-sage">{item.storeName}</p>
        <h2 className="mt-1 font-display text-2xl text-ink">{item.title}</h2>
        {item.price ? (
          <p className="mt-1 text-ink/70">{formatINR(item.price)}</p>
        ) : null}

        {step === "shop" ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-ink/70">
              We’ll open the store so you can buy this gift. Come back and tell
              us if you completed it — that’s how we prevent duplicates.
            </p>
            <a
              href={item.productUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setStep("confirm")}
              className="flex w-full items-center justify-center rounded-full bg-rose px-4 py-3 text-sm font-semibold text-white hover:bg-rose-deep"
            >
              Open store & buy
            </a>
            <button
              type="button"
              onClick={() => setStep("confirm")}
              className="w-full text-sm text-ink/60 underline-offset-2 hover:underline"
            >
              I already bought it
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium text-ink">Have you gifted this?</p>
            <label className="block text-sm">
              <span className="text-ink/60">Your name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
                placeholder="Meera Aunty"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink/60">Message (optional)</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
                rows={3}
                placeholder="With love for the little one"
              />
            </label>
            {error ? <p className="text-sm text-rose">{error}</p> : null}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setStep("shop");
                }}
                className="flex-1 rounded-full border border-mist px-4 py-3 text-sm"
              >
                Not yet
              </button>
              <button
                type="button"
                disabled={busy || !name.trim()}
                onClick={() => submit(true)}
                className="flex-1 rounded-full bg-ink px-4 py-3 text-sm font-semibold text-paper disabled:opacity-40"
              >
                Yes, I’ve gifted
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
