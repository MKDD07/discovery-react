import React, { useEffect, useState } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import SEO from "../components/snippets/seo/SEO";
import {
  MapPin,
  Star,
  Compass,
  Utensils,
  Hotel,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Loader2,
} from "lucide-react";
import SerpAPI from "../services/serpApi";
import { fetchPexelsVideo, pickVideoUrl } from "../components/sections/pexels/PexelsMediaSection";

export interface TripAdvisorPlaceData {
  type?: string;
  name: string;
  images?: string[];
  travel_advice?: Array<{ title: string; link: string }>;
  attraction_suggestions?: {
    items: Array<{
      name: string;
      place_id?: string;
      link?: string;
      thumbnail?: string;
      rating?: number;
      reviews?: number;
      address?: string;
      categories?: string[];
    }>;
    link?: string;
  };
  hotel_suggestions?: {
    items: Array<{
      name: string;
      place_id?: string;
      link?: string;
      thumbnail?: string;
      rating?: number;
      reviews?: number;
      price?: number;
      address?: string;
    }>;
    link?: string;
  };
  restaurant_suggestions?: {
    items: Array<{
      name: string;
      place_id?: string;
      link?: string;
      thumbnail?: string;
      rating?: number;
      reviews?: number;
      address?: string;
      cuisines?: string[];
      price_level?: string;
    }>;
    link?: string;
  };
  itineraries?: Array<{
    title: string;
    link?: string;
    description?: string;
    duration?: number;
    author?: { username?: string; avatar?: string };
  }>;
  destination_faq?: Array<{
    question: string;
    answer?: { snippet?: string; items?: Array<{ snippet: string; link?: string }> };
  }>;
}

// Default mock data matching the exact SerpApi tripadvisor_place schema
const DEFAULT_PLACE_DATA: TripAdvisorPlaceData = {
  type: "destination",
  name: "Paris, France",
  images: [
    "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  travel_advice: [
    { title: "Best area to stay in Paris", link: "https://www.tripadvisor.com" },
    { title: "Best time of the year to visit", link: "https://www.tripadvisor.com" },
    { title: "Curated multi-day itineraries", link: "https://www.tripadvisor.com" },
  ],
  attraction_suggestions: {
    items: [
      {
        name: "Eiffel Tower",
        thumbnail: "https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.6,
        reviews: 143709,
        address: "Av. Gustave Eiffel, 75007 Paris France",
        categories: ["Observation Decks & Towers", "Points of Interest & Landmarks"],
      },
      {
        name: "Louvre Museum",
        thumbnail: "https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.6,
        reviews: 104218,
        address: "99 Rue de Rivoli, 75001 Paris France",
        categories: ["Art Museums", "Historic Sites"],
      },
      {
        name: "Arc de Triomphe",
        thumbnail: "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.5,
        reviews: 46418,
        address: "Place Charles de Gaulle, 75008 Paris France",
        categories: ["Architectural Buildings", "Monuments & Statues"],
      },
    ],
  },
  hotel_suggestions: {
    items: [
      {
        name: "Grand Hotel Du Palais Royal",
        thumbnail: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.8,
        reviews: 1886,
        price: 411.42,
        address: "4 Rue de Valois, 75001 Paris France",
      },
      {
        name: "Hotel Esprit Saint Germain",
        thumbnail: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.8,
        reviews: 956,
        price: 321.84,
        address: "22 Rue Saint Sulpice, 75006 Paris France",
      },
      {
        name: "Cadet Residence",
        thumbnail: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.5,
        reviews: 866,
        price: 154,
        address: "7 Rue Cadet, 75009 Paris France",
      },
    ],
  },
  restaurant_suggestions: {
    items: [
      {
        name: "La Table De Colette",
        thumbnail: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.8,
        reviews: 1409,
        address: "17 Rue Laplace, 75005 Paris France",
        cuisines: ["French", "Contemporary"],
        price_level: "$$$$",
      },
      {
        name: "Perlimpinpin",
        thumbnail: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.8,
        reviews: 894,
        address: "121 Rue De Rome, 75017 Paris France",
        cuisines: ["French", "Healthy"],
        price_level: "$$-$$$",
      },
      {
        name: "Can Alegria Paris",
        thumbnail: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.8,
        reviews: 1603,
        address: "73 Rue Jean Baptiste Pigalle, 75009 Paris France",
        cuisines: ["Mediterranean", "European"],
        price_level: "$$-$$$",
      },
    ],
  },
  itineraries: [
    {
      title: "Your romantic getaway to Paris for 5 days",
      description: "Paris, the City of Lights, is a dream destination for travelers. Explore must-see attractions like the Eiffel Tower and Louvre Museum, indulge in exquisite French cuisine at charming cafes, and take a leisurely river dinner cruise along the Seine.",
      duration: 5,
    },
    {
      title: "A solo weekend discovering hidden art & cozy cafes",
      description: "From iconic sights to cozy bistros, explore the best of the city in three balanced, unforgettable days.",
      duration: 3,
    },
  ],
  destination_faq: [
    {
      question: "Where should I stay in Paris?",
      answer: {
        snippet: "We recommend central areas such as the 1st, 4th, and 6th arrondissements due to their proximity to major landmarks like the Louvre and Notre Dame.",
      },
    },
    {
      question: "What is Paris best known for?",
      answer: {
        snippet: "World-class art museums, romantic Seine cruises, historic architectural monuments, haute couture fashion, and exquisite culinary traditions.",
      },
    },
  ],
};

