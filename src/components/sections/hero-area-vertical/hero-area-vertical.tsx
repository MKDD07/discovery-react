import React, { useEffect, useRef } from "react";
import { loadAllPexelsMedia } from "../pexels/PexelsMediaSection";

const COLUMN_1_QUERIES = [
  "santorini greece sunset sea travel",
  "swiss alps mountain lake nature hiking",
  "paris eiffel tower evening lights",
  "bali tropical beach luxury resort",
  "dubai burj khalifa luxury travel",
  "rome colosseum historic monument",
  "maldives overwater villa turquoise ocean",
  "kyoto bamboo forest japan temple",
  "new york city times square travel",
  "amalfi coast cliffside village ocean",
];

const COLUMN_2_QUERIES = [
  "iceland northern lights aurora borealis",
  "venice gondola grand canal sunset",
  "taj mahal agra marble monument",
  "singapore marina bay sands skyline",
  "cappadocia hot air balloons turkey",
  "phuket thailand limestone islands boat",
  "grand canyon arizona landscape travel",
  "norway fjords waterfall green mountains",
  "barcelona sagrada familia architecture",
  "london big ben thames river bridge",
];

const COLUMN_3_QUERIES = [
  "hawaii tropical waterfall rainforest",
  "rio de janeiro christ the redeemer",
  "machu picchu peru ancient mountains",
  "sydney opera house harbour sunset",
  "zermatt matterhorn switzerland snow",
  "havana cuba vintage classic cars",
  "petra jordan treasury ancient wonder",
  "banff national park lake louise canada",
  "serengeti safari wildlife lion landscape",
  "cinque terre colorful houses coast italy",
];

