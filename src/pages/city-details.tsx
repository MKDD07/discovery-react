import React, { useEffect, useState } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import HeroCollection from "../components/sections/hero-collection/hero-collection";
import HotelOffersSection from "../components/sections/offers/hotel-offers";
import CategoryCity from "../components/sections/category-city/category-city";
import OfferBannerArea from "../components/sections/offer-banner-area/offer-banner-area";
import CollectionFaq from "../components/sections/collection-faq/collection-faq";
import SEO from "../components/snippets/seo/SEO";
import { Globe } from "lucide-react";

interface LocationDbItem {
  id?: number;
  name: string;
  slug: string;
  country?: string;
  state_region?: string;
  location_type?: string;
  parent_location?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  pexels_query?: string;
  heading?: string;
  short_description?: string;
  seo_title?: string;
  seo_description?: string;
  hotel_search_query?: string;
  currency?: string;
  timezone?: string;
  destination_content?: string;
  content_status?: string;
}

interface CityDetailsPageProps {
  location?: string;
  slug?: string;
  query?: string;
  onBackHome?: () => void;
}

export const CityDetailsPage: React.FC<CityDetailsPageProps> = ({
  location = "Swiss Alps",
  slug,
  query,
  onBackHome,
}) => {
  const [dbLocation, setDbLocation] = useState<LocationDbItem | null>(null);
  const [loadingDb, setLoadingDb] = useState(true);

  const effectiveSlug = (
    slug ||
    location.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  ).toLowerCase();

  useEffect(() => {
    let isMounted = true;
    const fetchLocationData = async () => {
      setLoadingDb(true);
      try {
        const cleanSlug = effectiveSlug.replace(/'/g, "''");
        const cleanName = location.replace(/'/g, "''");

        const querySql = `SELECT * FROM locations WHERE slug = '${cleanSlug}' OR lower(name) = lower('${cleanName}') OR lower(slug) = lower('${cleanName.replace(/\s+/g, "-")}') LIMIT 1;`;

        const res = await fetch("/api/sqlite-console", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: querySql }),
        });

        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.results) && data.results.length > 0) {
          setDbLocation(data.results[0]);
        }
      } catch (err) {
        console.warn("Could not fetch location data from D1:", err);
      } finally {
        if (isMounted) setLoadingDb(false);
      }
    };

    fetchLocationData();
    return () => {
      isMounted = false;
    };
  }, [effectiveSlug, location]);

  const destinationName = dbLocation?.name || location;
  const pexelsQuery =
    dbLocation?.pexels_query || query || `${destinationName} landscape travel scenery`;
  const heading =
    dbLocation?.heading || `Discover the Extraordinary Wonders of ${destinationName}`;
  const shortDescription =
    dbLocation?.short_description ||
    `Experience world-class luxury stays, majestic landscapes, authentic culture, and curated travel experiences in ${destinationName}.`;
  const seoTitle =
    dbLocation?.seo_title ||
    `${destinationName} Travel Guide & Luxury Packages | Discovery Convoy`;
  const seoDesc =
    dbLocation?.seo_description ||
    `Plan your luxury escape to ${destinationName}. Handpicked 5-star hotels, bespoke itineraries, flight routes, and insider travel tips with Discovery Convoy.`;

  // Helper to parse markdown content into structured blocks
  const parseMarkdownSections = (markdown?: string) => {
    if (!markdown) return [];
    const rawSections = markdown.split(/(?=^###?\s+)/m);
    return rawSections
      .map((sec) => {
        const lines = sec.trim().split("\n");
        const firstLine = lines[0] || "";
        const title = firstLine.replace(/^###?\s+/, "").trim();
        const body = lines.slice(1).join("\n").trim();
        return { title, body };
      })
      .filter((s) => s.title.length > 0 || s.body.length > 0);
  };

  const parsedSections = parseMarkdownSections(dbLocation?.destination_content);

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={[
          destinationName,
          dbLocation?.country || "Travel",
          `${destinationName} luxury stays`,
          `${destinationName} guide`,
          "Discovery Convoy",
        ]}
        url={`https://discoveryconvoy.com/destination/${effectiveSlug}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          name: destinationName,
          description: shortDescription,
          url: `https://discoveryconvoy.com/destination/${effectiveSlug}`,
          ...(dbLocation?.latitude && dbLocation?.longitude
            ? {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: dbLocation.latitude,
                  longitude: dbLocation.longitude,
                },
              }
            : {}),
        }}
      />

      <Header />

      <main>
        {/* Navigation Breadcrumb back link */}
        <div className="bg-light py-2 border-bottom">
          <div className="container container-1350">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2" style={{ fontSize: "13px" }}>
                <a
                  href="/"
                  onClick={(e) => {
                    if (onBackHome) {
                      e.preventDefault();
                      onBackHome();
                    }
                  }}
                  className="text-muted text-decoration-none hover-primary"
                >
                  <i className="fa-solid fa-house mr-5"></i> Home
                </a>
                <span className="text-muted">/</span>
                <span className="text-muted">Destinations</span>
                {dbLocation?.country && (
                  <>
                    <span className="text-muted">/</span>
                    <span className="text-muted">{dbLocation.country}</span>
                  </>
                )}
                <span className="text-muted">/</span>
                <span className="fw-600 text-dark">{destinationName}</span>
              </div>

              {dbLocation?.country && (
                <div className="d-none d-md-flex align-items-center gap-2">
                  <span className="badge bg-white text-dark border px-3 py-1 rounded-pill small font-monospace">
                    <Globe size={12} className="text-primary me-1" />
                    {dbLocation.country}
                    {dbLocation.state_region ? ` • ${dbLocation.state_region}` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 1. Hero Collection Banner (Image / Video Background with live Pexels) */}
        <HeroCollection cityName={destinationName} query={pexelsQuery} />

        {/* 3. Hotel Offers Section */}
        <div id="hotel-offers-section" className="pt-20">
          <HotelOffersSection />
        </div>

        {/* 4. Category City Section with SerpApi live packages */}
        <CategoryCity location={destinationName} />

        {/* 5. Offer Banner Area with Pexels */}
        <OfferBannerArea location={destinationName} query={pexelsQuery} />
        {/* ── 2. D1 Database Deep Dive & Destination Insights Section (Paragraph-Based Editorial Layout, No Cards) ── */}
        <section className="tp-about-area pt-80 pb-60 bg-white">
          <div className="container container-1350">
            {/* Header with requested theme font & subtitle style */}
            <div className="tp-about-section-title p-relative pb-10">
              <span className="tp-section-5-subtitle fw-700 d-flex align-items-center mb-25">
                <i className="fa-solid fa-fire mr-10" style={{ color: "var(--tp-theme-1)" }}></i>
                Curated Destination &amp; Travel Guide
              </span>
              <h2 className="tp-section-title fw-600 mb-20">
                {heading}
              </h2>
            </div>

            {/* Quick Inline Meta Bar (No Cards - Pure Minimalist Typography) */}
            <div
              className="d-flex align-items-center flex-wrap gap-4 pb-20 mb-30 border-bottom text-muted"
              style={{ fontSize: "14.5px" }}
            >
              {dbLocation?.country && (
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-globe" style={{ color: "var(--tp-theme-1)" }} />
                  <span>
                    <strong className="text-dark">Country:</strong> {dbLocation.country}
                    {dbLocation.state_region ? ` (${dbLocation.state_region})` : ""}
                  </span>
                </div>
              )}
              {dbLocation?.latitude && dbLocation?.longitude && (
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-location-dot" style={{ color: "var(--tp-theme-1)" }} />
                  <span>
                    <strong className="text-dark">Coordinates:</strong>{" "}
                    {Number(dbLocation.latitude).toFixed(2)}°N, {Number(dbLocation.longitude).toFixed(2)}°E
                  </span>
                </div>
              )}
              {dbLocation?.currency && (
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-coins" style={{ color: "var(--tp-theme-1)" }} />
                  <span>
                    <strong className="text-dark">Currency:</strong> {dbLocation.currency}
                  </span>
                </div>
              )}
              {dbLocation?.timezone && (
                <div className="d-flex align-items-center gap-2">
                  <i className="fa-solid fa-clock" style={{ color: "var(--tp-theme-1)" }} />
                  <span>
                    <strong className="text-dark">Timezone:</strong> {dbLocation.timezone}
                  </span>
                </div>
              )}
              <div className="d-flex align-items-center gap-2 ms-auto">
                <i className="fa-solid fa-circle-check text-success" />
                <span className="text-success fw-600">Verified Discovery Guide</span>
              </div>
            </div>

            {/* Lead Short Description (Magazine Editorial Paragraph) */}
            <div className="mb-40">
              <p
                style={{
                  fontSize: "1.18rem",
                  lineHeight: "1.9",
                  color: "#2c3e50",
                  fontWeight: 400,
                  maxWidth: "1100px",
                }}
              >
                {shortDescription}
              </p>
            </div>

            {/* Paragraph-based Structured Sections (Pure Editorial Flow, No Cards) */}
            {parsedSections.length > 0 && (
              <div className="row g-5">
                {parsedSections.map((sec, idx) => (
                  <div key={idx} className={parsedSections.length === 1 ? "col-12" : "col-lg-6"}>
                    <div className="mb-35">
                      {sec.title && (
                        <h4
                          className="fw-700 text-dark mb-20 d-flex align-items-center"
                          style={{
                            fontSize: "1.35rem",
                            letterSpacing: "-0.01em",
                            borderBottom: "1px solid #f0f0f0",
                            paddingBottom: "10px",
                          }}
                        >
                          <i
                            className="fa-solid fa-mountain-sun mr-10"
                            style={{ color: "var(--tp-theme-1)", fontSize: "16px" }}
                          />
                          {sec.title}
                        </h4>
                      )}

                      {/* Render paragraphs and bullet points directly in editorial flow */}
                      <div style={{ lineHeight: "1.95", fontSize: "16px" }}>
                        {sec.body.split("\n").map((line, lIdx) => {
                          const trimmed = line.trim();
                          if (!trimmed) return null;
                          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                            const bulletText = trimmed.replace(/^[-*]\s+/, "");
                            const isBoldPrefix = bulletText.includes("**");
                            if (isBoldPrefix) {
                              const parts = bulletText.split("**");
                              return (
                                <p
                                  key={lIdx}
                                  className="d-flex align-items-start mb-12 text-secondary"
                                  style={{ lineHeight: "1.8" }}
                                >
                                  <i
                                    className="fa-solid fa-circle-check mt-1 mr-10 flex-shrink-0"
                                    style={{ color: "var(--tp-theme-1)", fontSize: "14px" }}
                                  />
                                  <span>
                                    <strong className="text-dark">{parts[1]}</strong>
                                    {parts.slice(2).join("")}
                                  </span>
                                </p>
                              );
                            }
                            return (
                              <p
                                key={lIdx}
                                className="d-flex align-items-start mb-12 text-secondary"
                                style={{ lineHeight: "1.8" }}
                              >
                                <i
                                  className="fa-solid fa-circle-check mt-1 mr-10 flex-shrink-0"
                                  style={{ color: "var(--tp-theme-1)", fontSize: "14px" }}
                                />
                                <span>{bulletText}</span>
                              </p>
                            );
                          }
                          return (
                            <p
                              key={lIdx}
                              className="mb-15"
                              style={{ color: "#4a5568", lineHeight: "1.9" }}
                            >
                              {trimmed}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        {/* 6. Collection FAQ Section */}
        <CollectionFaq location={destinationName} />
      </main>

      <Footer />
    </>
  );
};

export default CityDetailsPage;

