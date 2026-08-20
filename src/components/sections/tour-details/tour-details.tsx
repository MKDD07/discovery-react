import React, { useEffect, useState } from "react";
import {
  MapPin,
  Star,
  Users,
  Clock,
  Globe,
  Wifi,
  Utensils,
  Car,
  Dumbbell,
  Waves,
  BedDouble,
  ConciergeBell,
  Plane,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Info,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SerpAPI, { SerpHotelDetail } from "../../../services/serpApi";

interface TourDetailsProps {
  tourName?: string;
  location?: string;
  cardPrice?: string;
  cardOriginalPrice?: number;
  initialHotel?: any;
}

/* ── Amenity → Lucide icon map ──────────────────────────────────────── */
const amenityIcon = (name: string): React.ReactNode => {
  const n = name.toLowerCase();
  if (n.includes("wifi") || n.includes("wi-fi") || n.includes("internet"))
    return <Wifi size={16} />;
  if (n.includes("pool") || n.includes("swim")) return <Waves size={16} />;
  if (n.includes("gym") || n.includes("fitness")) return <Dumbbell size={16} />;
  if (
    n.includes("restaurant") ||
    n.includes("breakfast") ||
    n.includes("food") ||
    n.includes("dining")
  )
    return <Utensils size={16} />;
  if (n.includes("parking") || n.includes("car")) return <Car size={16} />;
  if (
    n.includes("airport") ||
    n.includes("transfer") ||
    n.includes("shuttle")
  )
    return <Plane size={16} />;
  if (n.includes("room service") || n.includes("concierge"))
    return <ConciergeBell size={16} />;
  if (
    n.includes("spa") ||
    n.includes("massage") ||
    n.includes("wellness")
  )
    return <Sparkles size={16} />;
  return <BedDouble size={16} />;
};

/* ── Star row ────────────────────────────────────────────────────────── */
const StarRow: React.FC<{ rating: number; size?: number }> = ({
  rating,
  size = 14,
}) => (
  <span style={{ display: "inline-flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        fill={s <= Math.round(rating) ? "currentColor" : "none"}
        style={{ color: s <= Math.round(rating) ? "#f59e0b" : "#d1d5db" }}
      />
    ))}
  </span>
);

/* ── Skeleton loader ────────────────────────────────────────────────── */
const TourDetailSkeleton: React.FC = () => (
  <div style={{ padding: "24px 0" }}>
    <div
      style={{
        background: "#f3f4f6",
        borderRadius: 16,
        height: 440,
        marginBottom: 28,
        animation: "pulse 1.5s infinite",
      }}
    />
    <div
      style={{
        height: 36,
        background: "#f3f4f6",
        borderRadius: 8,
        width: "55%",
        marginBottom: 16,
        animation: "pulse 1.5s infinite",
      }}
    />
    <div
      style={{
        height: 22,
        background: "#f3f4f6",
        borderRadius: 6,
        width: "35%",
        marginBottom: 28,
        animation: "pulse 1.5s infinite",
      }}
    />
  </div>
);

