import React, { useEffect, useState, useMemo } from "react";
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
  Calendar as CalendarIcon,
  Plus,
  Minus,
  Receipt,
  CreditCard,
  Percent,
  X,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation as SwiperNav, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import SerpAPI, { SerpHotelDetail, resizeImage } from "../../../services/serpApi";
import Button from "../../snippets/button";

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
    return <Wifi size={15} className="tp-stay-amenity-icon" />;
  if (n.includes("pool") || n.includes("swim"))
    return <Waves size={15} className="tp-stay-amenity-icon" />;
  if (n.includes("gym") || n.includes("fitness"))
    return <Dumbbell size={15} className="tp-stay-amenity-icon" />;
  if (
    n.includes("restaurant") ||
    n.includes("breakfast") ||
    n.includes("food") ||
    n.includes("dining")
  )
    return <Utensils size={15} className="tp-stay-amenity-icon" />;
  if (n.includes("parking") || n.includes("car"))
    return <Car size={15} className="tp-stay-amenity-icon" />;
  if (
    n.includes("airport") ||
    n.includes("transfer") ||
    n.includes("shuttle")
  )
    return <Plane size={15} className="tp-stay-amenity-icon" />;
  if (n.includes("room service") || n.includes("concierge"))
    return <ConciergeBell size={15} className="tp-stay-amenity-icon" />;
  if (
    n.includes("spa") ||
    n.includes("massage") ||
    n.includes("wellness")
  )
    return <Sparkles size={15} className="tp-stay-amenity-icon" />;
  return <BedDouble size={15} className="tp-stay-amenity-icon" />;
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

  // Gallery Swiper Modal State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [modalActiveIndex, setModalActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (isGalleryModalOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsGalleryModalOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isGalleryModalOpen]);

  // Real-time booking configuration state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultCheckIn = tomorrow.toISOString().split("T")[0];

  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  const defaultCheckOut = threeDaysLater.toISOString().split("T")[0];

  const [checkInDate, setCheckInDate] = useState<string>(defaultCheckIn);
  const [checkOutDate, setCheckOutDate] = useState<string>(defaultCheckOut);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setActiveImg(0);

    // Initial seed from card
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

  // Extract base unit price from cardPrice or hotel data
  const basePricePerPerson = useMemo(() => {
    if (hotel?.rawPrice && hotel.rawPrice > 0) return hotel.rawPrice;
    if (cardPrice) {
      const parsed = parseInt(cardPrice.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 3151;
  }, [cardPrice, hotel?.rawPrice]);

  // Calculate number of nights
  const numberOfNights = useMemo(() => {
    try {
      const d1 = new Date(checkInDate);
      const d2 = new Date(checkOutDate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 2;
    }
  }, [checkInDate, checkOutDate]);

  // Real-time calculation with breakdown & GST (18% GST standard in hospitality)
  const calculation = useMemo(() => {
    const adultRate = basePricePerPerson;
    const childRate = Math.round(basePricePerPerson * 0.5); // Children at 50%
    const perNightSubtotal = adults * adultRate + children * childRate;
    const staySubtotal = perNightSubtotal * numberOfNights;
    const discount = Math.round(staySubtotal * 0.1); // 10% instant promo discount
    const discountedSubtotal = staySubtotal - discount;
    const gstRate = 0.18; // 18% GST
    const gstAmount = Math.round(discountedSubtotal * gstRate);
    const finalTotal = discountedSubtotal + gstAmount;

    return {
      adultRate,
      childRate,
      staySubtotal,
      discount,
      discountedSubtotal,
      gstAmount,
      finalTotal,
    };
  }, [basePricePerPerson, adults, children, numberOfNights]);

  // Simulate quick real-time ajax recalculation effect
  const handleDateOrGuestChange = () => {
    setIsUpdatingPrice(true);
    setTimeout(() => {
      setIsUpdatingPrice(false);
    }, 200);
  };

  const displayPrice = cardPrice || hotel?.price || `₹${basePricePerPerson.toLocaleString("en-IN")}`;
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
                      <span
                        className="tp-section-subtitle mb-0 text-uppercase fw-600"
                        style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                      >
                        <i className="fa-solid fa-sparkles me-1 text-primary"></i>{" "}
                        {hotel.type || "Curated Stay"}
                      </span>
                      <span className="text-muted small">•</span>
                      <span className="text-muted small d-inline-flex align-items-center gap-1">
                        <MapPin size={13} className="text-danger" /> {location}
                      </span>
                    </div>

                    {/* Small clean title */}
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
                        <Clock size={13} /> {numberOfNights} Nights / {numberOfNights + 1} Days
                      </span>
                      <span className="text-muted small">•</span>
                      <span className="text-muted small d-inline-flex align-items-center gap-1">
                        <Users size={13} /> {adults + children} Guests Selected
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
                <div className="tp-tour-gallery tp-tour-gallery-premium mb-35">
                  <div className="row g-3">
                    <div className={images.length > 1 ? "col-lg-8" : "col-12"}>
                      <div
                        className="tp-tour-gallery-stage p-relative cursor-pointer"
                        onClick={() => {
                          setModalActiveIndex(activeImg);
                          setIsGalleryModalOpen(true);
                        }}
                      >
                        <img
                          src={resizeImage(images[activeImg], 1000)}
                          alt={hotel.name}
                          key={activeImg}
                        />
                        {images.length > 1 && (
                          <>
                            <button
                              type="button"
                              className="tp-tour-gallery-btn position-absolute start-0 top-50 translate-middle-y ms-3"
                              aria-label="Previous image"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveImg((p) =>
                                  p === 0 ? images.length - 1 : p - 1
                                );
                              }}
                            >
                              <ChevronLeft size={20} />
                            </button>
                            <button
                              type="button"
                              className="tp-tour-gallery-btn position-absolute end-0 top-50 translate-middle-y me-3"
                              aria-label="Next image"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveImg((p) =>
                                  p === images.length - 1 ? 0 : p + 1
                                );
                              }}
                            >
                              <ChevronRight size={20} />
                            </button>
                          </>
                        )}
                        <span className="tp-tour-gallery-counter">
                          {activeImg + 1} / {images.length}
                        </span>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="tp-tour-gallery-map-badge"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Navigation size={13} style={{ color: "var(--tp-theme-1)" }} /> Map View
                        </a>
                      </div>
                    </div>

                    {images.length > 1 && (
                      <div className="col-lg-4 d-none d-lg-block">
                        <div className="row g-3 tp-tour-gallery-thumb-grid">
                          {images.slice(1, 5).map((img, idx) => {
                            const realIdx = idx + 1;
                            const isLast = idx === 3 && images.length > 5;
                            return (
                              <div
                                key={realIdx}
                                className="col-6"
                              >
                                <div
                                  className={`tp-tour-gallery-thumb-item ${
                                    activeImg === realIdx ? "is-active" : ""
                                  }`}
                                  onClick={() => {
                                    if (isLast) {
                                      setModalActiveIndex(realIdx);
                                      setIsGalleryModalOpen(true);
                                    } else {
                                      setActiveImg(realIdx);
                                    }
                                  }}
                                >
                                  <img
                                    src={resizeImage(img, 400)}
                                    alt={`Hotel view ${realIdx}`}
                                  />
                                  {isLast && (
                                    <div
                                      className="tp-tour-gallery-more-overlay"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setModalActiveIndex(realIdx);
                                        setIsGalleryModalOpen(true);
                                      }}
                                    >
                                      <span>+{images.length - 5}</span>
                                      <span style={{ fontSize: "11px", opacity: 0.85 }}>More Photos</span>
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

              {/* ── Swiper Fullscreen Gallery Lightbox Modal ─────────── */}
              {isGalleryModalOpen && (
                <div
                  className="tp-gallery-modal-overlay"
                  onClick={() => setIsGalleryModalOpen(false)}
                >
                  {/* Modal Header */}
                  <div
                    className="tp-gallery-modal-header"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <h4 className="tp-gallery-modal-title">{hotel.name}</h4>
                      <span className="tp-gallery-modal-counter">
                        {modalActiveIndex + 1} / {images.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="tp-gallery-modal-close"
                      aria-label="Close modal"
                      onClick={() => setIsGalleryModalOpen(false)}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Modal Body with Swiper */}
                  <div
                    className="tp-gallery-modal-body"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Swiper
                      modules={[SwiperNav, Keyboard]}
                      initialSlide={modalActiveIndex}
                      spaceBetween={30}
                      slidesPerView={1}
                      keyboard={{ enabled: true }}
                      navigation={{
                        prevEl: ".tp-gallery-modal-arrow-prev",
                        nextEl: ".tp-gallery-modal-arrow-next",
                      }}
                      onSwiper={(s) => setSwiperInstance(s)}
                      onSlideChange={(swiper) => {
                        setModalActiveIndex(swiper.activeIndex);
                        setActiveImg(swiper.activeIndex);
                      }}
                      className="tp-gallery-swiper"
                    >
                      {images.map((img, i) => (
                        <SwiperSlide key={i}>
                          <img
                            src={resizeImage(img, 1000)}
                            alt={`${hotel.name} - photo ${i + 1}`}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Modal Navigation Arrows */}
                    <button
                      type="button"
                      className="tp-gallery-modal-arrow-prev"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      type="button"
                      className="tp-gallery-modal-arrow-next"
                      aria-label="Next slide"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>

                  {/* Modal Bottom Thumbnail Strip */}
                  <div
                    className="tp-gallery-modal-thumbs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className={`tp-gallery-modal-thumb-strip ${
                          modalActiveIndex === i ? "is-active" : ""
                        }`}
                        onClick={() => {
                          setModalActiveIndex(i);
                          setActiveImg(i);
                          swiperInstance?.slideTo(i);
                        }}
                      >
                        <img src={resizeImage(img, 200)} alt={`Thumb ${i + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Main Layout Content + Interactive Booking Sidebar ─── */}
              <div className="row g-4">
                {/* Left: Tour Details Content */}
                <div className="col-lg-7">
                  {/* Overview Card */}
                  <div className="tp-stay-section-card">
                    <h4 className="tp-stay-section-title">
                      <Sparkles size={16} className="text-dark opacity-75" /> Stay Overview
                    </h4>
                    <p className="tp-stay-desc">
                      {hotel.description ||
                        `Discover an unforgettable retreat at ${hotel.name}. Positioned strategically in ${location}, this property blends modern comfort with world-class hospitality and close access to key attractions.`}
                    </p>

                    {/* Quick Info Grid */}
                    <div className="tp-stay-info-grid">
                      <div className="tp-stay-info-item">
                        <Clock size={16} className="tp-stay-info-icon" />
                        <div className="tp-stay-info-label">Check-in</div>
                        <div className="tp-stay-info-value">
                          {hotel.check_in_time || "12:00 PM"}
                        </div>
                      </div>
                      <div className="tp-stay-info-item">
                        <Clock size={16} className="tp-stay-info-icon" />
                        <div className="tp-stay-info-label">Check-out</div>
                        <div className="tp-stay-info-value">
                          {hotel.check_out_time || "11:00 AM"}
                        </div>
                      </div>
                      <div className="tp-stay-info-item">
                        <Users size={16} className="tp-stay-info-icon" />
                        <div className="tp-stay-info-label">Guests</div>
                        <div className="tp-stay-info-value">
                          {adults} Ad, {children} Ch
                        </div>
                      </div>
                      <div className="tp-stay-info-item">
                        <Globe size={16} className="tp-stay-info-icon" />
                        <div className="tp-stay-info-label">Languages</div>
                        <div className="tp-stay-info-value">
                          English, Hindi
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Luxury Amenities Grid */}
                  <div className="tp-stay-section-card">
                    <h4 className="tp-stay-section-title">
                      Featured Amenities & Highlights
                    </h4>
                    <div className="tp-stay-amenity-grid">
                      {(hotel.amenities && hotel.amenities.length > 0
                        ? hotel.amenities
                        : [
                            "High-Speed Wi-Fi",
                            "Infinity Swimming Pool",
                            "Fine Dining & Breakfast",
                            "Luxury Spa & Wellness",
                            "24/7 Room Service",
                            "Valet Parking",
                            "Fitness Center",
                            "Airport Transfers",
                            "Air Conditioning",
                          ]
                      ).map((amenity) => (
                        <div key={amenity} className="tp-stay-amenity-item">
                          {amenityIcon(amenity)}
                          <span className="tp-stay-amenity-text">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Included / Excluded Details */}
                  <div className="tp-stay-section-card">
                    <h4 className="tp-stay-section-title">
                      Inclusions & Exclusions
                    </h4>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="tp-stay-plan-box">
                          <h6 className="tp-stay-plan-title text-dark">
                            <CheckCircle2 size={15} className="text-dark opacity-75" /> Included in Plan
                          </h6>
                          <ul className="tp-stay-plan-list">
                            {(
                              hotel.included || [
                                "Comfortable room stay",
                                "Daily complimentary breakfast",
                                "High-speed Wi-Fi",
                                "Access to hotel amenities",
                              ]
                            ).map((item) => (
                              <li key={item} className="tp-stay-plan-item">
                                <CheckCircle2 size={14} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="tp-stay-plan-box">
                          <h6 className="tp-stay-plan-title text-dark">
                            <XCircle size={15} className="text-dark opacity-75" /> Not Included
                          </h6>
                          <ul className="tp-stay-plan-list">
                            {(
                              hotel.excluded || [
                                "Flight / transport charges",
                                "Personal expenses & shopping",
                                "Optional activity charges",
                                "Insurance cover",
                              ]
                            ).map((item) => (
                              <li key={item} className="tp-stay-plan-item">
                                <XCircle size={14} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Free Cancellation Banner */}
                  <div className="tp-stay-policy-banner">
                    <ShieldCheck size={22} className="text-dark opacity-75 flex-shrink-0" />
                    <div>
                      <div className="tp-stay-policy-title">
                        Free Cancellation
                      </div>
                      <p className="tp-stay-policy-desc">
                        {hotel.cancellation ||
                          "Free cancellation up to 24 hours before your check-in date. No hidden fees."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Real-time Interactive Booking & Price Calculation Sidebar */}
                <div className="col-lg-5">
                  <div className="tp-stay-sidebar-sticky">
                    <div className="tp-stay-booking-card">
                      {/* Price Section */}
                      <div className="tp-stay-price-header">
                        <div className="tp-stay-price-label">
                          Price shown on card
                        </div>
                        <div className="d-flex align-items-baseline gap-2">
                          <span className="tp-stay-new-price">
                            {displayPrice}
                          </span>
                          {displayOriginalPrice && (
                            <span className="tp-stay-old-price">
                              ₹{displayOriginalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                          <span className="tp-stay-price-suffix">
                            / adult / night
                          </span>
                        </div>
                        <div className="tp-stay-guarantee-pill">
                          Best Price Guaranteed • 10% Off Applied
                        </div>
                      </div>

                      {/* ── Real-Time Interactive Form ────────────────── */}
                      <div className="tp-stay-form-group">
                        {/* Dates Selector */}
                        <div className="row g-2 mb-3">
                          <div className="col-6">
                            <label className="tp-stay-input-label">
                              <CalendarIcon size={12} className="opacity-75" /> Check-In
                            </label>
                            <input
                              type="date"
                              className="tp-stay-date-input"
                              value={checkInDate}
                              min={new Date().toISOString().split("T")[0]}
                              onChange={(e) => {
                                setCheckInDate(e.target.value);
                                handleDateOrGuestChange();
                              }}
                            />
                          </div>
                          <div className="col-6">
                            <label className="tp-stay-input-label">
                              <CalendarIcon size={12} className="opacity-75" /> Check-Out
                            </label>
                            <input
                              type="date"
                              className="tp-stay-date-input"
                              value={checkOutDate}
                              min={checkInDate}
                              onChange={(e) => {
                                setCheckOutDate(e.target.value);
                                handleDateOrGuestChange();
                              }}
                            />
                          </div>
                        </div>

                        {/* Guests Counter Selector */}
                        <div className="tp-stay-guest-counter-box">
                          {/* Adults */}
                          <div className="tp-stay-guest-row mb-2">
                            <div>
                              <div className="fw-semibold text-dark small">
                                Adults (12+ yrs)
                              </div>
                              <div className="text-muted" style={{ fontSize: "11px" }}>
                                ₹{calculation.adultRate.toLocaleString("en-IN")} / night
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                type="button"
                                className="tp-stay-counter-btn"
                                disabled={adults <= 1}
                                onClick={() => {
                                  setAdults((a) => Math.max(1, a - 1));
                                  handleDateOrGuestChange();
                                }}
                              >
                                <Minus size={13} />
                              </button>
                              <span className="fw-bold text-dark small" style={{ minWidth: "18px", textAlign: "center" }}>
                                {adults}
                              </span>
                              <button
                                type="button"
                                className="tp-stay-counter-btn"
                                disabled={adults >= 10}
                                onClick={() => {
                                  setAdults((a) => a + 1);
                                  handleDateOrGuestChange();
                                }}
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="tp-stay-guest-row pt-2 border-top">
                            <div>
                              <div className="fw-semibold text-dark small">
                                Children (2-11 yrs)
                              </div>
                              <div className="text-muted" style={{ fontSize: "11px" }}>
                                50% Off (₹{calculation.childRate.toLocaleString("en-IN")})
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                type="button"
                                className="tp-stay-counter-btn"
                                disabled={children <= 0}
                                onClick={() => {
                                  setChildren((c) => Math.max(0, c - 1));
                                  handleDateOrGuestChange();
                                }}
                              >
                                <Minus size={13} />
                              </button>
                              <span className="fw-bold text-dark small" style={{ minWidth: "18px", textAlign: "center" }}>
                                {children}
                              </span>
                              <button
                                type="button"
                                className="tp-stay-counter-btn"
                                disabled={children >= 6}
                                onClick={() => {
                                  setChildren((c) => c + 1);
                                  handleDateOrGuestChange();
                                }}
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* ── Real-Time Dynamic Price Breakdown Table ──── */}
                        <div
                          className="tp-stay-breakdown-card"
                          style={{
                            opacity: isUpdatingPrice ? 0.6 : 1,
                            transition: "opacity 0.2s ease",
                          }}
                        >
                          <div className="tp-stay-breakdown-header">
                            <span className="d-flex align-items-center gap-1">
                              <Receipt size={14} className="opacity-75" /> Fare Breakdown
                            </span>
                            <span className="badge bg-dark bg-opacity-10 text-dark" style={{ fontSize: "10px" }}>
                              {numberOfNights} {numberOfNights === 1 ? "Night" : "Nights"}
                            </span>
                          </div>

                          <div className="d-flex flex-column gap-1">
                            <div className="tp-stay-breakdown-row">
                              <span>
                                Adults ({adults} × ₹{calculation.adultRate.toLocaleString("en-IN")}):
                              </span>
                              <span className="text-dark fw-medium">₹{(adults * calculation.adultRate * numberOfNights).toLocaleString("en-IN")}</span>
                            </div>

                            {children > 0 && (
                              <div className="tp-stay-breakdown-row">
                                <span>
                                  Children ({children} × ₹{calculation.childRate.toLocaleString("en-IN")}):
                                </span>
                                <span className="text-dark fw-medium">₹{(children * calculation.childRate * numberOfNights).toLocaleString("en-IN")}</span>
                              </div>
                            )}

                            <div className="tp-stay-breakdown-row text-success">
                              <span className="d-flex align-items-center gap-1">
                                <Percent size={12} /> Special Promo Discount (10%):
                              </span>
                              <span className="fw-semibold">-₹{calculation.discount.toLocaleString("en-IN")}</span>
                            </div>

                            <div className="tp-stay-breakdown-row">
                              <span>Applicable GST (18%):</span>
                              <span className="text-dark fw-medium">₹{calculation.gstAmount.toLocaleString("en-IN")}</span>
                            </div>

                            {/* Total Payable */}
                            <div className="tp-stay-breakdown-total">
                              <span>Total Amount:</span>
                              <span className="fs-6 text-dark">₹{calculation.finalTotal.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Universal Action Buttons */}
                      <div className="d-grid gap-2">
                        <Button
                          variant="background"
                          size="md"
                          fullWidth
                          href={hotel.link || mapsUrl}
                          target="_blank"
                          icon={<CreditCard size={15} />}
                          iconPosition="left"
                        >
                          Book Now for ₹{calculation.finalTotal.toLocaleString("en-IN")}
                        </Button>
                        <Button
                          variant="stroke"
                          size="md"
                          fullWidth
                          href={mapsUrl}
                          target="_blank"
                          icon={<Navigation size={13} />}
                          iconPosition="left"
                        >
                          View on Google Maps
                        </Button>
                      </div>

                      {hotel.website && (
                        <div className="text-center mt-3 pt-3 border-top">
                          <a
                            href={hotel.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1 hover-primary"
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
