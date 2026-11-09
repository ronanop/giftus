"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create account");
      router.push("/dashboard/new");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative mx-auto flex min-h-full max-w-md flex-col justify-center px-5 py-16">
      <div
        className="float-orb -z-10 left-[-16%] top-[14%] h-44 w-44 bg-petal"
        aria-hidden
      />
      <div
        className="float-orb -z-10 right-[-12%] bottom-[16%] h-52 w-52 bg-gold/25"
        aria-hidden
      />
      <Link href="/" className="animate-soft-in font-display text-2xl text-ink">
        Giftus
      </Link>
      <h1
        className="animate-soft-in mt-8 font-display text-4xl text-ink"
        style={{ animationDelay: "80ms" }}
      >
        Create account
      </h1>
      <p
        className="animate-soft-in mt-2 text-ink/65"
        style={{ animationDelay: "140ms" }}
      >
        Full control over your personalized registry.
      </p>
      <form
        onSubmit={onSubmit}
        className="animate-soft-in mt-8 space-y-4 rounded-[1.75rem] border border-mist/80 bg-white/80 p-6 shadow-[0_16px_40px_rgba(28,20,16,0.06)] backdrop-blur"
        style={{ animationDelay: "200ms" }}
      >
        <label className="block text-sm">
          <span className="text-ink/60">Full name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink/60">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
          />
        </label>
        <label className="block text-sm">
          <span className="text-ink/60">Password</span>
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-mist bg-white px-4 py-3 outline-none focus:border-rose"
          />
        </label>
        {error ? <p className="text-sm text-rose">{error}</p> : null}
        <button
          disabled={busy}
          type="submit"
          className="btn-glow w-full rounded-full bg-rose px-4 py-3 text-sm font-semibold text-white hover:bg-rose-deep disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-ink/60">
        Already have an account?{" "}
        <Link href="/login" className="text-rose underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