const TourDetails: React.FC<TourDetailsProps> = ({
  tourName = "Tour Details",
  location = "India",
  cardPrice,
  cardOriginalPrice,
  initialHotel,
}) => {
  const [hotel, setHotel] = useState<SerpHotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setActiveImg(0);

    // If we already have initial card hotel passed via navigation state, seed it
    if (initialHotel) {
      setHotel({
        name: initialHotel.name || tourName,
        rating: initialHotel.rating || 4.5,
        reviews: initialHotel.reviews || 0,
        price: cardPrice || initialHotel.price || "₹9,999",
        rawPrice: initialHotel.rawPrice || 9999,
        originalPrice: cardOriginalPrice || initialHotel.originalPrice,
        link: initialHotel.link || "#",
        thumbnail: initialHotel.thumbnail || "",
        images: initialHotel.images || (initialHotel.thumbnail ? [initialHotel.thumbnail] : []),
        gps_coordinates: initialHotel.gps_coordinates,
        description: initialHotel.description || "",
        amenities: initialHotel.amenities || [
          "Free Wi-Fi",
          "Air conditioning",
          "Room service",
          "Swimming pool",
          "Restaurant",
          "Free parking",
        ],
        duration: "2 Nights / 3 Days",
        groupSize: "1 – 8 guests",
        languages: ["English", "Hindi"],
        cancellation: "Free cancellation up to 24 hours before check-in",
        included: [
          "Deluxe accommodation",
          "Daily buffet breakfast",
          "Complimentary Wi-Fi",
          "Swimming pool & fitness access",
          "Welcome drink on arrival",
        ],
        excluded: [
          "Airfare & airport taxes",
          "Personal expenses & mini bar",
          "Optional sightseeing tickets",
          "Travel insurance",
        ],
        highlights: [
          "Prime location with easy accessibility",
          "Top-rated hospitality & guest service",
          "Authentic dining & wellness facilities",
        ],
      });
    }

    SerpAPI.searchHotelByName(tourName, location)
      .then((data) => {
        if (!mounted) return;
        const detail = SerpAPI.extractHotelDetail(data, tourName);
        if (detail) {
          // Priority: Use exact cardPrice and cardOriginalPrice from card
          setHotel((prev) => ({
            ...detail,
            price: cardPrice || (prev?.price ?? detail.price),
            originalPrice:
              cardOriginalPrice ||
              (prev?.originalPrice ?? detail.originalPrice),
            rawPrice: prev?.rawPrice ?? detail.rawPrice,
          }));
        } else if (!initialHotel) {
          // Fallback minimal hotel object
          setHotel({
            name: tourName,
            rating: 4.8,
            reviews: 128,
            price: cardPrice || "₹8,999",
            rawPrice: 8999,
            originalPrice: cardOriginalPrice || 11999,
            link: `https://www.google.com/travel/hotels?q=${encodeURIComponent(tourName)}`,
            thumbnail: "",
            images: [],
            amenities: ["Free Wi-Fi", "Swimming Pool", "Restaurant", "Spa", "Free Parking"],
            duration: "2 Nights / 3 Days",
            groupSize: "1 – 8 guests",
            languages: ["English", "Hindi"],
            cancellation: "Free cancellation up to 24 hours before check-in",
            included: ["Accommodation", "Breakfast Included", "Free High-Speed Wi-Fi", "Pool Access"],
            excluded: ["Personal expenses", "Travel insurance", "Additional room amenities"],
          });
        }
      })
      .catch(() => {
        if (mounted && !initialHotel) setError("Failed to load hotel details.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [tourName, location, cardPrice, cardOriginalPrice, initialHotel]);

  // Derived prices
  const displayPrice = cardPrice || hotel?.price || "₹8,999";
  const displayOriginalPrice = cardOriginalPrice || hotel?.originalPrice;
  const images = hotel?.images && hotel.images.length > 0
    ? hotel.images
    : hotel?.thumbnail
    ? [hotel.thumbnail]
    : [];

  const mapsUrl = hotel?.gps_coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${hotel.gps_coordinates.latitude},${hotel.gps_coordinates.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel?.name || tourName + " " + location)}`;

  return (
    <>
      {/* tp-tour-details-area-start */}
      <div className="tp-tour-details-area pt-20 pb-60">
        <div className="container container-1350">
          {loading && !hotel && <TourDetailSkeleton />}

          {error && !hotel && !loading && (
            <div
              className="alert alert-danger d-flex align-items-center gap-3 my-4 p-4 rounded-4"
              role="alert"
            >
              <Info size={24} />
              <div>
                <strong>Notice:</strong> {error}
              </div>
            </div>
          )}

          {hotel && (
            <div className="tp-tour-details">
              {/* ── Top Header Title & Meta ──────────────────────────── */}
              <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-25 pb-20 border-bottom">
                <div>
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-10">
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold font-monospace text-uppercase">
                      {hotel.type || "Verified Stay"}
                    </span>
                    <span className="d-inline-flex align-items-center gap-1 text-muted small">
                      <MapPin size={15} className="text-danger" />
                      <strong className="text-dark">{location}</strong>
                    </span>
                  </div>
                  <h1 className="tp-tour-details-title fw-bold text-dark mb-10" style={{ fontSize: "clamp(24px, 3.2vw, 36px)", letterSpacing: "-0.5px" }}>
                    {hotel.name}
                  </h1>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <div className="d-inline-flex align-items-center gap-2 bg-warning bg-opacity-10 px-2 py-1 rounded-3">
                      <StarRow rating={hotel.rating} size={15} />
                      <span className="fw-bold text-dark small">{hotel.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-muted small">
                      ({hotel.reviews.toLocaleString("en-IN")} verified reviews)
                    </span>
                    <span className="text-muted small">•</span>
                    <span className="text-muted small d-inline-flex align-items-center gap-1">
                      <Clock size={14} className="text-primary" /> {hotel.duration || "2 Nights / 3 Days"}
                    </span>
                    <span className="text-muted small">•</span>
                    <span className="text-muted small d-inline-flex align-items-center gap-1">
                      <Users size={14} className="text-success" /> {hotel.groupSize || "1 – 8 Guests"}
                    </span>
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 shadow-sm bg-white"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: hotel.name,
                          url: window.location.href,
                        }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }
                    }}
                  >
                    <Share2 size={16} />
                    <span className="d-none d-sm-inline">Share</span>
                  </button>
                  <button
                    type="button"
                    className={`btn d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 shadow-sm ${
                      wishlist ? "btn-danger" : "btn-outline-secondary bg-white"
                    }`}
                    onClick={() => setWishlist(!wishlist)}
                  >
                    <Heart size={16} fill={wishlist ? "currentColor" : "none"} />
                    <span className="d-none d-sm-inline">{wishlist ? "Saved" : "Save"}</span>
                  </button>
                </div>
              </div>

              {/* ── Modern Gallery Showcase ──────────────────────────── */}
              {images.length > 0 && (
                <div className="tp-tour-gallery mb-40">
                  <div className="row g-2">
                    {/* Main Featured Photo */}
                    <div className={images.length > 1 ? "col-lg-8" : "col-12"}>
                      <div
                        className="position-relative overflow-hidden rounded-4 shadow-sm"
                        style={{ height: "420px", background: "#f8f9fa" }}
                      >
                        <img
                          src={images[activeImg]}
                          alt={hotel.name}
                          className="w-100 h-100 object-fit-cover transition-all"
                          style={{ transition: "all 0.4s ease" }}
                        />
                        {images.length > 1 && (
                          <>
                            <button
                              type="button"
                              className="btn btn-dark btn-sm position-absolute start-0 top-50 translate-middle-y ms-3 rounded-circle d-flex align-items-center justify-content-center bg-opacity-75 border-0 shadow"
                              style={{ width: "42px", height: "42px" }}
                              onClick={() =>
                                setActiveImg((p) => (p === 0 ? images.length - 1 : p - 1))
                              }
                            >
                              <ChevronLeft size={22} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-dark btn-sm position-absolute end-0 top-50 translate-middle-y me-3 rounded-circle d-flex align-items-center justify-content-center bg-opacity-75 border-0 shadow"
                              style={{ width: "42px", height: "42px" }}
                              onClick={() =>
                                setActiveImg((p) => (p === images.length - 1 ? 0 : p + 1))
                              }
                            >
                              <ChevronRight size={22} />
                            </button>
                          </>
                        )}
                        <span className="position-absolute bottom-0 end-0 m-3 badge bg-dark bg-opacity-75 px-3 py-2 rounded-pill font-monospace small">
                          📷 {activeImg + 1} / {images.length}
                        </span>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="position-absolute bottom-0 start-0 m-3 btn btn-light btn-sm rounded-pill shadow-sm d-inline-flex align-items-center gap-1 fw-semibold"
                        >
                          <Navigation size={14} className="text-primary" /> View on Map
                        </a>
                      </div>
                    </div>

                    {/* Secondary Gallery Grid */}
                    {images.length > 1 && (
                      <div className="col-lg-4 d-none d-lg-block">
                        <div className="row g-2 h-100">
                          {images.slice(1, 5).map((img, idx) => {
                            const realIdx = idx + 1;
                            const isLast = idx === 3 && images.length > 5;
                            return (
                              <div key={realIdx} className="col-6" style={{ height: "205px" }}>
                                <div
                                  className="position-relative h-100 rounded-4 overflow-hidden shadow-sm cursor-pointer"
                                  style={{
                                    border: activeImg === realIdx ? "2px solid #0d6efd" : "none",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => setActiveImg(realIdx)}
                                >
                                  <img
                                    src={img}
                                    alt=""
                                    className="w-100 h-100 object-fit-cover"
                                  />
                                  {isLast && (
                                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-60 d-flex align-items-center justify-content-center text-white fw-bold fs-5">
                                      +{images.length - 5} More
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Main Layout: Content + Sticky Booking Box ──────── */}
              <div className="row g-4">
                {/* Left Main Content */}
                <div className="col-lg-8">
                  {/* Overview Card */}
                  <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
                    <h3 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
                      <Sparkles size={20} className="text-primary" /> About This Stay
                    </h3>
                    <p className="text-muted lh-lg mb-4" style={{ fontSize: "15.5px" }}>
                      {hotel.description ||
                        `Experience world-class hospitality and comfort at ${hotel.name}. Nestled in ${location}, this property offers top-tier amenities, refined dining, and prime access to scenic destinations.`}
                    </p>

                    {/* Quick feature highlights */}
                    <div className="row g-3 pt-3 border-top">
                      <div className="col-sm-6 col-md-3">
                        <div className="p-3 bg-light rounded-3 text-center h-100">
                          <Clock size={22} className="text-primary mb-2" />
                          <div className="text-muted small">Check-in</div>
                          <div className="fw-bold text-dark">{hotel.check_in_time || "12:00 PM"}</div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-3">
                        <div className="p-3 bg-light rounded-3 text-center h-100">
                          <Clock size={22} className="text-danger mb-2" />
                          <div className="text-muted small">Check-out</div>
                          <div className="fw-bold text-dark">{hotel.check_out_time || "11:00 AM"}</div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-3">
                        <div className="p-3 bg-light rounded-3 text-center h-100">
                          <Users size={22} className="text-success mb-2" />
                          <div className="text-muted small">Capacity</div>
                          <div className="fw-bold text-dark">{hotel.groupSize || "1–8 Guests"}</div>
                        </div>
                      </div>
                      <div className="col-sm-6 col-md-3">
                        <div className="p-3 bg-light rounded-3 text-center h-100">
                          <Globe size={22} className="text-warning mb-2" />
                          <div className="text-muted small">Languages</div>
                          <div className="fw-bold text-dark">English, Hindi</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
                      <h3 className="fw-bold mb-4 text-dark">Featured Amenities</h3>
                      <div className="row g-3">
                        {hotel.amenities.map((amenity) => (
                          <div key={amenity} className="col-sm-6 col-md-4">
                            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
                              <span className="text-primary">{amenityIcon(amenity)}</span>
                              <span className="fw-medium text-dark small">{amenity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Included / Excluded Details */}
                  <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
                    <h3 className="fw-bold mb-4 text-dark">Package Inclusions & Exclusions</h3>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <h5 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
                          <CheckCircle2 size={18} /> What's Included
                        </h5>
                        <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                          {(hotel.included || [
                            "Comfortable hotel accommodation",
                            "Daily delicious breakfast",
                            "High-speed Wi-Fi access",
                            "Access to hotel leisure amenities",
                          ]).map((item) => (
                            <li key={item} className="d-flex align-items-start gap-2 small text-muted">
                              <CheckCircle2 size={16} className="text-success flex-shrink-0 mt-1" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="col-md-6">
                        <h5 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2">
                          <XCircle size={18} /> Not Included
                        </h5>
                        <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                          {(hotel.excluded || [
                            "Personal expenses & gratuities",
                            "Airfare / train transfers",
                            "Optional excursions & entry fees",
                            "Travel insurance coverage",
                          ]).map((item) => (
                            <li key={item} className="d-flex align-items-start gap-2 small text-muted">
                              <XCircle size={16} className="text-danger flex-shrink-0 mt-1" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Free Cancellation Banner */}
                  <div className="p-4 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-4 d-flex align-items-center gap-3 mb-4">
                    <ShieldCheck size={32} className="text-success flex-shrink-0" />
                    <div>
                      <h6 className="fw-bold text-success mb-1">Risk-Free Booking</h6>
                      <p className="small text-muted mb-0">
                        {hotel.cancellation ||
                          "Free cancellation up to 24 hours before your check-in date. No hidden cancellation charges."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Sticky Booking Card (Taking EXACT price from card) */}
                <div className="col-lg-4">
                  <div className="sticky-top" style={{ top: "100px", zIndex: 10 }}>
                    <div className="card border-0 rounded-4 shadow-lg p-4 bg-white">
                      {/* Price Section */}
                      <div className="border-bottom pb-3 mb-3">
                        <div className="text-muted small fw-semibold text-uppercase mb-1">
                          Total Price Shown On Card
                        </div>
                        <div className="d-flex align-items-baseline gap-2">
                          <span className="fs-2 fw-bolder text-dark" style={{ letterSpacing: "-0.5px" }}>
                            {displayPrice}
                          </span>
                          {displayOriginalPrice && (
                            <span className="text-muted text-decoration-line-through small">
                              ₹{displayOriginalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                          <span className="text-muted small">/ night</span>
                        </div>
                        <div className="badge bg-success bg-opacity-10 text-success fw-semibold mt-2 px-2 py-1">
                          Taxes & fees included
                        </div>
                      </div>

                      {/* Summary points */}
                      <div className="d-flex flex-column gap-2 mb-4 text-muted small">
                        <div className="d-flex justify-content-between">
                          <span>Destination:</span>
                          <strong className="text-dark">{location}</strong>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Guest Rating:</span>
                          <strong className="text-dark">★ {hotel.rating.toFixed(1)} / 5</strong>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Duration:</span>
                          <strong className="text-dark">{hotel.duration || "2 Nights / 3 Days"}</strong>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-grid gap-2">
                        <a
                          href={hotel.link || mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary btn-lg rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                        >
                          Book Now for {displayPrice}
                        </a>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-light btn-lg rounded-3 fw-semibold border d-flex align-items-center justify-content-center gap-2 text-dark"
                        >
                          <Navigation size={18} className="text-primary" /> View Location on Map
                        </a>
                      </div>

                      {hotel.website && (
                        <div className="text-center mt-3 pt-3 border-top">
                          <a
                            href={hotel.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1 hover-primary"
                          >
                            <ExternalLink size={13} /> Visit Hotel Official Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* tp-tour-details-area-end */}
    </>
  );
};

export default TourDetails;
