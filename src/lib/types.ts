export type Occasion =
  | "baby_shower"
  | "wedding"
  | "housewarming"
  | "anniversary"
  | "birthday";

export type GiftItemStatus = "available" | "reserved" | "purchased";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface RegistryPhoto {
  id: string;
  url: string;
  caption?: string;
}

export interface GiftCategory {
  id: string;
  name: string;
  /** Optional override; otherwise derived from a product image in the category. */
  imageUrl?: string;
  sortOrder: number;
}

export interface GiftItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  currency: "INR";
  storeName?: string;
  productUrl: string;
  categoryId?: string;
  status: GiftItemStatus;
  giftedBy?: string;
  giftMessage?: string;
  giftedAt?: string;
}

export interface CashFund {
  id: string;
  title: string;
  description?: string;
  goalAmount: number;
  raisedAmount: number;
  contributors: { name: string; amount: number; message?: string; at: string }[];
}

export interface Registry {
  id: string;
  slug: string;
  ownerId: string;
  title: string;
  occasion: Occasion;
  story: string;
  coverImageUrl: string;
  photos: RegistryPhoto[];
  eventDate?: string;
  location?: string;
  upiId?: string;
  upiName?: string;
  isPublic: boolean;
  categories: GiftCategory[];
  items: GiftItem[];
  funds: CashFund[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}
