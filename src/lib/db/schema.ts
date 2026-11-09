/**
 * Neon / Postgres schema (Drizzle).
 * Wire DATABASE_URL when ready — current runtime uses src/lib/store.ts
 * so the product works before Neon is connected.
 */
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const registries = pgTable("registries", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  occasion: text("occasion").notNull(),
  story: text("story").notNull(),
  coverImageUrl: text("cover_image_url").notNull(),
  photos: jsonb("photos").$type<{ id: string; url: string; caption?: string }[]>(),
  eventDate: text("event_date"),
  location: text("location"),
  upiId: text("upi_id"),
  upiName: text("upi_name"),
  isPublic: boolean("is_public").default(true),
  items: jsonb("items").$type<unknown[]>().default([]),
  funds: jsonb("funds").$type<unknown[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const giftClaims = pgTable("gift_claims", {
  id: text("id").primaryKey(),
  registryId: text("registry_id").notNull(),
  itemId: text("item_id").notNull(),
  name: text("name").notNull(),
  message: text("message"),
  amount: integer("amount"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
