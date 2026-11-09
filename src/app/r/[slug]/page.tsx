import { notFound } from "next/navigation";
import { RegistryView } from "@/components/RegistryView";
import { getRegistryBySlug } from "@/lib/store";

export default async function PublicRegistryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const registry = await getRegistryBySlug(slug);
  if (!registry || !registry.isPublic) notFound();

  return <RegistryView initial={registry} />;
}