interface DestinationGuidePageProps {
  destinationQuery?: string;
  onBackHome?: () => void;
}

export const DestinationGuidePage: React.FC<DestinationGuidePageProps> = ({
  destinationQuery = "Paris, France",
}) => {
  const [data, setData] = useState<TripAdvisorPlaceData>(DEFAULT_PLACE_DATA);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"attractions" | "hotels" | "restaurants" | "itineraries">("attractions");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoPoster, setVideoPoster] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    SerpAPI.searchTripAdvisorPlace(destinationQuery)
      .then((res: any) => {
        if (!isMounted) return;
        if (res?.place_result) {
          setData(res.place_result);
        }
      })
      .catch((err) => {
        console.warn("TripAdvisor place search failed, using default dataset:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // Fetch dynamic Pexels video based on destination query (same as blog & destination pages)
    const pexelsVideoQuery = `${destinationQuery} travel landscape nature scenery`;
    fetchPexelsVideo(pexelsVideoQuery, "landscape")
      .then((videos) => {
        if (!isMounted || !videos || videos.length === 0) return;
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        const bestUrl =
          pickVideoUrl(randomVideo, "hd") ||
          pickVideoUrl(randomVideo, "medium") ||
          pickVideoUrl(randomVideo, "full_hd");

        if (bestUrl) setVideoUrl(bestUrl);
        if (randomVideo.image) setVideoPoster(randomVideo.image);
      })
      .catch((err) => {
        console.warn("DestinationGuidePage: Pexels video fetch error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [destinationQuery]);

  const heroImage = data.images?.[0] || videoPoster || DEFAULT_PLACE_DATA.images![0];

  return (
    <>
      <SEO
        title={`${data.name} Travel Guide | Live TripAdvisor Insights`}
        description={`Explore verified attractions, handpicked hotels, top restaurants, and curated itineraries for ${data.name}.`}
        keywords={[data.name, "travel guide", "top attractions", "hotels", "restaurants", "Discovery Convoy"]}
      />

      <Header />

      <main className="bg-light-subtle pb-80">
        {/* ── TP HERO 5 STYLE DESTINATION BANNER ───────────────────────────── */}
        <section className="tp-hero-area tp-hero-5-spacing p-relative z-index-2 pt-40 pb-50">
          <div className="container container-1876">
            <div
              className="tp-hero-5-bg p-relative overflow-hidden rounded-5"
              style={{
                position: "relative",
                padding: "80px 40px",
                color: "#ffffff",
                minHeight: "460px",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#0f172a",
              }}
            >
              {/* Background Video or Fallback Poster */}
              {videoUrl ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={heroImage}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 0,
                  }}
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: 0,
                  }}
                />
              )}

              {/* Dark Gradient Overlay for Readability */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8))",
                  zIndex: 1,
                }}
              />

              <div className="container position-relative" style={{ zIndex: 2 }}>
                <div className="row">
                  <div className="col-12">
                    <div className="tp-breadcrumb-wrap text-center py-4">
                      <h2 className="tp-breadcrumb-title fs-112 text-center mb-15 text-white">
                        {data.name}
                      </h2>
                      <div className="tp-breadcrumb-list mb-25 d-flex align-items-center justify-content-center flex-wrap">
                        <span className="text-white opacity-75">
                          <a
                            href="/"
                            className="text-white text-decoration-none"
                            onClick={(e) => {
                              e.preventDefault();
                              window.history.pushState({}, "", "/");
                              window.dispatchEvent(new PopStateEvent("popstate"));
                            }}
                          >
                            Home
                          </a>
                        </span>
                        <span className="dvdr mx-2 text-white opacity-50">/</span>
                        <span className="text-white opacity-75">
                          <a
                            href="/destinations"
                            className="text-white text-decoration-none"
                            onClick={(e) => {
                              e.preventDefault();
                              window.history.pushState({}, "", "/destinations");
                              window.dispatchEvent(new PopStateEvent("popstate"));
                            }}
                          >
                            Destinations
                          </a>
                        </span>
                        <span className="dvdr mx-2 text-white opacity-50">/</span>
                        <span className="text-white opacity-100">{data.name} Guide</span>
                      </div>

                      {/* Travel Advice Pills (Blog Style Rounded Badges) */}
                      {data.travel_advice && data.travel_advice.length > 0 && (
                        <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
                          {data.travel_advice.map((adv, idx) => (
                            <a
                              key={idx}
                              href={adv.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-light rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1"
                              style={{ fontSize: "12px", fontWeight: 400, backdropFilter: "blur(4px)", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                            >
                              <Compass size={12} /> {adv.title} <ExternalLink size={10} className="opacity-75" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── INTERACTIVE NAV TABS ────────────────────────────────────────── */}
        <div className="container mt-20 mb-40">
          <div className="bg-white p-2 rounded-4 shadow-sm border d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="d-flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("attractions")}
                className={`btn btn-sm rounded-3 px-3 py-2 d-inline-flex align-items-center gap-2 border-0 ${
                  activeTab === "attractions" ? "btn-success text-white" : "btn-light text-dark"
                }`}
                style={{ fontSize: "13px", fontWeight: 400 }}
              >
                <Compass size={14} /> Top Attractions ({data.attraction_suggestions?.items?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hotels")}
                className={`btn btn-sm rounded-3 px-3 py-2 d-inline-flex align-items-center gap-2 border-0 ${
                  activeTab === "hotels" ? "btn-success text-white" : "btn-light text-dark"
                }`}
                style={{ fontSize: "13px", fontWeight: 400 }}
              >
                <Hotel size={14} /> Recommended Hotels ({data.hotel_suggestions?.items?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("restaurants")}
                className={`btn btn-sm rounded-3 px-3 py-2 d-inline-flex align-items-center gap-2 border-0 ${
                  activeTab === "restaurants" ? "btn-success text-white" : "btn-light text-dark"
                }`}
                style={{ fontSize: "13px", fontWeight: 400 }}
              >
                <Utensils size={14} /> Dining &amp; Cafes ({data.restaurant_suggestions?.items?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("itineraries")}
                className={`btn btn-sm rounded-3 px-3 py-2 d-inline-flex align-items-center gap-2 border-0 ${
                  activeTab === "itineraries" ? "btn-success text-white" : "btn-light text-dark"
                }`}
                style={{ fontSize: "13px", fontWeight: 400 }}
              >
                <BookOpen size={14} /> Trip Itineraries ({data.itineraries?.length || 0})
              </button>
            </div>

            {loading && (
              <span className="text-muted small px-3 d-inline-flex align-items-center gap-1" style={{ fontSize: "12px", fontWeight: 400 }}>
                <Loader2 size={13} className="animate-spin text-success" /> Syncing live place data...
              </span>
            )}
          </div>
        </div>

        {/* ── CONTENT GRID SECTION ────────────────────────────────────────── */}
        <div className="container">
          {/* TAB 1: ATTRACTIONS */}
          {activeTab === "attractions" && (
            <div className="row">
              {data.attraction_suggestions?.items?.map((item, idx) => (
                <div key={idx} className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                  <div className="tp-tour-item mb-30" style={{ cursor: "pointer" }}>
                    <div className="tp-tour-thumb p-relative fix">
                      <a href={item.link || "#"} target="_blank" rel="noreferrer" className="image">
                        <img
                          alt={item.name}
                          width="400"
                          height="233"
                          loading="lazy"
                          decoding="async"
                          src={item.thumbnail || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80"}
                          style={{
                            opacity: 1,
                            transition: "opacity 0.3s",
                            maxWidth: "400px",
                            width: "100%",
                            height: "233px",
                            objectFit: "cover",
                          }}
                        />
                      </a>
                      <span className="tp-tour-wishlist">
                        <i className="fa-regular fa-heart"></i>
                      </span>
                      <div className="tp-tour-media-meta">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + " " + (item.address || data.name))}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`View ${item.name} on Google Maps`}
                        >
                          <i className="fa-solid fa-map-location-dot"></i>
                        </a>
                      </div>
                    </div>
                    <div className="tp-tour-content">
                      <div className="tp-tour-meta d-flex align-items-center">
                        <div className="tp-tour-review mr-5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s}>
                              <i className="fa-solid fa-star"></i>
                            </span>
                          ))}
                        </div>
                        <span className="tp-tour-review-score tp-ff-inter">
                          ( {item.reviews?.toLocaleString() || "100+"} Reviews )
                        </span>
                      </div>
                      <h3 className="tp-tour-title fw-500 mb-10">
                        <a href={item.link || "#"} target="_blank" rel="noreferrer" style={{ fontSize: "17px" }}>
                          {item.name}
                        </a>
                      </h3>
                      <div className="tp-tour-info">
                        <span>
                          <i className="fa-solid fa-location-dot mr-5"></i>
                          {item.address?.split(",")[0] || data.name}
                        </span>
                        <span>
                          <i className="fa-regular fa-clock mr-5"></i>
                          {item.categories?.[0] || "Attraction"}
                        </span>
                        <span>
                          <i className="fa-regular fa-user mr-5"></i>
                          <span>1</span>-<span>8</span> user
                        </span>
                      </div>
                      <div className="tp-tour-footer d-flex justify-content-between gap-2 align-items-center">
                        <div className="tp-tour-price">
                          <div className="tp-tour-top-price d-flex align-items-center gap-2">
                            <span className="tp-tour-prefix">Score:</span>
                            <span className="tp-tour-old-price text-muted small">{item.rating || 4.5} / 5.0</span>
                          </div>
                          <div className="tp-tour-bottom-price">
                            <span className="tp-tour-new-price fw-700">Explore</span>
                            <span className="tp-tour-suffix">/guide</span>
                          </div>
                        </div>
                        <div className="tp-tour-btn">
                          <a href={item.link || "#"} target="_blank" rel="noreferrer" className="tp-btn-sm fw-500 tp-ff-inter">
                            Book A tour
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: HOTELS */}
          {activeTab === "hotels" && (
            <div className="row">
              {data.hotel_suggestions?.items?.map((item, idx) => (
                <div key={idx} className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                  <div className="tp-tour-item mb-30" style={{ cursor: "pointer" }}>
                    <div className="tp-tour-thumb p-relative fix">
                      <a href={item.link || "#"} target="_blank" rel="noreferrer" className="image">
                        <img
                          alt={item.name}
                          width="400"
                          height="233"
                          loading="lazy"
                          decoding="async"
                          src={item.thumbnail || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80"}
                          style={{
                            opacity: 1,
                            transition: "opacity 0.3s",
                            maxWidth: "400px",
                            width: "100%",
                            height: "233px",
                            objectFit: "cover",
                          }}
                        />
                      </a>
                      <span className="tp-tour-wishlist">
                        <i className="fa-regular fa-heart"></i>
                      </span>
                      <div className="tp-tour-media-meta">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + " " + (item.address || data.name))}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`View ${item.name} on Google Maps`}
                        >
                          <i className="fa-solid fa-map-location-dot"></i>
                        </a>
                      </div>
                    </div>
                    <div className="tp-tour-content">
                      <div className="tp-tour-meta d-flex align-items-center">
                        <div className="tp-tour-review mr-5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s}>
                              <i className="fa-solid fa-star"></i>
                            </span>
                          ))}
                        </div>
                        <span className="tp-tour-review-score tp-ff-inter">
                          ( {item.reviews?.toLocaleString() || "150"} Reviews )
                        </span>
                      </div>
                      <h3 className="tp-tour-title fw-500 mb-10">
                        <a href={item.link || "#"} target="_blank" rel="noreferrer" style={{ fontSize: "17px" }}>
                          {item.name}
                        </a>
                      </h3>
                      <div className="tp-tour-info">
                        <span>
                          <i className="fa-solid fa-location-dot mr-5"></i>
                          {item.address?.split(",")[0] || data.name}
                        </span>
                        <span>
                          <i className="fa-regular fa-clock mr-5"></i>
                          2 days
                        </span>
                        <span>
                          <i className="fa-regular fa-user mr-5"></i>
                          <span>1</span>-<span>8</span> user
                        </span>
                      </div>
                      <div className="tp-tour-footer d-flex justify-content-between gap-2 align-items-center">
                        <div className="tp-tour-price">
                          <div className="tp-tour-top-price d-flex align-items-center gap-2">
                            <span className="tp-tour-prefix">From:</span>
                            <span className="tp-tour-old-price text-decoration-line-through text-muted small">
                              {item.price ? `$${Math.round(item.price * 1.25)}` : "₹9,374"}
                            </span>
                          </div>
                          <div className="tp-tour-bottom-price">
                            <span className="tp-tour-new-price fw-700">
                              {item.price ? `$${item.price}` : "₹7,499"}
                            </span>
                            <span className="tp-tour-suffix">/night</span>
                          </div>
                        </div>
                        <div className="tp-tour-btn">
                          <a href={item.link || "#"} target="_blank" rel="noreferrer" className="tp-btn-sm fw-500 tp-ff-inter">
                            Book A tour
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: RESTAURANTS */}
          {activeTab === "restaurants" && (
            <div className="row">
              {data.restaurant_suggestions?.items?.map((item, idx) => (
                <div key={idx} className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                  <div className="tp-tour-item mb-30" style={{ cursor: "pointer" }}>
                    <div className="tp-tour-thumb p-relative fix">
                      <a href={item.link || "#"} target="_blank" rel="noreferrer" className="image">
                        <img
                          alt={item.name}
                          width="400"
                          height="233"
                          loading="lazy"
                          decoding="async"
                          src={item.thumbnail || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80"}
                          style={{
                            opacity: 1,
                            transition: "opacity 0.3s",
                            maxWidth: "400px",
                            width: "100%",
                            height: "233px",
                            objectFit: "cover",
                          }}
                        />
                      </a>
                      <span className="tp-tour-wishlist">
                        <i className="fa-regular fa-heart"></i>
                      </span>
                      <div className="tp-tour-media-meta">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + " " + (item.address || data.name))}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`View ${item.name} on Google Maps`}
                        >
                          <i className="fa-solid fa-map-location-dot"></i>
                        </a>
                      </div>
                    </div>
                    <div className="tp-tour-content">
                      <div className="tp-tour-meta d-flex align-items-center">
                        <div className="tp-tour-review mr-5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s}>
                              <i className="fa-solid fa-star"></i>
                            </span>
                          ))}
                        </div>
                        <span className="tp-tour-review-score tp-ff-inter">
                          ( {item.reviews?.toLocaleString() || "80"} Reviews )
                        </span>
                      </div>
                      <h3 className="tp-tour-title fw-500 mb-10">
                        <a href={item.link || "#"} target="_blank" rel="noreferrer" style={{ fontSize: "17px" }}>
                          {item.name}
                        </a>
                      </h3>
                      <div className="tp-tour-info">
                        <span>
                          <i className="fa-solid fa-location-dot mr-5"></i>
                          {item.address?.split(",")[0] || data.name}
                        </span>
                        <span>
                          <i className="fa-regular fa-clock mr-5"></i>
                          {item.cuisines?.[0] || "Dining"}
                        </span>
                        <span>
                          <i className="fa-regular fa-user mr-5"></i>
                          <span>{item.price_level || "$$"}</span>
                        </span>
                      </div>
                      <div className="tp-tour-footer d-flex justify-content-between gap-2 align-items-center">
                        <div className="tp-tour-price">
                          <div className="tp-tour-top-price d-flex align-items-center gap-2">
                            <span className="tp-tour-prefix">Dining:</span>
                            <span className="tp-tour-old-price text-muted small">{item.cuisines?.slice(0, 2).join(", ") || "Fine Food"}</span>
                          </div>
                          <div className="tp-tour-bottom-price">
                            <span className="tp-tour-new-price fw-700">Reserve</span>
                            <span className="tp-tour-suffix">/table</span>
                          </div>
                        </div>
                        <div className="tp-tour-btn">
                          <a href={item.link || "#"} target="_blank" rel="noreferrer" className="tp-btn-sm fw-500 tp-ff-inter">
                            Book A tour
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: ITINERARIES */}
          {activeTab === "itineraries" && (
            <div className="row">
              {data.itineraries?.map((item, idx) => (
                <div key={idx} className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                  <div className="tp-tour-item mb-30" style={{ cursor: "pointer" }}>
                    <div className="tp-tour-thumb p-relative fix">
                      <a href={item.link || "#"} target="_blank" rel="noreferrer" className="image">
                        <img
                          alt={item.title}
                          width="400"
                          height="233"
                          loading="lazy"
                          decoding="async"
                          src={data.images?.[idx % (data.images.length || 1)] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80"}
                          style={{
                            opacity: 1,
                            transition: "opacity 0.3s",
                            maxWidth: "400px",
                            width: "100%",
                            height: "233px",
                            objectFit: "cover",
                          }}
                        />
                      </a>
                      <span className="tp-tour-wishlist">
                        <i className="fa-regular fa-heart"></i>
                      </span>
                    </div>
                    <div className="tp-tour-content">
                      <div className="tp-tour-meta d-flex align-items-center">
                        <div className="tp-tour-review mr-5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s}>
                              <i className="fa-solid fa-star"></i>
                            </span>
                          ))}
                        </div>
                        <span className="tp-tour-review-score tp-ff-inter">
                          ( {item.duration || 3} Days Trip )
                        </span>
                      </div>
                      <h3 className="tp-tour-title fw-500 mb-10">
                        <a href={item.link || "#"} target="_blank" rel="noreferrer" style={{ fontSize: "17px" }}>
                          {item.title}
                        </a>
                      </h3>
                      <div className="tp-tour-info">
                        <span>
                          <i className="fa-solid fa-location-dot mr-5"></i>
                          {data.name}
                        </span>
                        <span>
                          <i className="fa-regular fa-clock mr-5"></i>
                          {item.duration || 3} days
                        </span>
                        <span>
                          <i className="fa-regular fa-user mr-5"></i>
                          <span>{item.author?.username ? `By ${item.author.username}` : "Curated"}</span>
                        </span>
                      </div>
                      <div className="tp-tour-footer d-flex justify-content-between gap-2 align-items-center">
                        <div className="tp-tour-price">
                          <div className="tp-tour-top-price d-flex align-items-center gap-2">
                            <span className="tp-tour-prefix">Plan:</span>
                            <span className="tp-tour-old-price text-muted small">{item.duration || 3} Days</span>
                          </div>
                          <div className="tp-tour-bottom-price">
                            <span className="tp-tour-new-price fw-700">Full Guide</span>
                            <span className="tp-tour-suffix">/trip</span>
                          </div>
                        </div>
                        <div className="tp-tour-btn">
                          <a href={item.link || "#"} target="_blank" rel="noreferrer" className="tp-btn-sm fw-500 tp-ff-inter">
                            Book A tour
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── FAQ SECTION (Custom Borderless Button Accordion) ─────────── */}
          {data.destination_faq && data.destination_faq.length > 0 && (
            <div className="mt-60">
              <div className="text-center mb-35">
                <span className="text-success small d-inline-block mb-1" style={{ fontSize: "12px", fontWeight: 400 }}>
                  <HelpCircle size={13} className="me-1 d-inline" /> Frequently Asked Questions
                </span>
                <h3 className="text-dark" style={{ fontSize: "24px", fontWeight: 400 }}>
                  Essential Travel Tips for {data.name}
                </h3>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="d-flex flex-column gap-3">
                    {data.destination_faq.map((faq, idx) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div key={idx} className="bg-white rounded-4 overflow-hidden shadow-sm">
                          <button
                            type="button"
                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            className="w-100 text-start p-4 bg-white border-0 d-flex align-items-center justify-content-between gap-3 text-dark fw-bold"
                            style={{ fontSize: "15.5px", cursor: "pointer" }}
                          >
                            <span className="d-flex align-items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-circle-question-mark"
                                aria-hidden="true"
                                style={{ color: "rgb(132, 196, 24)", flexShrink: 0 }}
                              >
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <path d="M12 17h.01"></path>
                              </svg>
                              {faq.question}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-chevron-down text-muted flex-shrink-0 transition-transform"
                              aria-hidden="true"
                              style={{
                                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s",
                              }}
                            >
                              <path d="m6 9 6 6 6-6"></path>
                            </svg>
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 text-muted border-0" style={{ fontSize: "14px", fontWeight: 400, lineHeight: 1.65 }}>
                              {faq.answer?.snippet}
                              {faq.answer?.items && faq.answer.items.length > 0 && (
                                <ul className="mt-2 mb-0 ps-3">
                                  {faq.answer.items.map((it, itIdx) => (
                                    <li key={itIdx}>
                                      {it.link ? (
                                        <a href={it.link} target="_blank" rel="noopener noreferrer" className="text-success">
                                          {it.snippet}
                                        </a>
                                      ) : (
                                        it.snippet
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DestinationGuidePage;
