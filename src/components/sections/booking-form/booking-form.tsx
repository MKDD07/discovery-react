import React, { useState } from "react";
import SerpAPI, { SerpHotelResult, SerpOrganicResult } from "../../../services/serpApi";
import {
  Package,
  Building,
  Plane,
  Route,
  MapPin,
  Calendar,
  Users,
  Search,
  Star,
  ArrowUpRight,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export type BookingTab = "packages" | "hotels" | "flights" | "travels";

const IATA_AIRPORTS = [
  { code: "DEL", city: "New Delhi", name: "Indira Gandhi Intl Airport, India" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj Intl, India" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda Intl Airport, India" },
  { code: "MAA", city: "Chennai", name: "Chennai Intl Airport, India" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhash Chandra Bose Intl, India" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi Intl Airport, India" },
  { code: "JFK", city: "New York", name: "John F. Kennedy Intl Airport, USA" },
  { code: "LHR", city: "London", name: "London Heathrow Airport, UK" },
  { code: "DXB", city: "Dubai", name: "Dubai International Airport, UAE" },
  { code: "SIN", city: "Singapore", name: "Singapore Changi Airport, Singapore" },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport, Thailand" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle Airport, France" },
  { code: "HND", city: "Tokyo", name: "Haneda Airport, Japan" },
];

export interface BookingFormProps {
  activeTab?: BookingTab;
  onTabChange?: (tab: BookingTab) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  activeTab: controlledActiveTab,
  onTabChange,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<BookingTab>("packages");
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  // Input States
  const [location, setLocation] = useState("");
  const [originIata, setOriginIata] = useState("DEL");
  const [destIata, setDestIata] = useState("JFK");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  // Dropdown visibility toggles
  const [showLocationList, setShowLocationList] = useState(false);

