"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProfileForm({
  name: initialName,
  email,
}: {
  name: string;
  email: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save profile");
      setName(data.user.name);
      setMessage("Profile saved");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 space-y-4 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_30px_rgba(28,20,16,0.05)]"
    >
      <label className="block text-sm">
        <span className="text-ink/60">Name</span>
        <input
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
        />
      </label>
      <label className="block text-sm">
        <span className="text-ink/60">Email</span>
        <input
          disabled
          value={email}
          className="mt-1 w-full rounded-2xl border border-mist bg-parchment/50 px-4 py-3 text-ink/70 outline-none"
        />
      </label>
      {message ? <p className="text-sm text-grove">{message}</p> : null}
      {error ? <p className="text-sm text-rose">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition hover:bg-dusk disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
