import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getRegistryById } from "@/lib/store";
import { RegistryEditor } from "@/components/RegistryEditor";

export default async function EditRegistryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;
  const registry = await getRegistryById(id);
  if (!registry || registry.ownerId !== session.id) notFound();

  return <RegistryEditor initial={registry} />;
}
