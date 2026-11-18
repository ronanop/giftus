import { config } from "dotenv";
config({ path: ".env.local" });

import { nanoid } from "nanoid";
import type { GiftCategory, GiftItem } from "../src/lib/types";

const CATALOG: Array<{
  name: string;
  products: Array<{
    title: string;
    description: string;
    price: number;
    storeName: string;
    imageUrl: string;
    productUrl: string;
  }>;
}> = [
  {
    name: "For Our Nursery",
    products: [
      {
        title: "Wooden Convertible Crib",
        description: "Grow-with-baby crib for the nursery corner.",
        price: 24999,
        storeName: "Amazon",
        imageUrl:
          "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.amazon.in/s?k=wooden+convertible+crib",
      },
      {
        title: "Starry Night Mobile",
        description: "Soft hanging stars for calm evening winds.",
        price: 1899,
        storeName: "FirstCry",
        imageUrl:
          "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.firstcry.com/",
      },
      {
        title: "Soft Knit Baby Blanket",
        description: "Chunky knit throw for naps and cuddles.",
        price: 1499,
        storeName: "Myntra",
        imageUrl:
          "https://images.unsplash.com/photo-1519689373023-dd07c7988603?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.myntra.com/",
      },
    ],
  },
  {
    name: "Toys & Play",
    products: [
      {
        title: "Classic Plush Teddy",
        description: "A first friend with a soft sage bow.",
        price: 1299,
        storeName: "Amazon",
        imageUrl:
          "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.amazon.in/s?k=plush+teddy+bear",
      },
      {
        title: "Wooden Stacking Rings",
        description: "Rainbow stacker for tiny hands.",
        price: 899,
        storeName: "FirstCry",
        imageUrl:
          "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.firstcry.com/",
      },
      {
        title: "Natural Wood Blocks Set",
        description: "Alphabet blocks for playtime discovery.",
        price: 1199,
        storeName: "Flipkart",
        imageUrl:
          "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.flipkart.com/",
      },
    ],
  },
  {
    name: "Feeding Essentials",
    products: [
      {
        title: "Anti-Colic Glass Bottle",
        description: "Clear glass bottle for gentle feeds.",
        price: 799,
        storeName: "FirstCry",
        imageUrl:
          "https://images.unsplash.com/photo-1584839404042-8bcb9ce4f6f6?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.firstcry.com/",
      },
      {
        title: "Silicone Suction Bowl",
        description: "Stays put for first solid bites.",
        price: 649,
        storeName: "Amazon",
        imageUrl:
          "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.amazon.in/s?k=silicone+suction+bowl+baby",
      },
      {
        title: "Bamboo Feeding Spoons",
        description: "Soft-tip spoons for weaning.",
        price: 499,
        storeName: "Myntra",
        imageUrl:
          "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.myntra.com/",
      },
    ],
  },
  {
    name: "On-the-Go & Travel",
    products: [
      {
        title: "Lightweight Travel Stroller",
        description: "Compact stroller for city walks and trips.",
        price: 18999,
        storeName: "Amazon",
        imageUrl:
          "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.amazon.in/s?k=lightweight+baby+stroller",
      },
      {
        title: "Insulated Diaper Bag",
        description: "Roomy tote with bottle pockets.",
        price: 2499,
        storeName: "Flipkart",
        imageUrl:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.flipkart.com/",
      },
      {
        title: "Padded Car Seat Insert",
        description: "Extra cushion for newborn rides.",
        price: 1699,
        storeName: "FirstCry",
        imageUrl:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.firstcry.com/",
      },
    ],
  },
  {
    name: "Clothing & Basics",
    products: [
      {
        title: "Organic Cotton Cable Knit Romper",
        description: "Cream knit romper for everyday snuggles.",
        price: 1599,
        storeName: "Myntra",
        imageUrl:
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.myntra.com/",
      },
      {
        title: "Soft Sole Booties",
        description: "Matching booties for tiny toes.",
        price: 699,
        storeName: "Amazon",
        imageUrl:
          "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.amazon.in/s?k=baby+booties",
      },
      {
        title: "Cotton Bodysuit Set",
        description: "Everyday essentials in soft cotton.",
        price: 1299,
        storeName: "FirstCry",
        imageUrl:
          "https://images.unsplash.com/photo-1519689373023-dd07c7988603?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.firstcry.com/",
      },
    ],
  },
  {
    name: "Bath & Care",
    products: [
      {
        title: "Gentle Baby Wash & Lotion Set",
        description: "Mild bath duo for sensitive skin.",
        price: 999,
        storeName: "Amazon",
        imageUrl:
          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.amazon.in/s?k=baby+wash+lotion+set",
      },
      {
        title: "Organic Hooded Towel",
        description: "Soft hooded wrap after bath time.",
        price: 1199,
        storeName: "FirstCry",
        imageUrl:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.firstcry.com/",
      },
      {
        title: "Wooden Baby Hairbrush",
        description: "Gentle brush for first wisps of hair.",
        price: 549,
        storeName: "Myntra",
        imageUrl:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.myntra.com/",
      },
    ],
  },
  {
    name: "Sleep & Comfort",
    products: [
      {
        title: "Star Print Toddler Pillow",
        description: "Soft starry pillow for cozy nights.",
        price: 899,
        storeName: "Amazon",
        imageUrl:
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.amazon.in/s?k=baby+pillow+stars",
      },
      {
        title: "Plush Comfort Bunny",
        description: "A snuggle bunny for bedtime.",
        price: 1099,
        storeName: "FirstCry",
        imageUrl:
          "https://images.unsplash.com/photo-1530325553241-4f6e483679f5?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.firstcry.com/",
      },
      {
        title: "Muslin Swaddle Blanket",
        description: "Breathable wrap for peaceful sleep.",
        price: 799,
        storeName: "Myntra",
        imageUrl:
          "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80",
        productUrl: "https://www.myntra.com/",
      },
    ],
  },
];

async function main() {
  const { patchDnsForNeonLocal } = await import("../src/lib/dns-fix");
  patchDnsForNeonLocal();
  const { getRegistryBySlug, updateRegistry } = await import("../src/lib/store");

  const registry = await getRegistryBySlug("shraddhas-baby-arrival");
  if (!registry) throw new Error("Registry not found");

  const categories: GiftCategory[] = [];
  const items: GiftItem[] = [];

  CATALOG.forEach((group, index) => {
    const categoryId = nanoid();
    categories.push({
      id: categoryId,
      name: group.name,
      sortOrder: index,
      imageUrl: group.products[0]?.imageUrl,
    });
    for (const product of group.products) {
      items.push({
        id: nanoid(),
        title: product.title,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        currency: "INR",
        storeName: product.storeName,
        productUrl: product.productUrl,
        categoryId,
        status: "available",
      });
    }
  });

  const updated = await updateRegistry(registry.id, registry.ownerId, {
    categories,
    items,
  });
  if (!updated) throw new Error("Update failed");

  console.log(
    JSON.stringify(
      {
        slug: updated.slug,
        categories: updated.categories.map((c) => c.name),
        itemCount: updated.items.length,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
