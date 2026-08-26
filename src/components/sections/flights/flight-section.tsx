import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { searchFlights, extractFlights, SerpFlightResult } from "../../../services/serpApi";
import FlightCard from "./FlightCard";
import HeadingContainer from "../../snippets/heading-container/heading-container";

export interface FlightRoute {
  id: string;
  from: string;
  to: string;
  label: string;
  icon?: string;
}

export interface FlightSectionProps {
  type: "domestic" | "international";
  title: string;
  subtitle: string;
  iconClass?: string;
  defaultRoute?: FlightRoute;
  routes?: FlightRoute[];
}

const DOMESTIC_FALLBACKS: SerpFlightResult[] = [
  {
    airline: "IndiGo",
    logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&q=80",
    price: "₹3,850",
    currency: "INR",
    duration: 135,
    stops: 0,
    departure: "06:15 AM",
    arrival: "08:30 AM",
    from: "DEL (New Delhi)",
    to: "BOM (Mumbai)",
  },
  {
    airline: "Air India",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&q=80",
    price: "₹4,420",
    currency: "INR",
    duration: 165,
    stops: 0,
    departure: "09:40 AM",
    arrival: "12:25 PM",
    from: "DEL (New Delhi)",
    to: "BLR (Bengaluru)",
  },
  {
    airline: "Vistara",
    logo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&q=80",
    price: "₹4,190",
    currency: "INR",
    duration: 150,
    stops: 0,
    departure: "11:20 AM",
    arrival: "01:50 PM",
    from: "BOM (Mumbai)",
    to: "GOI (Goa)",
  },
  {
    airline: "SpiceJet",
    logo: "https://images.unsplash.com/photo-1517479180996-8554b1a55b0e?w=100&q=80",
    price: "₹3,450",
    currency: "INR",
    duration: 120,
    stops: 0,
    departure: "02:15 PM",
    arrival: "04:15 PM",
    from: "DEL (New Delhi)",
    to: "SXR (Srinagar)",
  },
  {
    airline: "Akasa Air",
    logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&q=80",
    price: "₹3,990",
    currency: "INR",
    duration: 140,
    stops: 0,
    departure: "05:00 PM",
    arrival: "07:20 PM",
    from: "BLR (Bengaluru)",
    to: "DEL (New Delhi)",
  },
  {
    airline: "Air India Express",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&q=80",
    price: "₹3,750",
    currency: "INR",
    duration: 110,
    stops: 0,
    departure: "07:45 PM",
    arrival: "09:35 PM",
    from: "HYD (Hyderabad)",
    to: "MAA (Chennai)",
  },
];

const INTERNATIONAL_FALLBACKS: SerpFlightResult[] = [
  {
    airline: "Emirates",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&q=80",
    price: "₹18,500",
    currency: "INR",
    duration: 230,
    stops: 0,
    departure: "04:30 AM",
    arrival: "07:00 AM",
    from: "DEL (New Delhi)",
    to: "DXB (Dubai)",
  },
  {
    airline: "Singapore Airlines",
    logo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&q=80",
    price: "₹22,900",
    currency: "INR",
    duration: 330,
    stops: 0,
    departure: "08:15 AM",
    arrival: "04:15 PM",
    from: "DEL (New Delhi)",
    to: "SIN (Singapore)",
  },
  {
    airline: "Qatar Airways",
    logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&q=80",
    price: "₹26,400",
    currency: "INR",
    duration: 270,
    stops: 0,
    departure: "03:45 AM",
    arrival: "06:00 AM",
    from: "BOM (Mumbai)",
    to: "DOH (Doha)",
  },
  {
    airline: "Thai Airways",
    logo: "https://images.unsplash.com/photo-1517479180996-8554b1a55b0e?w=100&q=80",
    price: "₹15,800",
    currency: "INR",
    duration: 255,
    stops: 0,
    departure: "11:30 PM",
    arrival: "05:15 AM",
    from: "DEL (New Delhi)",
    to: "BKK (Bangkok)",
  },
  {
    airline: "British Airways",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&q=80",
    price: "₹48,200",
    currency: "INR",
    duration: 570,
    stops: 0,
    departure: "01:50 AM",
    arrival: "06:50 AM",
    from: "DEL (New Delhi)",
    to: "LHR (London Heathrow)",
  },
  {
    airline: "Air France",
    logo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&q=80",
    price: "₹46,900",
    currency: "INR",
    duration: 550,
    stops: 0,
    departure: "02:10 AM",
    arrival: "07:30 AM",
    from: "BOM (Mumbai)",
    to: "CDG (Paris)",
  },
];

