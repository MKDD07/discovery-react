import React, { useEffect, useRef, useState, useMemo } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import { loadAllPexelsMedia, fetchPexelsVideo, pickVideoUrl } from "../components/sections/pexels/PexelsMediaSection";
import Pagination from "../components/snippets/pagination/pagination";
import { MapPin, Search, Globe, Compass, ArrowRight, Video, Sparkles, Filter } from "lucide-react";
import SEO from "../components/snippets/seo/SEO";

export interface LocationItem {
  id: number;
  name: string;
  slug: string;
  country?: string;
  state_region?: string;
  location_type?: string;
  parent_location?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  heading?: string;
  short_description?: string;
  seo_title?: string;
  seo_description?: string;
  hotel_search_query?: string;
  currency?: string;
  timezone?: string;
  destination_content?: string;
  content_status?: string;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
  pexels_query?: string;
}

type ScopeFilter = "all" | "india" | "international";

const INDIA_AERIAL_QUERIES = [
  "india landscape drone aerial 4k",
  "kashmir himalayas aerial view drone",
  "taj mahal aerial view 4k",
  "kerala backwaters aerial drone",
  "rajasthan palace aerial view drone",
  "goa beaches coastline drone aerial",
];

const INTERNATIONAL_AERIAL_QUERIES = [
  "switzerland alps drone aerial 4k",
  "dubai skyline aerial drone 4k",
  "maldives overwater villa aerial 4k",
  "paris france aerial drone 4k",
  "bali tropical coastline aerial drone",
  "amalfi coast italy aerial drone 4k",
];

const GLOBAL_AERIAL_QUERIES = [
  "scenic world travel drone nature cinematic",
  "mountains ocean travel drone aerial 4k",
  "earth landscape drone aerial 4k",
];

const FALLBACK_POSTER =
  "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1920";
const FALLBACK_VIDEO =
  "https://player.vimeo.com/external/371837092.hd.mp4?s=d11c0f0d2c0b022ad0518ff7ab8d313d42c3c6f2&profile_id=175";

const ITEMS_PER_PAGE = 12;

interface DestinationsPageProps {
  onBackHome?: () => void;
  onSelectDestination?: (loc: { name: string; slug: string; query: string }) => void;
}

