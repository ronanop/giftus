import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { createNeonPool } from "./pg-connect";

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL_UNPOOLED / DATABASE_URL missing");

  const pool = await createNeonPool(url);
  const db = drizzle(pool);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS registries (
      id text PRIMARY KEY,
      slug text NOT NULL UNIQUE,
      owner_id text NOT NULL REFERENCES users(id),
      title text NOT NULL,
      occasion text NOT NULL,
      story text NOT NULL,
      cover_image_url text NOT NULL,
      photos jsonb DEFAULT '[]'::jsonb,
      event_date text,
      location text,
      upi_id text,
      upi_name text,
      is_public boolean DEFAULT true,
      items jsonb DEFAULT '[]'::jsonb,
      funds jsonb DEFAULT '[]'::jsonb,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS gift_claims (
      id text PRIMARY KEY,
      registry_id text NOT NULL,
      item_id text NOT NULL,
      name text NOT NULL,
      message text,
      amount integer,
      created_at timestamptz DEFAULT now()
    );
  `);

  await db.execute(sql`
    ALTER TABLE registries
    ADD COLUMN IF NOT EXISTS categories jsonb DEFAULT '[]'::jsonb;
  `);

  const tables = await db.execute(sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);
  console.log(
    "Tables:",
    tables.rows.map((r) => r.table_name).join(", "),
  );

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