  // Search Results & Loading State
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTabChange = (tab: BookingTab) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tab);
    }
    onTabChange?.(tab);
    setSearchResults([]);
    setSearched(false);
    setShowLocationList(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setShowLocationList(false);

    try {
      if (activeTab === "packages") {
        const query = location.trim() ? `${location.trim()} tour packages holiday deals` : "India tour packages holiday deals";
        const data = await SerpAPI.searchHome(query);
        const results = SerpAPI.extractOrganicResults(data, 6);
        setSearchResults(results);
      } else if (activeTab === "hotels") {
        const query = location.trim() || "Goa, India";
        const data = await SerpAPI.searchHotels({
          q: query,
          check_in: checkIn || undefined,
          check_out: checkOut || undefined,
        });
        const results = SerpAPI.extractHotels(data, 6);
        setSearchResults(results);
      } else if (activeTab === "flights") {
        const query = `cheap flights from ${originIata} to ${destIata}`;
        const data = await SerpAPI.searchFlights({ query });
        const results = SerpAPI.extractFlights(data, 6);
        setSearchResults(results);
      } else if (activeTab === "travels") {
        const query = location.trim() ? `travel guide itineraries ${location}` : "top travel itineraries & guides";
        const data = await SerpAPI.searchHome(query);
        const results = SerpAPI.extractOrganicResults(data, 6);
        setSearchResults(results);
      }
    } catch (err) {
      console.error("Booking search error:", err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const navigateToTour = (title: string, loc?: string, price?: string) => {
    const slug = encodeURIComponent(title);
    const searchParams = new URLSearchParams();
    if (price) searchParams.set("price", price);
    if (loc) searchParams.set("loc", loc);
    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : "";
    window.history.pushState({}, "", `/tour/${slug}${queryStr}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="tp-booking-form-area py-4" style={{ marginTop: "-55px", position: "relative", zIndex: 30 }}>
      <div className="container container-1350">
        <div className="row justify-content-center">
          <div className="col-12">
            {/* Glassmorphism Blurred Background Container */}
            <div
              className="tp-booking-form tp-booking-6-form rounded-4 p-4 p-md-5 border shadow-lg"
              style={{
                background: "rgba(255, 255, 255, 0.88)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderColor: "rgba(255, 255, 255, 0.6)",
                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.12)",
              }}
            >
              {/* Category Navigation Tabs */}
              <div className="tp-booking-nav-tabs d-flex align-items-center gap-2 mb-4 flex-wrap">
                <button
                  type="button"
                  className={`btn btn-sm px-4 py-2 rounded-pill fw-600 d-inline-flex align-items-center gap-2 transition-all ${
                    activeTab === "packages"
                      ? "tp-btn text-white shadow-sm"
                      : "bg-white text-dark border hover-bg-light"
                  }`}
                  style={{ fontSize: "13px" }}
                  onClick={() => handleTabChange("packages")}
                >
                  <Package size={15} /> Packages
                </button>

                <button
                  type="button"
                  className={`btn btn-sm px-4 py-2 rounded-pill fw-600 d-inline-flex align-items-center gap-2 transition-all ${
                    activeTab === "hotels"
                      ? "tp-btn text-white shadow-sm"
                      : "bg-white text-dark border hover-bg-light"
                  }`}
                  style={{ fontSize: "13px" }}
                  onClick={() => handleTabChange("hotels")}
                >
                  <Building size={15} /> Hotels
                </button>

                <button
                  type="button"
                  className={`btn btn-sm px-4 py-2 rounded-pill fw-600 d-inline-flex align-items-center gap-2 transition-all ${
                    activeTab === "flights"
                      ? "tp-btn text-white shadow-sm"
                      : "bg-white text-dark border hover-bg-light"
                  }`}
                  style={{ fontSize: "13px" }}
                  onClick={() => handleTabChange("flights")}
                >
                  <Plane size={15} /> Flights (IATA)
                </button>

                <button
                  type="button"
                  className={`btn btn-sm px-4 py-2 rounded-pill fw-600 d-inline-flex align-items-center gap-2 transition-all ${
                    activeTab === "travels"
                      ? "tp-btn text-white shadow-sm"
                      : "bg-white text-dark border hover-bg-light"
                  }`}
                  style={{ fontSize: "13px" }}
                  onClick={() => handleTabChange("travels")}
                >
                  <Route size={15} /> Travels
                </button>
              </div>

              {/* Main Booking Search Form */}
              <form onSubmit={handleSearch}>
                <div className="tp-booking-wrap d-flex flex-column flex-lg-row align-items-stretch align-items-lg-end gap-3">
                  {/* Field 1: Destination / Hotel / Origin */}
                  {activeTab !== "flights" ? (
                    <div className="tp-booking-location tp-booking-col-1 p-relative flex-grow-1">
                      <span className="tp-booking-6-title fw-600 d-inline-block mb-2 text-dark" style={{ fontSize: "13px" }}>
                        {activeTab === "packages" && "Package Destination"}
                        {activeTab === "hotels" && "Hotel Location"}
                        {activeTab === "travels" && "Travel Spot"}
                      </span>
                      <div className="tp-booking-location-input tp-booking-toggle p-relative">
                        <span className="tp-booking-input-icon text-muted">
                          <MapPin size={16} />
                        </span>
                        <input
                          className="tp-input bg-white rounded-3 border ps-5"
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          onFocus={() => setShowLocationList(true)}
                          placeholder="Where to ? (e.g. Goa, Kashmir, Dubai)"
                          style={{ fontSize: "13.5px", height: "48px" }}
                        />
                      </div>

                      {/* Autocomplete Suggestions */}
                      {showLocationList && (
                        <div
                          className="tp-booking-location-list tp-booking-toggle-active position-absolute top-100 start-0 w-100 bg-white rounded-3 border shadow-lg mt-1 p-2"
                          style={{ zIndex: 999 }}
                        >
                          <div className="tp-booking-location-inner">
                            <span className="tp-booking-location-suggested d-block text-muted px-3 py-1 font-monospace small">
                              Suggested destinations
                            </span>
                            <ul className="list-unstyled mb-0">
                              {[
                                { city: "Goa, India", desc: "Pristine beaches & nightlife" },
                                { city: "Kashmir, India", desc: "Snow valleys & scenic mountains" },
                                { city: "Dubai, UAE", desc: "Luxury resorts & desert safari" },
                                { city: "Kerala, India", desc: "Peaceful backwaters & tea estates" },
                                { city: "Paris, France", desc: "Historic landmarks & romance" },
                              ].map((item, idx) => (
                                <li
                                  key={idx}
                                  className="px-3 py-2 rounded-2 hover-bg-light cursor-pointer transition-all"
                                  onClick={() => {
                                    setLocation(item.city);
                                    setShowLocationList(false);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="tp-booking-location-content">
                                    <span className="fw-600 text-dark d-block" style={{ fontSize: "13px" }}>
                                      {item.city}
                                    </span>
                                    <p className="text-muted small mb-0">{item.desc}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Flight Origin */}
                      <div className="tp-booking-location tp-booking-col-1 p-relative flex-grow-1">
                        <span className="tp-booking-6-title fw-600 d-inline-block mb-2 text-dark" style={{ fontSize: "13px" }}>
                          From (Origin IATA)
                        </span>
                        <div className="tp-booking-location-input p-relative">
                          <span className="tp-booking-input-icon text-muted">
                            <Plane size={16} />
                          </span>
                          <select
                            className="tp-input bg-white rounded-3 border ps-5 w-100"
                            value={originIata}
                            onChange={(e) => setOriginIata(e.target.value)}
                            style={{ fontSize: "13.5px", height: "48px" }}
                          >
                            {IATA_AIRPORTS.map((ap, idx) => (
                              <option key={idx} value={ap.code}>
                                {ap.code} - {ap.city} ({ap.name})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Flight Destination */}
                      <div className="tp-booking-location tp-booking-col-1 p-relative flex-grow-1">
                        <span className="tp-booking-6-title fw-600 d-inline-block mb-2 text-dark" style={{ fontSize: "13px" }}>
                          To (Destination IATA)
                        </span>
                        <div className="tp-booking-location-input p-relative">
                          <span className="tp-booking-input-icon text-muted">
                            <Plane size={16} style={{ transform: "rotate(45deg)" }} />
                          </span>
                          <select
                            className="tp-input bg-white rounded-3 border ps-5 w-100"
                            value={destIata}
                            onChange={(e) => setDestIata(e.target.value)}
                            style={{ fontSize: "13.5px", height: "48px" }}
                          >
                            {IATA_AIRPORTS.map((ap, idx) => (
                              <option key={idx} value={ap.code}>
                                {ap.code} - {ap.city} ({ap.name})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Field 2: Check-In - Check-Out */}
                  <div className="tp-booking-location tp-booking-col-2 tp-booking-datepicker p-relative flex-grow-1">
                    <span className="tp-booking-6-title fw-600 d-inline-block mb-2 text-dark" style={{ fontSize: "13px" }}>
                      Check In - Check Out
                    </span>
                    <div className="tp-booking-location-input p-relative d-flex align-items-center gap-2">
                      <span className="tp-booking-input-icon text-muted">
                        <Calendar size={16} />
                      </span>
                      <input
                        className="tp-input bg-white rounded-3 border ps-5 w-50"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        style={{ fontSize: "13px", height: "48px" }}
                      />
                      <input
                        className="tp-input bg-white rounded-3 border ps-3 w-50"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        style={{ fontSize: "13px", height: "48px" }}
                      />
                    </div>
                  </div>

                  {/* Field 3: Guests (Adults & Children) */}
                  <div className="tp-booking-location tp-booking-col-3 tp-booking-nohide p-relative flex-grow-1">
                    <span className="tp-booking-6-title fw-600 d-inline-block mb-2 text-dark" style={{ fontSize: "13px" }}>
                      Guests
                    </span>
                    <div
                      className="tp-booking-location-input tp-booking-toggle p-relative d-flex align-items-center gap-1 bg-white rounded-3 border ps-5 pe-2"
                      style={{ height: "48px" }}
                    >
                      <span className="tp-booking-input-icon text-muted">
                        <Users size={16} />
                      </span>
                      <select
                        className="tp-input w-50 bg-transparent border-0 font-medium text-xs cursor-pointer p-0"
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        style={{ fontSize: "13px" }}
                      >
                        <option value={1}>1 Adult</option>
                        <option value={2}>2 Adults</option>
                        <option value={3}>3 Adults</option>
                        <option value={4}>4 Adults</option>
                        <option value={5}>5 Adults</option>
                        <option value={6}>6 Adults</option>
                      </select>
                      <span className="text-muted">,</span>
                      <select
                        className="tp-input w-50 bg-transparent border-0 font-medium text-xs cursor-pointer p-0"
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(Number(e.target.value))}
                        style={{ fontSize: "13px" }}
                      >
                        <option value={0}>0 Child</option>
                        <option value={1}>1 Child</option>
                        <option value={2}>2 Children</option>
                        <option value={3}>3 Children</option>
                        <option value={4}>4 Children</option>
                      </select>
                    </div>
                  </div>

                  {/* Search Submit CTA Button */}
                  <div className="tp-booking-submit-btn">
                    <button
                      type="submit"
                      className="tp-btn w-100 d-inline-flex align-items-center justify-content-center gap-2 fw-600 text-white rounded-3 px-4 shadow-sm"
                      disabled={loading}
                      style={{ height: "48px", minWidth: "140px", fontSize: "14px" }}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Searching...
                        </>
                      ) : (
                        <>
                          <Search size={16} /> Search
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Real-time SerpApi Live Results Display */}
              {searched && (
                <div className="tp-booking-results mt-4 pt-3 border-top">
                  <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                    <h5 className="fw-700 text-dark mb-0 d-inline-flex align-items-center gap-2" style={{ fontSize: "18px" }}>
                      <Sparkles size={18} className="text-primary" />
                      Live {activeTab.toUpperCase()} Results {location ? `for "${location}"` : ""}
                    </h5>
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 font-monospace small">
                      Powered by Google Search
                    </span>
                  </div>

                  {loading ? (
                    <div className="text-center py-5 text-muted">
                      <Loader2 size={32} className="animate-spin mb-2 d-inline-block text-primary" />
                      <p className="small mb-0">Fetching real-time {activeTab} information & pricing from SerpApi...</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 bg-light rounded-3 text-center text-muted">
                      <p className="mb-0">No direct results found for this search. Please try another destination or check your spelling.</p>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {/* Hotels View */}
                      {activeTab === "hotels" &&
                        searchResults.map((item: SerpHotelResult, idx: number) => (
                          <div key={idx} className="col-lg-4 col-md-6">
                            <div className="card h-100 border rounded-3 overflow-hidden shadow-sm hover-shadow transition-all bg-white">
                              {item.thumbnail ? (
                                <img
                                  src={item.thumbnail}
                                  className="card-img-top"
                                  alt={item.name}
                                  style={{ height: "150px", objectFit: "cover" }}
                                />
                              ) : (
                                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "150px" }}>
                                  <Building size={32} className="text-muted" />
                                </div>
                              )}
                              <div className="card-body p-3 d-flex flex-column justify-content-between">
                                <div>
                                  <h6 className="fw-700 text-dark text-truncate mb-1" style={{ fontSize: "14px" }}>
                                    {item.name}
                                  </h6>
                                  {item.rating > 0 && (
                                    <div className="small text-warning mb-2 d-flex align-items-center gap-1">
                                      <Star size={13} fill="currentColor" /> {item.rating} ({item.reviews} reviews)
                                    </div>
                                  )}
                                  <div className="fw-800 text-primary mb-3" style={{ fontSize: "16px" }}>
                                    {item.price || "Check Live Rate"}{" "}
                                    <span className="text-muted small fw-normal">/ night</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => navigateToTour(item.name, location || "Hotel", item.price)}
                                  className="tp-btn-sm tp-btn text-white w-100 text-center rounded-2 py-2"
                                  style={{ fontSize: "12.5px" }}
                                >
                                  View Hotel Details
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* Packages View (Google Search Live Results) */}
                      {activeTab === "packages" &&
                        searchResults.map((item: SerpOrganicResult, idx: number) => (
                          <div key={idx} className="col-lg-4 col-md-6">
                            <div className="card h-100 border rounded-3 overflow-hidden shadow-sm hover-shadow transition-all bg-white">
                              {item.thumbnail && (
                                <img
                                  src={item.thumbnail}
                                  className="card-img-top"
                                  alt=""
                                  style={{ height: "140px", objectFit: "cover" }}
                                />
                              )}
                              <div className="card-body p-3 d-flex flex-column justify-content-between">
                                <div>
                                  <span className="badge bg-success bg-opacity-10 text-success font-monospace mb-2" style={{ fontSize: "11px" }}>
                                    <CheckCircle2 size={11} className="me-1" /> Holiday Package
                                  </span>
                                  <h6 className="fw-700 text-dark mb-1 line-clamp-1" style={{ fontSize: "14px" }}>
                                    {item.title}
                                  </h6>
                                  <p className="text-muted small line-clamp-2 mb-3" style={{ fontSize: "12.5px", lineHeight: 1.5 }}>
                                    {item.snippet}
                                  </p>
                                </div>
                                <div className="d-flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => navigateToTour(item.title, location || "India")}
                                    className="tp-btn-sm tp-btn text-white flex-grow-1 text-center rounded-2 py-2"
                                    style={{ fontSize: "12px" }}
                                  >
                                    Explore Package
                                  </button>
                                  {item.link && (
                                    <a
                                      href={item.link}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="btn btn-sm btn-light border px-2 py-2 rounded-2"
                                      title="Open Source Link"
                                    >
                                      <ArrowUpRight size={14} />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* Flights View */}
                      {activeTab === "flights" &&
                        searchResults.map((item, idx) => (
                          <div key={idx} className="col-md-6">
                            <div className="p-3 border rounded-3 bg-white shadow-sm d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="fw-700 text-dark mb-1 d-flex align-items-center gap-2" style={{ fontSize: "14px" }}>
                                  <Plane size={15} className="text-primary" /> {item.airline}
                                </h6>
                                <p className="text-muted small mb-1">
                                  {item.from} → {item.to}
                                </p>
                                <span className="badge bg-secondary bg-opacity-10 text-secondary small">
                                  {item.stops === 0 ? "Non-stop Flight" : `${item.stops} Stop(s)`}
                                </span>
                              </div>
                              <div className="text-end">
                                <div className="fw-800 text-primary fs-6 mb-1">{item.price}</div>
                                <a
                                  href={`https://www.google.com/travel/flights?q=flights+from+${originIata}+to+${destIata}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="tp-btn-sm tp-btn text-white rounded-2 px-3 py-1"
                                  style={{ fontSize: "11.5px" }}
                                >
                                  Book Flight
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* Travels View */}
                      {activeTab === "travels" &&
                        searchResults.map((item: SerpOrganicResult, idx: number) => (
                          <div key={idx} className="col-md-6">
                            <div className="p-3 border rounded-3 bg-white shadow-sm h-100 d-flex flex-column justify-content-between">
                              <div>
                                <h6 className="fw-700 text-dark mb-1 text-truncate" style={{ fontSize: "14px" }}>
                                  {item.title}
                                </h6>
                                <p className="text-muted small line-clamp-2 mb-3" style={{ fontSize: "12.5px" }}>
                                  {item.snippet}
                                </p>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="badge bg-info bg-opacity-10 text-info small">Travel Guide</span>
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                  style={{ fontSize: "12px" }}
                                >
                                  Read Guide <ArrowUpRight size={13} className="ms-1" />
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Footer Note */}
              <p className="tp-booking-6-dec mt-3 text-muted small mb-0">
                Can't find what you're looking for? Create your{" "}
                <a href="#" onClick={(e) => e.preventDefault()} className="common-underline fw-600 text-primary">
                  Custom Itinerary
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
