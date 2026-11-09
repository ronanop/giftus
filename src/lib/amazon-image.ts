import { sanitizeProductImageUrl } from "./product-image";

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-IN,en;q=0.9",
};

export function extractAmazonAsin(url?: string | null) {
  if (!url) return undefined;
  const m =
    url.match(/\/(?:dp|gp\/product|gp\/aw\/d|product)\/([A-Z0-9]{10})/i) ||
    url.match(/[?&]asin=([A-Z0-9]{10})/i);
  return m?.[1]?.toUpperCase();
}

/** Unreliable catalog fallback — often a 43-byte blank GIF for marketplace ASINs. */
export function amazonAsinImageGuess(asin?: string) {
  if (!asin) return undefined;
  return `https://m.media-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_SX500_.jpg`;
}

export function extractAmazonImageUrls(html: string) {
  const out: string[] = [];
  const patterns = [
    /"hiRes"\s*:\s*"(https:\\\/\\\/m\.media-amazon\.com\\\/images\\\/I\\\/[^"]+)"/g,
    /"large"\s*:\s*"(https:\\\/\\\/m\.media-amazon\.com\\\/images\\\/I\\\/[^"]+)"/g,
    /"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g,
    /"large"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g,
    /data-old-hires="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g,
    /https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+\-_%,.]+\._(?:AC_|SL|UX|UL)[^"'\\\s>]*/g,
    /https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+\-_%,.]+\.jpg/g,
  ];

  for (const re of patterns) {
    for (const match of html.matchAll(re)) {
      const raw = (match[1] || match[0])
        .replace(/\\u002F/g, "/")
        .replace(/\\\//g, "/")
        .replace(/&amp;/g, "&");
      if (!/\.(jpe?g|png|webp)/i.test(raw)) continue;
      if (/_RC|_SS\d{2}_|\.js($|\?)/i.test(raw)) continue;
      out.push(raw);
    }
  }

  return [...new Set(out)];
}

export async function isRenderableProductImage(url?: string | null) {
  const clean = sanitizeProductImageUrl(url);
  if (!clean) return false;
  // Catalog P/ URLs are frequently blank GIFs for India marketplace listings.
  if (/\/images\/P\//i.test(clean)) {
    try {
      const res = await fetch(clean, {
        redirect: "follow",
        cache: "no-store",
        headers: { Accept: "image/*,*/*" },
      });
      if (!res.ok) return false;
      const buf = Buffer.from(await res.arrayBuffer());
      const ct = res.headers.get("content-type") || "";
      if (buf.length < 1000) return false;
      if (/gif/i.test(ct) && buf.length < 5000) return false;
      return true;
    } catch {
      return false;
    }
  }
  return true;
}

export async function resolveAmazonProductImage(productUrl: string) {
  try {
    const res = await fetch(productUrl, {
      headers: BROWSER_HEADERS,
      redirect: "follow",
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    const html = await res.text();
    const candidates = extractAmazonImageUrls(html)
      .map((u) => sanitizeProductImageUrl(u))
      .filter((u): u is string => Boolean(u));
    return candidates[0];
  } catch {
    return undefined;
  }
}

export async function resolveGiftImageUrl(input: {
  imageUrl?: string | null;
  productUrl?: string | null;
}) {
  if (await isRenderableProductImage(input.imageUrl)) {
    return sanitizeProductImageUrl(input.imageUrl);
  }
  if (input.productUrl && /amazon\.|amzn\./i.test(input.productUrl)) {
    const scraped = await resolveAmazonProductImage(input.productUrl);
    if (scraped) return scraped;
  }
  return undefined;
}
