import { patchDnsForNeonLocal } from "../src/lib/dns-fix";
patchDnsForNeonLocal();

const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function main() {
  const home = await fetch(base);
  console.log("GET / =>", home.status);

  const registry = await fetch(`${base}/r/aanya-baby-shower`);
  console.log("GET /r/aanya-baby-shower =>", registry.status);

  const search = await fetch(`${base}/api/registries?q=aanya`);
  const searchJson = await search.json();
  console.log(
    "GET /api/registries?q=aanya =>",
    search.status,
    "count=",
    searchJson.registries?.length,
    "slug=",
    searchJson.registries?.[0]?.slug,
  );

  const email = `neon-tester-${Date.now()}@giftus.in`;
  const signup = await fetch(`${base}/api/auth/signup`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Neon Tester",
      email,
      password: "testpass123",
    }),
  });
  const signupJson = await signup.json();
  console.log("POST /api/auth/signup =>", signup.status, signupJson.user?.email);

  const cookie = signup.headers.getSetCookie?.()?.[0] || signup.headers.get("set-cookie") || "";

  const create = await fetch(`${base}/api/registries`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: cookie.split(";")[0],
    },
    body: JSON.stringify({
      title: "Neon Wired Registry",
      occasion: "baby_shower",
      location: "Mumbai",
      upiId: "neon@upi",
    }),
  });
  const createJson = await create.json();
  console.log(
    "POST /api/registries =>",
    create.status,
    createJson.registry?.slug || createJson.error,
  );

  // storage via upload API needs multipart + auth cookie
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
  const form = new FormData();
  form.append("file", new Blob([png], { type: "image/png" }), "dot.png");
  const upload = await fetch(`${base}/api/upload`, {
    method: "POST",
    headers: { cookie: cookie.split(";")[0] },
    body: form,
  });
  const uploadJson = await upload.json();
  console.log("POST /api/upload =>", upload.status, uploadJson.url ? "url-ok" : uploadJson.error);

  if (uploadJson.url) {
    const read = await fetch(uploadJson.url);
    console.log("GET uploaded object =>", read.status);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
