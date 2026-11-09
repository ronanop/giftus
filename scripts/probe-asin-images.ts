async function main() {
  const asins = ["B09V4FNFHN", "B09XS7JWHH"];
  const patterns = (a: string) => [
    `https://m.media-amazon.com/images/P/${a}.01._SCLZZZZZZZ_SX500_.jpg`,
    `https://images-eu.ssl-images-amazon.com/images/P/${a}.01.LZZZZZZZ.jpg`,
    `https://m.media-amazon.com/images/P/${a}.01.MAIN._SCLZZZZZZZ_SX500_.jpg`,
    `https://images-na.ssl-images-amazon.com/images/P/${a}.01.LZZZZZZZ.jpg`,
  ];
  for (const a of asins) {
    for (const u of patterns(a)) {
      try {
        const r = await fetch(u, { method: "GET", redirect: "follow" });
        const ct = r.headers.get("content-type");
        const buf = Buffer.from(await r.arrayBuffer());
        console.log(r.status, ct, buf.length, u);
      } catch (e) {
        console.log("err", u, e instanceof Error ? e.message : e);
      }
    }
  }
}

main();