export const HeroAreaVertical: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    if (heroRef.current) {
      loadAllPexelsMedia(heroRef.current);
      // Give gentle transition once media begins resolving
      const timer = setTimeout(() => setLoaded(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* tp-hero-area-start */}
      <div
        ref={heroRef}
        className="tp-hero-area tp-hero-5-spacing p-relative z-index-2" style={{ marginBottom: "200px" }}>
        <img
          className="tp-hero-5-shape d-none d-lg-block"
          src="assets/img/hero/five/shape.png"
          alt=""
        />
        <img
          className="tp-hero-5-shape-2 tptranslateX2 d-none d-lg-block"
          src="assets/img/hero/five/shape-2.png"
          alt=""
        />
        <img
          className="tp-hero-5-shape-3 tptranslateX2 d-none d-lg-block"
          src="assets/img/hero/five/shape-3.png"
          alt=""
        />
        <img
          className="tp-hero-5-shape-4 tpswing d-none d-lg-block"
          src="assets/img/hero/five/shape-4.png"
          alt=""
        />
        <div className="container container-1876">
          <div className="tp-hero-5-bg">
            <div className="row align-items-center">
              <div className="col-xxl-6">
                <div className="tp-hero-5-content">
                  <div
                    className="wow fadeInUp"
                    data-wow-duration=".9s"
                    data-wow-delay=".3s"
                  >
                    <span className="tp-hero-5-subtitle text-uppercase d-inline-block fw-500">
                      Let's Explore
                    </span>
                  </div>
                  <h4
                    className="tp-hero-5-title fw-400 tp-ff-marcellus mb-15 wow fadeInUp"
                    data-wow-duration=".9s"
                    data-wow-delay=".4s"
                  >
                    Beautiful life moments
                  </h4>
                  <p
                    className="tp-hero-5-dec mb-35 wow fadeInUp"
                    data-wow-duration=".9s"
                    data-wow-delay=".5s"
                  >
                    Save up to 50% on your next Travel stay
                  </p>
                  <div
                    className="tp-booking-form tp-booking-5-form d-inline-block text-start wow fadeInUp"
                    data-wow-duration=".9s"
                    data-wow-delay=".6s"
                  >
                    <form action="#" onSubmit={(e) => e.preventDefault()}>
                      <div className="tp-booking-wrap tp-marker-tab p-relative">
                        <div className="tp-booking-location tp-booking-col-1 p-relative">
                          <div className="tp-booking-location-input tp-booking-toggle p-relative">
                            <span className="tp-booking-input-icon">
                              <i className="fa-solid fa-location-dot"></i>
                            </span>
                            <input
                              className="tp-input"
                              type="text"
                              placeholder="Where to ?"
                            />
                          </div>
                        </div>
                        <div className="tp-booking-location tp-booking-col-2 tp-booking-datepicker p-relative">
                          <div className="tp-booking-location-input tp-booking-toggle p-relative">
                            <span className="tp-booking-input-icon">
                              <i className="fa-regular fa-calendar-days"></i>
                            </span>
                            <input
                              className="tp-multi-datepicker tp-input"
                              id="date-vertical"
                              type="text"
                              name="date"
                              placeholder="Select dates"
                            />
                          </div>
                        </div>
                        <div className="tp-booking-location tp-booking-col-3 tp-booking-nohide p-relative">
                          <div className="tp-booking-location-input tp-booking-toggle no-border p-relative">
                            <span className="tp-booking-input-icon">
                              <i className="fa-solid fa-user-group"></i>
                            </span>
                            <input
                              className="tp-input"
                              type="text"
                              placeholder="2 adults, 1 child"
                            />
                          </div>
                          <div className="tp-booking-submit-btn">
                            <button type="submit" aria-label="Search">
                              <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-xxl-6">
                <div className="tp-hero-5-gallery">
                  <div className="row gx-15">
                    {/* Column 1 */}
                    <div className="col-4">
                      <div className="tp-gallery-wrap">
                        {COLUMN_1_QUERIES.map((query, idx) => {
                          const thumbNum = (idx % 5) + 1;
                          const thumbSrc = thumbNum === 1 
                            ? "assets/img/hero/five/thumb.jpg" 
                            : `assets/img/hero/five/thumb-${thumbNum}.jpg`;
                          return (
                            <div
                              className="tp-gallery-item mb-15 rounded-4 overflow-hidden p-relative"
                              key={`col1-${idx}`}
                       
                            >
                              {!loaded && (
                                <div
                                  className="tp-skeleton-thumb position-absolute w-100 h-100 top-0 left-0"
                                  style={{ zIndex: 1 }}
                                ></div>
                              )}
                              <img
                                className="w-100"
                                src={thumbSrc}
                                data-pexels={query}
                                data-type="image"
                                data-quality="medium"
                                alt={`Travel destination ${idx + 1}`}
                                style={{
                                  opacity: loaded ? 1 : 0,
                                  transition: "opacity 0.4s ease",
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Column 2 */}
                    <div className="col-4">
                      <div className="tp-gallery-wrap tp-gallery-wrap-2">
                        {COLUMN_2_QUERIES.map((query, idx) => {
                          const thumbNum = (idx % 5) + 6;
                          return (
                            <div
                              className="tp-gallery-item mb-15 overflow-hidden p-relative"
                              key={`col2-${idx}`}
                            >
                              {!loaded && (
                                <div
                                  className="tp-skeleton-thumb position-absolute w-100 h-100 top-0 left-0"
                                  style={{ zIndex: 1 }}
                                ></div>
                              )}
                              <img
                                className="w-100"
                                src={`assets/img/hero/five/thumb-${thumbNum}.jpg`}
                                data-pexels={query}
                                data-type="image"
                                data-quality="medium"
                                alt={`Travel destination ${idx + 11}`}
                                style={{
                                  opacity: loaded ? 1 : 0,
                                  transition: "opacity 0.4s ease",
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Column 3 */}
                    <div className="col-4">
                      <div className="tp-gallery-wrap">
                        {COLUMN_3_QUERIES.map((query, idx) => {
                          const thumbArray = ["thumb-11.jpg", "thumb-12.jpg", "thumb-3.jpg", "thumb-4.jpg", "thumb-9.jpg"];
                          const thumbSrc = `assets/img/hero/five/${thumbArray[idx % thumbArray.length]}`;
                          return (
                            <div
                              className="tp-gallery-item mb-15 overflow-hidden p-relative"
                              key={`col3-${idx}`}
                            >
                              {!loaded && (
                                <div
                                  className="tp-skeleton-thumb position-absolute w-100 h-100 top-0 left-0"
                                  style={{ zIndex: 1 }}
                                ></div>
                              )}
                              <img
                                className="w-100"
                                src={thumbSrc}
                                data-pexels={query}
                                data-type="image"
                                data-quality="medium"
                                alt={`Travel destination ${idx + 21}`}
                                style={{
                                  opacity: loaded ? 1 : 0,
                                  transition: "opacity 0.4s ease",
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* tp-hero-area-end */}
    </>
  );
};

export default HeroAreaVertical;
