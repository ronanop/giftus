import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=2000&q=80"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/55 to-ink/25" />
          </div>
          <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
            <p className="animate-soft-in font-display text-4xl text-white md:text-6xl lg:text-7xl">
              Giftus
            </p>
            <h1 className="animate-soft-in mt-4 max-w-2xl text-balance font-display text-3xl leading-tight text-white/95 md:text-5xl" style={{ animationDelay: "80ms" }}>
              A registry that feels like your celebration — not a shopping list.
            </h1>
            <p className="animate-soft-in mt-5 max-w-xl text-lg text-white/80" style={{ animationDelay: "140ms" }}>
              Personal photos, heartfelt story, gifts from any store, and UPI
              funds that land straight in your account. Built for Indian baby
              showers, weddings, and everything in between.
            </p>
            <div className="animate-soft-in mt-8 flex flex-wrap gap-3" style={{ animationDelay: "200ms" }}>
              <Link
                href="/signup"
                className="rounded-full bg-rose px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(184,74,94,0.35)] hover:bg-rose-deep"
              >
                Start your registry
              </Link>
              <Link
                href="/r/aanya-baby-shower"
                className="rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur hover:bg-white/20"
              >
                View sample registry
              </Link>
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <h2 className="max-w-xl font-display text-3xl text-ink md:text-4xl">
            Easy for you. Effortless for guests on iPhone.
          </h2>
          <p className="mt-4 max-w-2xl text-ink/70">
            Create a page that looks like your family. Guests open one link —
            no account required — and gift with confidence.
          </p>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              {
                title: "Make it yours",
                body: "Cover photo, family gallery, your words. Unlimited gifts from Amazon, Flipkart, Myntra, FirstCry, and more — just paste a link.",
              },
              {
                title: "Share one link",
                body: "WhatsApp it with the invite. Guests see what’s still needed, who’s already gifted, and leave a warm note.",
              },
              {
                title: "Receive directly",
                body: "Physical gifts ship from the store. Cash funds go to your UPI — with iOS-friendly Pay buttons, QR, and a clear “Have you paid?” confirm.",
              },
            ].map((step) => (
              <div key={step.title} className="border-t border-mist pt-6">
                <h3 className="font-display text-2xl text-ink">{step.title}</h3>
                <p className="mt-3 text-ink/70">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-mist bg-petal/40">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:items-center md:px-8 md:py-28">
            <div>
              <h2 className="font-display text-3xl text-ink md:text-4xl">
                Personalization is the product.
              </h2>
              <p className="mt-4 text-ink/70">
                Generic registries forget the people. Giftus puts your photos
                and story first, then the gifts — with soft heart motion and
                live highlights when someone claims an item.
              </p>
              <ul className="mt-6 space-y-3 text-ink/80">
                <li>Family photo gallery on every page</li>
                <li>“Purchased by Meera Aunty” celebrations</li>
                <li>Owner control: unlimited items, UPI, privacy</li>
                <li>Guest flow: name + message, no forced login</li>
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(28,20,16,0.18)]">
              <img
                src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80"
                alt="Soft nursery moment"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6 text-white">
                <p className="font-display text-2xl">Aanya&apos;s Baby Shower</p>
                <p className="mt-1 text-sm text-white/80">Bengaluru · December 2026</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 text-center md:px-8 md:py-28">
          <h2 className="font-display text-3xl text-ink md:text-5xl">
            Ready to lead how India gifts?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">
            Free to create. Premium to experience. Built so relatives on iPhone
            can gift without confusion.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper hover:bg-ink/90"
          >
            Create your Giftus page
          </Link>
        </section>
      </main>
      <footer className="border-t border-mist">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-ink/55 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-display text-lg text-ink/80">Giftus</p>
          <p>Made for celebrations across India · Temporary name while we build</p>
        </div>
      </footer>
    </div>
  );
}
