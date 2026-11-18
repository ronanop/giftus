export const SITE_URL = "https://shubhsagan.com";
export const SITE_NAME = "Shubh Sagan";

export const SITE_TAGLINE =
  "Personalized gift registries for Indian celebrations";

export const SITE_DESCRIPTION =
  "Create a beautiful gift registry for baby showers, weddings, and family celebrations in India. Add gifts from Amazon, Flipkart, FirstCry, and Myntra, share one link, and receive UPI cash gifts.";

/** Primary + related phrases for meta keywords and content targeting. */
export const SEO_KEYWORDS = [
  "gift registry India",
  "online gift registry",
  "baby shower gift registry",
  "baby arrival registry",
  "wedding gift registry India",
  "wedding registry online",
  "housewarming gift registry",
  "UPI gift registry",
  "Amazon gift registry India",
  "FirstCry baby registry",
  "Flipkart gift wishlist",
  "personalized gift registry",
  "celebration gift list",
  "gift registry website India",
  "guests buy from gift list",
  "Shubh Sagan",
  "shubhsagan",
] as const;

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return new URL(path, SITE_URL).toString();
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    sameAs: [SITE_URL],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };
}

export function registryJsonLd(input: {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  location?: string;
  occasion?: string;
  updatedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url: absoluteUrl(`/r/${input.slug}`),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    primaryImageOfPage: input.imageUrl
      ? absoluteUrl(input.imageUrl)
      : undefined,
    about: {
      "@type": "Event",
      name: input.title,
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      location: input.location
        ? {
            "@type": "Place",
            name: input.location,
            address: {
              "@type": "PostalAddress",
              addressLocality: input.location,
              addressCountry: "IN",
            },
          }
        : {
            "@type": "VirtualLocation",
            url: absoluteUrl(`/r/${input.slug}`),
          },
      description: input.description,
      organizer: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    dateModified: input.updatedAt,
    keywords: [
      input.occasion,
      "gift registry",
      "gift registry India",
      SITE_NAME,
    ]
      .filter(Boolean)
      .join(", "),
  };
}
