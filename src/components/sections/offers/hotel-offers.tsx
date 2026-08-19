import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const HOTEL_IMAGES = [
  "/assets/img/offers-hotels/hotel_001.jpg",
  "/assets/img/offers-hotels/hotel_002.jpg",
  "/assets/img/offers-hotels/hotel_003.jpg",
  "/assets/img/offers-hotels/hotel_004.jpg",
];

interface HotelOffersSectionProps {
  slidesPerViewDesktop?: number;
}

export const HotelOffersSection: React.FC<HotelOffersSectionProps> = ({
  slidesPerViewDesktop = 4,
}) => {
  return (
    <section className="tp-hotel-offers-area py-4 p-relative">
      <div className="container">
        <Swiper
          modules={[Autoplay]}
          loop={true}
          speed={8500}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          spaceBetween={20}
          slidesPerView={slidesPerViewDesktop}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
              spaceBetween: 14,
            },
            576: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            992: {
              slidesPerView: Math.min(3, slidesPerViewDesktop),
              spaceBetween: 20,
            },
            1200: {
              slidesPerView: slidesPerViewDesktop,
              spaceBetween: 24,
            },
          }}
        >
          {[...HOTEL_IMAGES, ...HOTEL_IMAGES].map((imgSrc, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="rounded-4 overflow-hidden shadow-sm"
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={imgSrc}
                  alt={`Hotel Offer ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "16px",
                    transition: "transform 0.4s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.04)";
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

export default HotelOffersSection;