export const FlightSection: React.FC<FlightSectionProps> = ({
  type,
  title,
  subtitle,
  iconClass = "fa-solid fa-plane-departure",
  defaultRoute,
  routes = [],
}) => {
  const [activeRoute, setActiveRoute] = useState<FlightRoute>(
    defaultRoute || (routes.length > 0 ? routes[0] : { id: "del-bom", from: "DEL", to: "BOM", label: "Delhi to Mumbai" })
  );
  const [flights, setFlights] = useState<SerpFlightResult[]>(
    type === "domestic" ? DOMESTIC_FALLBACKS : INTERNATIONAL_FALLBACKS
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    searchFlights({
      departure_id: activeRoute.from,
      arrival_id: activeRoute.to,
      query: `cheap flights ${activeRoute.from} to ${activeRoute.to}`,
      currency: "INR",
    })
      .then((data) => {
        if (!isMounted) return;
        const extracted = extractFlights(data, 8);
        if (extracted && extracted.length > 0) {
          setFlights(extracted);
        } else {
          setFlights(type === "domestic" ? DOMESTIC_FALLBACKS : INTERNATIONAL_FALLBACKS);
        }
      })
      .catch((err) => {
        console.warn(`FlightSection (${type}) SerpApi fetch fallback:`, err);
        if (isMounted) {
          setFlights(type === "domestic" ? DOMESTIC_FALLBACKS : INTERNATIONAL_FALLBACKS);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeRoute, type]);

  return (
    <section className="tp-flight-section pt-90 pb-80 p-relative" style={{ backgroundColor: "#fbfcfd" }}>
      <div className="container">
        {/* Section Header using Premade Snippet */}
        <HeadingContainer
          subtitle={subtitle}
          title={title}
          iconClass={iconClass}
          showIcon={true}
          showBtn={false}
        />

        {/* Route Tabs below Heading */}
        {routes.length > 0 && (
          <div className="tp-tour-tab mb-35">
            <ul role="tablist">
              {routes.map((route) => {
                const isActive = activeRoute.id === route.id;
                return (
                  <li className="nav-tab-item" role="presentation" key={route.id}>
                    <a
                      href={`#${route.id}`}
                      role="tab"
                      aria-selected={isActive}
                      className={isActive ? "active" : ""}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveRoute(route);
                      }}
                    >
                      {route.icon && <i className={`${route.icon} mr-5`} />}
                      {route.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Flight Cards Carousel */}
        {loading ? (
          <div className="row g-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="col-xl-3 col-lg-4 col-md-6">
                <div
                  className="bg-white rounded-4 p-4 shadow-sm h-100 placeholder-glow"
                  style={{ height: "240px", border: "1px solid #edf2f7" }}
                >
                  <div className="placeholder col-6 mb-3"></div>
                  <div className="placeholder col-12 mb-4" style={{ height: "40px" }}></div>
                  <div className="placeholder col-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-relative">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                prevEl: `.tp-flight-slider-arrow-prev-${type}`,
                nextEl: `.tp-flight-slider-arrow-next-${type}`,
              }}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 15 },
                576: { slidesPerView: 2, spaceBetween: 20 },
                1200: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="tp-tour-swiper"
            >
              {flights.map((flight, idx) => (
                <SwiperSlide key={`${flight.airline}-${idx}`}>
                  <FlightCard flight={flight} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="tp-tour-slider-arrow-box d-none d-md-flex align-items-center justify-content-between">
              <button
                className={`tp-tour-slider-arrow-prev tp-flight-slider-arrow-prev-${type}`}
                tabIndex={0}
                aria-label="Previous slide"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                className={`tp-tour-slider-arrow-next tp-flight-slider-arrow-next-${type}`}
                tabIndex={0}
                aria-label="Next slide"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FlightSection;
