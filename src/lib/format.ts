export function formatINR(amount?: number | null) {
  if (amount == null || Number.isNaN(amount)) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function occasionLabel(occasion: string) {
  const map: Record<string, string> = {
    baby_shower: "Baby Shower",
    wedding: "Wedding",
    housewarming: "Housewarming",
    anniversary: "Anniversary",
    birthday: "Birthday",
  };
  return map[occasion] ?? occasion;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48);
}

export function detectStore(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("amazon") || host === "amzn.in" || host === "amzn.to" || host.endsWith(".amzn.in"))
      return "Amazon";
    if (host.includes("flipkart")) return "Flipkart";
    if (host.includes("myntra")) return "Myntra";
    if (host.includes("firstcry")) return "FirstCry";
    if (host.includes("nykaa")) return "Nykaa";
    if (host.includes("pepperfry")) return "Pepperfry";
    if (host.includes("tatacliq") || host.includes("tata")) return "Tata CLiQ";
    if (host.includes("fabindia")) return "Fabindia";
    return host.split(".")[0]?.replace(/^\w/, (c) => c.toUpperCase()) || "Store";
  } catch {
    return "Store";
  }
}
