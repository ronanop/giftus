export function buildUpiUri(input: {
  pa: string;
  pn?: string;
  am?: number;
  tn?: string;
}) {
  const params = new URLSearchParams();
  params.set("pa", input.pa.trim());
  params.set("pn", (input.pn || "Giftus").slice(0, 80));
  params.set("cu", "INR");
  if (input.am && input.am > 0) params.set("am", input.am.toFixed(2));
  if (input.tn) params.set("tn", input.tn.slice(0, 80));
  return `upi://pay?${params.toString()}`;
}

/** iOS-first: explicit app schemes + generic UPI fallback. */
export function buildUpiAppLinks(upiUri: string) {
  const query = upiUri.replace(/^upi:\/\/pay\?/, "");
  return [
    {
      id: "gpay",
      label: "Google Pay",
      href: `tez://upi/pay?${query}`,
    },
    {
      id: "phonepe",
      label: "PhonePe",
      href: `phonepe://pay?${query}`,
    },
    {
      id: "paytm",
      label: "Paytm",
      href: `paytmmp://pay?${query}`,
    },
    {
      id: "any",
      label: "Any UPI app",
      href: upiUri,
    },
  ] as const;
}

export function isLikelyIos() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}
