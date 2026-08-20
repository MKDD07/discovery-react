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
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
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
    return <Wifi size={14} className="text-primary" />;
  if (n.includes("pool") || n.includes("swim"))
    return <Waves size={14} className="text-info" />;
  if (n.includes("gym") || n.includes("fitness"))
    return <Dumbbell size={14} className="text-warning" />;
  if (
    n.includes("restaurant") ||
    n.includes("breakfast") ||
    n.includes("food") ||
    n.includes("dining")
  )
    return <Utensils size={14} className="text-danger" />;
  if (n.includes("parking") || n.includes("car"))
    return <Car size={14} className="text-secondary" />;
  if (
    n.includes("airport") ||
    n.includes("transfer") ||
    n.includes("shuttle")
  )
    return <Plane size={14} className="text-primary" />;
  if (n.includes("room service") || n.includes("concierge"))
    return <ConciergeBell size={14} className="text-success" />;
  if (
    n.includes("spa") ||
    n.includes("massage") ||
    n.includes("wellness")
  )
    return <Sparkles size={14} className="text-warning" />;
  return <BedDouble size={14} className="text-primary" />;
};

/* ── Star row ────────────────────────────────────────────────────────── */
const StarRow: React.FC<{ rating: number; size?: number }> = ({
  rating,
  size = 13,
}) => (
  <span className="d-inline-flex gap-1 align-items-center">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
        style={{ color: s <= Math.round(rating) ? "#f59e0b" : "#d1d5db" }}
      />
    ))}
  </span>
);

