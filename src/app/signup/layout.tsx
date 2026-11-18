import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Gift Registry",
  description:
    "Sign up for Shubh Sagan and create a personalized gift registry for baby showers, weddings, and family celebrations in India. Add store gifts and accept UPI.",
  alternates: {
    canonical: "/signup",
  },
  openGraph: {
    title: "Create Your Gift Registry | Shubh Sagan",
    description:
      "Build a beautiful online gift registry with photos, store gifts, and UPI cash gifts.",
    url: "/signup",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
