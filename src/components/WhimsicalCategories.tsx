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
    <section className="whimsy-band relative overflow-x-clip py-10 sm:overflow-hidden sm:px-5 sm:py-16 md:px-8 md:py-20">
      <div className="relative mx-auto max-w-6xl text-center">
        <Reveal>
          <div className="px-5 sm:px-0">
            <h2 className="mx-auto max-w-[16ch] font-script text-[1.85rem] leading-[1.15] text-grove sm:max-w-none sm:text-4xl md:text-5xl">
              Gifts Before the Baby Arrives
            </h2>
            <p className="mt-2 font-display text-[0.7rem] tracking-[0.16em] text-grove/70 uppercase sm:mt-3 sm:text-sm sm:tracking-[0.18em]">
              Explore our wishlist by category
            </p>
          </div>
        </Reveal>

        <div className="whimsy-category-rail mt-6 sm:mt-10 sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-7 xl:gap-3">
          {categories.map((category, i) => {
            const art =
              whimsyArtForCategory(category.name) ||
              categoryImage(category, items);
            const active = activeId === category.id;
            return (
              <Reveal
                key={category.id}
                delay={i * 50}
                variant="scale"
                className="whimsy-category-slide"
              >
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
                  <span className="whimsy-arch-title">{category.name}</span>
                </button>
              </Reveal>
            );
          })}
        </div>

        <p className="whimsy-scroll-hint sm:hidden" aria-hidden>
          <span className="font-script text-[1.15rem] text-grove/75">
            Scroll for more categories
          </span>
          <span className="whimsy-scroll-hint-arrow" aria-hidden>
            →
          </span>
        </p>
      </div>
    </section>
  );
}
