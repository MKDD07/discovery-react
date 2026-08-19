import React from "react";

interface CollectionFaqProps {
  location?: string;
}

export const CollectionFaq: React.FC<CollectionFaqProps> = ({ location = "Kashmir" }) => {
  return (
    <>
      {/* tp-faq-area-start */}
      <div className="tp-faq-area tp-faq-city-ptb pt-100 pb-100" style={{ backgroundColor: "#fbfcfd" }}>
        <div className="container container-1350">
          <div className="row gx-25">
            <div className="col-12">
              <div className="text-center mb-50">
                <span className="tp-section-subtitle d-inline-block mb-10 fw-600">
                  <i className="fa-solid fa-circle-question mr-8" style={{ color: "#ff5e14" }}></i>
                  Need Assistance?
                </span>
                <h3 className="tp-tour-details-title fw-600 mb-0">
                  Frequently Asked Questions About {location}
                </h3>
              </div>
            </div>

            {/* Left Column FAQ */}
            <div className="col-lg-6 mb-30">
              <div className="tp-faq-wrap">
                <div className="accordion" id="faq_destination_left">
                  <div className="accordion-item mb-20 shadow-sm rounded-4 border-0">
                    <h2 className="accordion-header" id="faq-d-1">
                      <button
                        className="accordion-button tp-faq-btn rounded-4 fw-600"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq_d_collapse_1"
                        aria-expanded="true"
                        aria-controls="faq_d_collapse_1"
                      >
                        <span className="tp-faq-title">
                          What is the best season to visit {location}?
                        </span>
                      </button>
                    </h2>
                    <div
                      id="faq_d_collapse_1"
                      className="accordion-collapse collapse show"
                      aria-labelledby="faq-d-1"
                      data-bs-parent="#faq_destination_left"
                    >
                      <div className="accordion-body tp-faq-details-para">
                        <p>
                          {location} is wonderful across multiple seasons. Peak summer months (April to August) offer pleasant sightseeing, while winter (November to February) is ideal for snowfall and winter sports adventures.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-20 shadow-sm rounded-4 border-0">
                    <h2 className="accordion-header" id="faq-d-2">
                      <button
                        className="accordion-button collapsed tp-faq-btn rounded-4 fw-600"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq_d_collapse_2"
                        aria-expanded="false"
                        aria-controls="faq_d_collapse_2"
                      >
                        <span className="tp-faq-title">
                          What inclusions are covered in Discovery Convoy packages?
                        </span>
                      </button>
                    </h2>
                    <div
                      id="faq_d_collapse_2"
                      className="accordion-collapse collapse"
                      aria-labelledby="faq-d-2"
                      data-bs-parent="#faq_destination_left"
                    >
                      <div className="accordion-body tp-faq-details-para">
                        <p>
                          All standard packages include verified premium hotel stays, daily breakfast, dedicated AC transport for all transfers & sightseeing, airport pickups, and 24/7 on-tour expert concierge support.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-20 shadow-sm rounded-4 border-0">
                    <h2 className="accordion-header" id="faq-d-3">
                      <button
                        className="accordion-button collapsed tp-faq-btn rounded-4 fw-600"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq_d_collapse_3"
                        aria-expanded="false"
                        aria-controls="faq_d_collapse_3"
                      >
                        <span className="tp-faq-title">
                          Can I customize my daily sightseeing schedule?
                        </span>
                      </button>
                    </h2>
                    <div
                      id="faq_d_collapse_3"
                      className="accordion-collapse collapse"
                      aria-labelledby="faq-d-3"
                      data-bs-parent="#faq_destination_left"
                    >
                      <div className="accordion-body tp-faq-details-para">
                        <p>
                          Yes! Our destination specialists can tailor room categories, extend your trip duration, add private guides, or include special culinary/adventure activities to match your group.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column FAQ */}
            <div className="col-lg-6 mb-30">
              <div className="tp-faq-wrap">
                <div className="accordion" id="faq_destination_right">
                  <div className="accordion-item mb-20 shadow-sm rounded-4 border-0">
                    <h2 className="accordion-header" id="faq-d-4">
                      <button
                        className="accordion-button tp-faq-btn rounded-4 fw-600"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq_d_collapse_4"
                        aria-expanded="true"
                        aria-controls="faq_d_collapse_4"
                      >
                        <span className="tp-faq-title">
                          What are the payment and cancellation policies?
                        </span>
                      </button>
                    </h2>
                    <div
                      id="faq_d_collapse_4"
                      className="accordion-collapse collapse show"
                      aria-labelledby="faq-d-4"
                      data-bs-parent="#faq_destination_right"
                    >
                      <div className="accordion-body tp-faq-details-para">
                        <p>
                          We offer flexible booking with partial deposits upfront. Cancellations made 7–14 days prior to departure qualify for full or flexible rebooking credits depending on partner hotel terms.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-20 shadow-sm rounded-4 border-0">
                    <h2 className="accordion-header" id="faq-d-5">
                      <button
                        className="accordion-button collapsed tp-faq-btn rounded-4 fw-600"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq_d_collapse_5"
                        aria-expanded="false"
                        aria-controls="faq_d_collapse_5"
                      >
                        <span className="tp-faq-title">
                          Are these {location} packages suitable for families and seniors?
                        </span>
                      </button>
                    </h2>
                    <div
                      id="faq_d_collapse_5"
                      className="accordion-collapse collapse"
                      aria-labelledby="faq-d-5"
                      data-bs-parent="#faq_destination_right"
                    >
                      <div className="accordion-body tp-faq-details-para">
                        <p>
                          Absolutely. We design relaxed itineraries with minimal road strain, comfortable vehicles, elevator-equipped partner hotels, and kid-friendly meal options.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-20 shadow-sm rounded-4 border-0">
                    <h2 className="accordion-header" id="faq-d-6">
                      <button
                        className="accordion-button collapsed tp-faq-btn rounded-4 fw-600"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq_d_collapse_6"
                        aria-expanded="false"
                        aria-controls="faq_d_collapse_6"
                      >
                        <span className="tp-faq-title">
                          How do I get in touch with on-ground support?
                        </span>
                      </button>
                    </h2>
                    <div
                      id="faq_d_collapse_6"
                      className="accordion-collapse collapse"
                      aria-labelledby="faq-d-6"
                      data-bs-parent="#faq_destination_right"
                    >
                      <div className="accordion-body tp-faq-details-para">
                        <p>
                          Our dedicated concierge helpline is accessible 24/7 via call or WhatsApp at +91 9319300560 and support@discoveryconvoy.com throughout your entire travel duration.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* tp-faq-area-end */}
    </>
  );
};

export default CollectionFaq;
