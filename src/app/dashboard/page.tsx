import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listRegistriesForOwner } from "@/lib/store";
import { SiteHeader } from "@/components/SiteHeader";
import { DashboardRegistryCard } from "@/components/DashboardRegistryCard";

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
            className="btn-glow rounded-full bg-rose px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(184,74,94,0.28)] hover:bg-rose-deep"
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
              <DashboardRegistryCard
                key={r.id}
                id={r.id}
                title={r.title}
                occasion={r.occasion}
                slug={r.slug}
                itemCount={r.items.length}
                fundCount={r.funds.length}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
