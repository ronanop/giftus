import { enrichProductUrl } from "../src/lib/enrich";

async function main() {
  const urls = [
    "https://www.amazon.in/dp/B09V4FNFHN",
    "https://www.amazon.in/Mamaearth-Natural-Baby-Shampoo-Oatmeal/dp/B07P9X3K8R",
    "https://www.amazon.in/Sony-WH-1000XM5-Wireless-Cancelling-Headphones/dp/B09XS7JWHH",
  ];
  for (const u of urls) {
    const r = await enrichProductUrl(u);
    console.log(
      JSON.stringify({
        title: r.title.slice(0, 80),
        price: r.price,
        img: Boolean(r.imageUrl && !r.imageUrl.includes("uedata")),
        partial: r.partial,
      }),
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
