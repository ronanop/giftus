import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { getRegistryById } from "@/lib/store";
import { CopyPublicLinkButton } from "@/components/CopyPublicLinkButton";
import { RegistryView } from "@/components/RegistryView";

export const metadata: Metadata = {
  title: "Preview registry",
  robots: { index: false, follow: false },
};

export default async function RegistryPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const registry = await getRegistryById(id);
  if (!registry || registry.ownerId !== session.id) notFound();

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-[60] border-b border-mist/70 bg-[#FFF9F3]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 md:px-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose">
              Preview
            </p>
            <p className="truncate text-sm text-ink/65">
              Only you can see this bar. Guests still use your public link.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/dashboard/${registry.id}`}
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper"
            >
              ← Back to editing
            </Link>
            <CopyPublicLinkButton slug={registry.slug} />
            <Link
              href={`/r/${registry.slug}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-mist px-4 py-2 text-sm font-medium text-ink hover:bg-white"
            >
              Open public link
            </Link>
          </div>
        </div>
      </div>
      <RegistryView initial={registry} />
    </div>
  );
}
