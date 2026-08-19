import React, { useState, useEffect, useRef } from "react";
import { loadAllPexelsMedia } from "../pexels/PexelsMediaSection";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

const FAQS_DATA: FaqItem[] = [
  {
    id: 1,
    question: "How do I book a holiday package with Discovery Convoy?",
    answer:
      "You can effortlessly book through our online search bar by choosing your preferred destination, departure date, and tour style, or get in touch directly with our travel specialists via phone (+91 9319300560) or email for a personalized itinerary.",
    category: "Booking",
  },
  {
    id: 2,
    question: "Can I customize an existing domestic or international tour package?",
    answer:
      "Yes, absolutely! All our packages can be tailored to match your pace, hotel preferences, activities, and budget. Contact our concierge team to add extra nights, private transfers, or exclusive local excursions.",
    category: "Customization",
  },
  {
    id: 3,
    question: "What cancellation and refund policies do you offer?",
    answer:
      "We offer flexible cancellation policies depending on the airline and hotel partners. Free cancellations are available on select refundable stays up to 48-72 hours prior to departure. Full terms will be clearly outlined prior to confirmation.",
    category: "Cancellation",
  },
  {
    id: 4,
    question: "Do you provide visa assistance for international destinations?",
    answer:
      "Yes, our visa concierge team provides step-by-step guidance, document verification, appointment scheduling, and fast-track processing assistance for Schengen, UK, US, UAE, Thailand, Singapore, and 50+ other global destinations.",
    category: "Visa Support",
  },
  {
    id: 5,
    question: "What 24/7 on-trip assistance is included during my vacation?",
    answer:
      "Every guest receives dedicated 24/7 on-trip support from our round-the-clock emergency response team and local destination managers to resolve flight delays, hotel changes, or on-ground queries immediately.",
    category: "Assistance",
  },
];

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<number>(1);
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (faqRef.current) {
      loadAllPexelsMedia(faqRef.current);
    }
  }, []);

  const toggleFaq = (id: number) => {
    setOpenId((prev) => (prev === id ? 0 : id));
  };

  return (
    <section ref={faqRef} className="tp-faq-area pt-120 pb-110 p-relative bg-white">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Column: Pexels Image Showcase */}
          <div className="col-xl-5 col-lg-6 mb-50 mb-lg-0">
            <div className="p-relative">
              {/* Main Pexels Image */}
              <div
                className="rounded-4 overflow-hidden shadow-sm p-relative"
                style={{ height: "480px", borderRadius: "20px" }}
              >
                <img
                  className="w-100 h-100"
                  src="assets/img/faq/faq-thumb.jpg"
                  data-pexels="happy traveler consulting travel guide map smiling outdoor"
                  data-type="image"
                  data-quality="large"
                  alt="Travel Consultation"
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Floating Experience Badge */}
              <div
                className="p-absolute bg-white p-3 rounded-4 shadow d-flex align-items-center gap-3"
                style={{
                  bottom: "-25px",
                  right: "-20px",
                  maxWidth: "260px",
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#fff3ed",
                    color: "#111",
                    fontSize: "20px",
                  }}
                >
                  <i className="fa-solid fa-headset"></i>
                </div>
                <div>
                  <h6 className="mb-0 fw-700" style={{ fontSize: "14px" }}>
                    Expert Support
                  </h6>
                  <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
                    Talk to our trip advisors 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Section Header & Accordion */}
          <div className="col-xl-7 col-lg-6">
            <div className="pl-lg-40">
              <div className="tp-section-title-wrap mb-35">
                <span className="tp-section-subtitle d-inline-block mb-10 fw-600">
                  <i className="fa-solid fa-circle-question mr-8" style={{ color: "#ff5e14" }}></i>
                  Frequently Asked Questions
                </span>
                <h2 className="tp-section-title fw-600 mb-15">
                  Everything you need to know about your trip
                </h2>
                <p className="text-muted mb-0" style={{ fontSize: "15px", lineHeight: "1.6" }}>
                  Find answers to common questions about bookings, customizations, safety, and our 24/7 dedicated travel support.
                </p>
              </div>

              {/* Accordion List */}
              <div className="d-flex flex-column gap-3">
                {FAQS_DATA.map((faq) => {
                  const isOpen = openId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-4 transition"
                      style={{
                        border: isOpen
                          ? "1px solid rgba(255, 94, 20, 0.3)"
                          : "1px solid #edf2f7",
                        backgroundColor: isOpen ? "#fffaf8" : "#fff",
                        borderRadius: "14px",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-100 text-start p-3 d-flex align-items-center justify-content-between border-0 bg-transparent"
                        style={{ cursor: "pointer", outline: "none" }}
                        aria-expanded={isOpen}
                      >
                        <span
                          className="fw-600 pr-3"
                          style={{
                            fontSize: "16px",
                            color: isOpen ? "#111" : "#333",
                          }}
                        >
                          {faq.question}
                        </span>
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                          style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: isOpen ? "#ff5e14" : "#f1f5f9",
                            color: isOpen ? "#fff" : "#64748b",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <i
                            className={`fa-solid ${
                              isOpen ? "fa-minus" : "fa-plus"
                            }`}
                            style={{ fontSize: "12px" }}
                          ></i>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-3 pb-3 pt-1">
                          <p
                            className="mb-0"
                            style={{
                              fontSize: "14px",
                              lineHeight: "1.65",
                              color: "#64748b",
                            }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
