import { config } from "dotenv";
config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { nanoid } from "nanoid";
import { createNeonPool } from "./pg-connect";
import * as schema from "../src/lib/db/schema";
import { DEMO_REGISTRY } from "../src/lib/demo";

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  const pool = await createNeonPool(url);
  const db = drizzle({ client: pool, schema });

  const demoEmail = "demo@giftus.in";
  let owner = await db.query.users.findFirst({
    where: eq(schema.users.email, demoEmail),
  });

  if (!owner) {
    const id = nanoid();
    await db.insert(schema.users).values({
      id,
      name: "Giftus Demo",
      email: demoEmail,
      passwordHash: await bcrypt.hash("giftus-demo-pass", 10),
    });
    owner = await db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
  }

  if (!owner) throw new Error("Could not create demo owner");

  const existing = await db.query.registries.findFirst({
    where: eq(schema.registries.slug, DEMO_REGISTRY.slug),
  });

  if (existing) {
    console.log("Demo registry already exists:", existing.slug);
  } else {
    await db.insert(schema.registries).values({
      id: nanoid(),
      slug: DEMO_REGISTRY.slug,
      ownerId: owner.id,
      title: DEMO_REGISTRY.title,
      occasion: DEMO_REGISTRY.occasion,
      story: DEMO_REGISTRY.story,
      coverImageUrl: DEMO_REGISTRY.coverImageUrl,
      photos: DEMO_REGISTRY.photos,
      eventDate: DEMO_REGISTRY.eventDate,
      location: DEMO_REGISTRY.location,
      upiId: DEMO_REGISTRY.upiId,
      upiName: DEMO_REGISTRY.upiName,
      isPublic: true,
      items: DEMO_REGISTRY.items,
      funds: DEMO_REGISTRY.funds,
    });
    console.log("Seeded demo registry:", DEMO_REGISTRY.slug);
  }

  await pool.end();
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
