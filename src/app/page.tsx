import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  softwareAppJsonLd,
} from "@/lib/seo";

const SAMPLE_REGISTRY = "/r/shraddhas-baby-arrival";

export const metadata: Metadata = {
  title: "Gift Registry India for Baby Shower, Wedding & Celebrations",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | Online Gift Registry for Indian Celebrations`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
};

export default function HomePage() {
  return (
    <div className="home-shell flex min-h-full flex-col">
      <JsonLd data={softwareAppJsonLd()} />
      <SiteHeader />
      <main className="flex-1">
        <section className="home-hero relative isolate overflow-hidden">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=80"
              alt="Indian wedding celebration for a personalized gift registry"
              className="ken-burns h-full w-full object-cover object-[center_28%]"
            />
            <div className="home-hero-veil absolute inset-0" />
          </div>

          <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
            <h1
              className="animate-soft-in max-w-[18ch] text-balance font-display text-[clamp(1.85rem,4.6vw,3.1rem)] leading-[1.12] text-white/95"
              style={{ animationDelay: "40ms" }}
            >
              Gift registry for Indian celebrations, gathered with love.
            </h1>
            <p
              className="animate-soft-in mt-5 max-w-[34ch] text-lg leading-relaxed text-white/78 md:text-xl"
              style={{ animationDelay: "140ms" }}
            >
              Your story, your photos, gifts from any store, and UPI blessings
              that reach you directly.
            </p>
            <div
              className="animate-soft-in mt-9 flex flex-wrap gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/signup"
                className="btn-glow rounded-full bg-rose px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(184,74,94,0.4)] hover:bg-rose-deep"
              >
                Create your registry
              </Link>
              <Link
                href={SAMPLE_REGISTRY}
                className="rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
              >
                See a celebration page
              </Link>
            </div>
          </div>
        </section>

        <section
          id="how"
          className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28"
        >
          <Reveal>
            <h2 className="max-w-[18ch] font-display text-3xl text-ink md:text-5xl">
              A page that feels like your invitation.
            </h2>
            <p className="mt-4 max-w-[42ch] text-lg leading-relaxed text-ink/70">
              Guests open one link on their phone, no account needed, and know
              exactly how to celebrate with you.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-12 border-t border-mist pt-12 md:grid-cols-3 md:gap-10">
            {[
              {
                title: "Make it yours",
                body: "Cover photo, your words, and gifts from Amazon, Flipkart, FirstCry, Myntra. Paste a link and it becomes part of the page.",
              },
              {
                title: "Share one link",
                body: "Send it with the invite on WhatsApp. Guests see what is still needed, who has already gifted, and leave a warm note.",
              },
              {
                title: "Receive with ease",
                body: "Store gifts ship to you. Cash blessings arrive on UPI, with QR, GPay, PhonePe, Paytm, and a clear confirm for the host.",
              },
            ].map((step, i) => (
              <Reveal key={step.title} delay={i * 90}>
                <div>
                  <h3 className="font-display text-2xl text-ink md:text-[1.85rem]">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[32ch] leading-relaxed text-ink/70">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="band-petal border-y border-blush/35">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[1.05fr_0.95fr] md:items-end md:gap-14 md:px-8 md:py-28">
            <Reveal variant="left">
              <p className="font-script text-[2rem] leading-none text-rose md:text-[2.4rem]">
                From our celebrations
              </p>
              <h2 className="mt-4 max-w-[14ch] font-display text-3xl text-ink md:text-5xl">
                Every page begins with the people.
              </h2>
              <p className="mt-5 max-w-[38ch] text-lg leading-relaxed text-ink/70">
                Shubh Sagan keeps the family story first, then the wishlist, so
                relatives gift with certainty, not confusion.
              </p>
              <Link
                href={SAMPLE_REGISTRY}
                className="mt-8 inline-flex text-sm font-semibold text-rose transition hover:text-rose-deep"
              >
                Open Shraddha&apos;s Baby Arrival →
              </Link>
            </Reveal>

            <Reveal variant="scale" delay={100}>
              <Link
                href={SAMPLE_REGISTRY}
                className="home-feature-frame group relative block overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/covers/shraddhas-baby-arrival.jpg"
                  alt="Shraddha's Baby Arrival celebration page"
                  className="ken-burns aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dusk/90 via-dusk/35 to-transparent p-6 text-white md:p-8">
                  <p className="font-display text-2xl md:text-3xl">
                    Shraddha&apos;s Baby Arrival
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    A living registry guests already know how to use
                  </p>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="band-sage">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <Reveal>
              <h2 className="max-w-[18ch] font-display text-3xl text-ink md:text-4xl">
                Made for Indian celebrations, end to end.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-3">
              {[
                {
                  title: "Any store you love",
                  body: "Amazon, Flipkart, FirstCry, Myntra. Paste the product link and Shubh Sagan fills in the card.",
                },
                {
                  title: "UPI without friction",
                  body: "QR, GPay, PhonePe, Paytm, and copy, then a gentle confirm so the host knows the blessing arrived.",
                },
                {
                  title: "Guests stay guests",
                  body: "No forced accounts. Name, message, gift: finished on an iPhone in a quiet moment.",
                },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 80}>
                  <div className="border-t border-grove/15 pt-5">
                    <h3 className="font-display text-2xl text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-[30ch] leading-relaxed text-ink/70">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="band-dusk relative overflow-hidden">
          <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-28">
            <Reveal>
              <h2 className="max-w-[16ch] font-display text-3xl text-white md:text-5xl">
                Begin your celebration page.
              </h2>
              <p className="mt-5 max-w-[36ch] text-lg leading-relaxed text-white/75">
                Create once. Share with family. Let every gift arrive with
                warmth, and without duplicate confusion.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="btn-glow inline-flex rounded-full bg-rose px-8 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(184,74,94,0.45)] hover:bg-rose-deep"
                >
                  Create your registry
                </Link>
                <Link
                  href={SAMPLE_REGISTRY}
                  className="inline-flex rounded-full border border-white/30 px-8 py-3.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
                >
                  Preview a live page
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-mist bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <p className="font-display text-2xl text-ink">Shubh Sagan</p>
            <p className="mt-1 max-w-[42ch] text-sm text-ink/55">
              {SITE_TAGLINE}. Online gift registry for baby shower, wedding,
              housewarming, and family celebrations across India.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/60">
            <Link href="/#how" className="transition hover:text-ink">
              How it works
            </Link>
            <Link href={SAMPLE_REGISTRY} className="transition hover:text-ink">
              See a registry
            </Link>
            <Link href="/search" className="transition hover:text-ink">
              Find
            </Link>
            <Link href="/blog" className="transition hover:text-ink">
              Guides
            </Link>
            <a
              href="https://shubhsagan.com"
              className="transition hover:text-ink"
            >
              shubhsagan.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
