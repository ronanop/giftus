import dns from "node:dns";
import { Resolver } from "node:dns/promises";

let patched = false;

/**
 * Some local ISP resolvers refuse Neon hostnames (Query refused / ENOTFOUND).
 * Patch dns.lookup so pg + AWS SDK resolve via public DNS for *.neon.tech.
 */
export function patchDnsForNeonLocal() {
  if (patched) return;

  const resolver = new Resolver();
  resolver.setServers(["8.8.8.8", "1.1.1.1"]);
  const originalLookup = dns.lookup.bind(dns);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (dns as any).lookup = (
    hostname: string,
    options: unknown,
    callback?: unknown,
  ) => {
    let opts = options;
    let cb = callback as
      | ((err: NodeJS.ErrnoException | null, address: string, family: number) => void)
      | ((
          err: NodeJS.ErrnoException | null,
          addresses: dns.LookupAddress[],
        ) => void)
      | undefined;

    if (typeof options === "function") {
      cb = options as typeof cb;
      opts = {};
    }

    const usePublic =
      hostname.includes("neon.tech") ||
      process.env.GIFTUS_FORCE_PUBLIC_DNS === "1";

    if (!usePublic) {
      return originalLookup(hostname, opts as never, cb as never);
    }

    const wantAll =
      typeof opts === "object" &&
      opts &&
      "all" in opts &&
      (opts as { all?: boolean }).all;

    resolver
      .resolve4(hostname)
      .then((addrs) => {
        if (!addrs.length) throw new Error("empty");
        if (wantAll) {
          (cb as (err: null, addresses: dns.LookupAddress[]) => void)(
            null,
            addrs.map((address) => ({ address, family: 4 })),
          );
        } else {
          (cb as (err: null, address: string, family: number) => void)(
            null,
            addrs[0],
            4,
          );
        }
      })
      .catch(() => {
        originalLookup(hostname, opts as never, cb as never);
      });
  };

  patched = true;
}
