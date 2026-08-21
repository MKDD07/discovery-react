import React, { useState, useEffect } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import {
  Crown,
  Sparkles,
  Star,
  MapPin,
  ChevronRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Heart,
} from "lucide-react";
import { searchHotels, resizeImage } from "../services/serpApi";
import Button from "../components/snippets/button";
import SEO from "../components/snippets/seo/SEO";

interface CollectionPageProps {
  slug?: string;
  onBackLuxe?: () => void;
  onSelectTour?: (tour: {
    name: string;
    location: string;
    price?: string;
    originalPrice?: number;
    initialHotel?: any;
  }) => void;
}

interface ThemeMeta {
  title: string;
  subtitle: string;
  badge: string;
  heroImage: string;
  serpQuery: string;
  highlights: string[];
}

const THEMES_DICTIONARY: Record<string, ThemeMeta> = {
  "contemporary-heavens": {
    title: "Contemporary Heavens",
    subtitle: "Modern architectural masterworks, private infinity pools & sleek minimalism",
    badge: "Architectural Marvels",
    heroImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85",
    serpQuery: "5 star modern luxury villa resort infinity pool private pool India",
    highlights: ["Private Infinity Pools", "Modern Butler Service", "Panoramic Skyline Decks"],
  },
  "hilly-hideaways": {
    title: "Hilly Hideaways",
    subtitle: "Misty mountain estates, pine-scented luxury chalets & serene alpine sanctuaries",
    badge: "High Altitude Luxury",
    heroImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85",
    serpQuery: "5 star luxury mountain resort hill station estate Shimla Manali Munnar Himalayas India",
    highlights: ["Fireplace Suites", "Alpine Valley Views", "Organic Mountain Dining"],
  },
  "nature-getaways": {
    title: "Nature Getaways",
    subtitle: "Untouched forest lodges, bespoke safari sanctuaries & wilderness indulgence",
    badge: "Wilderness Sanctuaries",
    heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85",
    serpQuery: "5 star luxury wildlife safari resort forest jungle lodge Ranthambore Kabini Corbett India",
    highlights: ["Private Jungle Safaris", "Luxury Treehouses", "Riverfront Decks"],
  },
  "beachside-escapes": {
    title: "Beachside Escapes",
    subtitle: "Private beachfront villas, turquoise ocean horizons & sun-drenched coastal elegance",
    badge: "Coastal Splendor",
    heroImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=85",
    serpQuery: "5 star luxury beach resort oceanfront villas Goa Kerala Andaman tropical India",
    highlights: ["Private Beach Access", "Sunset Yacht Charters", "Seaside Candlelight Dining"],
  },
  "vintage-stays": {
    title: "Vintage & Royal Palaces",
    subtitle: "Centuries-old royal forts, gilded heritage suites & authentic regal indulgence",
    badge: "Regal Heritage",
    heroImage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=85",
    serpQuery: "5 star royal palace heritage luxury forts hotel Udaipur Jaipur Jodhpur Rajasthan India",
    highlights: ["Royal Butler Heritage", "Vintage Car Transfers", "Palace Courtyard Banquets"],
  },
  "wellness-wonderlands": {
    title: "Wellness Wonderlands",
    subtitle: "Holistic ayurveda spas, rejuvenating mountain retreats & soul-nourishing wellness",
    badge: "Holistic Rejuvenation",
    heroImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85",
    serpQuery: "5 star luxury ayurveda wellness spa resort retreat Ananda Vana Himalayas India",
    highlights: ["Bespoke Ayurvedic Cures", "Private Yoga Pavilions", "Thermal Hydrotherapy"],
  },
};

const DEFAULT_THEME: ThemeMeta = {
  title: "Luxe Curated Collection",
  subtitle: "Handpicked ultra-premium stays packed with signature butler services & private villas",
  badge: "Discovery Signature Selection",
  heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85",
  serpQuery: "5 star luxury palace resort hotels India",
  highlights: ["Dedicated Concierge", "100% Vetted Stays", "Signature Amenities"],
};

