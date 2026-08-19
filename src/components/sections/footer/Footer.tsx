import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { loadAllPexelsMedia } from "../pexels/PexelsMediaSection";
import logo from "../../../logo.png";

const INSTAGRAM_PEXELS_QUERIES = [
  "tropical beach resort sunset vacation",
  "santorini white blue sea view travel",
  "swiss alps mountain lake hiking",
  "bali temple rainforest scenic",
  "paris eiffel tower evening lights travel",
  "maldives overwater villa turquoise ocean",
  "dubai desert safari luxury camp",
];

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (footerRef.current) {
      loadAllPexelsMedia(footerRef.current);
    }
  }, []);

  return (
    <>
      {/* tp-footer-area-start */}
      <footer
        ref={footerRef}
        className="tp-footer-area tp-footer-6 z-index-2 pt-100 p-relative"
        data-bg-color="#fff3ed"
      >
        <img
          className="tp-footer-6-shape"
          src="assets/img/footer/saven/shape.png"
          alt=""
        />
        <img
          className="tp-footer-6-shape-2"
          src="assets/img/footer/saven/shape-3.png"
          alt=""
        />
        <img
          className="tp-footer-6-shape-3 tptranslateY2 d-none d-lg-block"
          src="assets/img/footer/saven/shape-2.png"
          alt=""
        />

        <div className="container">
          {/* Newsletter / Brand Highlight Bar */}
          <div className="tp-footer-subscribe-wrap pb-40">
            <div className="row align-items-center">
              <div className="col-xxl-6 col-xl-5 col-lg-5 mb-30">
                <div className="tp-footer-logo-wrap mb-20">
                  <a href="/">
                    <img width="130px" src={logo} alt="Discovery Convoy Logo" />
                  </a>
                </div>
                <p className="mb-0" style={{ maxWidth: "420px", color: "inherit" }}>
                  Discover unforgettable destinations, bespoke tours, curated hotels, and seamless travel journeys across the globe with Discovery Convoy.
                </p>
              </div>

              <div className="col-xxl-6 col-xl-7 col-lg-7 mb-30">
                <div className="tp-footer-three-subscribe-form tp-footer-6-subscribe-form">
                  <h3 className="tp-footer-subscribe-title fs-28 fw-600 mb-10">
                    <i className="fa-solid fa-paper-plane mr-10"></i>
                    Join Our Newsletter
                  </h3>
                  <p className="mb-20">
                    Sign up to receive exclusive offers, travel guides, and new destination deals directly to your inbox.
                  </p>
                  <div className="tp-footer-subscribe-form p-relative">
                    <form action="#" onSubmit={(e) => e.preventDefault()} className="p-relative">
                      <input
                        className="tp-input"
                        type="email"
                        placeholder="Enter your email address"
                        required
                      />
                      <button className="tp-footer-subscribe-btn" type="submit" aria-label="Subscribe">
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Widgets */}
          <div className="tp-footer-widget-wrap pt-60 pb-50">
            <div className="row g-4">
              {/* Col 1: About & Social Card */}
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div
                  className="tp-footer-widget mb-30 p-4"
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <h3 className="tp-footer-widget-title fw-600 mb-20">
                    <i className="fa-solid fa-compass mr-10"></i>
                    About Convoy
                  </h3>
                  <p className="mb-20" style={{ fontSize: "14px", lineHeight: "1.7", color: "#555" }}>
                    Your trusted companion for domestic holidays, international escapes, flight bookings, and tailor-made packages worldwide.
                  </p>
                  <div className="tp-footer-social d-flex align-items-center gap-2">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#f4f6f8",
                        color: "inherit",
                        textDecoration: "none"
                      }}
                      title="Facebook"
                    >
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#f4f6f8",
                        color: "inherit",
                        textDecoration: "none"
                      }}
                      title="Instagram"
                    >
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                    <a
                      href="https://x.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#f4f6f8",
                        color: "inherit",
                        textDecoration: "none"
                      }}
                      title="X (Twitter)"
                    >
                      <i className="fa-brands fa-x-twitter"></i>
                    </a>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#f4f6f8",
                        color: "inherit",
                        textDecoration: "none"
                      }}
                      title="YouTube"
                    >
                      <i className="fa-brands fa-youtube"></i>
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "#f4f6f8",
                        color: "inherit",
                        textDecoration: "none"
                      }}
                      title="LinkedIn"
                    >
                      <i className="fa-brands fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Col 2: Quick Links Card */}
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div
                  className="tp-footer-widget mb-30 p-4"
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <h3 className="tp-footer-widget-title fw-600 mb-20">
                    <i className="fa-solid fa-link mr-10"></i>
                    Quick Links
                  </h3>
                  <div className="tp-footer-widget-menu">
                    <ul>
                      <li>
                        <a href="/">Home</a>
                      </li>
                      <li>
                        <a href="#about">About Us</a>
                      </li>
                      <li>
                        <a href="#domestic">Domestic Packages</a>
                      </li>
                      <li>
                        <a href="#international">International Tours</a>
                      </li>
                      <li>
                        <a href="#privacy">Privacy Policy</a>
                      </li>
                      <li>
                        <a href="#terms">Terms &amp; Conditions</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Col 3: Popular Services Card */}
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div
                  className="tp-footer-widget mb-30 p-4"
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <h3 className="tp-footer-widget-title fw-600 mb-20">
                    <i className="fa-solid fa-suitcase-rolling mr-10"></i>
                    Our Services
                  </h3>
                  <div className="tp-footer-widget-menu">
                    <ul>
                      <li>
                        <a href="#tour-packages">Custom Holiday Packages</a>
                      </li>
                      <li>
                        <a href="#hotels">Luxury Hotel Bookings</a>
                      </li>
                      <li>
                        <a href="#flights">Flight Reservations</a>
                      </li>
                      <li>
                        <a href="#guides">Local Guided Experiences</a>
                      </li>
                      <li>
                        <a href="#insurance">Travel Assistance &amp; Safety</a>
                      </li>
                      <li>
                        <a href="#support">24/7 Concierge Support</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Col 4: Contact Us Card */}
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div
                  className="tp-footer-widget mb-30 p-4"
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <h3 className="tp-footer-widget-title fw-600 mb-20">
                    <i className="fa-solid fa-headset mr-10"></i>
                    Get In Touch
                  </h3>
                  <div className="tp-footer-contact">
                    <div className="d-flex align-items-start mb-15">
                      <i className="fa-solid fa-phone mt-1 mr-10"></i>
                      <div>
                        <span className="d-block" style={{ fontSize: "13px", color: "#777" }}>Phone Support</span>
                        <a href="tel:+919319300560" className="fw-600 d-inline-block" style={{ fontSize: "14px", color: "#555" }}>
                          +91 9319300560
                        </a>
                      </div>
                    </div>

                    <div className="d-flex align-items-start mb-15">
                      <i className="fa-solid fa-envelope mt-1 mr-10"></i>
                      <div>
                        <span className="d-block" style={{ fontSize: "13px", color: "#777" }}>Email Support</span>
                        <a href="mailto:support@discoveryconvoy.com" className="fw-600 d-inline-block" style={{ fontSize: "14px", color: "#555", wordBreak: "break-all" }}>
                          support@discoveryconvoy.com
                        </a>
                      </div>
                    </div>

                    <div className="d-flex align-items-start mb-15">
                      <i className="fa-solid fa-location-dot mt-1 mr-10"></i>
                      <div>
                        <span className="d-block" style={{ fontSize: "13px", color: "#777" }}>Office Location</span>
                        <span className="fw-600 d-inline-block" style={{ fontSize: "14px", color: "#555" }}>
                          Discovery Convoy Travel Services
                        </span>
                      </div>
                    </div>

                    <div className="d-flex align-items-start">
                      <i className="fa-solid fa-clock mt-1 mr-10"></i>
                      <div>
                        <span className="d-block" style={{ fontSize: "13px", color: "#777" }}>Working Hours</span>
                        <span className="fw-600 d-inline-block" style={{ fontSize: "14px", color: "#555" }}>
                          Mon – Sat: 09:00 AM – 08:00 PM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instagram Slider Area with Pexels */}
        <div className="container-fluid container-1856 pb-50">
          <div className="tp-instagram-wrap wow fadeInUp" data-wow-duration=".9s" data-wow-delay=".4s">
            <Swiper
              modules={[Autoplay]}
              loop={true}
              speed={7500}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }}
              spaceBetween={20}
              slidesPerView={2}
              breakpoints={{
                0: { slidesPerView: 2, spaceBetween: 12 },
                576: { slidesPerView: 3, spaceBetween: 15 },
                768: { slidesPerView: 4, spaceBetween: 16 },
                1200: { slidesPerView: 5, spaceBetween: 20 },
                1400: { slidesPerView: 6, spaceBetween: 20 },
                1600: { slidesPerView: 7, spaceBetween: 20 },
              }}
              className="tp-instagram-slide"
            >
              {INSTAGRAM_PEXELS_QUERIES.map((query, idx) => (
                <SwiperSlide key={idx}>
                  <div className="tp-instagram-thumb p-relative rounded-4 overflow-hidden shadow-sm" style={{ height: "220px" }}>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="d-block w-100 h-100">
                      <img
                        className="w-100 h-100"
                        src="assets/img/footer/thumb.jpg"
                        data-pexels={query}
                        data-type="image"
                        data-quality="medium"
                        alt={`Instagram Travel ${idx + 1}`}
                        style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.06)";
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

        {/* Copyright Bar */}
        <div className="tp-copyright-area pt-25 pb-15">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-5">
                <div className="tp-copyright-text">
                  <p className="tp-ff-inter mb-5">
                    2026 <a href="/">Discovery Convoy </a>© All rights reserved
                  </p>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="tp-copyright-payment d-flex flex-wrap align-items-center justify-content-lg-end">
                  <p className="fw-500 mb-5">Payment Channels :</p>
                  <a href="#">
                    <img src="assets/img/footer/payment.png" alt="Payment Channels" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* tp-footer-area-end */}
    </>
  );
}

