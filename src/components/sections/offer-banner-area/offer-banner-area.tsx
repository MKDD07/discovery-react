import React, { useEffect, useState } from "react";
import { fetchPexelsImage, pickImageUrl } from "../pexels/PexelsMediaSection";

interface OfferBannerAreaProps {
  location?: string;
  query?: string;
}

export const OfferBannerArea: React.FC<OfferBannerAreaProps> = ({
  location = "Kashmir, India",
  query = "kashmir dal lake shikara luxury mountain sunset",
}) => {
  const [bgImage, setBgImage] = useState<string>("assets/img/offer/banner.jpg");

  useEffect(() => {
    let isMounted = true;
    fetchPexelsImage(query, "landscape")
      .then((photos: any[]) => {
        if (isMounted && photos && photos.length > 0) {
          const imgUrl = pickImageUrl(photos[0], "large2x");
          if (imgUrl) setBgImage(imgUrl);
        }
      })
      .catch((err) => console.error("OfferBannerArea Pexels err:", err));

    return () => {
      isMounted = false;
    };
  }, [query]);

  return (
    <>
      {/* tp-offer-banner-area-start */}
      <div
        className="tp-offer-banner-area tp-offer-banner-overly p-relative pt-120 pb-120 bg-position"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          className="position-absolute w-100 h-100 top-0 left-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1 }}
        ></div>
        <div className="container container-1350 p-relative" style={{ zIndex: 2 }}>
          <div className="row">
            <div className="col-xxl-6 col-xl-8 col-lg-10">
              <div className="tp-offer-banner-content p-relative z-index-2">
                <span className="tp-offer-banner-subtitle mb-15 d-inline-block">
                  <span
                    className="badge px-3 py-2 text-white fw-700 rounded-pill"
                    style={{ backgroundColor: "#ff5e14", fontSize: "13px" }}
                  >
                    🔥 SPECIAL DESTINATION OFFER
                  </span>
                </span>
                <h2 className="tp-offer-banner-title text-white fw-600 mb-20">
                  Let’s Explore The Hidden Wonders Of {location}
                </h2>
                <div className="tp-offer-banner-location mb-30 d-flex align-items-center text-white">
                  <i className="fa-solid fa-location-dot mr-10" style={{ color: "#ff5e14" }}></i>
                  <span className="fw-500">{location}</span>
                </div>
                <a href="#explore" className="tp-btn fw-600 tp-ff-inter">
                  Book Special Tour <i className="fa-solid fa-arrow-right ml-5"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* tp-offer-banner-area-end */}
    </>
  );
};

export default OfferBannerArea;