export const DestinationsPage: React.FC<DestinationsPageProps> = ({
  onBackHome,
  onSelectDestination,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Hero background video state
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>(FALLBACK_VIDEO);
  const [heroPosterUrl, setHeroPosterUrl] = useState<string>(FALLBACK_POSTER);
  const [currentVideoQuery, setCurrentVideoQuery] = useState<string>("");

  // Helper to check if a location is in India
  const isIndiaLocation = (loc: LocationItem) => {
    const c = (loc.country || "").trim().toLowerCase();
    const s = (loc.state_region || "").trim().toLowerCase();
    const p = (loc.parent_location || "").trim().toLowerCase();
    return (
      c === "india" ||
      c.includes("india") ||
      s.includes("india") ||
      p.includes("india") ||
      loc.currency === "INR" ||
      (loc.timezone || "").includes("Kolkata")
    );
  };

  // Fetch locations from D1
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    async function fetchLocations() {
      try {
        const res = await fetch("/api/locations?limit=1000");
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.success && Array.isArray(data.locations)) {
            const activeLocs: LocationItem[] = data.locations.filter(
              (l: LocationItem) => l.is_active !== 0
            );
            setLocations(activeLocs);
          }
        }
      } catch (err) {
        console.error("Failed to load locations from D1:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchLocations();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Update Hero Aerial Video dynamically when scope or filter changes
  useEffect(() => {
    let isMounted = true;

    let queriesPool = GLOBAL_AERIAL_QUERIES;
    if (scopeFilter === "india") {
      queriesPool = INDIA_AERIAL_QUERIES;
    } else if (scopeFilter === "international") {
      queriesPool = INTERNATIONAL_AERIAL_QUERIES;
    }

    // Pick random query from selected pool
    const selectedQuery = queriesPool[Math.floor(Math.random() * queriesPool.length)];
    setCurrentVideoQuery(selectedQuery);

    fetchPexelsVideo(selectedQuery, "landscape")
      .then((videos) => {
        if (!isMounted || !videos || videos.length === 0) return;
        // Pick random video from returned list
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        const bestUrl =
          pickVideoUrl(randomVideo, "hd") ||
          pickVideoUrl(randomVideo, "medium") ||
          pickVideoUrl(randomVideo, "full_hd");

        if (bestUrl) setHeroVideoUrl(bestUrl);
        if (randomVideo.image) setHeroPosterUrl(randomVideo.image);
      })
      .catch((err) => {
        console.warn("DestinationsPage: Pexels aerial video fetch error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [scopeFilter]);

  // Compute available countries based on selected scope (All / India / International)
  const countries = useMemo(() => {
    const set = new Set<string>();
    locations.forEach((loc) => {
      const isIndia = isIndiaLocation(loc);
      if (scopeFilter === "india" && !isIndia) return;
      if (scopeFilter === "international" && isIndia) return;

      if (loc.country && loc.country.trim()) {
        set.add(loc.country.trim());
      }
    });
    return ["All", ...Array.from(set).sort()];
  }, [locations, scopeFilter]);

  // Filter locations by Scope (India / International / All), Search, and Country
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const isIndia = isIndiaLocation(loc);

      // 1. Scope filter
      if (scopeFilter === "india" && !isIndia) return false;
      if (scopeFilter === "international" && isIndia) return false;

      // 2. Country pill filter
      if (
        selectedCountry !== "All" &&
        (!loc.country || loc.country.toLowerCase() !== selectedCountry.toLowerCase())
      ) {
        return false;
      }

      // 3. Search query filter
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      return (
        loc.name.toLowerCase().includes(query) ||
        (loc.country && loc.country.toLowerCase().includes(query)) ||
        (loc.state_region && loc.state_region.toLowerCase().includes(query)) ||
        (loc.heading && loc.heading.toLowerCase().includes(query)) ||
        (loc.short_description && loc.short_description.toLowerCase().includes(query)) ||
        (loc.seo_description && loc.seo_description.toLowerCase().includes(query)) ||
        (loc.hotel_search_query && loc.hotel_search_query.toLowerCase().includes(query))
      );
    });
  }, [locations, scopeFilter, selectedCountry, searchQuery]);

  const totalPages = Math.ceil(filteredLocations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLocations = filteredLocations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Trigger Pexels loader when page, filter, or data changes
  useEffect(() => {
    if (!loading && containerRef.current) {
      loadAllPexelsMedia(containerRef.current);
    }
  }, [loading, scopeFilter, selectedCountry, currentPage, filteredLocations]);

  const handleScopeChange = (scope: ScopeFilter) => {
    setScopeFilter(scope);
    setSelectedCountry("All");
    setCurrentPage(1);
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleNavigate = (loc: LocationItem) => {
    const slug = loc.slug || loc.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (onSelectDestination) {
      onSelectDestination({
        name: loc.name,
        slug,
        query: loc.pexels_query || `${loc.name} landscape travel scenery`,
      });
    } else {
      window.history.pushState({}, "", `/destination/${slug}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  return (
    <>
      <SEO
        title="Explore Global Destinations & India Curated Cities | Discovery Convoy"
        description="Discover luxury travel destinations across India and worldwide. Browse curated city guides, local attractions, 5-star hotels, and flight intelligence."
        keywords={[
          "destinations",
          "india travel destinations",
          "international travel destinations",
          "luxury travel cities",
          "city guides",
          "curated travel",
          "Discovery Convoy",
        ]}
        url="https://discoveryconvoy.com/destinations"
      />
      <Header />
      <main ref={containerRef}>
        {/* ── Dynamic Hero Banner with Aerial Drone Video ────────────────── */}
        <div
          className="tp-breadcrumb-area tp-breadcrumb-ptb p-relative fix"
          style={{
            position: "relative",
            minHeight: "480px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: "#0d131f",
          }}
        >
          {/* Background Video Player */}
          <video
            key={heroVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            poster={heroPosterUrl}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
              opacity: 0.85,
              transition: "opacity 0.7s ease",
            }}
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>

          {/* Dark luxury gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              background:
                "linear-gradient(180deg, rgba(13, 19, 31, 0.45) 0%, rgba(13, 19, 31, 0.75) 60%, rgba(13, 19, 31, 0.95) 100%)",
            }}
          ></div>

          {/* Content Overlay */}
          <div className="container p-relative" style={{ zIndex: 3 }}>
            <div className="row justify-content-center text-center">
              <div className="col-xl-9 col-lg-10">
                {/* Aerial Live View Badge */}
                <div className="mb-3 d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.16)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  <Video size={14} className="text-warning animate-pulse" />
                  <span>
                    {scopeFilter === "india"
                      ? "🇮🇳 Live Aerial View • India Destinations"
                      : scopeFilter === "international"
                      ? "🌍 Live Aerial View • Global Destinations"
                      : "✨ Live Aerial View • World Atlas"}
                  </span>
                </div>

                <h1
                  className="tp-breadcrumb-title fs-112 text-white mb-3 fw-bold"
                  style={{
                    fontSize: "clamp(32px, 5.5vw, 68px)",
                    letterSpacing: "-0.5px",
                    lineHeight: 1.15,
                  }}
                >
                  {scopeFilter === "india"
                    ? "Explore Incredible India"
                    : scopeFilter === "international"
                    ? "Global & International Escapes"
                    : "Curated World Destinations"}
                </h1>

                <p
                  className="text-white opacity-90 mx-auto mb-4"
                  style={{ maxWidth: "680px", fontSize: "16px", lineHeight: "1.6" }}
                >
                  {scopeFilter === "india"
                    ? "Discover royal palaces, snowcapped Himalayan peaks, golden coastlines, and spiritual heritage across India with real-time flight and 5-star hotel search."
                    : scopeFilter === "international"
                    ? "Browse world-famous metropolitan capitals, overwater private island resorts, European alpine chalets, and tropical paradises."
                    : "Seamlessly search and plan your next journey with curated guides, local insights, 5-star resort portfolios, and live airfare intelligence."}
                </p>

                {/* Hero Scope Toggle Buttons (All / India / International) */}
                <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 mb-4">
                  <button
                    type="button"
                    className={`btn px-4 py-2 rounded-pill fw-bold border-0 transition-all ${
                      scopeFilter === "all"
                        ? "bg-white text-dark shadow-lg scale-105"
                        : "btn-outline-light text-white"
                    }`}
                    style={{
                      fontSize: "14px",
                      backgroundColor: scopeFilter === "all" ? "#ffffff" : "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(8px)",
                    }}
                    onClick={() => handleScopeChange("all")}
                  >
                    <Globe size={15} className="me-2 d-inline" /> All Destinations ({locations.length})
                  </button>

                  <button
                    type="button"
                    className={`btn px-4 py-2 rounded-pill fw-bold border-0 transition-all ${
                      scopeFilter === "india"
                        ? "bg-warning text-dark shadow-lg scale-105"
                        : "btn-outline-light text-white"
                    }`}
                    style={{
                      fontSize: "14px",
                      backgroundColor: scopeFilter === "india" ? "#ffb703" : "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(8px)",
                    }}
                    onClick={() => handleScopeChange("india")}
                  >
                    🇮🇳 India (Domestic)
                  </button>

                  <button
                    type="button"
                    className={`btn px-4 py-2 rounded-pill fw-bold border-0 transition-all ${
                      scopeFilter === "international"
                        ? "bg-primary text-white shadow-lg scale-105"
                        : "btn-outline-light text-white"
                    }`}
                    style={{
                      fontSize: "14px",
                      backgroundColor: scopeFilter === "international" ? "#023e8a" : "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(8px)",
                    }}
                    onClick={() => handleScopeChange("international")}
                  >
                    ✈️ International (Global)
                  </button>
                </div>

                {/* Hero Search Box */}
                <div className="mx-auto" style={{ maxWidth: "560px" }}>
                  <div
                    className="input-group shadow-lg rounded-pill overflow-hidden p-1 border"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <span className="input-group-text bg-transparent border-0 ps-3 text-muted">
                      <Search size={19} className="text-primary" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 shadow-none ps-2"
                      placeholder={
                        scopeFilter === "india"
                          ? "Search Indian cities, states (e.g. Kashmir, Jaipur, Goa, Kerala)..."
                          : scopeFilter === "international"
                          ? "Search global cities, countries (e.g. Paris, Dubai, Maldives, Bali)..."
                          : "Search any destination, country, or region worldwide..."
                      }
                      value={searchQuery}
                      onChange={handleSearchChange}
                      style={{ fontSize: "14px" }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-muted pe-3 text-decoration-none"
                        onClick={() => {
                          setSearchQuery("");
                          setCurrentPage(1);
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Destination Cards Section ────────────────────────────── */}
        <div className="tp-blog-area tp-tour-ptb tp-animate-tab pt-70 pb-120 bg-light-subtle">
          <div className="container">
            {/* Country Sub-filter Pills (If more than 1 country) */}
            {countries.length > 2 && (
              <div className="row mb-40">
                <div className="col-12 text-center">
                  <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-2">
                    <span className="text-muted small fw-bold me-1 d-none d-md-inline">
                      <Filter size={13} className="me-1" /> Filter by Country:
                    </span>
                    {countries.map((country) => (
                      <button
                        key={country}
                        type="button"
                        className={`btn btn-sm px-3 py-1 rounded-pill fw-600 border transition-all ${
                          selectedCountry === country
                            ? "btn-dark text-white shadow-sm"
                            : "btn-white text-dark bg-white border-secondary-subtle"
                        }`}
                        onClick={() => handleCountryChange(country)}
                        style={{ fontSize: "12.5px" }}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results count & Active filters status */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-30 pb-15 border-bottom">
              <div>
                <span className="fw-bold text-dark fs-16">
                  {filteredLocations.length}{" "}
                  {filteredLocations.length === 1 ? "Destination" : "Destinations"} Available
                </span>
                {scopeFilter !== "all" && (
                  <span className="badge bg-primary-subtle text-primary ms-2 px-2 py-1 rounded-pill">
                    {scopeFilter === "india" ? "🇮🇳 India" : "🌍 International"}
                  </span>
                )}
                {selectedCountry !== "All" && (
                  <span className="badge bg-secondary-subtle text-dark ms-2 px-2 py-1 rounded-pill">
                    {selectedCountry}
                  </span>
                )}
                {searchQuery && (
                  <span className="badge bg-warning-subtle text-dark ms-2 px-2 py-1 rounded-pill">
                    Matching "{searchQuery}"
                  </span>
                )}
              </div>

              {(searchQuery || selectedCountry !== "All" || scopeFilter !== "all") && (
                <button
                  type="button"
                  className="btn btn-sm btn-link text-danger p-0 text-decoration-none small fw-semibold"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCountry("All");
                    setScopeFilter("all");
                    setCurrentPage(1);
                  }}
                >
                  Clear all filters ✕
                </button>
              )}
            </div>

            {/* Destination Cards Grid */}
            <div className="row g-4">
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="col-xl-4 col-lg-6 col-md-6">
                      <div className="tp-blog-item tp-blog-3-item mb-30 h-100 d-flex flex-column justify-content-between bg-white border rounded-4 p-3 shadow-sm">
                        <div className="tp-skeleton-thumb rounded-3 mb-3" style={{ height: "240px" }}></div>
                        <div className="tp-skeleton mb-2" style={{ width: "80px", height: "16px" }}></div>
                        <div className="tp-skeleton mb-2" style={{ width: "90%", height: "24px" }}></div>
                        <div className="tp-skeleton mb-1" style={{ width: "100%", height: "14px" }}></div>
                        <div className="tp-skeleton" style={{ width: "70%", height: "14px" }}></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : currentLocations.length > 0 ? (
                currentLocations.map((loc) => {
                  const isIndia = isIndiaLocation(loc);
                  const locationBadge = isIndia
                    ? "🇮🇳 India"
                    : loc.country
                    ? `✈️ ${loc.country}`
                    : "🌍 Global";

                  const pexelsQuery =
                    loc.pexels_query || `${loc.name} ${loc.country || ""} travel scenery 4k`;
                  const fallbackImg =
                    loc.image_url ||
                    "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800";

                  return (
                    <div key={loc.id || loc.slug} className="col-xl-4 col-lg-6 col-md-6">
                      <div className="tp-blog-item tp-blog-3-item mb-30 h-100 d-flex flex-column justify-content-between bg-white border rounded-4 overflow-hidden shadow-sm transition-all hover-shadow">
                        <div>
                          {/* Image Thumbnail with Pexels & Badges */}
                          <div
                            className="tp-blog-thumb fix p-relative"
                            style={{ minHeight: "240px", maxHeight: "240px" }}
                          >
                            <span
                              className="tp-blog-thumb-badge"
                              style={{
                                backgroundColor: isIndia
                                  ? "rgba(180, 83, 9, 0.9)"
                                  : "rgba(18, 22, 33, 0.88)",
                                color: "#fff",
                                backdropFilter: "blur(6px)",
                                fontSize: "11.5px",
                                fontWeight: "600",
                                padding: "4px 12px",
                                borderRadius: "20px",
                                zIndex: 2,
                              }}
                            >
                              {locationBadge}
                            </span>

                            <a
                              href={`/destination/${loc.slug}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleNavigate(loc);
                              }}
                              className="d-block h-100"
                            >
                              <img
                                className="w-100 h-100"
                                src={fallbackImg}
                                data-pexels={pexelsQuery}
                                data-type="image"
                                data-quality="large"
                                alt={loc.name}
                                loading="lazy"
                                decoding="async"
                                style={{
                                  height: "240px",
                                  objectFit: "cover",
                                }}
                              />
                            </a>
                          </div>

                          {/* Card Content Body */}
                          <div className="tp-blog-content px-4 pt-3 pb-2">
                            {/* Location Meta */}
                            <div className="tp-custom-blog-meta-bar mb-2 d-flex align-items-center justify-content-between">
                              <div
                                className="tp-custom-meta-info d-flex align-items-center gap-1 text-muted"
                                style={{ fontSize: "12px" }}
                              >
                                <MapPin size={13} className="text-primary" />
                                <span>
                                  {loc.state_region ? `${loc.state_region}, ` : ""}
                                  {loc.country || "Global"}
                                </span>
                              </div>
                              {loc.currency && (
                                <span
                                  className="badge bg-light text-dark border"
                                  style={{ fontSize: "10.5px" }}
                                >
                                  {loc.currency}
                                </span>
                              )}
                            </div>

                            {/* Destination Name */}
                            <h3 className="tp-blog-title fw-600 mb-2">
                              <a
                                href={`/destination/${loc.slug}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleNavigate(loc);
                                }}
                                className="text-dark hover-primary text-decoration-none"
                              >
                                {loc.name}
                              </a>
                            </h3>

                            {/* Description Excerpt */}
                            <p
                              className="text-muted small mt-2 mb-3"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: "1.5",
                              }}
                            >
                              {loc.short_description ||
                                loc.seo_description ||
                                loc.heading ||
                                `Discover top sights, 5-star accommodations, and luxury travel itineraries in ${loc.name}.`}
                            </p>
                          </div>
                        </div>

                        {/* Footer Action Button */}
                        <div className="px-4 pb-4 pt-0">
                          <a
                            href={`/destination/${loc.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigate(loc);
                            }}
                            className="btn btn-sm btn-outline-primary rounded-pill w-100 fw-600 d-flex align-items-center justify-content-center gap-2 py-2"
                            style={{ fontSize: "13px" }}
                          >
                            <span>Explore Guide &amp; Stays</span>
                            <ArrowRight size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center py-5">
                  <div
                    className="p-5 bg-white border rounded-4 shadow-sm mx-auto"
                    style={{ maxWidth: "550px" }}
                  >
                    <Compass size={44} className="text-primary mb-3 mx-auto d-block" />
                    <h4 className="fw-700 text-dark mb-2">No Destinations Found</h4>
                    <p className="text-muted small mb-4">
                      {searchQuery
                        ? `No destinations matched "${searchQuery}" in the selected filter.`
                        : "There are no destinations listed in this category."}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCountry("All");
                        setScopeFilter("all");
                        setCurrentPage(1);
                      }}
                      className="tp-btn text-white px-4 py-2 d-inline-flex align-items-center gap-2"
                      style={{ fontSize: "13px" }}
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Pagination Component */}
              {!loading && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 450, behavior: "smooth" });
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DestinationsPage;
