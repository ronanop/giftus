import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find a Gift Registry",
  description:
    "Search public gift registries on Shubh Sagan by name or city. Find baby shower, wedding, and celebration registries across India.",
  alternates: {
    canonical: "/search",
  },
  openGraph: {
    title: "Find a Gift Registry | Shubh Sagan",
    description:
      "Search baby shower, wedding, and celebration gift registries across India.",
    url: "/search",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
