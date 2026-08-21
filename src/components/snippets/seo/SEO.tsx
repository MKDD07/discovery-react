import React, { useEffect } from "react";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "place" | "product";
  author?: string;
  publishedTime?: string;
  schema?: Record<string, any>;
}

const DEFAULT_TITLE = "Discovery Convoy | Luxury Stays, Flight Intelligence & Bespoke Escapes";
const DEFAULT_DESCRIPTION =
  "Experience luxury travel with Discovery Convoy. Curated 5-star palace hotels, private overwater villas, real-time Google flight intelligence, and 24/7 dedicated concierge assistance.";
const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1200";
const SITE_NAME = "Discovery Convoy";
const BASE_URL = "https://discoveryconvoy.com";

const setMetaTag = (attr: "name" | "property", key: string, value: string) => {
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
};

const setCanonical = (href: string) => {
  let link = document.querySelector(`link[rel="canonical"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const setJsonLd = (schema: Record<string, any>) => {
  let script = document.getElementById("structured-data-schema") as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = "structured-data-schema";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema);
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [
    "luxury stays",
    "5 star hotels",
    "luxury resorts",
    "private villas",
    "flight search",
    "bespoke travel",
    "luxury concierge",
    "Discovery Convoy",
  ],
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  author = "Discovery Convoy Concierge",
  publishedTime,
  schema,
}) => {
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : BASE_URL);
  const fullTitle = title
    ? title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`
    : DEFAULT_TITLE;

  useEffect(() => {
    // 1. Title
    document.title = fullTitle;

    // 2. Standard Meta
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywords.join(", "));
    setMetaTag("name", "robots", "index, follow, max-image-preview:large");
    setCanonical(currentUrl);

    // 3. OpenGraph
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", image);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:site_name", SITE_NAME);

    // 4. Twitter Card
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", image);

    // 5. Article specifics if applicable
    if (type === "article") {
      setMetaTag("name", "author", author);
      if (publishedTime) {
        setMetaTag("property", "article:published_time", publishedTime);
      }
    }

    // 6. JSON-LD Structured Data Schema
    const defaultSchema = schema || {
      "@context": "https://schema.org",
      "@type": type === "article" ? "Article" : "TravelAgency",
      name: fullTitle,
      description: description,
      url: currentUrl,
      image: image,
      brand: {
        "@type": "Brand",
        name: SITE_NAME,
      },
      telephone: "+919319300560",
      email: "support@discoveryconvoy.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "DLF Cyber City, Tower B",
        addressLocality: "Gurugram",
        addressRegion: "Haryana / NCR New Delhi",
        postalCode: "122002",
        addressCountry: "IN",
      },
    };

    setJsonLd(defaultSchema);
  }, [fullTitle, description, keywords, image, currentUrl, type, author, publishedTime, schema]);

  return null;
};

export default SEO;
