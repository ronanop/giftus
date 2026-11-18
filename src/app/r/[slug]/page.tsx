import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegistryView } from "@/components/RegistryView";
import { JsonLd } from "@/components/JsonLd";
import { occasionLabel } from "@/lib/format";
import { getRegistryBySlug } from "@/lib/store";
import {
  absoluteUrl,
  registryJsonLd,
  SITE_NAME,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const registry = await getRegistryBySlug(slug);
  if (!registry || !registry.isPublic) {
    return {
      title: "Registry not found",
      robots: { index: false, follow: false },
    };
  }

  const occasion = occasionLabel(registry.occasion);
  const description =
    registry.story?.trim().slice(0, 155) ||
    `${registry.title} gift registry on ${SITE_NAME}. Browse gifts, share blessings, and celebrate with UPI.`;
  const title = `${registry.title} | ${occasion} Gift Registry`;
  const url = absoluteUrl(`/r/${registry.slug}`);
  const image = registry.coverImageUrl?.startsWith("http")
    ? registry.coverImageUrl
    : absoluteUrl(registry.coverImageUrl || "/covers/shraddhas-baby-arrival.jpg");

  return {
    title,
    description,
    keywords: [
      registry.title,
      occasion,
      "gift registry",
      "gift registry India",
      "online gift registry",
      SITE_NAME,
      registry.location || "",
    ].filter(Boolean),
    alternates: {
      canonical: `/r/${registry.slug}`,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          alt: `${registry.title} gift registry cover`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PublicRegistryPage({ params }: PageProps) {
  const { slug } = await params;
  const registry = await getRegistryBySlug(slug);
  if (!registry || !registry.isPublic) notFound();

  const occasion = occasionLabel(registry.occasion);
  const description =
    registry.story?.trim() ||
    `${registry.title} is a ${occasion.toLowerCase()} gift registry on ${SITE_NAME}.`;

  return (
    <>
      <JsonLd
        data={registryJsonLd({
          title: registry.title,
          description,
          slug: registry.slug,
          imageUrl: registry.coverImageUrl,
          location: registry.location || undefined,
          occasion,
          updatedAt: registry.updatedAt,
        })}
      />
      <RegistryView initial={registry} />
    </>
  );
}
