import * as cheerio from "cheerio";
import { detectStore } from "./format";

export type EnrichedProduct = {
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  storeName: string;
  productUrl: string;
  partial?: boolean;
};

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-IN,en;q=0.9",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Upgrade-Insecure-Requests": "1",
};

const MOBILE_HEADERS: Record<string, string> = {
  ...BROWSER_HEADERS,
  "User-Agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
};

function absoluteUrl(base: string, maybe?: string | null) {
  if (!maybe) return undefined;
  try {
    return new URL(maybe, base).toString();
  } catch {
    return maybe;
  }
}

function parsePrice(...candidates: Array<string | undefined | null>) {
  for (const raw of candidates) {
    if (!raw) continue;
    const cleaned = raw.replace(/[^\d.]/g, "");
    const num = Number.parseFloat(cleaned);
    if (!Number.isNaN(num) && num > 0) return Math.round(num);
  }
  return undefined;
}

function cleanTitle(raw?: string | null) {
  if (!raw) return "";
  return raw
    .replace(/\s+/g, " ")
    .replace(/\s*[|:].*$/, "")
    .replace(/\s+Amazon\.in.*$/i, "")
    .replace(/\s+Flipkart\.com.*$/i, "")
    .trim()
    .slice(0, 140);
}

function isBlockedHtml(html: string, status: number) {
  if (status === 503 || status === 429 || status === 403) return true;
  return /Robot Check|enter the characters you see|api-services-support@amazon\.com|opfcaptcha|sorry, we just need to make sure you're not a robot/i.test(
    html,
  );
}

function isJunkImage(url?: string) {
  if (!url) return true;
  return /fls-.*\.amazon|\/uedata|pixel|sprite|transparent-pixel|grey-pixel|loading-|spinner/i.test(
    url,
  );
}

function extractAmazonAsin(url: string) {
  const m =
    url.match(/\/(?:dp|gp\/product|gp\/aw\/d|product)\/([A-Z0-9]{10})/i) ||
    url.match(/[?&]asin=([A-Z0-9]{10})/i);
  return m?.[1]?.toUpperCase();
}

function titleFromAmazonSlug(url: string) {
  try {
    const path = new URL(url).pathname;
    // /Some-Product-Name/dp/ASIN
    const m = path.match(/\/([^/]+)\/(?:dp|gp\/product)\//i);
    if (!m?.[1] || m[1].length < 4) return undefined;
    if (/^(dp|gp|product|aw)$/i.test(m[1])) return undefined;
    return cleanTitle(decodeURIComponent(m[1]).replace(/[-_+]+/g, " "));
  } catch {
    return undefined;
  }
}

function amazonCandidateUrls(productUrl: string) {
  const asin = extractAmazonAsin(productUrl);
  const urls = [productUrl];
  if (asin) {
    try {
      const host = new URL(productUrl).hostname.includes("amazon.com")
        ? "www.amazon.com"
        : "www.amazon.in";
      urls.push(`https://${host}/dp/${asin}`);
      urls.push(`https://${host}/gp/aw/d/${asin}`);
    } catch {
      /* ignore */
    }
  }
  return [...new Set(urls)];
}

async function fetchHtml(
  url: string,
  headers: Record<string, string>,
): Promise<{ ok: boolean; status: number; html: string; finalUrl: string }> {
  const res = await fetch(url, {
    headers,
    redirect: "follow",
    // @ts-expect-error Next.js fetch cache option
    next: { revalidate: 0 },
  });
  const html = await res.text();
  return {
    ok: res.ok && !isBlockedHtml(html, res.status),
    status: res.status,
    html,
    finalUrl: res.url || url,
  };
}

function parseProductHtml(html: string, baseUrl: string, storeName: string) {
  const $ = cheerio.load(html);

  const jsonLd = (() => {
    const out: { name?: string; image?: string; price?: string; description?: string } =
      {};
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const raw = $(el).text();
        const data = JSON.parse(raw);
        const nodes = Array.isArray(data) ? data : [data];
        for (const node of nodes) {
          const graph = node["@graph"];
          const list = Array.isArray(graph) ? graph : [node];
          for (const item of list) {
            if (!item || typeof item !== "object") continue;
            const type = String(item["@type"] || "");
            if (!/Product/i.test(type) && !item.name) continue;
            if (item.name && !out.name) out.name = String(item.name);
            if (item.description && !out.description)
              out.description = String(item.description);
            const img = item.image;
            if (!out.image) {
              if (typeof img === "string") out.image = img;
              else if (Array.isArray(img) && img[0])
                out.image =
                  typeof img[0] === "string" ? img[0] : img[0]?.url;
              else if (img?.url) out.image = String(img.url);
            }
            const offers = item.offers;
            const offer = Array.isArray(offers) ? offers[0] : offers;
            if (offer?.price && !out.price) out.price = String(offer.price);
          }
        }
      } catch {
        /* ignore bad json-ld */
      }
    });
    return out;
  })();

  const ogTitle =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $("#productTitle").text() ||
    $("#title").text() ||
    $("title").first().text();

  const ogDesc =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    jsonLd.description ||
    undefined;

  const dynamicImage = (() => {
    const raw =
      $("#landingImage").attr("data-old-hires") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#imgTagWrapperId img").attr("data-a-dynamic-image");
    if (!raw) return undefined;
    if (raw.startsWith("http")) return raw;
    try {
      const map = JSON.parse(raw) as Record<string, number[]>;
      return Object.keys(map).sort(
        (a, b) => (map[b]?.[0] ?? 0) - (map[a]?.[0] ?? 0),
      )[0];
    } catch {
      return undefined;
    }
  })();

  const ogImage =
    dynamicImage ||
    $("#landingImage").attr("src") ||
    $("#imgTagWrapperId img").attr("src") ||
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    jsonLd.image ||
    $("img[data-old-hires]").first().attr("data-old-hires");

  const price = parsePrice(
    jsonLd.price,
    $('meta[property="product:price:amount"]').attr("content"),
    $(".a-price .a-offscreen").first().text(),
    $("#priceblock_ourprice").text(),
    $("#priceblock_dealprice").text(),
    $(".priceToPay .a-offscreen").first().text(),
    $("#corePrice_feature_div .a-offscreen").first().text(),
    $('[class*="price"]').first().text(),
  );

  let title = cleanTitle(jsonLd.name || ogTitle);
  if (!title || /amazon\.in|amazon\.com|flipkart/i.test(title)) {
    title = cleanTitle(titleFromAmazonSlug(baseUrl) || title);
  }

  const imageUrl = absoluteUrl(baseUrl, ogImage);
  const safeImage = isJunkImage(imageUrl) ? undefined : imageUrl;

  return {
    title: title || `${storeName} gift`,
    description: ogDesc?.trim().slice(0, 220),
    imageUrl: safeImage,
    price,
    storeName,
    productUrl: baseUrl,
    partial: !title || title === `${storeName} gift` || !safeImage,
  } satisfies EnrichedProduct;
}

