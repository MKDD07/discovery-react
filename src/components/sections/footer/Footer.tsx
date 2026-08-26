import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { loadAllPexelsMedia } from "../pexels/PexelsMediaSection";
import logo from "../../../logo.png";
import SeoDirectorySection from "../seo-directory/seo-directory";

const INSTAGRAM_PEXELS_QUERIES = [
  "luxury private villa pool ocean view",
  "santorini white blue sea view luxury travel",
  "swiss alps mountain lake luxury chalet",
  "bali temple luxury rainforest resort",
  "paris eiffel tower evening palace hotel",
  "maldives overwater villa luxury turquoise ocean",
  "dubai luxury desert resort sunset",
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (footerRef.current) {
      loadAllPexelsMedia(footerRef.current);
    }

    // Smooth subtle parallax scroll listener for footer ambient aura
    const handleScroll = () => {
      if (!parallaxBgRef.current || !footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const offset = (windowHeight - rect.top) * 0.12;
        parallaxBgRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── SEO Directory & Quick Links Section ────────────────────── */}
      <SeoDirectorySection />

      {/* ── Luxury Parallax Curated Footer ──────────────────────────── */}
      <footer
        ref={footerRef}
        className="tp-luxe-footer p-relative overflow-hidden"
        style={{
          backgroundColor: "#fdfbf9",
          borderTopLeftRadius: "32px",
          borderTopRightRadius: "32px",
          boxShadow: "0 -20px 50px rgba(15, 23, 42, 0.03)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Subtle Parallax Ambient Aura Background */}
        <div
          ref={parallaxBgRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(132, 196, 24, 0.07) 0%, rgba(253, 251, 249, 0) 70%)",
            pointerEvents: "none",
            zIndex: 0,
            transition: "transform 0.1s linear",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 163, 59, 0.06) 0%, rgba(253, 251, 249, 0) 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div className="container position-relative" style={{ zIndex: 1, paddingTop: "80px" }}>
          {/* ── Newsletter & Brand Showcase Header ─────────────────────── */}
          <div className="tp-luxe-footer-top pb-60 mb-50 border-bottom border-light-subtle">
            <div className="row align-items-center g-4">
              <div className="col-lg-5">
                <div className="tp-footer-logo-wrap mb-20">
                  <a href="/" className="d-inline-block text-decoration-none">
                    <img width="145" src={logo} alt="Discovery Convoy Logo" style={{ display: "block" }} />
                  </a>
                </div>
                <p
                  className="mb-0"
                  style={{
                    fontSize: "14.5px",
                    lineHeight: "1.75",
                    color: "#475569",
                    maxWidth: "400px",
                  }}
                >
                  India's premier luxury travel collective. Dedicated to curating unforgettable private itineraries, 5-star palatial escapes, and bespoke global journeys.
                </p>
              </div>

              <div className="col-lg-7">
                <div
                  className="p-4 p-md-5 rounded-4 shadow-sm"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <div className="row align-items-center g-3">
                    <div className="col-md-6">
                      <span
                        className="badge bg-primary-subtle text-primary mb-2 px-3 py-1 rounded-pill fw-bold"
                        style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                      >
                        THE PRIVATE CONCIERGE DISPATCH
                      </span>
                      <h3 className="fs-20 fw-bold text-dark mb-1">Join Our Travel Journal</h3>
                      <p className="small text-secondary mb-0">
                        Receive private access to curated itineraries and secret seasonal escapes.
                      </p>
                    </div>
                    <div className="col-md-6">
                      <form
                        action="#"
                        onSubmit={(e) => {
                          e.preventDefault();
                          alert("Thank you for joining our private travel dispatch!");
                        }}
                        className="d-flex gap-2 position-relative"
                      >
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          required
                          className="form-control rounded-pill px-3 py-2.5 bg-light border-0 shadow-none text-dark"
                          style={{ fontSize: "13px" }}
                          aria-label="Email address for travel newsletter"
                        />
                        <button
                          type="submit"
                          className="btn btn-dark rounded-pill px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-1.5 flex-shrink-0"
                          style={{ fontSize: "13px" }}
                          aria-label="Subscribe to newsletter"
                        >
                          Join <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Editorial Widgets Grid ───────────────────────────── */}
          <div className="tp-footer-widget-wrap pb-60">
            <div className="row g-4">
              {/* Col 1: Brand & Philosophy */}
              <div className="col-lg-3 col-md-6">
                <div className="pe-lg-3">
                  <h4 className="fs-16 fw-bold text-dark mb-20 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-compass text-primary"></i>
                    Bespoke Journeys
                  </h4>
                  <p style={{ fontSize: "13.5px", lineHeight: "1.8", color: "#475569" }} className="mb-25">
                    From the sun-kissed shores of Goa and backwaters of Kerala to Parisian avenues and Maldivian atolls, we engineer seamless, timeless luxury voyages.
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    {[
                      { icon: "fa-brands fa-facebook-f", url: "https://facebook.com", label: "Facebook" },
                      { icon: "fa-brands fa-instagram", url: "https://instagram.com", label: "Instagram" },
                      { icon: "fa-brands fa-x-twitter", url: "https://x.com", label: "Twitter" },
                      { icon: "fa-brands fa-youtube", url: "https://youtube.com", label: "YouTube" },
                      { icon: "fa-brands fa-linkedin-in", url: "https://linkedin.com", label: "LinkedIn" },
                    ].map((item, sIdx) => (
                      <a
                        key={sIdx}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-dark shadow-sm transition-all"
                        style={{
                          width: "36px",
                          height: "36px",
                          border: "1px solid rgba(15, 23, 42, 0.08)",
                          fontSize: "13px",
                        }}
                      >
                        <i className={item.icon}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Col 2: Navigation Hub */}
              <div className="col-lg-3 col-md-6">
                <div>
                  <h4 className="fs-16 fw-bold text-dark mb-20 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-layer-group text-primary"></i>
                    Curated Portals
                  </h4>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-2.5" style={{ fontSize: "13.5px" }}>
                    {[
                      { label: "Global Destinations Atlas", url: "/destinations" },
                      { label: "Luxe Private Escapes", url: "/luxury" },
                      { label: "Curated Travel Blog", url: "/blog" },
                      { label: "TripAdvisor Destination Guides", url: "/guide/paris" },
                      { label: "About Discovery Convoy", url: "/about" },
                      { label: "Concierge FAQ & Assistance", url: "/faq" },
                    ].map((link, idx) => (
                      <li key={idx}>
                        <a
                          href={link.url}
                          className="text-secondary text-decoration-none hover-primary transition-all d-inline-flex align-items-center gap-1.5"
                        >
                          <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: "9px" }}></i>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Col 3: Services & Collections */}
              <div className="col-lg-3 col-md-6">
                <div>
                  <h4 className="fs-16 fw-bold text-dark mb-20 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-crown text-primary"></i>
                    Signature Offerings
                  </h4>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-2.5" style={{ fontSize: "13.5px" }}>
                    {[
                      { label: "Palatial & Heritage Stays", url: "/collection/luxury-palaces-villas" },
                      { label: "Honeymoon & Romantic Getaways", url: "/collection/honeymoon-getaways" },
                      { label: "Mountain & Wilderness Sanctuaries", url: "/collection/mountain-wilderness-retreats" },
                      { label: "Private Islands & Beachfront Villas", url: "/collection/beachfront-private-islands" },
                      { label: "Flight Intelligence & Charters", url: "/flights" },
                      { label: "24/7 Dedicated Concierge", url: "/contact" },
                    ].map((srv, idx) => (
                      <li key={idx}>
                        <a
                          href={srv.url}
                          className="text-secondary text-decoration-none hover-primary transition-all d-inline-flex align-items-center gap-1.5"
                        >
                          <i className="fa-solid fa-chevron-right text-muted" style={{ fontSize: "9px" }}></i>
                          {srv.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Col 4: Contact & Concierge Support */}
              <div className="col-lg-3 col-md-6">
                <div
                  className="p-3.5 rounded-4 bg-white shadow-sm"
                  style={{ border: "1px solid rgba(15, 23, 42, 0.06)" }}
                >
                  <h4 className="fs-15 fw-bold text-dark mb-15 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-headset text-primary"></i>
                    Private Concierge
                  </h4>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-2.5">
                      <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "30px", height: "30px" }}>
                        <i className="fa-solid fa-phone" style={{ fontSize: "11px" }}></i>
                      </div>
                      <div>
                        <span className="d-block fw-semibold text-secondary" style={{ fontSize: "11.5px" }}>24/7 Helpline</span>
                        <a href="tel:+919319300560" className="fw-bold text-dark text-decoration-none" style={{ fontSize: "13.5px" }}>
                          +91 9319300560
                        </a>
                      </div>
                    </div>

                    <div className="d-flex align-items-start gap-2.5">
                      <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "30px", height: "30px" }}>
                        <i className="fa-solid fa-envelope" style={{ fontSize: "11px" }}></i>
                      </div>
                      <div>
                        <span className="d-block fw-semibold text-secondary" style={{ fontSize: "11.5px" }}>Concierge Mail</span>
                        <a href="mailto:support@discoveryconvoy.com" className="fw-bold text-dark text-decoration-none" style={{ fontSize: "13.5px", wordBreak: "break-all" }}>
                          support@discoveryconvoy.com
                        </a>
                      </div>
                    </div>

                    <div className="d-flex align-items-start gap-2.5">
                      <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "30px", height: "30px" }}>
                        <i className="fa-solid fa-clock" style={{ fontSize: "11px" }}></i>
                      </div>
                      <div>
                        <span className="d-block fw-semibold text-secondary" style={{ fontSize: "11.5px" }}>Working Hours</span>
                        <span className="fw-bold text-dark d-block" style={{ fontSize: "13px" }}>
                          Mon – Sat: 09:00 AM – 08:00 PM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Continuous Live Visual Gallery Stream ─────────────────── */}
          <div className="pb-50">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="fw-bold text-dark fs-14 d-flex align-items-center gap-1.5">
                <i className="fa-brands fa-instagram text-primary"></i>
                Visual Travel Log &amp; Sanctuaries
              </span>
              <span className="text-secondary small">#DiscoveryConvoy</span>
            </div>
            <Swiper
              modules={[Autoplay]}
              loop={true}
              speed={8000}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              spaceBetween={16}
              slidesPerView={2}
              breakpoints={{
                0: { slidesPerView: 2, spaceBetween: 12 },
                576: { slidesPerView: 3, spaceBetween: 14 },
                768: { slidesPerView: 4, spaceBetween: 16 },
                1200: { slidesPerView: 6, spaceBetween: 16 },
              }}
              className="tp-instagram-slide"
            >
              {[...INSTAGRAM_PEXELS_QUERIES, ...INSTAGRAM_PEXELS_QUERIES].map((query, idx) => (
                <SwiperSlide key={idx}>
                  <div
                    className="p-relative rounded-4 overflow-hidden shadow-sm"
                    style={{ height: "180px", backgroundColor: "#f1f5f9" }}
                  >
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-block w-100 h-100"
                      aria-label={`View Instagram travel photo ${idx + 1}`}
                    >
                      <img
                        className="w-100 h-100"
                        src="assets/img/footer/thumb.jpg"
                        data-pexels={query}
                        data-type="image"
                        data-quality="medium"
                        alt={`Instagram Travel Story ${idx + 1}`}
                        style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
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

          {/* ── Clean Minimal Copyright Bar ────────────────────────────── */}
          <div className="tp-copyright-area py-4 border-top border-light-subtle">
            <div className="row align-items-center g-3">
              <div className="col-md-6 text-center text-md-start">
                <p className="text-secondary small mb-0">
                  © 2026 <a href="/" className="fw-bold text-dark text-decoration-none">Discovery Convoy</a>. All rights reserved. Crafted for extraordinary journeys.
                </p>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <div className="d-inline-flex align-items-center gap-2">
                  <span className="small text-muted me-1">Payment Gateways:</span>
                  <img
                    src="assets/img/footer/payment.png"
                    alt="Accepted payment channels"
                    style={{ maxHeight: "22px", filter: "grayscale(10%) contrast(1.1)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
