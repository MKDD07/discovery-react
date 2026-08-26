import React, { useEffect, useState } from "react";

interface LinkItem {
  label: string;
  url: string;
}

interface DirectorySection {
  title: string;
  links: LinkItem[];
}

interface D1LocationItem {
  id: number;
  name: string;
  slug: string;
  country?: string;
  state_region?: string;
  hotel_search_query?: string;
  is_active?: number;
}

export const SeoDirectorySection: React.FC = () => {
  const [d1Locations, setD1Locations] = useState<D1LocationItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/locations?limit=100")
      .then((res) => res.json())
      .then((data: any) => {
        if (isMounted && data?.success && Array.isArray(data.locations) && data.locations.length > 0) {
          setD1Locations(data.locations);
        }
      })
      .catch((err) => {
        console.warn("SeoDirectorySection: could not load dynamic locations from D1", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (url.startsWith("/")) {
      e.preventDefault();
      window.history.pushState({}, "", url);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Build dynamic SEO directory sections
  const dynamicSections: DirectorySection[] = [
    {
      title: "Popular Destinations & City Guides",
      links: d1Locations.length > 0
        ? d1Locations.map((loc) => ({
            label: `Explore ${loc.name}`,
            url: `/destination/${loc.slug}`,
          }))
        : [
            { label: "Explore Goa", url: "/destination/goa" },
            { label: "Explore Kashmir", url: "/destination/kashmir" },
            { label: "Explore Kerala", url: "/destination/kerala" },
            { label: "Explore Dubai", url: "/destination/dubai" },
            { label: "Explore Maldives", url: "/destination/maldives" },
            { label: "Explore Paris", url: "/destination/paris" },
            { label: "Explore Switzerland", url: "/destination/switzerland" },
            { label: "Explore Bali", url: "/destination/bali" },
            { label: "Explore Rajasthan", url: "/destination/rajasthan" },
            { label: "Explore Manali", url: "/destination/manali" },
            { label: "Explore Shimla", url: "/destination/shimla" },
            { label: "Explore Jaipur", url: "/destination/jaipur" },
          ],
    },
    {
      title: "Luxury Hotels & Resort Guides",
      links: d1Locations.length > 0
        ? d1Locations.map((loc) => ({
            label: `Hotels in ${loc.name}`,
            url: `/destination/${loc.slug}#hotel-offers-section`,
          }))
        : [
            { label: "Hotels in Goa", url: "/destination/goa" },
            { label: "Hotels in Kashmir", url: "/destination/kashmir" },
            { label: "Hotels in Dubai", url: "/destination/dubai" },
            { label: "Hotels in Maldives", url: "/destination/maldives" },
            { label: "Hotels in Paris", url: "/destination/paris" },
            { label: "Hotels in Switzerland", url: "/destination/switzerland" },
            { label: "Hotels in Jaipur", url: "/destination/jaipur" },
            { label: "Hotels in Udaipur", url: "/destination/udaipur" },
            { label: "Hotels in Ooty", url: "/destination/ooty" },
            { label: "Hotels in Manali", url: "/destination/manali" },
          ],
    },
    {
      title: "TripAdvisor Travel & Tour Intelligence",
      links: d1Locations.length > 0
        ? d1Locations.slice(0, 20).map((loc) => ({
            label: `${loc.name} Travel Guide & Attractions`,
            url: `/guide/${loc.slug}`,
          }))
        : [
            { label: "Paris Travel Guide & Attractions", url: "/guide/paris" },
            { label: "Tokyo Travel Guide & Attractions", url: "/guide/tokyo" },
            { label: "Dubai Travel Guide & Attractions", url: "/guide/dubai" },
            { label: "Goa Travel Guide & Attractions", url: "/guide/goa" },
            { label: "Maldives Travel Guide & Attractions", url: "/guide/maldives" },
            { label: "Switzerland Travel Guide & Attractions", url: "/guide/switzerland" },
            { label: "Rome Travel Guide & Attractions", url: "/guide/rome" },
          ],
    },
    {
      title: "Curated Travel Collections",
      links: [
        { label: "Luxury Palaces & Heritage Stays", url: "/collection/luxury-palaces-villas" },
        { label: "Honeymoon & Romantic Getaways", url: "/collection/honeymoon-getaways" },
        { label: "Mountain & Wilderness Retreats", url: "/collection/mountain-wilderness-retreats" },
        { label: "Beachfront & Private Islands", url: "/collection/beachfront-private-islands" },
        { label: "Cultural & Heritage Odysseys", url: "/collection/heritage-cultural-odysseys" },
        { label: "Wellness & Ayurveda Sanctuaries", url: "/collection/wellness-ayurveda-sanctuaries" },
        { label: "Safari & Wildlife Expeditions", url: "/collection/safari-wildlife-expeditions" },
        { label: "Luxury Travel Journal & Blog", url: "/blog" },
      ],
    },
    {
      title: "Discovery Convoy & Quick Support",
      links: [
        { label: "About Discovery Convoy", url: "/about" },
        { label: "24/7 Concierge Support", url: "/contact" },
        { label: "Frequently Asked Questions", url: "/faq" },
        { label: "Global Destinations Atlas", url: "/destinations" },
        { label: "Bespoke Luxury Escapes", url: "/luxury" },
        { label: "Member Login & Account", url: "/login" },
      ],
    },
  ];
  return (
    <section className="tp-seo-directory-area py-5 bg-white border-top">
      <div className="container">
        {/* Directory Link Categories */}
        <div className="tp-seo-directory-grid mb-4">
          {dynamicSections.map((sec, idx) => (
            <div key={idx} className="tp-seo-directory-col mb-4">
              <h4 className="tp-seo-directory-title">{sec.title}</h4>
              <div className="tp-seo-directory-links">
                {sec.links.map((link, lIdx) => (
                  <React.Fragment key={lIdx}>
                    <a
                      href={link.url}
                      onClick={(e) => handleLinkClick(e, link.url)}
                      className="tp-seo-link"
                    >
                      {link.label}
                    </a>
                    {lIdx < sec.links.length - 1 && <span className="tp-seo-sep">, </span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Curated Theme-Aligned Directory & Hotel Query Streams (Comma-based editorial flow) */}
        <div className="tp-seo-theme-stream mb-4 pt-2">
          <div className="mb-3">
            <span
              className="tp-ff-dancing d-inline-block text-primary"
              style={{
                fontFamily: "var(--tp-ff-dancing, 'Dancing Script', cursive)",
                fontSize: "24px",
                lineHeight: "1.2",
              }}
            >
              Curated Destination Atlas &amp; Luxury Stays
            </span>
          </div>

          {/* 1. Direct Destination Hotspots */}
          <div className="tp-seo-directory-col mb-3">
            <h4 className="tp-seo-directory-title">
              Featured Luxury Destinations:
            </h4>
            <div className="tp-seo-directory-links">
              {(d1Locations.length > 0 ? d1Locations : [
                { name: "Goa", slug: "goa" },
                { name: "Kashmir", slug: "kashmir" },
                { name: "Dubai", slug: "dubai" },
                { name: "Maldives", slug: "maldives" },
                { name: "Paris", slug: "paris" },
                { name: "Switzerland", slug: "switzerland" },
                { name: "Jaipur", slug: "jaipur" },
                { name: "Udaipur", slug: "udaipur" },
                { name: "Kerala", slug: "kerala" },
                { name: "Manali", slug: "manali" },
                { name: "Shimla", slug: "shimla" },
                { name: "Bali", slug: "bali" }
              ]).map((loc, idx, arr) => (
                <React.Fragment key={`dest-${loc.slug || idx}`}>
                  <a
                    href={`/destination/${loc.slug}`}
                    onClick={(e) => handleLinkClick(e, `/destination/${loc.slug}`)}
                    className="tp-seo-link"
                  >
                    Explore {loc.name}
                  </a>
                  {idx < arr.length - 1 && <span className="tp-seo-sep">, </span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 2. Destination-Based Luxury Hotel Search Queries */}
          <div className="tp-seo-directory-col mb-3">
            <h4 className="tp-seo-directory-title">
              Curated Hotel &amp; Resort Inquiries:
            </h4>
            <div className="tp-seo-directory-links">
              {(d1Locations.length > 0 ? d1Locations : [
                { name: "Goa", slug: "goa", hotel_search_query: "luxury beach resorts in Goa" },
                { name: "Kashmir", slug: "kashmir", hotel_search_query: "heritage houseboats & luxury stays Srinagar Kashmir" },
                { name: "Dubai", slug: "dubai", hotel_search_query: "5-star luxury hotels Dubai" },
                { name: "Maldives", slug: "maldives", hotel_search_query: "overwater luxury private villas Maldives" },
                { name: "Paris", slug: "paris", hotel_search_query: "palace hotels Paris" },
                { name: "Switzerland", slug: "switzerland", hotel_search_query: "luxury alpine chalets Switzerland" },
                { name: "Jaipur", slug: "jaipur", hotel_search_query: "heritage palace hotels Jaipur" },
                { name: "Udaipur", slug: "udaipur", hotel_search_query: "lake view luxury palaces Udaipur" }
              ]).map((loc, idx, arr) => (
                <React.Fragment key={`hotel-${loc.slug || idx}`}>
                  <a
                    href={`/destination/${loc.slug}#hotel-offers-section`}
                    onClick={(e) => handleLinkClick(e, `/destination/${loc.slug}#hotel-offers-section`)}
                    className="tp-seo-link"
                  >
                    {loc.hotel_search_query || `Hotels in ${loc.name}`}
                  </a>
                  {idx < arr.length - 1 && <span className="tp-seo-sep">, </span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 3. TripAdvisor Travel Guide Intelligence */}
          <div className="tp-seo-directory-col mb-3">
            <h4 className="tp-seo-directory-title">
              TripAdvisor Place &amp; Attraction Guides:
            </h4>
            <div className="tp-seo-directory-links">
              {(d1Locations.length > 0 ? d1Locations : [
                { name: "Paris", slug: "paris" },
                { name: "Tokyo", slug: "tokyo" },
                { name: "Dubai", slug: "dubai" },
                { name: "Goa", slug: "goa" },
                { name: "Maldives", slug: "maldives" },
                { name: "Switzerland", slug: "switzerland" },
                { name: "Rome", slug: "rome" },
                { name: "Jaipur", slug: "jaipur" }
              ]).map((loc, idx, arr) => (
                <React.Fragment key={`guide-${loc.slug || idx}`}>
                  <a
                    href={`/guide/${loc.slug}`}
                    onClick={(e) => handleLinkClick(e, `/guide/${loc.slug}`)}
                    className="tp-seo-link"
                  >
                    {loc.name} Travel Guide
                  </a>
                  {idx < arr.length - 1 && <span className="tp-seo-sep">, </span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Editorial Content Blocks */}
        <div className="tp-seo-content-box pt-4 border-top">
          <div className="mb-3">
            <h5 className="tp-seo-heading">Why Discovery Convoy?</h5>
            <p className="tp-seo-text">
              Established as India's premier travel brand, Discovery Convoy provides bespoke luxury stays, competitive airfares, exclusive discounts, and a seamless online booking experience. Explore 5-star palatial resorts, private island sanctuaries, and curated global expeditions designed to meet every discerning traveler's wishlist.
            </p>
          </div>

          <div className="mb-3">
            <h5 className="tp-seo-heading">Booking Luxury Stays & Flights with Discovery Convoy</h5>
            <p className="tp-seo-text">
              At Discovery Convoy, you can access real-time destination intelligence, 5-star hotel recommendations, TripAdvisor place guides, and seamless flight routes. With our 24/7 dedicated concierge assistance, every itinerary is tailored to perfection.
            </p>
          </div>

          <div>
            <h5 className="tp-seo-heading">Curated Global & Domestic Destinations</h5>
            <p className="tp-seo-text mb-0">
              From the serene backwaters of Kerala and regal heritage palaces of Rajasthan to the overwater villas of the Maldives and the romantic avenues of Paris, Discovery Convoy brings the world's most sought-after destinations to your fingertips.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeoDirectorySection;
