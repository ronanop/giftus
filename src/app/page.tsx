import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import { HeartField } from "@/components/HeartField";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=2000&q=80"
              alt=""
              className="ken-burns h-full w-full object-cover"
            />
            <div className="hero-veil absolute inset-0" />
            <div
              className="float-orb left-[12%] top-[22%] h-40 w-40 bg-rose/40"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="float-orb right-[8%] top-[40%] h-52 w-52 bg-marigold/35"
              style={{ animationDelay: "1.4s" }}
            />
            <HeartField dense />
          </div>
          <div className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
            <p
              className="animate-soft-in font-display text-5xl text-white md:text-7xl lg:text-8xl"
              style={{ animationDelay: "40ms" }}
            >
              Giftus
            </p>
            <h1
              className="animate-soft-in mt-5 max-w-2xl text-balance font-display text-3xl leading-tight text-white/95 md:text-5xl"
              style={{ animationDelay: "140ms" }}
            >
              A registry that feels like your celebration — not a shopping list.
            </h1>
            <p
              className="animate-soft-in mt-5 max-w-xl text-lg text-white/80"
              style={{ animationDelay: "240ms" }}
            >
              Personal photos, heartfelt story, gifts from any store, and UPI
              funds that land straight in your account. Built for Indian baby
              showers, weddings, and everything in between.
            </p>
            <div
              className="animate-soft-in mt-9 flex flex-wrap gap-3"
              style={{ animationDelay: "340ms" }}
            >
              <Link
                href="/signup"
                className="btn-glow rounded-full bg-rose px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(184,74,94,0.4)] hover:bg-rose-deep"
              >
                Start your registry
              </Link>
              <Link
                href="/r/aanya-baby-shower"
                className="rounded-full border border-white/35 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
              >
                View sample registry
              </Link>
            </div>
          </div>
        </section>

        <section id="how" className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <h2 className="max-w-xl font-display text-3xl text-ink md:text-5xl">
              Easy for you. Effortless for guests on iPhone.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-ink/70">
              Create a page that looks like your family. Guests open one link —
              no account required — and gift with confidence.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                title: "Make it yours",
                body: "Cover photo, family gallery, your words. Unlimited gifts from Amazon, Flipkart, Myntra, FirstCry, and more — just paste a link.",
                tint: "from-petal/80 to-transparent",
              },
              {
                title: "Share one link",
                body: "WhatsApp it with the invite. Guests see what’s still needed, who’s already gifted, and leave a warm note.",
                tint: "from-sage-soft to-transparent",
              },
              {
                title: "Receive directly",
                body: "Physical gifts ship from the store. Cash funds go to your UPI — with iOS-friendly Pay buttons, QR, and a clear “Have you paid?” confirm.",
                tint: "from-blush/70 to-transparent",
              },
            ].map((step, i) => (
              <Reveal key={step.title} delay={i * 120} variant={i === 1 ? "scale" : "up"}>
                <div
                  className={`rounded-[1.75rem] bg-gradient-to-b ${step.tint} p-1`}
                >
                  <div className="rounded-[1.6rem] border border-mist/70 bg-white/70 p-6 backdrop-blur-sm">
                    <h3 className="font-display text-2xl text-ink">{step.title}</h3>
                    <p className="mt-3 text-ink/70">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="band-petal border-y border-blush/40">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:items-center md:px-8 md:py-28">
            <Reveal variant="left">
              <h2 className="font-display text-3xl text-ink md:text-5xl">
                Personalization is the product.
              </h2>
              <p className="mt-4 text-lg text-ink/70">
                Generic registries forget the people. Giftus puts your photos
                and story first, then the gifts — with soft heart motion and
                live highlights when someone claims an item.
              </p>
              <ul className="mt-8 space-y-4 text-ink/85">
                {[
                  "Family photo gallery on every page",
                  "“Purchased by Meera Aunty” celebrations",
                  "Owner control: unlimited items, UPI, privacy",
                  "Guest flow: name + message, no forced login",
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal variant="scale" delay={120}>
              <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(28,20,16,0.18)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80"
                  alt="Soft nursery moment"
                  className="ken-burns aspect-[4/5] w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dusk/90 via-dusk/40 to-transparent p-7 text-white">
                  <p className="font-display text-3xl">Aanya&apos;s Baby Shower</p>
                  <p className="mt-1 text-sm text-white/80">Bengaluru · December 2026</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="band-sage">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
            <Reveal>
              <h2 className="max-w-2xl font-display text-3xl text-ink md:text-4xl">
                Built for the way India celebrates.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Any store link",
                  body: "Amazon, Flipkart, FirstCry, Myntra — paste and Giftus builds the card.",
                },
                {
                  title: "UPI that just works",
                  body: "QR, GPay, PhonePe, Paytm, copy — then a warm confirm for the host.",
                },
                {
                  title: "Zero guest friction",
                  body: "No forced accounts. Name, message, gift — done on an iPhone in seconds.",
                },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 100}>
                  <article className="h-full rounded-[1.75rem] bg-white/75 p-6 shadow-[0_12px_40px_rgba(28,20,16,0.05)] backdrop-blur">
                    <div className="mb-4 h-1.5 w-12 rounded-full bg-gradient-to-r from-gold to-marigold" />
                    <h3 className="font-display text-2xl text-ink">{item.title}</h3>
                    <p className="mt-3 text-ink/70">{item.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="band-dusk relative overflow-hidden">
          <div
            className="float-orb -left-10 top-10 h-56 w-56 bg-rose/40"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="float-orb right-0 bottom-0 h-64 w-64 bg-marigold/30"
            style={{ animationDelay: "1.8s" }}
          />
          <div className="relative mx-auto max-w-6xl px-5 py-24 text-center md:px-8 md:py-28">
            <Reveal variant="scale">
              <h2 className="font-display text-3xl text-white md:text-5xl">
                Ready to lead how India gifts?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/75">
                Free to create. Premium to experience. Built so relatives on
                iPhone can gift without confusion.
              </p>
              <Link
                href="/signup"
                className="btn-glow mt-9 inline-flex rounded-full bg-rose px-8 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(184,74,94,0.45)] hover:bg-rose-deep"
              >
                Create your Giftus page
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="border-t border-mist bg-paper/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-ink/55 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-display text-lg text-ink/80">Giftus</p>
          <p>Made for celebrations across India · Temporary name while we build</p>
        </div>
      </footer>
    </div>
  );
}
