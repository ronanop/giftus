import { Resolver } from "node:dns/promises";
import { Pool, type PoolConfig } from "pg";

/**
 * Build a pg Pool that works even when the system DNS refuses Neon hostnames.
 * Resolves via public DNS, then connects to the IP with SNI/servername set.
 */
export async function createNeonPool(connectionString: string, overrides: PoolConfig = {}) {
  const url = new URL(connectionString);
  const hostname = url.hostname;
  const resolver = new Resolver();
  resolver.setServers(["8.8.8.8", "1.1.1.1"]);

  let host = hostname;
  try {
    const v4 = await resolver.resolve4(hostname);
    if (v4[0]) host = v4[0];
  } catch {
    try {
      const v6 = await resolver.resolve6(hostname);
      if (v6[0]) host = v6[0];
    } catch {
      // fall back to system DNS / hostname
    }
  }

  return new Pool({
    host,
    port: Number(url.port || 5432),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, "") || "neondb",
    ssl: {
      rejectUnauthorized: false,
      servername: hostname,
    },
    max: 5,
    idleTimeoutMillis: 5000,
    ...overrides,
  });
}
