import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { JsonLd } from "@/components/JsonLd";
import {
  blogArticleJsonLd,
  blogFaqJsonLd,
  getAllBlogPosts,
  getBlogPost,
} from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return { title: "Guide not found", robots: { index: false } };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: [...post.keywords, ...post.questions, SITE_NAME],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: SITE_NAME,
      publishedTime: post.date,
      images: [],
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
      images: [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div>
      <JsonLd data={blogArticleJsonLd(post)} />
      <JsonLd data={blogFaqJsonLd(post)} />
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-12 md:px-8">
        <Link
          href="/blog"
          className="text-sm font-medium text-ink/60 transition hover:text-ink"
        >
          ← All guides
        </Link>

        <article className="mt-8">
          <p className="text-sm text-ink/50">
            {new Date(post.date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-ink md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/70">
            {post.description}
          </p>

          <section className="mt-8 rounded-[1.5rem] border border-mist bg-petal/40 px-5 py-4">
            <h2 className="font-display text-xl text-ink">
              Questions this guide answers
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-ink/75">
              {post.questions.map((question) => (
                <li key={question}>• {question}</li>
              ))}
            </ul>
          </section>

          <div className="mt-10 space-y-5 text-base leading-relaxed text-ink/85 md:text-lg">
            {post.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 rounded-[1.75rem] bg-dusk px-6 py-8 text-white">
            <h2 className="font-display text-2xl md:text-3xl">
              Create your gift registry on Shubh Sagan
            </h2>
            <p className="mt-3 max-w-[40ch] text-white/75">
              Build a personalized page, add gifts from any store, accept UPI,
              and share one link with guests.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-full bg-rose px-5 py-3 text-sm font-semibold text-white hover:bg-rose-deep"
              >
                Create registry
              </Link>
              <Link
                href="/r/shraddhas-baby-arrival"
                className="rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
              >
                See an example
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
