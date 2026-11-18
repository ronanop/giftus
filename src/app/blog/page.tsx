import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllBlogPosts } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gift Registry Guides for India",
  description:
    "Guides on baby shower registries, wedding gift lists, UPI cash gifts, and how guests can buy from your wishlist in India with Shubh Sagan.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Gift Registry Guides | ${SITE_NAME}`,
    description:
      "Answers to common questions about online gift registries in India.",
    url: `${SITE_URL}/blog`,
  },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-12 md:px-8">
        <p className="text-sm font-medium text-rose">Guides</p>
        <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">
          Gift registry guides for India
        </h1>
        <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-ink/70">
          Clear answers to questions people ask about gift lists, baby showers,
          weddings, WhatsApp sharing, and UPI cash gifts, and how Shubh Sagan
          helps.
        </p>

        <ul className="mt-12 space-y-8 border-t border-mist pt-10">
          {posts.map((post) => (
            <li key={post.slug}>
              <article>
                <p className="text-sm text-ink/50">
                  {new Date(post.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h2 className="mt-2 font-display text-2xl text-ink md:text-3xl">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition hover:text-rose"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 max-w-[52ch] leading-relaxed text-ink/70">
                  {post.description}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-3 inline-flex text-sm font-semibold text-rose hover:text-rose-deep"
                >
                  Read guide →
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
