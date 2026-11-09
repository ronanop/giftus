import type { GiftCategory, GiftItem, Registry } from "./types";
import { isUsableProductImage } from "./product-image";

export function categoryImage(
  category: GiftCategory,
  items: GiftItem[],
): string | undefined {
  if (isUsableProductImage(category.imageUrl)) return category.imageUrl;
  const fromGift = items.find(
    (item) =>
      item.categoryId === category.id && isUsableProductImage(item.imageUrl),
  );
  return fromGift?.imageUrl;
}

export function sortCategories(categories: GiftCategory[]) {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function groupItemsByCategory(registry: Registry) {
  const categories = sortCategories(registry.categories || []);
  const uncategorized = registry.items.filter((item) => !item.categoryId);
  const groups = categories.map((category) => ({
    category,
    imageUrl: categoryImage(category, registry.items),
    items: registry.items.filter((item) => item.categoryId === category.id),
  }));
  return { groups, uncategorized };
}
