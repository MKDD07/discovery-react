import React, { useEffect, useRef } from "react";
import { loadAllPexelsMedia } from "../pexels/PexelsMediaSection";

export const ChoseArea: React.FC = () => {
  const choseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (choseRef.current) {
      loadAllPexelsMedia(choseRef.current);
    }
  }, []);

  return (
    <>
      {/* tp-chose-area-start */}
      <div ref={choseRef} className="tp-chose-area pt-160 pb-80 tp-section-pt tp-section-pb">
        <div className="container">
          <div className="row">
            <div className="col-xl-6">
              <div className="tp-chose-section-title p-relative mb-60">
                <span
                  className="tp-section-subtitle d-inline-block mb-15 wow fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".3s"
                >
                  Why Choose Us
                </span>
                <h2
                  className="tp-section-title fw-600 mb-10 wow fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".4s"
                >
                  Reasons people
                  <br /> love traveling with us
                </h2>
                <p
                  className="mb-40 wow fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".5s"
                >
                  We’re more than just a travel service, we’re your trusted companion on
                  <br /> every journey from booking to local tips.
                </p>
                <a
                  href="#about"
                  className="tp-btn wow fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".6s"
                >
                  Learn more
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
            </div>
            <div className="col-xl-6">
              <div className="tp-chose-wrap">
                <div
                  className="tp-chose-item mb-60"
                  data-bg-color="#f7e4fe"
                  style={{ backgroundColor: "rgb(247, 228, 254)" }}
                >
                  <div className="row">
                    <div className="col-md-7">
                      <div className="tp-chose-content">
                        <h3 className="tp-chose-numbar">01</h3>
                        <h4 className="tp-chose-title">
                          <a href="#experts">Meet our travel experts</a>
                        </h4>
                        <p className="tp-chose-dec mb-25">
                          We’re more than just a travel service, we’re your
                          <br /> trusted companion on every journey.
                        </p>
                        <a href="#experts" className="tp-btn-solid">
                          Learn more
                          <svg
                            width={13}
                            height={12}
                            viewBox="0 0 13 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.3577 5.75L0.750066 5.75"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7.03557 10.75C7.03557 10.75 11.75 7.06751 11.75 5.74994C11.75 4.43236 7.03549 0.75 7.03549 0.75"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="tp-chose-thumb ml-40">
                        <img
                          className="w-100"
                          src="assets/img/chose/thumb.jpg"
                          data-pexels="travel tour guide smiling outdoor"
                          data-type="image"
                          data-quality="large"
                          alt="Travel Experts"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tp-chose-item mb-60"
                  data-bg-color="#ecf8f1"
                  style={{ backgroundColor: "rgb(236, 248, 241)" }}
                >
                  <div className="row">
                    <div className="col-md-7">
                      <div className="tp-chose-content">
                        <h3 className="tp-chose-numbar">02</h3>
                        <h4 className="tp-chose-title">
                          <a href="#customized">Customized holiday packages</a>
                        </h4>
                        <p className="tp-chose-dec mb-25">
                          Personalized routes crafted around your unique
                          <br /> preferences and travel wishlist.
                        </p>
                        <a href="#customized" className="tp-btn-solid">
                          Learn more
                          <svg
                            width={13}
                            height={12}
                            viewBox="0 0 13 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.3577 5.75L0.750066 5.75"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7.03557 10.75C7.03557 10.75 11.75 7.06751 11.75 5.74994C11.75 4.43236 7.03549 0.75 7.03549 0.75"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="tp-chose-thumb ml-40">
                        <img
                          className="w-100"
                          src="assets/img/chose/thumb-2.jpg"
                          data-pexels="scenic mountain hiking lake vacation"
                          data-type="image"
                          data-quality="large"
                          alt="Customized Packages"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tp-chose-item mb-60"
                  data-bg-color="#fef9ce"
                  style={{ backgroundColor: "rgb(254, 249, 206)" }}
                >
                  <div className="row">
                    <div className="col-md-7">
                      <div className="tp-chose-content">
                        <h3 className="tp-chose-numbar">03</h3>
                        <h4 className="tp-chose-title">
                          <a href="#support">24/7 dedicated assistance</a>
                        </h4>
                        <p className="tp-chose-dec mb-25">
                          Seamless customer support standing by
                          <br /> before, during, and after every voyage.
                        </p>
                        <a href="#support" className="tp-btn-solid">
                          Learn more
                          <svg
                            width={13}
                            height={12}
                            viewBox="0 0 13 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.3577 5.75L0.750066 5.75"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7.03557 10.75C7.03557 10.75 11.75 7.06751 11.75 5.74994C11.75 4.43236 7.03549 0.75 7.03549 0.75"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="tp-chose-thumb ml-40">
                        <img
                          className="w-100"
                          src="assets/img/chose/thumb-3.jpg"
                          data-pexels="happy travelers couple looking map exploring"
                          data-type="image"
                          data-quality="large"
                          alt="Dedicated Assistance"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* tp-chose-area-end */}
    </>
  );
};

export default ChoseArea;