export default function CollectionPage({
  slug = "contemporary-heavens",
  onBackLuxe,
  onSelectTour,
}: CollectionPageProps) {
  const currentSlug = slug.toLowerCase().replace(/^\/collection\/?/, "").replace(/^\//, "") || "contemporary-heavens";
  const theme = THEMES_DICTIONARY[currentSlug] || DEFAULT_THEME;

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"rating" | "price_low" | "price_high">("rating");
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    searchHotels({ q: theme.serpQuery, slot: "1" })
      .then((hotels) => {
        if (!isMounted) return;
        if (hotels && hotels.length > 0) {
          const formatted = hotels.map((h: any, idx: number) => {
            const rawRate = h.rate_per_night?.extracted_lowest || h.rate_per_night?.lowest;
            const numericPrice =
              typeof rawRate === "number"
                ? rawRate
                : parseInt(String(rawRate || "18500").replace(/[^0-9]/g, "")) ||
                  18500 + idx * 2500;
            return {
              id: h.hotel_id || `luxe-col-${idx}`,
              name: h.name || "Signature Ultra-Luxe Property",
              city: h.neighborhood || h.city || "Premier Destination",
              rating: h.overall_rating ? Number(h.overall_rating).toFixed(1) : "4.9",
              reviews: h.reviews ? `${h.reviews}` : "450+",
              image:
                h.images?.[0]?.original_image ||
                h.images?.[0]?.thumbnail ||
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
              price: `₹${numericPrice.toLocaleString("en-IN")}`,
              numericPrice,
              tag:
                idx % 3 === 0
                  ? "Private Pool Villa"
                  : idx % 2 === 0
                  ? "Signature Suite"
                  : "Butler Included",
              amenities: h.amenities?.slice(0, 3) || [
                "Private Pool",
                "Butler Service",
                "Free Breakfast",
              ],
              reviewQuote:
                h.description ||
                "Unrivaled luxury hospitality with immaculate architecture and breathtaking panoramic views.",
              rawHotel: h,
            };
          });
          setProperties(formatted);
        } else {
          // Curated Fallbacks
          setProperties([
            {
              id: "fallback-1",
              name: "The Oberoi Amarvilas",
              city: "Agra, India",
              rating: "4.9",
              reviews: "1.4k",
              image:
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
              price: "₹38,500",
              numericPrice: 38500,
              tag: "Taj Mahal View",
              amenities: ["Private Balcony", "Royal Butler", "Spa Pavilion"],
              reviewQuote:
                "Every room offers uninterrupted royal views with legendary 24/7 hospitality.",
            },
            {
              id: "fallback-2",
              name: "Taj Lake Palace",
              city: "Udaipur, India",
              rating: "5.0",
              reviews: "2.1k",
              image:
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
              price: "₹45,000",
              numericPrice: 45000,
              tag: "Island Palace",
              amenities: ["Private Boat Arrival", "Royal Butler", "Floating Spa"],
              reviewQuote:
                "A dream floating on lake waters with majestic marble courtyards.",
            },
            {
              id: "fallback-3",
              name: "Wildflower Hall, An Oberoi Resort",
              city: "Shimla, India",
              rating: "4.9",
              reviews: "980",
              image:
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
              price: "₹32,000",
              numericPrice: 32000,
              tag: "Heated Outdoor Pool",
              amenities: ["Cedar Forest Trails", "Heated Jacuzzi", "Gourmet Dining"],
              reviewQuote:
                "Pure Himalayan luxury immersed in centuries-old cedar forests.",
            },
          ]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Failed to load collection properties", err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [theme.serpQuery]);

  const handleBook = (prop: any) => {
    if (onSelectTour) {
      onSelectTour({
        name: prop.name,
        location: prop.city,
        price: prop.price,
        originalPrice: prop.numericPrice ? Math.round(prop.numericPrice * 1.2) : undefined,
        initialHotel: {
          name: prop.name,
          thumbnail: prop.image,
          images: [prop.image],
          price: prop.price,
        },
      });
    } else {
      const tourUrl = `/tour/${encodeURIComponent(prop.name)}?loc=${encodeURIComponent(prop.city)}&price=${encodeURIComponent(prop.price)}`;
      window.history.pushState({}, "", tourUrl);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  const handleNavigateLuxe = () => {
    if (onBackLuxe) {
      onBackLuxe();
    } else {
      window.history.pushState({}, "", "/luxury");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  const sortedProperties = [...properties].sort((a, b) => {
    if (sortBy === "price_low") return a.numericPrice - b.numericPrice;
    if (sortBy === "price_high") return b.numericPrice - a.numericPrice;
    return Number(b.rating) - Number(a.rating);
  });

  return (
    <div className="discovery-collection-page bg-light-luxury min-vh-100">
      <SEO
        title={`${theme.title} - Luxury Collection`}
        description={theme.subtitle}
        keywords={[theme.title, theme.badge, "luxury collection", "5 star stays", "Discovery Convoy"]}
        image={theme.heroImage}
        url={`https://discoveryconvoy.com/collection/${currentSlug}`}
      />
      <Header />

      {/* ── 1. Hero Collection Banner ─────────────────────────────────────── */}
      <div
        className="tp-collection-hero p-relative"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.85) 100%), url(${theme.heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "90px 0 65px",
          color: "#ffffff",
        }}
      >
        <div className="container p-relative z-index-2">
          {/* Breadcrumbs */}
          <div className="d-flex align-items-center gap-2 mb-20 text-white-50" style={{ fontSize: "13px" }}>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, "", "/");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="text-white-50 text-decoration-none hover-white"
            >
              Home
            </a>
            <ChevronRight size={13} />
            <button
              type="button"
              onClick={handleNavigateLuxe}
              className="btn p-0 text-white-50 border-0 bg-transparent shadow-none"
              style={{ fontSize: "13px" }}
            >
              Luxe Selections
            </button>
            <ChevronRight size={13} />
            <span className="text-warning fw-semibold">{theme.title}</span>
          </div>

          <div className="row align-items-end justify-content-between g-4">
            <div className="col-lg-8">
              <div className="d-inline-flex align-items-center gap-1 bg-white bg-opacity-15 border border-white border-opacity-25 px-3 py-1 rounded-pill mb-3">
                <Crown size={14} className="text-warning" />
                <span className="text-white fw-semibold" style={{ fontSize: "12px" }}>
                  {theme.badge}
                </span>
              </div>
              <h1 className="fw-800 text-white mb-2" style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}>
                {theme.title}
              </h1>
              <p className="text-white-75 lead mb-4" style={{ maxWidth: "680px", fontSize: "16px" }}>
                {theme.subtitle}
              </p>

              {/* Highlights pills */}
              <div className="d-flex flex-wrap gap-2">
                {theme.highlights.map((hl, i) => (
                  <span
                    key={i}
                    className="badge bg-black bg-opacity-40 border border-white border-opacity-20 px-3 py-2 rounded-pill fw-normal"
                    style={{ fontSize: "12px" }}
                  >
                    ✨ {hl}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-lg-4 text-lg-end">
              <Button
                variant="stroke"
                size="md"
                icon={<ArrowLeft size={16} />}
                iconPosition="left"
                onClick={handleNavigateLuxe}
                style={{
                  color: "#ffffff",
                  borderColor: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(8px)",
                }}
              >
                Back to Luxe Selections
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Filter & Sort Bar ─────────────────────────────────────────── */}
      <div className="bg-white border-bottom py-3 sticky-top shadow-sm" style={{ zIndex: 90 }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-2">
              <Sparkles size={16} className="text-gold" />
              <span className="fw-bold text-dark" style={{ fontSize: "15px" }}>
                {properties.length} Handpicked Stays Available
              </span>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="form-select form-select-sm rounded-pill fw-semibold border-secondary-subtle px-3"
                  style={{ width: "auto" }}
                >
                  <option value="rating">Top Rated (⭐ 4.9+)</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Properties Grid ────────────────────────────────────────────── */}
      <div className="container py-60">
        {loading ? (
          <div className="text-center py-5">
            <Loader2 size={36} className="spin-animation text-gold mb-3" />
            <h4 className="fw-bold text-dark">Curating {theme.title}...</h4>
            <p className="text-muted">Retrieving real-time live luxury rates and villa availability...</p>
          </div>
        ) : (
          <div className="row g-4">
            {sortedProperties.map((prop) => {
              const isLiked = likedMap[prop.id];
              return (
                <div key={prop.id} className="col-lg-4 col-md-6">
                  <div className="tp-luxe-prop-card h-100 d-flex flex-column bg-white rounded-4 overflow-hidden border shadow-sm">
                    {/* Image Area */}
                    <div className="tp-luxe-prop-img-wrap p-relative" style={{ height: "260px" }}>
                      <img
                        src={resizeImage(prop.image, 600)}
                        alt={prop.name}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div className="tp-luxe-prop-top-meta">
                        <span className="tp-luxe-prop-city">
                          <MapPin size={12} /> {prop.city}
                        </span>
                        <span className="tp-luxe-prop-rating">
                          <Star size={12} fill="#ffd700" color="#ffd700" /> {prop.rating} ({prop.reviews})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setLikedMap((prev) => ({ ...prev, [prop.id]: !prev[prop.id] }))
                        }
                        className="btn btn-sm rounded-circle p-2 bg-white bg-opacity-85 position-absolute border-0 shadow-sm"
                        style={{ top: "14px", right: "14px", zIndex: 3 }}
                        aria-label="Wishlist"
                      >
                        <Heart
                          size={16}
                          color={isLiked ? "#e11d48" : "#475569"}
                          fill={isLiked ? "#e11d48" : "none"}
                        />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="tp-luxe-prop-body p-4 d-flex flex-column flex-1">
                      <div className="mb-2">
                        <span className="tp-luxe-pill">{prop.tag}</span>
                      </div>

                      <h3 className="tp-luxe-prop-title mb-2" style={{ fontSize: "19px" }}>
                        {prop.name}
                      </h3>

                      {/* Amenities Pills */}
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {prop.amenities.map((am: string, idx: number) => (
                          <span
                            key={idx}
                            className="badge bg-light text-secondary border px-2 py-1"
                            style={{ fontSize: "11px" }}
                          >
                            <CheckCircle size={10} className="text-success me-1" />
                            {am}
                          </span>
                        ))}
                      </div>

                      {/* Review Quote */}
                      <div className="tp-luxe-review-box mt-auto mb-3">
                        <p className="tp-luxe-review-text mb-0" style={{ fontSize: "12px", lineHeight: "1.5" }}>
                          "{prop.reviewQuote}"
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="tp-luxe-prop-footer pt-3 border-top d-flex align-items-center justify-content-between mt-auto">
                        <div>
                          <span className="tp-luxe-price-lbl">Starting from</span>
                          <h4 className="tp-luxe-price-val mb-0">{prop.price}</h4>
                          <span className="tp-luxe-price-sub">/ room / night</span>
                        </div>
                        <Button
                          variant="background"
                          size="sm"
                          icon={<ChevronRight size={14} />}
                          iconPosition="right"
                          onClick={() => handleBook(prop)}
                        >
                          Book Stay
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
