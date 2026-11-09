import { attachDatabasePool } from "@vercel/functions";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Resolver } from "node:dns/promises";
import { patchDnsForNeonLocal } from "../dns-fix";
import * as schema from "./schema";

patchDnsForNeonLocal();

type Db = NodePgDatabase<typeof schema>;

// App traffic: pooled. Migrations use DATABASE_URL / DATABASE_URL_UNPOOLED (direct).
const connectionString =
  process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL_POOLED / DATABASE_URL is not set. Run `neon deploy` or set .env.local.",
  );
}

const globalForDb = globalThis as unknown as {
  giftusPool?: Pool;
  giftusDb?: Db;
  giftusInit?: Promise<Db>;
};

async function resolveNeonHost(hostname: string) {
  try {
    const resolver = new Resolver();
    resolver.setServers(["8.8.8.8", "1.1.1.1"]);
    const v4 = await resolver.resolve4(hostname);
    return v4[0] || hostname;
  } catch {
    return hostname;
  }
}

async function createPool() {
  const url = new URL(connectionString!);
  const hostname = url.hostname;
  const host = hostname.includes("neon.tech")
    ? await resolveNeonHost(hostname)
    : hostname;

  const pool = new Pool({
    host,
    port: Number(url.port || 5432),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, "") || "neondb",
    ssl: {
      rejectUnauthorized: false,
      servername: hostname,
    },
    max: 10,
    idleTimeoutMillis: 5000,
  });

  attachDatabasePool(pool);
  return pool;
}

export async function getDb(): Promise<Db> {
  if (globalForDb.giftusDb) return globalForDb.giftusDb;
  if (!globalForDb.giftusInit) {
    globalForDb.giftusInit = (async () => {
      const pool = globalForDb.giftusPool ?? (await createPool());
      globalForDb.giftusPool = pool;
      const db = drizzle({ client: pool, schema });
      globalForDb.giftusDb = db;
      return db;
    })();
  }
  return globalForDb.giftusInit;
}

export async function endPool() {
  if (globalForDb.giftusPool) {
    await globalForDb.giftusPool.end();
    globalForDb.giftusPool = undefined;
    globalForDb.giftusDb = undefined;
    globalForDb.giftusInit = undefined;
  }
}
