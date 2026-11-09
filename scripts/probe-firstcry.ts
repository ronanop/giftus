import { enrichProductUrl } from "../src/lib/enrich";

async function main() {
  const url =
    "https://www.firstcry.com/ministitch/ministitch-denim-woven-jacket-with-patches-and-printed-t-shirt-sky/22982527/product-detail";
  const product = await enrichProductUrl(url);
  console.log(
    JSON.stringify(
      {
        title: product.title.slice(0, 80),
        price: product.price,
        store: product.storeName,
        image: Boolean(product.imageUrl),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
