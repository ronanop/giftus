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
    return (
      <Reveal key={item.id} delay={(index % 4) * 70}>
        <article
          className={`gift-card overflow-hidden rounded-[1.75rem] bg-white shadow-[0_12px_40px_rgba(28,20,16,0.06)] ${
            whimsy ? "border border-grove/10" : ""
          } ${flashId === item.id ? "claim-highlight" : ""}`}
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
            <h3 className="font-display text-xl text-ink">{item.title}</h3>
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
                  className={`btn-glow rounded-full px-4 py-2 text-sm font-semibold text-white ${
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
              ? "bg-gradient-to-t from-[#2f3e2f] via-[#2f3e2f]/55 to-[#2f3e2f]/20"
              : "bg-gradient-to-t from-dusk via-ink/55 to-ink/20"
          }`}
        />
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
              className="animate-soft-in mt-5 font-script text-4xl text-parchment md:text-6xl"
              style={{ animationDelay: "60ms" }}
            >
              A Little One Is Almost Home
            </p>
          ) : null}
          <h1
            className={`animate-soft-in mt-3 font-display text-4xl text-white md:text-6xl ${
              whimsy ? "md:text-5xl" : ""
            }`}
            style={{ animationDelay: "90ms" }}
          >
            {registry.title}
          </h1>
          <p
            className="animate-soft-in mt-3 max-w-2xl text-white/85"
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
              className="animate-soft-in mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-grove px-5 py-3 text-sm font-semibold text-parchment shadow-[0_12px_28px_rgba(47,62,47,0.35)] transition hover:bg-grove-deep"
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

      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        <Reveal>
          <div className={whimsy ? "whimsy-hero-frame rounded-[1.75rem] p-6 md:p-8" : ""}>
            <p className="max-w-3xl text-lg leading-relaxed text-ink/80">
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

        <section id="registry-gifts" className="mt-16 scroll-mt-24">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2
                  className={`font-display text-3xl ${
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
              <div className="flex flex-wrap gap-2">
                {activeCategoryId ? (
                  <button
                    type="button"
                    onClick={() => setActiveCategoryId(null)}
                    className="rounded-full border border-grove/20 bg-parchment px-4 py-2 text-sm text-grove"
                  >
                    All categories
                  </button>
                ) : null}
                {(["all", "available", "purchased"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`rounded-full px-4 py-2 text-sm capitalize transition ${
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
              <div className="grid gap-5 sm:grid-cols-2">
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
                      <div className="grid gap-5 sm:grid-cols-2">
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
                    <div className="grid gap-5 sm:grid-cols-2">
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
