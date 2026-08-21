import React, { useState } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import Button from "../components/snippets/button";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  Headphones,
  ShieldCheck,
  MessageSquare,
  Building,
  Calendar,
} from "lucide-react";

interface ContactPageProps {
  onBackHome?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBackHome }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    destination: "",
    travelType: "Luxury Leisure",
    guests: "2",
    dates: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="tp-page-wrapper bg-white min-vh-100 d-flex flex-column">
      <Header />

      <main className="flex-grow-1">
        {/* ── 1. Hero Section ────────────────────────────────────────────── */}
        <section
          className="tp-contact-hero position-relative text-white text-center d-flex align-items-center justify-content-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%), url('https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover no-repeat",
            padding: "100px 20px 80px",
          }}
        >
          <div className="container" style={{ maxWidth: "800px" }}>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-20 text-white mb-3">
              <Sparkles size={14} style={{ color: "#84C418" }} />
              <span className="fw-semibold" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                24/7 PRIVATE CONCIERGE DESK
              </span>
            </div>

            <h1 className="display-5 fw-bold text-white mb-3" style={{ letterSpacing: "-0.5px" }}>
              How Can We Craft Your Next Odyssey?
            </h1>

            <p className="text-white text-opacity-85 mx-auto mb-0" style={{ fontSize: "16px", lineHeight: "1.7", maxWidth: "620px" }}>
              Whether you wish to reserve a private island, plan a corporate retreat, or require urgent booking assistance, our travel advisors are available 24/7.
            </p>
          </div>
        </section>

        {/* ── 2. Contact Cards & Interactive Form ────────────────────────── */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row g-4 align-items-stretch">
              {/* Left Column: Direct Contact Details */}
              <div className="col-lg-5">
                <div className="d-flex flex-column gap-3 h-100">
                  {/* Phone Helpline Card */}
                  <div className="bg-white p-4 rounded-4 border shadow-sm">
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-3 p-3 text-dark"
                        style={{ background: "rgba(132, 196, 24, 0.15)", color: "#5c8f0a" }}
                      >
                        <Phone size={22} />
                      </div>
                      <div>
                        <div className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: "0.5px" }}>
                          24/7 Concierge Hotline
                        </div>
                        <a
                          href="tel:+919319300560"
                          className="fs-5 fw-800 text-dark text-decoration-none d-block mt-1 hover-primary"
                        >
                          +91 9319300560
                        </a>
                        <p className="text-muted small mb-0 mt-1">
                          Direct phone & WhatsApp support for immediate bookings.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email Support Card */}
                  <div className="bg-white p-4 rounded-4 border shadow-sm">
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-3 p-3 text-dark"
                        style={{ background: "rgba(15, 23, 42, 0.08)", color: "#0f172a" }}
                      >
                        <Mail size={22} />
                      </div>
                      <div>
                        <div className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: "0.5px" }}>
                          Email Inquiries
                        </div>
                        <a
                          href="mailto:support@discoveryconvoy.com"
                          className="fs-6 fw-bold text-dark text-decoration-none d-block mt-1 hover-primary"
                        >
                          support@discoveryconvoy.com
                        </a>
                        <p className="text-muted small mb-0 mt-1">
                          Responses guaranteed within 2 hours by senior advisors.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Office Headquarters Card */}
                  <div className="bg-white p-4 rounded-4 border shadow-sm">
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-3 p-3 text-dark"
                        style={{ background: "rgba(132, 196, 24, 0.15)", color: "#5c8f0a" }}
                      >
                        <MapPin size={22} />
                      </div>
                      <div>
                        <div className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: "0.5px" }}>
                          Global Headquarters
                        </div>
                        <div className="fw-bold text-dark mt-1" style={{ fontSize: "14.5px" }}>
                          DLF Cyber City, Tower B
                        </div>
                        <p className="text-muted small mb-0 mt-1">
                          Gurugram, NCR New Delhi, India
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Working Hours Card */}
                  <div className="bg-white p-4 rounded-4 border shadow-sm flex-grow-1">
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-3 p-3 text-dark"
                        style={{ background: "rgba(15, 23, 42, 0.08)", color: "#0f172a" }}
                      >
                        <Clock size={22} />
                      </div>
                      <div>
                        <div className="text-muted small fw-semibold text-uppercase" style={{ letterSpacing: "0.5px" }}>
                          Operational Schedule
                        </div>
                        <div className="fw-bold text-dark mt-1" style={{ fontSize: "14.5px" }}>
                          24 Hours • 7 Days a Week • 365 Days
                        </div>
                        <p className="text-muted small mb-0 mt-1">
                          Round-the-clock worldwide operational desk.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Luxury Inquiry Form */}
              <div className="col-lg-7">
                <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm h-100">
                  {formSubmitted ? (
                    <div className="text-center py-5">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3"
                        style={{ background: "rgba(132, 196, 24, 0.15)", color: "#5c8f0a", width: "64px", height: "64px" }}
                      >
                        <CheckCircle2 size={36} />
                      </div>
                      <h3 className="fw-bold text-dark mb-2">Inquiry Received with Priority</h3>
                      <p className="text-muted mx-auto mb-4" style={{ maxWidth: "480px", fontSize: "14.5px" }}>
                        Thank you, <strong>{formData.fullName || "valued traveler"}</strong>. A dedicated Discovery Convoy luxury travel designer has been assigned to your request and will contact you shortly.
                      </p>
                      <Button
                        variant="background"
                        size="md"
                        onClick={() => setFormSubmitted(false)}
                      >
                        Send Another Inquiry
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <h3 className="fw-800 text-dark mb-1" style={{ letterSpacing: "-0.3px" }}>
                          Bespoke Travel Inquiry
                        </h3>
                        <p className="text-muted small mb-0">
                          Please provide your travel preferences and our concierge will curate a personalized proposal.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                          {/* Full Name */}
                          <div className="col-md-6">
                            <label className="form-label text-dark fw-bold small mb-1">
                              Your Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              className="form-control bg-light border-0 px-3 fw-semibold"
                              placeholder="e.g. Alexander Vance"
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              style={{ height: "46px", borderRadius: "12px", fontSize: "13.5px" }}
                            />
                          </div>

                          {/* Email Address */}
                          <div className="col-md-6">
                            <label className="form-label text-dark fw-bold small mb-1">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              required
                              className="form-control bg-light border-0 px-3 fw-semibold"
                              placeholder="e.g. alex@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              style={{ height: "46px", borderRadius: "12px", fontSize: "13.5px" }}
                            />
                          </div>

                          {/* Phone Number */}
                          <div className="col-md-6">
                            <label className="form-label text-dark fw-bold small mb-1">
                              Phone / WhatsApp *
                            </label>
                            <input
                              type="tel"
                              required
                              className="form-control bg-light border-0 px-3 fw-semibold"
                              placeholder="+91 / +1 (with country code)"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              style={{ height: "46px", borderRadius: "12px", fontSize: "13.5px" }}
                            />
                          </div>

                          {/* Destination of Interest */}
                          <div className="col-md-6">
                            <label className="form-label text-dark fw-bold small mb-1">
                              Destination of Interest
                            </label>
                            <input
                              type="text"
                              className="form-control bg-light border-0 px-3 fw-semibold"
                              placeholder="e.g. Maldives, Swiss Alps, Dubai"
                              value={formData.destination}
                              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                              style={{ height: "46px", borderRadius: "12px", fontSize: "13.5px" }}
                            />
                          </div>

                          {/* Travel Type */}
                          <div className="col-md-6">
                            <label className="form-label text-dark fw-bold small mb-1">
                              Journey Type
                            </label>
                            <select
                              className="form-select bg-light border-0 px-3 fw-semibold"
                              value={formData.travelType}
                              onChange={(e) => setFormData({ ...formData, travelType: e.target.value })}
                              style={{ height: "46px", borderRadius: "12px", fontSize: "13.5px" }}
                            >
                              <option value="Luxury Leisure">Luxury Leisure / Holiday</option>
                              <option value="Honeymoon & Romantic">Honeymoon & Romantic</option>
                              <option value="Private Villa Stay">Private Villa Stay</option>
                              <option value="Corporate & VIP Retreat">Corporate & VIP Retreat</option>
                              <option value="Private Aviation & Yacht">Private Aviation & Yacht</option>
                            </select>
                          </div>

                          {/* Approximate Dates */}
                          <div className="col-md-6">
                            <label className="form-label text-dark fw-bold small mb-1">
                              Target Dates / Month
                            </label>
                            <input
                              type="text"
                              className="form-control bg-light border-0 px-3 fw-semibold"
                              placeholder="e.g. October 2026 (7 Nights)"
                              value={formData.dates}
                              onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                              style={{ height: "46px", borderRadius: "12px", fontSize: "13.5px" }}
                            />
                          </div>

                          {/* Custom Message / Special Requests */}
                          <div className="col-12">
                            <label className="form-label text-dark fw-bold small mb-1">
                              Special Requests or Preferences
                            </label>
                            <textarea
                              rows={4}
                              className="form-control bg-light border-0 p-3 fw-semibold"
                              placeholder="Tell us about your room preferences, dietary requirements, flight class, or special celebration details..."
                              value={formData.message}
                              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                              style={{ borderRadius: "12px", fontSize: "13.5px", resize: "none" }}
                            ></textarea>
                          </div>

                          {/* Submit CTA */}
                          <div className="col-12 pt-2">
                            <Button
                              variant="background"
                              size="lg"
                              type="submit"
                              fullWidth
                              icon={<Send size={16} />}
                              iconPosition="right"
                            >
                              Submit Luxury Concierge Request
                            </Button>
                          </div>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
