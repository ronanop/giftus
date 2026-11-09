import * as cheerio from "cheerio";
import { detectStore } from "./format";

export type EnrichedProduct = {
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  storeName: string;
  productUrl: string;
};

function absoluteUrl(base: string, maybe?: string | null) {
  if (!maybe) return undefined;
  try {
    return new URL(maybe, base).toString();
  } catch {
    return maybe;
  }
}

function parsePrice(...candidates: Array<string | undefined>) {
  for (const raw of candidates) {
    if (!raw) continue;
    const cleaned = raw.replace(/[^\d.]/g, "");
    const num = Number.parseFloat(cleaned);
    if (!Number.isNaN(num) && num > 0) return Math.round(num);
  }
  return undefined;
}

export async function enrichProductUrl(
  productUrl: string,
): Promise<EnrichedProduct> {
  const url = new URL(productUrl);
  const storeName = detectStore(productUrl);

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-IN,en;q=0.9",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    return {
      title: `${storeName} gift`,
      storeName,
      productUrl: url.toString(),
      description: "We couldn't read every detail — you can edit the title after adding.",
    };
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const ogTitle =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $("title").first().text();
  const ogDesc =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    undefined;
  const ogImage =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    $("img").first().attr("src");

  const jsonLdPrice = (() => {
    const blocks = $('script[type="application/ld+json"]')
      .toArray()
      .map((el) => $(el).text())
      .join("\n");
    const match = blocks.match(/"price"\s*:\s*"?([\d.]+)"?/i);
    return match?.[1];
  })();

  const price = parsePrice(
    jsonLdPrice,
    $('meta[property="product:price:amount"]').attr("content"),
    $('[class*="price"]').first().text(),
    $("#priceblock_ourprice").text(),
    $(".a-price .a-offscreen").first().text(),
  );

  const title = (ogTitle || "Gift item")
    .replace(/\s+/g, " ")
    .replace(/\s*[|:].*$/, "")
    .trim()
    .slice(0, 140);

  return {
    title: title || `${storeName} gift`,
    description: ogDesc?.trim().slice(0, 220),
    imageUrl: absoluteUrl(url.toString(), ogImage),
    price,
    storeName,
    productUrl: url.toString(),
  };
}
