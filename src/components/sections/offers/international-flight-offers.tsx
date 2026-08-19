import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const INTER_FLIGHT_OFFER_IMAGES = [
  "/assets/img/offers-inter-flight/int_flight_001.png",
  "/assets/img/offers-inter-flight/int_flight_002.png",
  "/assets/img/offers-inter-flight/int_flight_003.png",
  "/assets/img/offers-inter-flight/int_flight_004.png",
];

export const InternationalFlightOffersSection: React.FC = () => {
  return (
    <section className="tp-inter-flight-offers-area py-4 p-relative">
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
          {INTER_FLIGHT_OFFER_IMAGES.map((imgSrc, idx) => (
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
                  alt={`International Flight Offer ${idx + 1}`}
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

export default InternationalFlightOffersSection;