async function resolveFinalUrl(productUrl: string) {
  try {
    const res = await fetch(productUrl, {
      method: "GET",
      headers: BROWSER_HEADERS,
      redirect: "follow",
      // @ts-expect-error Next.js fetch cache option
      next: { revalidate: 0 },
    });
    return res.url || productUrl;
  } catch {
    return productUrl;
  }
}

export async function enrichProductUrl(
  productUrl: string,
): Promise<EnrichedProduct> {
  let resolved = productUrl.trim();
  // Expand Amazon short links so ASIN / slug parsing works
  if (/^(https?:\/\/)?(www\.)?amzn\.(in|to)\//i.test(resolved)) {
    resolved = await resolveFinalUrl(resolved);
  }

  const url = new URL(resolved);
  const storeName = detectStore(resolved);
  const isAmazon = storeName === "Amazon";

  const candidates = isAmazon
    ? amazonCandidateUrls(url.toString())
    : [url.toString()];

  let lastHtml = "";
  let lastUrl = url.toString();

  for (const candidate of candidates) {
    for (const headers of [BROWSER_HEADERS, MOBILE_HEADERS]) {
      try {
        const page = await fetchHtml(candidate, headers);
        lastHtml = page.html;
        lastUrl = page.finalUrl || candidate;
        if (!page.ok) continue;
        const parsed = parseProductHtml(page.html, lastUrl, storeName);
        if (
          parsed.title &&
          parsed.title !== `${storeName} gift` &&
          !/^amazon(\.in|\.com)?$/i.test(parsed.title)
        ) {
          return {
            ...parsed,
            productUrl: productUrl.trim(),
            partial: false,
          };
        }
        if (parsed.title && parsed.title !== `${storeName} gift`) {
          return { ...parsed, productUrl: productUrl.trim() };
        }
      } catch {
        /* try next */
      }
    }
  }

  // Last resort: slug / ASIN-based title when Amazon blocks the HTML scrape
  const slugTitle = isAmazon ? titleFromAmazonSlug(url.toString()) : undefined;
  if (lastHtml) {
    const parsed = parseProductHtml(lastHtml, lastUrl, storeName);
    if (slugTitle && (parsed.partial || parsed.title === `${storeName} gift`)) {
      return {
        ...parsed,
        title: slugTitle,
        productUrl: productUrl.trim(),
        partial: true,
        description:
          parsed.description ||
          "Amazon blocked full product details — title estimated from the link. You can edit it.",
      };
    }
    if (parsed.title !== `${storeName} gift`) {
      return { ...parsed, productUrl: productUrl.trim(), partial: true };
    }
  }

  return {
    title: slugTitle || `${storeName} gift`,
    storeName,
    productUrl: productUrl.trim(),
    partial: true,
    description:
      "We couldn't read every detail from this store page — you can edit the title and image after adding.",
  };
}
