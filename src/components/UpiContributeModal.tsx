"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { CashFund, Registry } from "@/lib/types";
import { buildUpiAppLinks, buildUpiUri } from "@/lib/upi";
import { formatINR } from "@/lib/format";

type Props = {
  open: boolean;
  fund: CashFund | null;
  registry: Registry;
  onClose: () => void;
  onConfirmed: (fund: CashFund) => void;
};

export function UpiContributeModal({
  open,
  fund,
  registry,
  onClose,
  onConfirmed,
}: Props) {
  const [amount, setAmount] = useState(2000);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"pay" | "confirm">("pay");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upiUri = useMemo(() => {
    if (!fund || !registry.upiId) return "";
    return buildUpiUri({
      pa: registry.upiId,
      pn: registry.upiName || registry.title,
      am: amount,
      tn: `${fund.title} via Giftus`,
    });
  }, [amount, fund, registry]);

  const apps = useMemo(() => (upiUri ? buildUpiAppLinks(upiUri) : []), [upiUri]);

  if (!open || !fund) return null;

  async function confirmPaid(confirm: boolean) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/contribute/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: registry.slug,
          fundId: fund!.id,
          name,
          amount,
          message,
          confirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      if (confirm) {
        onConfirmed(data.fund);
        onClose();
        setStep("pay");
        setName("");
        setMessage("");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function copyUpi() {
    if (!registry.upiId) return;
    await navigator.clipboard.writeText(registry.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-4 sm:items-center">
      <button className="absolute inset-0 cursor-default" aria-label="Close" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-paper p-6 shadow-[0_30px_80px_rgba(28,20,16,0.3)]">
        <h2 className="font-display text-2xl text-ink">{fund.title}</h2>
        <p className="mt-1 text-sm text-ink/65">{fund.description}</p>

        {step === "pay" ? (
          <div className="mt-5 space-y-4">
            <label className="block text-sm">
              <span className="text-ink/60">Amount (₹)</span>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {[500, 1000, 2000, 5000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(v)}
                  className="rounded-full border border-mist px-3 py-1.5 text-sm hover:border-rose hover:text-rose"
                >
                  {formatINR(v)}
                </button>
              ))}
            </div>

            {registry.upiId ? (
              <>
                <div className="rounded-3xl bg-white p-5 text-center shadow-[0_10px_30px_rgba(28,20,16,0.06)]">
                  <p className="text-sm text-ink/60">Scan with any UPI app (best on iPhone)</p>
                  <div className="mx-auto mt-4 inline-flex rounded-2xl bg-white p-3">
                    <QRCodeSVG value={upiUri} size={168} bgColor="#ffffff" fgColor="#1C1410" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-ink">{registry.upiId}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {apps.map((app) => (
                    <a
                      key={app.id}
                      href={app.href}
                      onClick={() => setStep("confirm")}
                      className="rounded-2xl bg-ink px-3 py-3 text-center text-sm font-medium text-paper hover:bg-ink/90"
                    >
                      {app.label}
                    </a>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={copyUpi}
                  className="w-full rounded-full border border-mist px-4 py-3 text-sm"
                >
                  {copied ? "UPI ID copied" : "Copy UPI ID"}
                </button>
              </>
            ) : (
              <p className="rounded-2xl bg-petal px-4 py-3 text-sm text-ink">
                This registry hasn’t added a UPI ID yet.
              </p>
            )}

            <button
              type="button"
              onClick={() => setStep("confirm")}
              className="w-full text-sm text-ink/60 underline-offset-2 hover:underline"
            >
              I’ve completed the payment
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <p className="text-sm font-medium text-ink">Have you paid via UPI?</p>
            <label className="block text-sm">
              <span className="text-ink/60">Your name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
                placeholder="Your name"
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink/60">Message (optional)</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
              />
            </label>
            {error ? <p className="text-sm text-rose">{error}</p> : null}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => setStep("pay")}
                className="flex-1 rounded-full border border-mist px-4 py-3 text-sm"
              >
                Not yet
              </button>
              <button
                type="button"
                disabled={busy || !name.trim()}
                onClick={() => confirmPaid(true)}
                className="flex-1 rounded-full bg-rose px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
              >
                Yes, I’ve paid
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
