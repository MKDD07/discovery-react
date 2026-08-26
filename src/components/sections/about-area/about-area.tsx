import React, { useEffect, useRef } from "react";
import { loadAllPexelsMedia } from "../pexels/PexelsMediaSection";

export const AboutArea: React.FC = () => {
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aboutRef.current) {
      loadAllPexelsMedia(aboutRef.current);
    }
  }, []);

  return (
    <>
      {/* tp-about-area-start */}
      <div ref={aboutRef} className="tp-about-area tp-section-pt tp-section-pb pt-140 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="tp-about-content mb-40">
                <div className="tp-about-section-title p-relative pb-105 ml-70">
                  <span
                    className="tp-section-subtitle d-inline-block mb-20 wow fadeInUp"
                    data-wow-duration=".9s"
                    data-wow-delay=".3s"
                  >
                    About Us
                  </span>
                  <h2
                    className="tp-section-title fw-600 wow fadeInUp"
                    data-wow-duration=".9s"
                    data-wow-delay=".4s"
                  >
                    Embark on your dream journey discover hidden gems around the
                    world experience.
                  </h2>
                </div>
                <div
                  className="tp-about-left-thumb p-relative wow fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".5s"
                >
                  <img
                    className="w-100"
                    src="assets/img/about/thumb.jpg"
                    data-pexels="travel adventure mountains backpacker"
                    data-type="image"
                    data-quality="large"
                    alt="About Travel Experience"
                  />
                  <div className="tp-about-circale">
                    <h2 className="tp-about-circale-title text-uppercase fw-700 mb-0">
                      10+
                    </h2>
                    <div className="tp-about-circale-text">
                      <img
                        className="rotate-infinite"
                        src="assets/img/about/text.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div
                className="tp-about-right-content ml-45 mb-40 mt-50 wow fadeInUp"
                data-wow-duration=".9s"
                data-wow-delay=".4s"
              >
                <div className="tp-about-left-thumb mb-40">
                  <img
                    className="w-100"
                    src="assets/img/about/thumb-2.jpg"
                    data-pexels="tropical beach vacation couple travel"
                    data-type="image"
                    data-quality="large"
                    alt="About Tour Destinations"
                  />
                </div>
                <p className="mb-50">
                  We transform your travel dreams into unforgettable realities.
                  <br />
                  From serene beaches to bustling cities our tours cover. Discover
                  <br />
                  hidden gems immerse yourself in unique cultures.
                </p>
                <div className="tp-about-help-wrap mb-60 d-flex flex-wrap align-items-center">
                  <div className="mr-15 mb-10">
                    <a href="#about" className="tp-btn">
                      More about us
                      <svg
                        width={13}
                        height={12}
                        viewBox="0 0 13 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.4922 5.89282H0.900117"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.1765 10.8855C7.1765 10.8855 11.884 7.20841 11.884 5.89276C11.884 4.57711 7.17642 0.900146 7.17642 0.900146"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                  <div className="tp-about-help d-flex align-items-center mb-10">
                    <span className="tp-about-help-icon mr-10">
                      <svg
                        width={21}
                        height={20}
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.8696 10.8696C20.8696 9.67087 19.8943 8.69565 18.6957 8.69565H17.8261V7.3913C17.8261 3.31565 14.5104 0 10.4348 0C6.35913 0 3.04348 3.31565 3.04348 7.3913V8.69565H2.17391C0.975217 8.69565 0 9.67087 0 10.8696V13.4783C0 14.677 0.975217 15.6522 2.17391 15.6522H4.78261V8.69565H3.91304V7.3913C3.91304 3.79522 6.8387 0.869565 10.4348 0.869565C14.0309 0.869565 16.9565 3.79522 16.9565 7.3913V8.69565H16.087V15.6522H16.9565V17.8261C16.9565 18.5452 16.3713 19.1304 15.6522 19.1304H11.3043V20H15.6522C16.8509 20 17.8261 19.0248 17.8261 17.8261V15.6522H18.6957C19.8943 15.6522 20.8696 14.677 20.8696 13.4783V10.8696ZM3.91304 14.7826H2.17391C1.45478 14.7826 0.869565 14.1974 0.869565 13.4783V10.8696C0.869565 10.1504 1.45478 9.56522 2.17391 9.56522H3.91304V14.7826ZM20 13.4783C20 14.1974 19.4148 14.7826 18.6957 14.7826H16.9565V9.56522H18.6957C19.4148 9.56522 20 10.1504 20 10.8696V13.4783Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <div className="tp-about-help-text">
                      <span>Hot line</span>
                      <a href="tel:+919319300560">+91 9319300560</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* tp-about-area-end */}
    </>
  );
};

export default AboutArea;

