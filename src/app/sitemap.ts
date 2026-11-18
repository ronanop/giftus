import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { listPublicRegistriesForSitemap } from "@/lib/store";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blogRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...getAllBlogPosts().map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/signup`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...blogRoutes,
  ];

  try {
    const publicRegistries = await listPublicRegistriesForSitemap();
    const registryRoutes: MetadataRoute.Sitemap = publicRegistries.map(
      (registry) => ({
        url: `${SITE_URL}/r/${registry.slug}`,
        lastModified: registry.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
      }),
    );
    return [...staticRoutes, ...registryRoutes];
  } catch {
    return staticRoutes;
  }
}
