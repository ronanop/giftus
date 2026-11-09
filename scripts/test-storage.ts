import { config } from "dotenv";
config({ path: ".env.local" });

import { patchDnsForNeonLocal } from "../src/lib/dns-fix";
patchDnsForNeonLocal();

import { uploadPrivateBytes, uploadPublicImage, publicObjectUrl } from "../src/lib/storage";

async function main() {
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );

  const pub = await uploadPublicImage({
    bytes: png,
    contentType: "image/png",
    folder: "healthchecks",
    extension: "png",
  });
  console.log("Public upload OK:", pub.url);

  const head = await fetch(pub.url);
  console.log("Public read status:", head.status);

  const priv = await uploadPrivateBytes({
    bytes: png,
    contentType: "image/png",
    key: `healthchecks/private-${Date.now()}.png`,
  });
  console.log("Private upload OK (presigned):", String(priv.url).slice(0, 80) + "…");

  const privHead = await fetch(priv.url);
  console.log("Private signed read status:", privHead.status);

  // sanity: public URL helper
  console.log("Public URL helper sample:", publicObjectUrl("healthchecks/example.png"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
