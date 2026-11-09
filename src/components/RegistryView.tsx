"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CashFund, GiftItem, Registry } from "@/lib/types";
import { formatINR, occasionLabel } from "@/lib/format";
import {
  isUsableProductImage,
  repairGiftImageUrl,
} from "@/lib/product-image";
import { HeartField } from "./HeartField";
import { GiftClaimModal } from "./GiftClaimModal";
import { UpiContributeModal } from "./UpiContributeModal";
import { Reveal } from "./Reveal";

export function RegistryView({ initial }: { initial: Registry }) {
  const [registry, setRegistry] = useState(initial);
  const [filter, setFilter] = useState<"all" | "available" | "purchased">("all");
  const [giftItem, setGiftItem] = useState<GiftItem | null>(null);
  const [fund, setFund] = useState<CashFund | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);

  const items = useMemo(() => {
    if (filter === "all") return registry.items;
    if (filter === "available") {
      return registry.items.filter(
        (i) => i.status === "available" || i.status === "reserved",
      );
    }
    return registry.items.filter((i) => i.status === "purchased");
  }, [filter, registry.items]);

  const purchasedCount = registry.items.filter(
    (i) => i.status === "purchased",
  ).length;

  function highlight(id: string) {
    setFlashId(id);
    setTimeout(() => setFlashId(null), 1400);
  }

  return (
    <div className="min-h-full">
      <div className="relative isolate overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={registry.coverImageUrl}
          alt=""
          className="ken-burns absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-ink/55 to-ink/20" />
        <div
          className="float-orb left-[10%] top-[30%] h-44 w-44 bg-rose/35"
          style={{ animationDelay: "0.4s" }}
        />
        <div
          className="float-orb right-[5%] top-[18%] h-52 w-52 bg-marigold/25"
          style={{ animationDelay: "1.6s" }}
        />
        <HeartField dense />
        <div className="relative mx-auto flex min-h-[74vh] max-w-5xl flex-col justify-end px-5 pb-12 pt-24 md:px-8">
          <Link
            href="/"
            className="absolute left-5 top-6 font-display text-xl text-white/90 transition hover:text-white md:left-8"
          >
            Giftus
          </Link>
          <span className="animate-soft-in inline-flex w-fit rounded-full bg-gradient-to-r from-gold to-marigold px-3.5 py-1 text-sm font-medium text-ink shadow-[0_8px_24px_rgba(168,137,74,0.35)]">
            {occasionLabel(registry.occasion)}
          </span>
          <h1
            className="animate-soft-in mt-4 font-display text-4xl text-white md:text-6xl"
            style={{ animationDelay: "90ms" }}
          >
            {registry.title}
          </h1>
          <p
            className="animate-soft-in mt-3 max-w-2xl text-white/85"
            style={{ animationDelay: "160ms" }}
          >
            {[registry.location, registry.eventDate].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        <Reveal>
          <p className="max-w-3xl text-lg leading-relaxed text-ink/80">
            {registry.story}
          </p>
        </Reveal>

        {registry.photos.length > 0 ? (
          <section className="mt-14">
            <Reveal>
              <h2 className="font-display text-3xl text-ink">Our moments</h2>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {registry.photos.map((photo, i) => (
                <Reveal key={photo.id} delay={i * 90} variant="scale">
                  <figure className="group overflow-hidden rounded-[1.5rem]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.caption || ""}
                      className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    {photo.caption ? (
                      <figcaption className="mt-2 text-sm text-ink/60">
                        {photo.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-16">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl text-ink">Gifts</h2>
                <p className="mt-1 text-sm text-ink/60">
                  {purchasedCount} of {registry.items.length} gifted
                </p>
              </div>
              <div className="flex gap-2">
                {(["all", "available", "purchased"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`rounded-full px-4 py-2 text-sm capitalize transition ${
                      filter === key
                        ? "bg-ink text-paper shadow-[0_8px_20px_rgba(28,20,16,0.18)]"
                        : "bg-mist text-ink/70 hover:bg-blush/60"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {items.map((item, i) => {
              const claimed = item.status === "purchased";
              return (
                <Reveal key={item.id} delay={(i % 4) * 70}>
                  <article
                    className={`gift-card overflow-hidden rounded-[1.75rem] bg-white shadow-[0_12px_40px_rgba(28,20,16,0.06)] ${
                      flashId === item.id ? "claim-highlight" : ""
                    }`}
                  >
                    <div className="relative aspect-[16/11] overflow-hidden bg-gradient-to-br from-mist to-petal">
                      {(() => {
                        const src = repairGiftImageUrl({
                          imageUrl: item.imageUrl,
                          productUrl: item.productUrl,
                        });
                        if (!isUsableProductImage(src)) return null;
                        return (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={src}
                            alt=""
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        );
                      })()}
                      {item.storeName ? (
                        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium shadow-sm">
                          {item.storeName}
                        </span>
                      ) : null}
                      {claimed ? (
                        <div className="absolute inset-x-4 bottom-4 rounded-full bg-sage px-4 py-2 text-center text-sm text-white shadow-[0_10px_24px_rgba(74,93,78,0.35)]">
                          Gifted by {item.giftedBy}
                        </div>
                      ) : null}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-xl text-ink">
                        {item.title}
                      </h3>
                      {item.description ? (
                        <p className="mt-1 line-clamp-2 text-sm text-ink/60">
                          {item.description}
                        </p>
                      ) : null}
                      {item.price ? (
                        <p className="mt-3 font-medium text-ink">
                          {formatINR(item.price)}
                        </p>
                      ) : null}
                      {claimed && item.giftMessage ? (
                        <p className="mt-3 text-sm italic text-rose">
                          &ldquo;{item.giftMessage}&rdquo;
                        </p>
                      ) : null}
                      {!claimed ? (
                        <div className="mt-4 flex gap-2">
                          <a
                            href={item.productUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-mist px-4 py-2 text-sm transition hover:border-ink/30 hover:bg-mist/60"
                          >
                            View
                          </a>
                          <button
                            type="button"
                            onClick={() => setGiftItem(item)}
                            className="btn-glow rounded-full bg-rose px-4 py-2 text-sm font-semibold text-white hover:bg-rose-deep"
                          >
                            Gift this
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        {registry.funds.length > 0 ? (
          <section className="mt-16">
            <Reveal>
              <h2 className="font-display text-3xl text-ink">Cash funds</h2>
            </Reveal>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {registry.funds.map((f, i) => {
                const pct = Math.min(
                  100,
                  Math.round((f.raisedAmount / f.goalAmount) * 100),
                );
                return (
                  <Reveal key={f.id} delay={i * 100}>
                    <article
                      className={`gift-card rounded-[1.75rem] bg-gradient-to-br from-white to-sage-soft/40 p-6 shadow-[0_12px_40px_rgba(28,20,16,0.06)] ${
                        flashId === f.id ? "claim-highlight" : ""
                      }`}
                    >
                      <h3 className="font-display text-2xl text-ink">
                        {f.title}
                      </h3>
                      {f.description ? (
                        <p className="mt-2 text-sm text-ink/65">
                          {f.description}
                        </p>
                      ) : null}
                      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-mist">
                        <div
                          className="progress-fill h-full rounded-full bg-gradient-to-r from-gold to-marigold"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="mt-2 text-sm text-ink/70">
                        Raised {formatINR(f.raisedAmount)} of{" "}
                        {formatINR(f.goalAmount)}
                      </p>
                      {f.contributors[0] ? (
                        <p className="mt-3 text-sm text-sage">
                          Latest: {f.contributors[0].name} ·{" "}
                          {formatINR(f.contributors[0].amount)}
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setFund(f)}
                        className="btn-glow mt-5 w-full rounded-full bg-ink px-4 py-3 text-sm font-semibold text-paper hover:bg-dusk"
                      >
                        Contribute via UPI
                      </button>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>

      <GiftClaimModal
        open={!!giftItem}
        item={giftItem}
        slug={registry.slug}
        onClose={() => setGiftItem(null)}
        onClaimed={(item) => {
          setRegistry((prev) => ({
            ...prev,
            items: prev.items.map((i) => (i.id === item.id ? item : i)),
          }));
          highlight(item.id);
        }}
      />

      <UpiContributeModal
        open={!!fund}
        fund={fund}
        registry={registry}
        onClose={() => setFund(null)}
        onConfirmed={(updated) => {
          setRegistry((prev) => ({
            ...prev,
            funds: prev.funds.map((f) => (f.id === updated.id ? updated : f)),
          }));
          highlight(updated.id);
        }}
      />
    </div>
  );
}
