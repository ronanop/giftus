import type { BabyArrivalTheme, CashFund, Occasion } from "@/lib/types";

/** Cover / hero image guidance shown on create + edit screens. */
export const COVER_IMAGE_GUIDE = {
  label: "Hero cover image",
  aspect: "4:3 landscape (wider than tall)",
  recommended: "1600 × 1200 px",
  minimum: "1200 × 900 px",
  maxDisplay: "Fits full phone width; top & bottom soft-fade into the page",
  tip: "Collages and family photos work best. Keep faces away from the very top and bottom edges.",
} as const;

export const FAMILY_PHOTO_GUIDE = {
  label: "Family photos",
  recommended: "1200 × 1500 px (portrait) or 1200 × 1200 px (square)",
  tip: "These appear in the “Our moments” gallery below the story.",
} as const;

export const BABY_ARRIVAL_DEFAULTS: Required<BabyArrivalTheme> = {
  scriptLine: "Our Little One",
  inviteLede:
    "A gentle wishlist for the newest member of our family — chosen with love, waiting for yours.",
  categoryHeading: "Gifts Before the Baby Arrives",
  categorySubheading: "Explore our wishlist by category",
  registryHeading: "The Registry",
  ctaLabel: "Open the Registry",
  storyHeading: "Our Story",
  cashGiftTitle: "A little something special",
  cashGiftDescription:
    "Send a cash gift of any amount — it goes directly to the family via UPI.",
};

export const BABY_ARRIVAL_STORY_DEFAULT =
  "Our little one is almost home. This registry is for the newest member of our family — thank you for celebrating with us.";

/** Starter category names for Baby Arrival create/edit flows. */
export const BABY_ARRIVAL_CATEGORY_NAMES = [
  "For Our Nursery",
  "Toys & Play",
  "Feeding Essentials",
  "On-the-Go & Travel",
  "Clothing & Basics",
  "Bath & Care",
  "Sleep & Comfort",
] as const;

export function isBabyArrivalOccasion(occasion: Occasion | string) {
  return occasion === "baby_shower";
}

export function resolveBabyArrivalTheme(
  theme?: BabyArrivalTheme | null,
): Required<BabyArrivalTheme> {
  return {
    scriptLine: theme?.scriptLine?.trim() || BABY_ARRIVAL_DEFAULTS.scriptLine,
    inviteLede: theme?.inviteLede?.trim() || BABY_ARRIVAL_DEFAULTS.inviteLede,
    categoryHeading:
      theme?.categoryHeading?.trim() || BABY_ARRIVAL_DEFAULTS.categoryHeading,
    categorySubheading:
      theme?.categorySubheading?.trim() ||
      BABY_ARRIVAL_DEFAULTS.categorySubheading,
    registryHeading:
      theme?.registryHeading?.trim() || BABY_ARRIVAL_DEFAULTS.registryHeading,
    ctaLabel: theme?.ctaLabel?.trim() || BABY_ARRIVAL_DEFAULTS.ctaLabel,
    storyHeading:
      theme?.storyHeading?.trim() || BABY_ARRIVAL_DEFAULTS.storyHeading,
    cashGiftTitle:
      theme?.cashGiftTitle?.trim() || BABY_ARRIVAL_DEFAULTS.cashGiftTitle,
    cashGiftDescription:
      theme?.cashGiftDescription?.trim() ||
      BABY_ARRIVAL_DEFAULTS.cashGiftDescription,
  };
}

export function defaultBabyArrivalCashGift(): CashFund {
  return {
    id: "cash-gift",
    title: BABY_ARRIVAL_DEFAULTS.cashGiftTitle,
    description: BABY_ARRIVAL_DEFAULTS.cashGiftDescription,
    goalAmount: 50000,
    raisedAmount: 0,
    contributors: [],
  };
}
