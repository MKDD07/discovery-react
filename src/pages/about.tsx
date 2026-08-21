import React from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import Button from "../components/snippets/button";
import {
  Sparkles,
  Compass,
  ShieldCheck,
  Award,
  Globe2,
  Users2,
  Headphones,
  Plane,
  Building,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Star,
} from "lucide-react";

interface AboutPageProps {
  onBackHome?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBackHome }) => {
  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="tp-page-wrapper bg-white min-vh-100 d-flex flex-column">
      <Header />

      <main className="flex-grow-1">
        {/* ── 1. Hero Section ────────────────────────────────────────────── */}
        <section
          className="tp-about-hero position-relative text-white text-center d-flex align-items-center justify-content-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.85) 100%), url('https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover no-repeat",
            padding: "120px 20px 100px",
          }}
        >
          <div className="container" style={{ maxWidth: "880px" }}>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-20 text-white mb-4">
              <Sparkles size={14} style={{ color: "#84C418" }} />
              <span className="fw-semibold" style={{ fontSize: "12.5px", letterSpacing: "0.5px" }}>
                REDEFINING LUXURY TRAVEL
              </span>
            </div>

            <h1 className="display-4 fw-bold text-white mb-4" style={{ letterSpacing: "-0.5px" }}>
              Crafting Unforgettable Journeys Across The Globe
            </h1>

            <p className="lead text-white text-opacity-90 mb-5 mx-auto" style={{ fontSize: "17px", lineHeight: "1.7", maxWidth: "720px" }}>
              Discovery Convoy is an elite travel discovery and booking platform curating bespoke journeys, world-class resort retreats, private jet escapes, and five-star accommodations for discerning global travelers.
            </p>

            <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
              <Button
                variant="background"
                size="lg"
                onClick={() => navigateTo("/luxury")}
                icon={<Compass size={18} />}
                iconPosition="left"
              >
                Explore Luxury Escapes
              </Button>
              <Button
                variant="stroke"
                size="lg"
                onClick={() => navigateTo("/contact")}
                icon={<Headphones size={18} />}
                iconPosition="left"
                className="text-white border-white border-opacity-50"
              >
                Connect With Concierge
              </Button>
            </div>
          </div>
        </section>

        {/* ── 2. Key Metrics Bar ─────────────────────────────────────────── */}
        <section className="bg-light py-5 border-bottom">
          <div className="container">
            <div className="row g-4 text-center">
              <div className="col-6 col-md-3">
                <div className="p-3">
                  <div className="display-6 fw-800 text-dark mb-1" style={{ color: "#0f172a" }}>
                    150+
                  </div>
                  <div className="text-muted fw-semibold small text-uppercase" style={{ letterSpacing: "0.5px" }}>
                    Global Destinations
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3">
                  <div className="display-6 fw-800 text-dark mb-1" style={{ color: "#0f172a" }}>
                    10,000+
                  </div>
                  <div className="text-muted fw-semibold small text-uppercase" style={{ letterSpacing: "0.5px" }}>
                    Curated Stays & Resorts
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3">
                  <div className="display-6 fw-800 text-dark mb-1" style={{ color: "#0f172a" }}>
                    99.4%
                  </div>
                  <div className="text-muted fw-semibold small text-uppercase" style={{ letterSpacing: "0.5px" }}>
                    Client Satisfaction
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3">
                  <div className="display-6 fw-800 text-dark mb-1" style={{ color: "#0f172a" }}>
                    24/7
                  </div>
                  <div className="text-muted fw-semibold small text-uppercase" style={{ letterSpacing: "0.5px" }}>
                    Private Concierge Support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Brand Story & Mission ───────────────────────────────────── */}
        <section className="py-5 my-md-4">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <div className="position-relative">
                  <img
                    src="https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=900"
                    alt="Luxury Travel Experience"
                    className="img-fluid rounded-4 shadow-lg w-100"
                    style={{ objectFit: "cover", maxHeight: "500px" }}
                  />
                  <div
                    className="position-absolute bg-white p-4 rounded-4 shadow-lg border d-none d-sm-block"
                    style={{ bottom: "-30px", right: "20px", maxWidth: "260px" }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Star size={16} className="text-warning fill-warning" />
                      <Star size={16} className="text-warning fill-warning" />
                      <Star size={16} className="text-warning fill-warning" />
                      <Star size={16} className="text-warning fill-warning" />
                      <Star size={16} className="text-warning fill-warning" />
                    </div>
                    <p className="small text-muted mb-0 fw-semibold">
                      "Discovery Convoy turned our anniversary trip to the Swiss Alps into pure magic."
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="ps-lg-3">
                  <div className="text-uppercase fw-bold small text-muted mb-2" style={{ letterSpacing: "1px" }}>
                    OUR HERITAGE & PHILOSOPHY
                  </div>
                  <h2 className="fw-800 text-dark mb-4 display-6" style={{ letterSpacing: "-0.5px" }}>
                    We Believe Travel Should Be Extraordinary
                  </h2>
                  <p className="text-muted lh-lg mb-4" style={{ fontSize: "15px" }}>
                    Founded with a passion for world-class hospitality and seamless travel discovery, Discovery Convoy connects discerning travelers with the globe's finest destinations. We eliminate the friction of travel planning by combining real-time flight and stay intelligence with personalized, on-the-ground concierge support.
                  </p>
                  <p className="text-muted lh-lg mb-4" style={{ fontSize: "15px" }}>
                    Whether you are seeking a secluded overwater bungalow in the Maldives, a royal heritage palace in Rajasthan, or an exclusive chalet retreat in the Swiss Alps, our travel designers meticulously handcraft every detail to perfection.
                  </p>

                  <div className="row g-3 pt-2">
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center gap-2 text-dark fw-bold small">
                        <CheckCircle2 size={16} style={{ color: "#84C418" }} /> Best Rate Guarantee
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center gap-2 text-dark fw-bold small">
                        <CheckCircle2 size={16} style={{ color: "#84C418" }} /> VIP Room Upgrades
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center gap-2 text-dark fw-bold small">
                        <CheckCircle2 size={16} style={{ color: "#84C418" }} /> 24/7 Dedicated Concierge
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center gap-2 text-dark fw-bold small">
                        <CheckCircle2 size={16} style={{ color: "#84C418" }} /> Flexible Cancellation
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Pillars of Excellence ─────────────────────────────────────── */}
        <section className="bg-light py-5">
          <div className="container py-4">
            <div className="text-center mb-5" style={{ maxWidth: "640px", margin: "0 auto" }}>
              <div className="text-uppercase fw-bold small text-muted mb-2" style={{ letterSpacing: "1px" }}>
                WHY DISCOVERY CONVOY
              </div>
              <h2 className="fw-800 text-dark display-6 mb-3">
                The Luxury Advantage
              </h2>
              <p className="text-muted">
                Experience seamless luxury from the moment of your first inquiry to your journey home.
              </p>
            </div>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="bg-white p-4 rounded-4 border h-100 shadow-sm transition-all hover-shadow">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3 p-3"
                    style={{ background: "rgba(132, 196, 24, 0.12)", color: "#5c8f0a" }}
                  >
                    <Building size={24} />
                  </div>
                  <h5 className="fw-bold text-dark mb-2">Handpicked 5-Star Stays</h5>
                  <p className="text-muted small lh-base mb-0">
                    We rigorously inspect every luxury palace, private villa, and boutique hotel to ensure unparalleled quality, amenities, and service standards.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="bg-white p-4 rounded-4 border h-100 shadow-sm transition-all hover-shadow">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3 p-3"
                    style={{ background: "rgba(15, 23, 42, 0.08)", color: "#0f172a" }}
                  >
                    <Plane size={24} />
                  </div>
                  <h5 className="fw-bold text-dark mb-2">Seamless Flight Booking</h5>
                  <p className="text-muted small lh-base mb-0">
                    Real-time flight search intelligence offering direct connections, competitive premium fares, and effortless airport transfer arrangements.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="bg-white p-4 rounded-4 border h-100 shadow-sm transition-all hover-shadow">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3 p-3"
                    style={{ background: "rgba(132, 196, 24, 0.12)", color: "#5c8f0a" }}
                  >
                    <Headphones size={24} />
                  </div>
                  <h5 className="fw-bold text-dark mb-2">24/7 Personal Concierge</h5>
                  <p className="text-muted small lh-base mb-0">
                    Your dedicated travel advisor is on call around the clock to organize private dining, yacht charters, custom itineraries, and urgent requests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Call To Action ──────────────────────────────────────────── */}
        <section className="py-5 text-center">
          <div className="container py-4" style={{ maxWidth: "760px" }}>
            <div className="p-5 rounded-4 bg-dark text-white position-relative overflow-hidden shadow-lg">
              <h2 className="fw-bold text-white mb-3">Ready For Your Next Odyssey?</h2>
              <p className="text-white text-opacity-80 mb-4 mx-auto" style={{ maxWidth: "560px", fontSize: "15px" }}>
                Let our travel designers create your bespoke luxury itinerary today. Seamless booking, exclusive privileges, and 24/7 on-ground assistance.
              </p>
              <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
                <Button
                  variant="background"
                  size="md"
                  onClick={() => navigateTo("/luxury")}
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                >
                  Browse Curated Stays
                </Button>
                <Button
                  variant="stroke"
                  size="md"
                  onClick={() => navigateTo("/contact")}
                  className="text-white border-white border-opacity-40"
                >
                  Contact Our Desk
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
