import type { Registry } from "./types";

/** Showcase registry — works without Neon so the product story is always visible. */
export const DEMO_REGISTRY: Registry = {
  id: "demo",
  slug: "aanya-baby-shower",
  ownerId: "demo-owner",
  title: "Aanya's Baby Shower",
  occasion: "baby_shower",
  story:
    "We're so excited to welcome our little Aanya. Your love means everything — if you'd like to gift something special, we've gathered a few things that will help us begin this chapter. Presence first, presents second.",
  coverImageUrl:
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1600&q=80",
  photos: [
    {
      id: "p1",
      url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80",
      caption: "Nursery dreams",
    },
    {
      id: "p2",
      url: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=900&q=80",
      caption: "Tiny shoes, big love",
    },
    {
      id: "p3",
      url: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=900&q=80",
      caption: "Our growing family",
    },
  ],
  eventDate: "2026-12-14",
  location: "Bengaluru",
  upiId: "giftus@upi",
  upiName: "Aanya's Parents",
  isPublic: true,
  categories: [
    { id: "c1", name: "Everyday essentials", sortOrder: 0 },
    { id: "c2", name: "Nursery gear", sortOrder: 1 },
  ],
  items: [
    {
      id: "g1",
      title: "Organic Cotton Onesie Set",
      description: "Soft everyday essentials for the first months.",
      imageUrl:
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      price: 1899,
      currency: "INR",
      storeName: "Amazon",
      productUrl: "https://www.amazon.in/",
      categoryId: "c1",
      status: "purchased",
      giftedBy: "Meera Aunty",
      giftMessage: "Can't wait to cuddle her!",
      giftedAt: new Date().toISOString(),
    },
    {
      id: "g2",
      title: "Baby Monitor with Night Vision",
      description: "Peace of mind for late-night checks.",
      imageUrl:
        "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
      price: 7499,
      currency: "INR",
      storeName: "Flipkart",
      productUrl: "https://www.flipkart.com/",
      categoryId: "c2",
      status: "available",
    },
    {
      id: "g3",
      title: "Muslin Swaddle Cloths (Pack of 4)",
      description: "Breathable and gentle for Indian summers.",
      imageUrl:
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
      price: 1299,
      currency: "INR",
      storeName: "FirstCry",
      productUrl: "https://www.firstcry.com/",
      categoryId: "c1",
      status: "available",
    },
    {
      id: "g4",
      title: "Convertible Stroller",
      description: "From newborn naps to park walks.",
      imageUrl:
        "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=800&q=80",
      price: 18999,
      currency: "INR",
      storeName: "Amazon",
      productUrl: "https://www.amazon.in/",
      categoryId: "c2",
      status: "reserved",
      giftedBy: "Rahul (holding)",
      giftedAt: new Date().toISOString(),
    },
  ],
  funds: [
    {
      id: "f1",
      title: "Nursery Fund",
      description: "Toward the crib and soft lighting we've been dreaming of.",
      goalAmount: 50000,
      raisedAmount: 18500,
      contributors: [
        {
          name: "Priya",
          amount: 5000,
          message: "For sweet dreams",
          at: new Date().toISOString(),
        },
        {
          name: "The Sharmas",
          amount: 10000,
          message: "With love from Delhi",
          at: new Date().toISOString(),
        },
        {
          name: "Anonymous",
          amount: 3500,
          at: new Date().toISOString(),
        },
      ],
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