/* ── Skeleton loader ────────────────────────────────────────────────── */
const TourDetailSkeleton: React.FC = () => (
  <div className="py-4">
    <div
      className="bg-light rounded-4 mb-4"
      style={{ height: "380px", animation: "pulse 1.5s infinite" }}
    />
    <div
      className="bg-light rounded-3 mb-3"
      style={{ height: "28px", width: "45%", animation: "pulse 1.5s infinite" }}
    />
    <div
      className="bg-light rounded-2 mb-4"
      style={{ height: "18px", width: "30%", animation: "pulse 1.5s infinite" }}
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
  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setActiveImg(0);

    // Initial instant seed from card
    if (initialHotel) {
      setHotel({
        name: initialHotel.name || tourName,
        rating: initialHotel.rating || 4.5,
        reviews: initialHotel.reviews || 0,
        price: cardPrice || initialHotel.price || "₹8,999",
        rawPrice: initialHotel.rawPrice || 8999,
        originalPrice: cardOriginalPrice || initialHotel.originalPrice,
        link: initialHotel.link || "#",
        thumbnail: initialHotel.thumbnail || "",
        images:
          initialHotel.images ||
          (initialHotel.thumbnail ? [initialHotel.thumbnail] : []),
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
          "Complimentary high-speed Wi-Fi",
          "Swimming pool & leisure area access",
          "Welcome beverage on arrival",
        ],
        excluded: [
          "Flight & train fares",
          "Personal expenses & mini bar charges",
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
          setHotel((prev) => ({
            ...detail,
            price: cardPrice || (prev?.price ?? detail.price),
            originalPrice:
              cardOriginalPrice ||
              (prev?.originalPrice ?? detail.originalPrice),
            rawPrice: prev?.rawPrice ?? detail.rawPrice,
          }));
        } else if (!initialHotel) {
          setHotel({
            name: tourName,
            rating: 4.8,
            reviews: 142,
            price: cardPrice || "₹8,999",
            rawPrice: 8999,
            originalPrice: cardOriginalPrice || 11999,
            link: `https://www.google.com/travel/hotels?q=${encodeURIComponent(
              tourName
            )}`,
            thumbnail: "",
            images: [],
            amenities: [
              "Free Wi-Fi",
              "Swimming Pool",
              "Restaurant",
              "Spa",
              "Free Parking",
            ],
            duration: "2 Nights / 3 Days",
            groupSize: "1 – 8 guests",
            languages: ["English", "Hindi"],
            cancellation: "Free cancellation up to 24 hours before check-in",
            included: [
              "Accommodation",
              "Breakfast Included",
              "Free High-Speed Wi-Fi",
              "Pool Access",
            ],
            excluded: [
              "Personal expenses",
              "Travel insurance",
              "Additional room amenities",
            ],
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [tourName, location, cardPrice, cardOriginalPrice, initialHotel]);

  const displayPrice = cardPrice || hotel?.price || "₹8,999";
  const displayOriginalPrice = cardOriginalPrice || hotel?.originalPrice;
  const images =
    hotel?.images && hotel.images.length > 0
      ? hotel.images
      : hotel?.thumbnail
      ? [hotel.thumbnail]
      : [];

  const mapsUrl = hotel?.gps_coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${hotel.gps_coordinates.latitude},${hotel.gps_coordinates.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        (hotel?.name || tourName) + " " + location
      )}`;

  return (
    <>
      {/* tp-tour-details-area-start */}
      <div className="tp-tour-details-area pt-20 pb-70">
        <div className="container container-1350">
          {loading && !hotel && <TourDetailSkeleton />}

          {hotel && (
            <div className="tp-tour-details">
              {/* ── Top Header Section ────────────────────────────────── */}
              <div className="tp-tour-details-top mb-25 pb-20 border-bottom">
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-10">
                      <span className="tp-section-subtitle mb-0 text-uppercase fw-600" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                        <i className="fa-solid fa-sparkles me-1 text-primary"></i> {hotel.type || "Curated Stay"}
                      </span>
                      <span className="text-muted small">•</span>
                      <span className="text-muted small d-inline-flex align-items-center gap-1">
                        <MapPin size={13} className="text-danger" /> {location}
                      </span>
                    </div>

                    {/* Small sized clean title */}
                    <h2
                      className="tp-tour-title text-dark mb-10 fw-700"
                      style={{ fontSize: "clamp(19px, 2.2vw, 24px)", lineHeight: 1.3 }}
                    >
                      {hotel.name}
                    </h2>

                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <StarRow rating={hotel.rating} size={13} />
                      <span className="fw-700 text-dark small">
                        {hotel.rating.toFixed(1)}
                      </span>
                      <span className="text-muted small">
                        ({hotel.reviews} reviews)
                      </span>
                      <span className="text-muted small">•</span>
                      <span className="text-muted small d-inline-flex align-items-center gap-1">
                        <Clock size={13} /> {hotel.duration || "2N / 3D"}
                      </span>
                      <span className="text-muted small">•</span>
                      <span className="text-muted small d-inline-flex align-items-center gap-1">
                        <Users size={13} /> {hotel.groupSize || "1–8 Guests"}
                      </span>
                    </div>
                  </div>

                  {/* Actions buttons using theme styles */}
                  <div className="col-lg-4 mt-3 mt-lg-0 text-lg-end">
                    <div className="d-inline-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="tp-btn-sm bg-light text-dark fw-500 tp-ff-inter border shadow-none d-inline-flex align-items-center gap-1"
                        onClick={() => {
                          if (navigator.share) {
                            navigator
                              .share({
                                title: hotel.name,
                                url: window.location.href,
                              })
                              .catch(() => {});
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link copied!");
                          }
                        }}
                      >
                        <Share2 size={13} /> Share
                      </button>
                      <button
                        type="button"
                        className={`tp-btn-sm fw-500 tp-ff-inter shadow-none d-inline-flex align-items-center gap-1 ${
                          wishlist
                            ? "bg-danger text-white border-danger"
                            : "bg-light text-dark border"
                        }`}
                        onClick={() => setWishlist(!wishlist)}
                      >
                        <Heart
                          size={13}
                          fill={wishlist ? "currentColor" : "none"}
                        />
                        {wishlist ? "Saved" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Theme Gallery Showcase ────────────────────────────── */}
              {images.length > 0 && (
                <div className="tp-tour-gallery mb-35">
                  <div className="row g-2">
                    <div className={images.length > 1 ? "col-lg-8" : "col-12"}>
                      <div
                        className="tp-tour-thumb p-relative fix rounded-3 overflow-hidden"
                        style={{ height: "360px", background: "#f5f6f8" }}
                      >
                        <img
                          src={images[activeImg]}
                          alt={hotel.name}
                          className="w-100 h-100 object-fit-cover"
                        />
                        {images.length > 1 && (
                          <>
                            <button
                              type="button"
                              className="position-absolute start-0 top-50 translate-middle-y ms-3 btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center bg-opacity-75 border-0"
                              style={{ width: "36px", height: "36px" }}
                              onClick={() =>
                                setActiveImg((p) =>
                                  p === 0 ? images.length - 1 : p - 1
                                )
                              }
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <button
                              type="button"
                              className="position-absolute end-0 top-50 translate-middle-y me-3 btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center bg-opacity-75 border-0"
                              style={{ width: "36px", height: "36px" }}
                              onClick={() =>
                                setActiveImg((p) =>
                                  p === images.length - 1 ? 0 : p + 1
                                )
                              }
                            >
                              <ChevronRight size={18} />
                            </button>
                          </>
                        )}
                        <span className="position-absolute bottom-0 end-0 m-3 badge bg-dark bg-opacity-75 px-3 py-1 font-monospace small rounded-pill">
                          {activeImg + 1} / {images.length}
                        </span>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="position-absolute bottom-0 start-0 m-3 tp-btn-sm fw-500 tp-ff-inter d-inline-flex align-items-center gap-1 bg-white text-dark shadow-sm"
                          style={{ fontSize: "12px", padding: "4px 12px" }}
                        >
                          <Navigation size={12} className="text-primary" /> Map View
                        </a>
                      </div>
                    </div>

                    {images.length > 1 && (
                      <div className="col-lg-4 d-none d-lg-block">
                        <div className="row g-2 h-100">
                          {images.slice(1, 5).map((img, idx) => {
                            const realIdx = idx + 1;
                            const isLast = idx === 3 && images.length > 5;
                            return (
                              <div
                                key={realIdx}
                                className="col-6"
                                style={{ height: "176px" }}
                              >
                                <div
                                  className="position-relative h-100 rounded-3 overflow-hidden cursor-pointer"
                                  style={{
                                    border:
                                      activeImg === realIdx
                                        ? "2px solid var(--tp-theme-primary, #2b6bf3)"
                                        : "1px solid #eee",
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
                                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-60 d-flex align-items-center justify-content-center text-white fw-bold small">
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

              {/* ── Main Layout Content + Sticky Booking Box ──────────── */}
              <div className="row g-4">
                {/* Left: Tour Details Content */}
                <div className="col-lg-8">
                  {/* Overview Card */}
                  <div className="bg-white p-4 rounded-3 border mb-25">
                    <h4
                      className="fw-700 mb-15 text-dark d-flex align-items-center gap-2"
                      style={{ fontSize: "17px" }}
                    >
                      <Sparkles size={16} className="text-primary" /> Stay Overview
                    </h4>
                    <p
                      className="text-muted lh-base mb-20"
                      style={{ fontSize: "14.5px" }}
                    >
                      {hotel.description ||
                        `Discover an unforgettable retreat at ${hotel.name}. Positioned strategically in ${location}, this property blends modern comfort with world-class hospitality and close access to key attractions.`}
                    </p>

                    {/* Quick Info Grid */}
                    <div className="row g-2 pt-15 border-top">
                      <div className="col-6 col-md-3">
                        <div className="p-3 bg-light rounded-2 text-center">
                          <Clock size={16} className="text-primary mb-1" />
                          <div className="text-muted" style={{ fontSize: "11px" }}>
                            Check-in
                          </div>
                          <div className="fw-600 text-dark small">
                            {hotel.check_in_time || "12:00 PM"}
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="p-3 bg-light rounded-2 text-center">
                          <Clock size={16} className="text-danger mb-1" />
                          <div className="text-muted" style={{ fontSize: "11px" }}>
                            Check-out
                          </div>
                          <div className="fw-600 text-dark small">
                            {hotel.check_out_time || "11:00 AM"}
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="p-3 bg-light rounded-2 text-center">
                          <Users size={16} className="text-success mb-1" />
                          <div className="text-muted" style={{ fontSize: "11px" }}>
                            Capacity
                          </div>
                          <div className="fw-600 text-dark small">
                            {hotel.groupSize || "1–8 Guests"}
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="p-3 bg-light rounded-2 text-center">
                          <Globe size={16} className="text-warning mb-1" />
                          <div className="text-muted" style={{ fontSize: "11px" }}>
                            Languages
                          </div>
                          <div className="fw-600 text-dark small">
                            English, Hindi
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="bg-white p-4 rounded-3 border mb-25">
                      <h4
                        className="fw-700 mb-15 text-dark"
                        style={{ fontSize: "17px" }}
                      >
                        Popular Amenities
                      </h4>
                      <div className="row g-2">
                        {hotel.amenities.map((amenity) => (
                          <div key={amenity} className="col-sm-6 col-md-4">
                            <div className="d-flex align-items-center gap-2 p-2 px-3 bg-light rounded-2">
                              {amenityIcon(amenity)}
                              <span
                                className="fw-500 text-dark text-truncate"
                                style={{ fontSize: "13px" }}
                              >
                                {amenity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Included / Excluded Details */}
                  <div className="bg-white p-4 rounded-3 border mb-25">
                    <h4
                      className="fw-700 mb-20 text-dark"
                      style={{ fontSize: "17px" }}
                    >
                      Inclusions & Exclusions
                    </h4>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded-2 h-100">
                          <h6
                            className="fw-700 text-success mb-10 d-flex align-items-center gap-1"
                            style={{ fontSize: "14px" }}
                          >
                            <CheckCircle2 size={15} /> Included in Plan
                          </h6>
                          <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                            {(
                              hotel.included || [
                                "Comfortable room stay",
                                "Daily complimentary breakfast",
                                "High-speed Wi-Fi",
                                "Access to hotel amenities",
                              ]
                            ).map((item) => (
                              <li
                                key={item}
                                className="d-flex align-items-start gap-2 text-muted"
                                style={{ fontSize: "13px" }}
                              >
                                <CheckCircle2
                                  size={14}
                                  className="text-success flex-shrink-0 mt-1"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded-2 h-100">
                          <h6
                            className="fw-700 text-danger mb-10 d-flex align-items-center gap-1"
                            style={{ fontSize: "14px" }}
                          >
                            <XCircle size={15} /> Not Included
                          </h6>
                          <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                            {(
                              hotel.excluded || [
                                "Flight / transport charges",
                                "Personal expenses & shopping",
                                "Optional activity charges",
                                "Insurance cover",
                              ]
                            ).map((item) => (
                              <li
                                key={item}
                                className="d-flex align-items-start gap-2 text-muted"
                                style={{ fontSize: "13px" }}
                              >
                                <XCircle
                                  size={14}
                                  className="text-danger flex-shrink-0 mt-1"
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Free Cancellation Banner */}
                  <div className="p-3 px-4 bg-light border border-success border-opacity-25 rounded-3 d-flex align-items-center gap-3 mb-25">
                    <ShieldCheck
                      size={24}
                      className="text-success flex-shrink-0"
                    />
                    <div>
                      <div
                        className="fw-700 text-success mb-1"
                        style={{ fontSize: "14px" }}
                      >
                        Free Cancellation
                      </div>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "12.5px" }}
                      >
                        {hotel.cancellation ||
                          "Free cancellation up to 24 hours before your check-in date. No hidden fees."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Sticky Booking Box */}
                <div className="col-lg-4">
                  <div
                    className="sticky-top"
                    style={{ top: "90px", zIndex: 5 }}
                  >
                    <div className="bg-white rounded-3 border p-4 shadow-sm">
                      {/* Price Section */}
                      <div className="border-bottom pb-15 mb-15">
                        <div
                          className="tp-tour-prefix text-muted fw-600 mb-1"
                          style={{ fontSize: "12px" }}
                        >
                          Price shown on card
                        </div>
                        <div className="d-flex align-items-baseline gap-2">
                          <span
                            className="tp-tour-new-price fw-800 text-dark"
                            style={{ fontSize: "24px" }}
                          >
                            {displayPrice}
                          </span>
                          {displayOriginalPrice && (
                            <span className="tp-tour-old-price text-muted text-decoration-line-through small">
                              ₹{displayOriginalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                          <span className="tp-tour-suffix text-muted small">
                            / person
                          </span>
                        </div>
                        <div
                          className="badge bg-success bg-opacity-10 text-success fw-600 mt-2 px-2 py-1"
                          style={{ fontSize: "11px" }}
                        >
                          Best Price Guaranteed
                        </div>
                      </div>

                      {/* Info Summary */}
                      <div
                        className="d-flex flex-column gap-2 mb-20 text-muted"
                        style={{ fontSize: "13px" }}
                      >
                        <div className="d-flex justify-content-between">
                          <span>Location:</span>
                          <strong className="text-dark">{location}</strong>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Rating:</span>
                          <strong className="text-dark">
                            ★ {hotel.rating.toFixed(1)} / 5
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Stay Length:</span>
                          <strong className="text-dark">
                            {hotel.duration || "2 Nights / 3 Days"}
                          </strong>
                        </div>
                      </div>

                      {/* Theme Buttons */}
                      <div className="d-grid gap-2">
                        <a
                          href={hotel.link || mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="tp-btn fw-600 tp-ff-inter w-100 text-center text-white"
                          style={{ padding: "12px 20px" }}
                        >
                          Book For {displayPrice}
                        </a>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="tp-btn-sm fw-500 tp-ff-inter bg-light text-dark border w-100 text-center d-flex align-items-center justify-content-center gap-1"
                          style={{ padding: "10px 20px" }}
                        >
                          <Navigation size={13} className="text-primary" /> View
                          on Google Maps
                        </a>
                      </div>

                      {hotel.website && (
                        <div className="text-center mt-15 pt-15 border-top">
                          <a
                            href={hotel.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1 hover-primary"
                            style={{ fontSize: "12px" }}
                          >
                            <ExternalLink size={12} /> Visit Official Website
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
