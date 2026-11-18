"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CashFund, GiftItem, Registry } from "@/lib/types";
import { formatINR, occasionLabel } from "@/lib/format";
import { groupItemsByCategory } from "@/lib/categories";
import {
  isUsableProductImage,
  repairGiftImageUrl,
} from "@/lib/product-image";
import { HeartField } from "./HeartField";
import { GiftClaimModal } from "./GiftClaimModal";
import { UpiContributeModal } from "./UpiContributeModal";
import { Reveal } from "./Reveal";
import { WhimsicalCategories } from "./WhimsicalCategories";

export function RegistryView({ initial }: { initial: Registry }) {
  const [registry, setRegistry] = useState(initial);
  const [filter, setFilter] = useState<"all" | "available" | "purchased">("all");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [giftItem, setGiftItem] = useState<GiftItem | null>(null);
  const [fund, setFund] = useState<CashFund | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);

  const whimsy = registry.occasion === "baby_shower";

  const filteredItems = useMemo(() => {
    let list = registry.items;
    if (filter === "available") {
      list = list.filter(
        (i) => i.status === "available" || i.status === "reserved",
      );
    } else if (filter === "purchased") {
      list = list.filter((i) => i.status === "purchased");
    }
    if (activeCategoryId) {
      list = list.filter((i) => i.categoryId === activeCategoryId);
    }
    return list;
  }, [filter, registry.items, activeCategoryId]);

  const grouped = useMemo(
    () =>
      groupItemsByCategory({
        ...registry,
        categories: registry.categories || [],
        items: filteredItems,
      }),
    [registry, filteredItems],
  );

  const purchasedCount = registry.items.filter(
    (i) => i.status === "purchased",
  ).length;

  function highlight(id: string) {
    setFlashId(id);
    setTimeout(() => setFlashId(null), 1400);
  }

  function selectCategory(id: string) {
    setActiveCategoryId((prev) => (prev === id ? null : id));
    const el = document.getElementById("registry-gifts");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderGiftCard(item: GiftItem, index: number) {
    const claimed = item.status === "purchased";
    const src = repairGiftImageUrl({
      imageUrl: item.imageUrl,
      productUrl: item.productUrl,
    });
    const image = isUsableProductImage(src) ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    ) : null;

    const corner = (pos: "tl" | "tr" | "bl" | "br") => (
      <svg
        key={pos}
        className={`whimsy-gift-corner ${pos}`}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M3 14V5.5C3 4.12 4.12 3 5.5 3H14"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M3 8.5c2.2 0 4.2-1.2 5.2-3M8.5 3c0 2.2 1.2 4.2 3 5.2"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    );

    return (
      <Reveal key={item.id} delay={(index % 4) * 70}>
        <article
          className={`gift-card overflow-hidden ${
            whimsy
              ? "whimsy-gift"
              : "rounded-[1.75rem] bg-white shadow-[0_12px_40px_rgba(28,20,16,0.06)]"
          } ${flashId === item.id ? "claim-highlight" : ""}`}
        >
          {whimsy ? (
            <>
              {corner("tl")}
              {corner("tr")}
              {corner("bl")}
              {corner("br")}
            </>
          ) : null}
          <div
            className={
              whimsy
                ? "whimsy-gift-media"
                : "relative aspect-[16/11] overflow-hidden bg-gradient-to-br from-mist to-petal"
            }
          >
            {image}
            {item.storeName ? (
              <span
                className={
                  whimsy
                    ? "whimsy-gift-store"
                    : "absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium shadow-sm"
                }
              >
                {item.storeName}
              </span>
            ) : null}
            {claimed ? (
              <div className="absolute inset-x-2 bottom-2 z-[1] rounded-full bg-sage px-2.5 py-1.5 text-center text-[0.65rem] leading-tight text-white shadow-[0_10px_24px_rgba(74,93,78,0.35)] sm:inset-x-4 sm:bottom-4 sm:px-4 sm:py-2 sm:text-sm">
                Gifted by {item.giftedBy}
              </div>
            ) : null}
          </div>
          <div className={whimsy ? "whimsy-gift-body" : "p-3 sm:p-5"}>
            <h3
              className={`font-display text-[0.95rem] leading-snug sm:text-xl ${
                whimsy ? "text-grove-deep" : "text-ink"
              }`}
            >
              {item.title}
            </h3>
            {item.description ? (
              <p
                className={`mt-1 line-clamp-2 text-xs sm:text-sm ${
                  whimsy ? "text-grove/70 max-sm:hidden" : "text-ink/60"
                }`}
              >
                {item.description}
              </p>
            ) : null}
            {item.price ? (
              whimsy ? (
                <p className="whimsy-gift-price">{formatINR(item.price)}</p>
              ) : (
                <p className="mt-2 text-sm font-medium text-ink sm:mt-3 sm:text-base">
                  {formatINR(item.price)}
                </p>
              )
            ) : null}
            {claimed && item.giftMessage ? (
              <p
                className={`mt-2 line-clamp-2 text-xs italic sm:mt-3 sm:text-sm ${
                  whimsy ? "text-grove/80" : "text-rose"
                }`}
              >
                &ldquo;{item.giftMessage}&rdquo;
              </p>
            ) : null}
            {!claimed ? (
              <div
                className={`mt-3 flex flex-col gap-1.5 sm:mt-4 sm:flex-row sm:gap-2 ${whimsy ? "whimsy-gift-actions" : ""}`}
              >
                <a
                  href={item.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex min-h-9 items-center justify-center rounded-full border px-3 py-2 text-xs transition sm:min-h-11 sm:flex-none sm:px-4 sm:py-2.5 sm:text-sm ${
                    whimsy
                      ? "whimsy-view"
                      : "border-mist hover:border-ink/30 hover:bg-mist/60"
                  }`}
                >
                  View
                </a>
                <button
                  type="button"
                  onClick={() => setGiftItem(item)}
                  className={`btn-glow inline-flex min-h-9 items-center justify-center rounded-full px-3 py-2 text-xs font-semibold text-white sm:min-h-11 sm:flex-none sm:px-4 sm:py-2.5 sm:text-sm ${
                    whimsy
                      ? "bg-grove hover:bg-grove-deep"
                      : "bg-rose hover:bg-rose-deep"
                  }`}
                >
                  Gift this
                </button>
              </div>
            ) : null}
          </div>
        </article>
      </Reveal>
    );
  }

  return (
    <div className={`min-h-full ${whimsy ? "whimsy-shell" : ""}`}>
      <div className="relative isolate overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={registry.coverImageUrl}
          alt=""
          className="ken-burns absolute inset-0 h-full w-full object-cover"
        />
        <div
          className={`absolute inset-0 ${
            whimsy
              ? "bg-[linear-gradient(180deg,rgba(47,62,47,0.28)_0%,rgba(47,62,47,0.2)_38%,rgba(47,62,47,0.72)_72%,rgba(31,42,31,0.94)_100%)]"
              : "bg-gradient-to-t from-dusk via-ink/55 to-ink/20"
          }`}
        />
        <div
          className="float-orb left-[10%] top-[30%] hidden h-44 w-44 bg-rose/35 sm:block"
          style={{ animationDelay: "0.4s" }}
        />
        <div
          className="float-orb right-[5%] top-[18%] hidden h-52 w-52 bg-marigold/25 sm:block"
          style={{ animationDelay: "1.6s" }}
        />
        <div className="pointer-events-none absolute inset-0 hidden sm:block">
          <HeartField dense />
        </div>
        <div className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col justify-end px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-[max(5rem,calc(env(safe-area-inset-top)+4rem))] md:min-h-[74vh] md:px-8 md:pb-12">
          <Link
            href="/"
            className="absolute left-[max(1.25rem,env(safe-area-inset-left))] top-[max(1.25rem,env(safe-area-inset-top))] font-display text-xl text-white/90 transition hover:text-white md:left-8 md:top-6"
          >
            Giftus
          </Link>
          <span
            className={`animate-soft-in inline-flex w-fit rounded-full px-3.5 py-1 text-sm font-medium shadow-[0_8px_24px_rgba(168,137,74,0.35)] ${
              whimsy
                ? "bg-parchment text-grove"
                : "bg-gradient-to-r from-gold to-marigold text-ink"
            }`}
          >
            {occasionLabel(registry.occasion)}
          </span>
          {whimsy ? (
            <p
              className="animate-soft-in mt-3 font-script text-[1.7rem] leading-tight text-parchment sm:mt-5 sm:text-4xl md:text-6xl"
              style={{ animationDelay: "60ms" }}
            >
              A Little One Is Almost Home
            </p>
          ) : null}
          <h1
            className={`animate-soft-in mt-2 font-display text-[2.15rem] leading-[1.08] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.35)] sm:mt-3 sm:text-4xl md:text-6xl ${
              whimsy ? "md:text-5xl" : ""
            }`}
            style={{ animationDelay: "90ms" }}
          >
            {registry.title}
          </h1>
          <p
            className="animate-soft-in mt-2.5 max-w-2xl text-[0.95rem] leading-relaxed text-white/88 sm:mt-3 sm:text-base"
            style={{ animationDelay: "160ms" }}
          >
            {whimsy
              ? "Our registry for the newest member of our family."
              : [registry.location, registry.eventDate]
                  .filter(Boolean)
                  .join(" · ")}
          </p>
          {whimsy ? (
            <a
              href="#registry-categories"
              className="animate-soft-in mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-grove px-5 py-3.5 text-sm font-semibold text-parchment shadow-[0_12px_28px_rgba(47,62,47,0.35)] transition hover:bg-grove-deep sm:mt-7 sm:w-fit sm:justify-start"
              style={{ animationDelay: "220ms" }}
            >
              Explore the Registry
              <span aria-hidden>→</span>
            </a>
          ) : null}
        </div>
      </div>

      {whimsy && (registry.categories || []).length > 0 ? (
        <div id="registry-categories">
          <WhimsicalCategories
            categories={registry.categories || []}
            items={registry.items}
            activeId={activeCategoryId}
            onSelect={selectCategory}
          />
        </div>
      ) : null}

      <div className="mx-auto max-w-5xl px-5 py-8 sm:py-10 md:px-8">
        <Reveal>
          <div
            className={
              whimsy
                ? "whimsy-hero-frame rounded-[1.35rem] p-5 sm:rounded-[1.75rem] sm:p-6 md:p-8"
                : ""
            }
          >
            <p className="max-w-3xl text-base leading-relaxed text-ink/80 sm:text-lg">
              {registry.story}
            </p>
            {whimsy && (registry.location || registry.eventDate) ? (
              <p className="mt-3 text-sm text-grove/70">
                {[registry.location, registry.eventDate]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            ) : null}
          </div>
        </Reveal>

        {registry.photos.length > 0 ? (
          <section className="mt-14">
            <Reveal>
              <h2 className="font-display text-3xl text-ink">Our moments</h2>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {registry.photos.map((photo, i) => (
                <Reveal key={photo.id} delay={i * 90} variant="scale">
                  <figure
                    className={`group overflow-hidden ${
                      whimsy
                        ? "whimsy-hero-frame rounded-[1.25rem] p-2"
                        : "rounded-[1.5rem]"
                    }`}
                  >
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

        <section id="registry-gifts" className="mt-12 scroll-mt-24 sm:mt-16">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div>
                <h2
                  className={`font-display text-[1.85rem] sm:text-3xl ${
                    whimsy ? "text-grove-deep" : "text-ink"
                  }`}
                >
                  {whimsy ? "The Registry" : "Gifts"}
                </h2>
                <p className="mt-1 text-sm text-ink/60">
                  {purchasedCount} of {registry.items.length} gifted
                  {activeCategoryId
                    ? ` · ${
                        registry.categories.find((c) => c.id === activeCategoryId)
                          ?.name || "Category"
                      }`
                    : ""}
                </p>
              </div>
              <div className="registry-filter-row -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                {activeCategoryId ? (
                  <button
                    type="button"
                    onClick={() => setActiveCategoryId(null)}
                    className="shrink-0 rounded-full border border-grove/20 bg-parchment px-4 py-2.5 text-sm text-grove"
                  >
                    All categories
                  </button>
                ) : null}
                {(["all", "available", "purchased"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`shrink-0 rounded-full px-4 py-2.5 text-sm capitalize transition ${
                      filter === key
                        ? whimsy
                          ? "bg-grove text-parchment shadow-[0_8px_20px_rgba(47,62,47,0.2)]"
                          : "bg-ink text-paper shadow-[0_8px_20px_rgba(28,20,16,0.18)]"
                        : "bg-mist text-ink/70 hover:bg-blush/60"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-8 space-y-12">
            {whimsy && activeCategoryId ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5">
                {filteredItems.map((item, i) => renderGiftCard(item, i))}
              </div>
            ) : (
              <>
                {grouped.groups.map(({ category, imageUrl, items }) =>
                  items.length > 0 ? (
                    <div key={category.id} id={`category-${category.id}`}>
                      {!whimsy ? (
                        <Reveal>
                          <div className="mb-5 flex items-center gap-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-mist shadow-[0_8px_24px_rgba(28,20,16,0.08)]">
                              {isUsableProductImage(imageUrl) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={imageUrl}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div>
                              <h3 className="font-display text-2xl text-ink">
                                {category.name}
                              </h3>
                              <p className="text-sm text-ink/55">
                                {items.length} gift
                                {items.length === 1 ? "" : "s"}
                              </p>
                            </div>
                          </div>
                        </Reveal>
                      ) : (
                        <Reveal>
                          <h3 className="mb-5 font-display text-2xl text-grove-deep">
                            {category.name}
                          </h3>
                        </Reveal>
                      )}
                      <div className="grid grid-cols-2 gap-3 sm:gap-5">
                        {items.map((item, i) => renderGiftCard(item, i))}
                      </div>
                    </div>
                  ) : null,
                )}

                {grouped.uncategorized.length > 0 ? (
                  <div>
                    {(registry.categories || []).length > 0 ? (
                      <Reveal>
                        <h3 className="mb-5 font-display text-2xl text-ink">
                          More gifts
                        </h3>
                      </Reveal>
                    ) : null}
                    <div className="grid grid-cols-2 gap-3 sm:gap-5">
                      {grouped.uncategorized.map((item, i) =>
                        renderGiftCard(item, i),
                      )}
                    </div>
                  </div>
                ) : null}
              </>
            )}

            {filteredItems.length === 0 ? (
              <p className="text-sm text-ink/55">No gifts in this filter.</p>
            ) : null}
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
