import React, { useEffect, useRef, useState, useMemo } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import { loadAllPexelsMedia } from "../components/sections/pexels/PexelsMediaSection";
import Pagination from "../components/snippets/pagination/pagination";
import { MapPin, Search, Globe, Sparkles, Compass, ArrowRight } from "lucide-react";
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
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch locations from D1 database
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    async function fetchLocations() {
      try {
        const res = await fetch("/api/locations?limit=1000");
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.success && Array.isArray(data.locations)) {
            // Filter active locations
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

  // Compute available countries dynamically from dataset
  const countries = useMemo(() => {
    const set = new Set<string>();
    locations.forEach((loc) => {
      if (loc.country && loc.country.trim()) {
        set.add(loc.country.trim());
      }
    });
    return ["All", ...Array.from(set).sort()];
  }, [locations]);

  // Filter locations by search and country
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchesCountry =
        selectedCountry === "All" ||
        (loc.country && loc.country.toLowerCase() === selectedCountry.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCountry;

      const matchesSearch =
        loc.name.toLowerCase().includes(query) ||
        (loc.country && loc.country.toLowerCase().includes(query)) ||
        (loc.state_region && loc.state_region.toLowerCase().includes(query)) ||
        (loc.heading && loc.heading.toLowerCase().includes(query)) ||
        (loc.short_description && loc.short_description.toLowerCase().includes(query));

      return matchesCountry && matchesSearch;
    });
  }, [locations, selectedCountry, searchQuery]);

  const totalPages = Math.ceil(filteredLocations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLocations = filteredLocations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Trigger Pexels loader when page, filter, or data changes
  useEffect(() => {
    if (!loading && containerRef.current) {
      loadAllPexelsMedia(containerRef.current);
    }
  }, [loading, selectedCountry, currentPage, filteredLocations]);

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
        title="Explore Global Destinations & Curated Cities | Discovery Convoy"
        description="Discover luxury travel destinations across India and worldwide. Browse curated city guides, local attractions, 5-star hotels, and flight intelligence."
        keywords={[
          "destinations",
          "luxury travel cities",
          "city guides",
          "curated travel",
          "Discovery Convoy",
          "travel destinations",
        ]}
        url="https://discoveryconvoy.com/destinations"
      />
      <Header />
      <main ref={containerRef}>
        {/* Breadcrumb Header with Parallax Effect */}
        <div
          className="tp-breadcrumb-area tp-breadcrumb-ptb tp-breadcrumb-overly bg-position tp-breadcrumb-parallax"
          data-background="assets/img/breadcrumb/bg-9.jpg"
          data-pexels="scenic global travel destination mountain coastline 4k landscape"
          data-type="background"
          data-quality="large"
          style={{
            backgroundImage:
              'url("https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1920")',
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="tp-breadcrumb-wrap text-center">
                  <span
                    className="text-uppercase tracking-wider fw-bold text-white mb-2 d-inline-block px-3 py-1 rounded-pill"
                    style={{
                      fontSize: "12px",
                      letterSpacing: "2px",
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    World Atlas &amp; City Guides
                  </span>
                  <h2 className="tp-breadcrumb-title fs-112 text-center mb-0 text-white">
                    Explore Destinations
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Destination Filter & Grid Section */}
        <div className="tp-blog-area tp-tour-ptb tp-animate-tab pt-80 pb-120">
          <div className="container">
            {/* Search and Country Filter Row */}
            <div className="row mb-50">
              <div className="col-xl-12 text-center">
                <div className="tp-about-section-title p-relative pb-20">
                  <h2 className="tp-section-title fs-32 fw-600 mb-2">
                    Curated Destinations
                  </h2>
                  <p className="text-muted" style={{ maxWidth: "620px", margin: "0 auto", fontSize: "14px" }}>
                    Browse handpicked cities, serene coastal getaways, and royal palaces worldwide with instant flight and luxury hotel intelligence.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="mx-auto mb-30" style={{ maxWidth: "520px" }}>
                  <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white p-1 border">
                    <span className="input-group-text bg-transparent border-0 ps-3 text-muted">
                      <Search size={18} />
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 shadow-none ps-2"
                      placeholder="Search by city, country, or region..."
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

                {/* Country Filter Tabs */}
                {countries.length > 1 && (
                  <div className="tp-tour-tab">
                    <ul
                      role="tablist"
                      className="d-flex align-items-center justify-content-center flex-wrap gap-2 list-unstyled mb-0"
                    >
                      {countries.map((country) => (
                        <li key={country} className="nav-tab-item">
                          <button
                            type="button"
                            className={`btn btn-sm px-4 py-2 rounded-pill fw-600 border-0 ${
                              selectedCountry === country
                                ? "tp-btn text-white shadow-sm"
                                : "btn-light text-dark"
                            }`}
                            onClick={() => handleCountryChange(country)}
                            style={{ fontSize: "13px" }}
                          >
                            {country}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Destination Cards Grid */}
            <div className="row g-4">
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="col-xl-4 col-lg-6 col-md-6">
                      <div className="tp-blog-item tp-blog-3-item mb-30 h-100 d-flex flex-column justify-content-between">
                        <div>
                          <div className="tp-blog-thumb fix mb-30 p-relative" style={{ height: "240px" }}>
                            <div className="tp-skeleton-thumb position-absolute top-0 start-0 w-100 h-100 rounded-3"></div>
                          </div>
                          <div className="tp-blog-content">
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <div className="tp-skeleton" style={{ width: "80px", height: "18px" }}></div>
                              <div className="tp-skeleton" style={{ width: "100px", height: "14px" }}></div>
                            </div>
                            <div className="tp-skeleton mb-2" style={{ width: "90%", height: "22px" }}></div>
                            <div className="tp-skeleton mb-1" style={{ width: "100%", height: "14px" }}></div>
                            <div className="tp-skeleton" style={{ width: "70%", height: "14px" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : currentLocations.length > 0 ? (
                currentLocations.map((loc) => {
                  const locationBadge = loc.country || loc.location_type || "Explore";
                  const pexelsQuery =
                    loc.pexels_query || `${loc.name} ${loc.country || ""} travel scenery 4k`;
                  const fallbackImg =
                    loc.image_url ||
                    "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800";

                  return (
                    <div key={loc.id || loc.slug} className="col-xl-4 col-lg-6 col-md-6">
                      <div className="tp-blog-item tp-blog-3-item mb-30 h-100 d-flex flex-column justify-content-between bg-white border rounded-4 overflow-hidden shadow-sm transition-all">
                        <div>
                          {/* Image Thumbnail with Pexels and Badges */}
                          <div className="tp-blog-thumb fix mb-25 p-relative" style={{ minHeight: "240px", maxHeight: "240px" }}>
                            <span
                              className="tp-blog-thumb-badge"
                              style={{
                                backgroundColor: "rgba(18, 22, 33, 0.85)",
                                color: "#fff",
                                backdropFilter: "blur(4px)",
                                fontSize: "11px",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                padding: "4px 12px",
                                borderRadius: "20px",
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
                          <div className="tp-blog-content px-4 pb-2">
                            {/* Meta info */}
                            <div className="tp-custom-blog-meta-bar mb-2 d-flex align-items-center justify-content-between">
                              <div className="tp-custom-meta-info d-flex align-items-center gap-1 text-muted" style={{ fontSize: "12px" }}>
                                <MapPin size={13} className="text-primary" />
                                <span>
                                  {loc.state_region ? `${loc.state_region}, ` : ""}
                                  {loc.country || "Global"}
                                </span>
                              </div>
                              {loc.currency && (
                                <span className="badge bg-light text-secondary border" style={{ fontSize: "10.5px" }}>
                                  {loc.currency}
                                </span>
                              )}
                            </div>

                            {/* Title */}
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

                            {/* Short Description */}
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

                        {/* Footer action button */}
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
                    <Compass size={40} className="text-primary mb-3 mx-auto d-block" />
                    <h4 className="fw-700 text-dark mb-2">No Destinations Found</h4>
                    <p className="text-muted small mb-4">
                      {searchQuery
                        ? `No destinations matched "${searchQuery}". Try searching for another city or clear the search filter.`
                        : "There are no destinations listed in this category."}
                    </p>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCountry("All");
                          setCurrentPage(1);
                        }}
                        className="tp-btn text-white px-4 py-2 d-inline-flex align-items-center gap-2"
                        style={{ fontSize: "13px" }}
                      >
                        Reset Search Filters
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 400, behavior: "smooth" });
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
