/** Amazon tracking / pixel URLs that look like images but never render a product photo. */
export function isUsableProductImage(url?: string | null): url is string {
  if (!url) return false;
  const raw = url.toLowerCase();
  // String-level reject before URL parse — Amazon tracker URLs often contain `$uedata`.
  if (
    raw.includes("fls-") ||
    raw.includes("/uedata") ||
    raw.includes("$uedata") ||
    raw.includes("unpixel")
  ) {
    return false;
  }
  // Catalog P/ URLs are often 1x1 blank GIFs for marketplace ASINs — never show them.
  if (raw.includes("/images/p/")) {
    return false;
  }
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const path = `${u.pathname}${u.search}`.toLowerCase();
    if (
      /pixel|sprite|transparent|grey-pixel|gray-pixel|spinner|loading-/.test(
        path,
      )
    ) {
      return false;
    }
    // Prefer real CDN product images
    if (
      host.includes("media-amazon") ||
      host.includes("ssl-images-amazon") ||
      host.includes("images-amazon") ||
      host.includes("imgur") ||
      host.includes("cloudinary") ||
      host.includes("unsplash") ||
      host.includes("neon.tech") ||
      host.includes("flipkart") ||
      host.includes("flixcart") ||
      /\.(jpe?g|png|webp|gif)(\?|$)/i.test(path)
    ) {
      return true;
    }
    // Allow http(s) images that aren't known junk
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeProductImageUrl(url?: string | null) {
  return isUsableProductImage(url) ? url : undefined;
}

function extractAmazonAsin(url?: string) {
  if (!url) return undefined;
  const m =
    url.match(/\/(?:dp|gp\/product|gp\/aw\/d|product)\/([A-Z0-9]{10})/i) ||
    url.match(/[?&]asin=([A-Z0-9]{10})/i);
  return m?.[1]?.toUpperCase();
}

/**
 * Sync repair only filters junk. Real Amazon `/images/I/` resolution is async
 * (see resolveGiftImageUrl) because catalog `/images/P/` URLs are often blank.
 */
export function repairGiftImageUrl(input: {
  imageUrl?: string | null;
  productUrl?: string | null;
}) {
  return sanitizeProductImageUrl(input.imageUrl);
}

export function amazonNeedsImageResolve(input: {
  imageUrl?: string | null;
  productUrl?: string | null;
}) {
  if (sanitizeProductImageUrl(input.imageUrl)) return false;
  return Boolean(
    input.productUrl &&
      /amazon\.|amzn\./i.test(input.productUrl) &&
      extractAmazonAsin(input.productUrl),
  );
}
