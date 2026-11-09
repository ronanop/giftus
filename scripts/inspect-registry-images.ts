import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { patchDnsForNeonLocal } = await import("../src/lib/dns-fix");
  patchDnsForNeonLocal();
  const { getRegistryBySlug } = await import("../src/lib/store");
  const { repairGiftImageUrl } = await import("../src/lib/product-image");

  const registry = await getRegistryBySlug("rishabhs-wedding");
  if (!registry) {
    console.log("registry not found");
    process.exit(1);
  }
  for (const item of registry.items) {
    console.log(
      JSON.stringify(
        {
          title: item.title.slice(0, 70),
          productUrl: item.productUrl,
          imageUrl: item.imageUrl?.slice(0, 100),
          repaired: repairGiftImageUrl({
            imageUrl: item.imageUrl,
            productUrl: item.productUrl,
          }),
        },
        null,
        2,
      ),
    );
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
