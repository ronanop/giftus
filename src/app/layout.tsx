import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Giftus — Personalized gift registries for India",
    template: "%s · Giftus",
  },
  description:
    "Create a beautiful, personal baby shower or wedding registry. Add gifts from any store, share one link, accept UPI — made for Indian celebrations.",
  metadataBase: new URL("https://giftus.in"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full antialiased giftus-shell">{children}</body>
    </html>
  );
}
