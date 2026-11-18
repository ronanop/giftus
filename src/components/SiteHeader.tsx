import Link from "next/link";
import { getSession } from "@/lib/auth";

function SparkMark() {
  return (
    <svg
      className="h-3.5 w-3.5 text-marigold"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2v6M12 16v6M2 12h6M16 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M18.4 5.6l-4.2 4.2M9.8 14.2l-4.2 4.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10.5 10.5 14 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export async function SiteHeader({
  variant = "default",
}: {
  variant?: "default" | "playful";
}) {
  const session = await getSession();
  const playful = variant === "playful";

  return (
    <header
      className={
        playful
          ? "home-header sticky top-0 z-40 border-b border-blush/40 bg-[#FFF9F3]/88 backdrop-blur-xl"
          : "sticky top-0 z-40 border-b border-mist/60 bg-paper/75 shadow-[0_8px_30px_rgba(28,20,16,0.04)] backdrop-blur-xl"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 md:px-8">
        <Link
          href="/"
          className={
            playful
              ? "group inline-flex items-center gap-1.5 font-display text-2xl tracking-tight text-rose-deep transition hover:text-rose"
              : "font-display text-2xl tracking-tight text-ink transition hover:text-rose"
          }
        >
          Shubh Sagan
          {playful ? (
            <span className="inline-flex translate-y-[-2px] gap-0.5 opacity-90 transition group-hover:opacity-100">
              <SparkMark />
            </span>
          ) : null}
        </Link>

        <nav
          className={
            playful
              ? "hidden items-center gap-6 text-sm text-ink/80 lg:flex"
              : "hidden items-center gap-7 text-sm text-ink/75 md:flex"
          }
        >
          {playful ? (
            <>
              <Link href="/#occasions" className="transition hover:text-rose-deep">
                Occasions
              </Link>
              <Link href="/#how" className="transition hover:text-rose-deep">
                How It Works
              </Link>
              <Link href="/#features" className="transition hover:text-rose-deep">
                Features
              </Link>
              <Link href="/blog" className="transition hover:text-rose-deep">
                Gift Ideas
              </Link>
              <Link href="/search" className="transition hover:text-rose-deep">
                For Guests
              </Link>
            </>
          ) : (
            <>
              <Link href="/#how" className="transition hover:text-ink">
                How it works
              </Link>
              <Link
                href="/r/shraddhas-baby-arrival"
                className="transition hover:text-ink"
              >
                See a registry
              </Link>
              <Link href="/search" className="transition hover:text-ink">
                Find
              </Link>
              <Link href="/blog" className="transition hover:text-ink">
                Guides
              </Link>
            </>
          )}
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
              <Link
                href="/profile"
                className="rounded-full px-4 py-2 text-sm text-ink/80 transition hover:bg-mist"
              >
                Profile
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
          ) : playful ? (
            <>
              <Link
                href="/search"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition hover:bg-blush/50 hover:text-rose-deep"
                aria-label="Find a registry"
              >
                <SearchIcon />
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-rose/55 px-4 py-2 text-sm font-medium text-rose-deep transition hover:bg-petal"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="btn-glow rounded-full bg-rose px-4 py-2 text-sm font-medium text-white shadow-[0_8px_24px_rgba(184,74,94,0.28)] hover:bg-rose-deep"
              >
                Create Registry
              </Link>
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
