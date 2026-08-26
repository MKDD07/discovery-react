import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const FLIGHT_OFFER_IMAGES = [
  "/assets/img/offers-flight/0001.webp",
  "/assets/img/offers-flight/0002.webp",
  "/assets/img/offers-flight/0003.webp",
  "/assets/img/offers-flight/0004.webp",
];

export const FlightOffersSection: React.FC = () => {
  return (
    <section className="tp-flight-offers-area py-4 p-relative">
      <div className="container">
        <Swiper
          modules={[Autoplay]}
          loop={true}
          speed={6000}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
          }}
        >
          {[...FLIGHT_OFFER_IMAGES, ...FLIGHT_OFFER_IMAGES, ...FLIGHT_OFFER_IMAGES].map((imgSrc, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="rounded-4 overflow-hidden shadow-sm"
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={imgSrc}
                  alt={`Flight Offer ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: "16px",
                    transition: "transform 0.4s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FlightOffersSection;
