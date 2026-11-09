import Link from "next/link";
import { getSession } from "@/lib/auth";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-mist/60 bg-paper/75 shadow-[0_8px_30px_rgba(28,20,16,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-ink transition hover:text-rose"
        >
          Giftus
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-ink/75 md:flex">
          <Link href="/#how" className="transition hover:text-ink">
            How it works
          </Link>
          <Link href="/r/aanya-baby-shower" className="transition hover:text-ink">
            See a registry
          </Link>
          <Link href="/search" className="transition hover:text-ink">
            Find
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full px-4 py-2 text-sm text-ink/80 transition hover:bg-mist"
              >
                Dashboard
              </Link>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-full bg-ink px-4 py-2 text-sm text-paper transition hover:bg-dusk"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm text-ink/80 transition hover:bg-mist"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="btn-glow rounded-full bg-rose px-4 py-2 text-sm font-medium text-white shadow-[0_8px_24px_rgba(184,74,94,0.28)] hover:bg-rose-deep"
              >
                Create registry
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
