import type { Metadata } from "next";
import { HomeLanding } from "@/components/HomeLanding";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  softwareAppJsonLd,
} from "@/lib/seo";
import "./home-landing.css";

export const metadata: Metadata = {
  title: "Gift Registry India for Baby Shower, Wedding & Celebrations",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | Online Gift Registry for Indian Celebrations`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [],
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} | Online Gift Registry for Indian Celebrations`,
    description: SITE_DESCRIPTION,
    images: [],
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={softwareAppJsonLd()} />
      <HomeLanding />
    </>
  );
}
