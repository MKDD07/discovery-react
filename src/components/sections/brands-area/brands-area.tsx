import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const BRAND_IMAGES = [
  { id: 1, src: "assets/img/brands/brand.png", alt: "Brand Partner 1" },
  { id: 2, src: "assets/img/brands/brand-2.png", alt: "Brand Partner 2" },
  { id: 3, src: "assets/img/brands/brand-3.png", alt: "Brand Partner 3" },
  { id: 4, src: "assets/img/brands/brand-4.png", alt: "Brand Partner 4" },
  { id: 5, src: "assets/img/brands/brand-5.png", alt: "Brand Partner 5" },
  { id: 6, src: "assets/img/brands/brand-6.png", alt: "Brand Partner 6" },
];

export const BrandsArea: React.FC = () => {
  return (
    <>
      {/* tp-brands-area-start */}
      <div className="tp-brands-area">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div
                className="tp-brands-area tp-brands-three pt-50 pb-50 rounded-4"
                data-bg-color="#FFC418"
                style={{ backgroundColor: "#FFC418" }}
              >
                <Swiper
                  modules={[Autoplay]}
                  loop={true}
                  speed={4000}
                  autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  spaceBetween={30}
                  slidesPerView={2}
                  breakpoints={{
                    0: { slidesPerView: 2, spaceBetween: 20 },
                    576: { slidesPerView: 3, spaceBetween: 25 },
                    768: { slidesPerView: 4, spaceBetween: 30 },
                    992: { slidesPerView: 5, spaceBetween: 35 },
                    1200: { slidesPerView: 6, spaceBetween: 40 },
                  }}
                  className="tp-brands-slider align-items-center"
                >
                  {BRAND_IMAGES.map((brand) => (
                    <SwiperSlide key={brand.id}>
                      <div className="tp-brands-item text-center">
                        <a href="#" onClick={(e) => e.preventDefault()} className="d-inline-block">
                          <img
                            src={brand.src}
                            alt={brand.alt}
                            style={{
                              maxHeight: "45px",
                              width: "auto",
                              objectFit: "contain",
                              transition: "transform 0.3s ease, opacity 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.08)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          />
                        </a>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* tp-brands-area-end */}
    </>
  );
};

export default BrandsArea;
