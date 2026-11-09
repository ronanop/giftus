/** Illustration art for baby-shower category arches (whimsical storybook set). */
export const WHIMSY_CATEGORY_ART: Record<string, string> = {
  "for our nursery": "/whimsy/cat-nursery.jpg",
  "toys & play": "/whimsy/cat-toys.jpg",
  "feeding essentials": "/whimsy/cat-feeding.jpg",
  "on-the-go & travel": "/whimsy/cat-travel.jpg",
  "clothing & basics": "/whimsy/cat-clothing.jpg",
  "bath & care": "/whimsy/cat-bath.jpg",
  "sleep & comfort": "/whimsy/cat-sleep.jpg",
};

export function whimsyArtForCategory(name: string) {
  return WHIMSY_CATEGORY_ART[name.trim().toLowerCase()];
}
