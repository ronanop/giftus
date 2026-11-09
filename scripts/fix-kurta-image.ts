async function scrapeAmazon(productUrl: string) {
  const res = await fetch(productUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Accept-Language": "en-IN,en;q=0.9",
    },
    redirect: "follow",
    cache: "no-store",
  });
  const html = await res.text();
  const images: string[] = [];
  for (const re of [
    /"hiRes"\s*:\s*"(https:\\\/\\\/m\.media-amazon\.com\\\/images\\\/I\\\/[^"]+)"/g,
    /"large"\s*:\s*"(https:\\\/\\\/m\.media-amazon\.com\\\/images\\\/I\\\/[^"]+)"/g,
    /"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g,
    /"large"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g,
    /data-old-hires="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/g,
    /https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+\-_%,.]+\._AC_[^"'\\\s]+/g,
  ]) {
    for (const m of html.matchAll(re)) {
      const raw = (m[1] || m[0]).replace(/\\u002F/g, "/").replace(/\\\//g, "/");
      if (/\.(jpg|jpeg|png|webp)/i.test(raw) && !raw.includes("._RC")) {
        images.push(raw);
      }
    }
  }
  const unique = [...new Set(images)];
  console.log("status", res.status, "images", unique.length);
  console.log(unique.slice(0, 10));
  for (const u of unique.slice(0, 3)) {
    const r = await fetch(u, { redirect: "follow", cache: "no-store" });
    const buf = Buffer.from(await r.arrayBuffer());
    console.log(r.status, r.headers.get("content-type"), buf.length, u.slice(0, 100));
  }
}

scrapeAmazon(
  "https://www.amazon.in/Voniry-Regular-Sleeve-Cotton-Golden/dp/B0CJC1TQFF",
).catch(console.error);
