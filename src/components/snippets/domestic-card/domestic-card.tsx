import React, { useState } from "react";
import { SerpHotelResult } from "../../../services/serpApi";

export interface DomesticCardProps {
  hotel: SerpHotelResult;
  location?: string;
}

export const DomesticCard: React.FC<DomesticCardProps> = ({ hotel, location = "Bangkok" }) => {
  const [showGallery, setShowGallery] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Available image candidate list
  const candidates: string[] = hotel.images && hotel.images.length > 0
    ? hotel.images
    : (hotel.thumbnail ? [hotel.thumbnail] : []);

  // Main card image index state
  const [candidateIdx, setCandidateIdx] = useState(0);
  const [mainImgLoaded, setMainImgLoaded] = useState(false);

  // Modal image state
  const [modalImgLoaded, setModalImgLoaded] = useState(false);

  // Current main card image URL (undefined if all candidates failed)
  const currentCardSrc = candidateIdx < candidates.length ? candidates[candidateIdx] : undefined;

  // 5-second timeout logic to skip image if loading takes longer than 5 seconds
  React.useEffect(() => {
    if (!currentCardSrc || mainImgLoaded) return;

    const timer = setTimeout(() => {
      // Image failed to load within 5 seconds, try next candidate image
      setMainImgLoaded(false);
      setCandidateIdx((prev) => prev + 1);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentCardSrc, mainImgLoaded]);

  // Build Google Maps link from GPS coordinates or hotel name
  const mapsUrl = hotel.gps_coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${hotel.gps_coordinates.latitude},${hotel.gps_coordinates.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + " " + location)}`;

  const galleryImages = candidates.length > 0 ? candidates : [];

  const openGallery = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImage(0);
    setModalImgLoaded(false);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  const prevImage = () => {
    setModalImgLoaded(false);
    setActiveImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setModalImgLoaded(false);
    setActiveImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const selectModalImage = (idx: number) => {
    if (idx !== activeImage) {
      setModalImgLoaded(false);
      setActiveImage(idx);
    }
  };

  const navigateToTour = (e: React.MouseEvent) => {
    // Let map link and wishlist button bubble normally
    const t = e.target as HTMLElement;
    if (t.closest(".tp-tour-media-meta") || t.closest(".tp-tour-wishlist")) return;
    e.preventDefault();
    const slug = encodeURIComponent(hotel.name);
    const priceParam = encodeURIComponent(hotel.price || "");
    const origParam = hotel.originalPrice ? `&mrp=${hotel.originalPrice}` : "";
    const locParam = encodeURIComponent(location || "");
    window.history.pushState(
      { hotel, location },
      "",
      `/tour/${slug}?price=${priceParam}${origParam}&loc=${locParam}`
    );
    window.dispatchEvent(new PopStateEvent("popstate", { state: { hotel, location } }));
  };

  return (
    <>
      <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
        <div
          className="tp-tour-item mb-30"
          onClick={navigateToTour}
          style={{ cursor: "pointer" }}
        >
          <div className="tp-tour-thumb p-relative fix">
            <a href={hotel.link} className="image">
              {!mainImgLoaded && (
                <div className="tp-skeleton-thumb position-absolute w-100 h-100 top-0 left-0"></div>
              )}
              {currentCardSrc && (
                <img
                  alt={hotel.name || "tour"}
                  src={currentCardSrc}
                  loading="lazy"
                  decoding="async"
                  style={{ opacity: mainImgLoaded ? 1 : 0, transition: "opacity 0.3s ease" }}
                  onLoad={() => setMainImgLoaded(true)}
                  onError={() => {
                    // Try next candidate image
                    setMainImgLoaded(false);
                    setCandidateIdx((prev) => prev + 1);
                  }}
                />
              )}
            </a>
            <span className="tp-tour-wishlist">
              <i className="fa-regular fa-heart"></i>
            </span>
            <div className="tp-tour-media-meta">
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                <i className="fa-solid fa-map-location-dot"></i>
              </a>
            </div>
          </div>
          <div className="tp-tour-content">
            <div className="tp-tour-meta d-flex align-items-center">
              <div className="tp-tour-review mr-5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    <i className={`fa-${star <= Math.round(hotel.rating) ? "solid" : "regular"} fa-star`}></i>
                  </span>
                ))}
              </div>
              <span className="tp-tour-review-score tp-ff-inter">( {hotel.reviews} Reviews )</span>
            </div>
            <h3 className="tp-tour-title fw-500 mb-10">
              <a href={hotel.link}>{hotel.name}</a>
            </h3>
            <div className="tp-tour-info">
              <span>
                <i className="fa-solid fa-location-dot mr-5"></i>
                {location}
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
                  {hotel.originalPrice && (
                    <span className="tp-tour-old-price text-decoration-line-through text-muted small">
                      ₹{hotel.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <div className="tp-tour-bottom-price">
                  <span className="tp-tour-new-price fw-700">{hotel.price}</span>
                  <span className="tp-tour-suffix">/person</span>
                </div>
              </div>
              <div className="tp-tour-btn">
                <a
                  href={hotel.link}
                  className="tp-btn-sm fw-500 tp-ff-inter"
                >
                  Book A tour
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DomesticCard;
