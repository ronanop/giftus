import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listRegistriesForOwner } from "@/lib/store";
import { occasionLabel } from "@/lib/format";
import { SiteHeader } from "@/components/SiteHeader";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const registries = await listRegistriesForOwner(session.id);

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-12 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-ink">Your registries</h1>
            <p className="mt-2 text-ink/65">Hi {session.name} — customize every detail.</p>
          </div>
          <Link
            href="/dashboard/new"
            className="rounded-full bg-rose px-5 py-3 text-sm font-semibold text-white hover:bg-rose-deep"
          >
            New registry
          </Link>
        </div>

        {registries.length === 0 ? (
          <div className="mt-12 rounded-[2rem] border border-dashed border-mist bg-white/50 p-10 text-center">
            <p className="font-display text-2xl text-ink">No registries yet</p>
            <p className="mt-2 text-ink/60">Create your first personalized celebration page.</p>
            <Link
              href="/dashboard/new"
              className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper"
            >
              Create registry
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-4">
            {registries.map((r) => (
              <Link
                key={r.id}
                href={`/dashboard/${r.id}`}
                className="flex flex-col gap-3 rounded-[1.5rem] bg-white p-5 shadow-[0_10px_30px_rgba(28,20,16,0.05)] transition hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm text-sage">{occasionLabel(r.occasion)}</p>
                  <h2 className="font-display text-2xl text-ink">{r.title}</h2>
                  <p className="mt-1 text-sm text-ink/55">
                    {r.items.length} gifts · {r.funds.length} funds · /r/{r.slug}
                  </p>
                </div>
                <span className="text-sm font-medium text-rose">Edit →</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
