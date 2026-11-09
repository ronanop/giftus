"use client";

import type { GiftCategory, GiftItem } from "@/lib/types";
import { categoryImage } from "@/lib/categories";
import { whimsyArtForCategory } from "@/lib/whimsy";
import { isUsableProductImage } from "@/lib/product-image";
import { Reveal } from "./Reveal";

function Bow() {
  return (
    <svg
      className="whimsy-bow"
      width="54"
      height="28"
      viewBox="0 0 54 28"
      fill="none"
      aria-hidden
    >
      <path
        d="M27 14c-2.2 0-4.2-.7-5.4-2.2-1.8 2.1-5.2 3.4-8.6 2.4-2.6-.8-4.4-3-4.2-5.5.2-2.8 2.8-4.6 5.8-4.2 3.2.4 5.6 2.6 6.6 5.2C22.4 6.4 24.6 5 27 5c2.4 0 4.6 1.4 5.8 4.7 1-2.6 3.4-4.8 6.6-5.2 3-.4 5.6 1.4 5.8 4.2.2 2.5-1.6 4.7-4.2 5.5-3.4 1-6.8-.3-8.6-2.4C31.2 13.3 29.2 14 27 14z"
        fill="currentColor"
      />
      <circle cx="27" cy="14" r="3.2" fill="currentColor" />
      <path
        d="M27 17v8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8h9M8.5 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WhimsicalCategories({
  categories,
  items,
  activeId,
  onSelect,
}: {
  categories: GiftCategory[];
  items: GiftItem[];
  activeId?: string | null;
  onSelect: (categoryId: string) => void;
}) {
  if (!categories.length) return null;

  return (
    <section className="whimsy-band relative overflow-hidden px-5 py-16 md:px-8 md:py-20">
      <div className="whimsy-flora" aria-hidden />
      <div className="relative mx-auto max-w-6xl text-center">
        <Reveal>
          <h2 className="font-script text-4xl text-grove md:text-5xl">
            Gifts Before the Baby Arrives
          </h2>
          <p className="mt-3 font-display text-sm tracking-[0.18em] text-grove/70 uppercase">
            Explore our wishlist by category
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 xl:gap-4">
          {categories.map((category, i) => {
            const art =
              whimsyArtForCategory(category.name) ||
              categoryImage(category, items);
            const active = activeId === category.id;
            return (
              <Reveal key={category.id} delay={i * 70} variant="scale">
                <button
                  type="button"
                  onClick={() => onSelect(category.id)}
                  className={`whimsy-arch group ${active ? "is-active" : ""}`}
                >
                  <Bow />
                  <div className="whimsy-arch-art">
                    {isUsableProductImage(art) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={art} alt="" />
                    ) : (
                      <div className="whimsy-arch-fallback" />
                    )}
                  </div>
                  <div className="whimsy-arch-footer">
                    <span className="whimsy-arch-title">{category.name}</span>
                    <span className="whimsy-arch-cta" aria-hidden>
                      <ArrowIcon />
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
