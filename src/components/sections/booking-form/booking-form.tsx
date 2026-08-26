import React, { useState, useRef, useEffect } from "react";
import SerpAPI, { SerpHotelResult, SerpOrganicResult, SerpFlightResult } from "../../../services/serpApi";
import Button from "../../snippets/button";
import {
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
  Clock,
  ArrowLeftRight,
  Plus,
  Minus,
  Check,
  Compass,
} from "lucide-react";

export type BookingTab = "hotels" | "flights" | "travels";

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

const POPULAR_DESTINATIONS = [
  "Paris", "Goa", "Dubai", "Maldives", "Kashmir", "Bali", "Switzerland", "London", "Tokyo", "Rajasthan", "Kerala"
];

export interface BookingFormProps {
  activeTab?: BookingTab;
  onTabChange?: (tab: BookingTab) => void;
}

const getFormattedDate = (daysFromToday = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split("T")[0];
};

export const BookingForm: React.FC<BookingFormProps> = ({
  activeTab: controlledActiveTab,
  onTabChange,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<BookingTab>("hotels");
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  // Input States (Defaults: checkIn = Today, checkOut = Tomorrow)
  const [location, setLocation] = useState("");
  const [originIata, setOriginIata] = useState("DEL");
  const [destIata, setDestIata] = useState("DXB");
  const [checkIn, setCheckIn] = useState(getFormattedDate(0));
  const [checkOut, setCheckOut] = useState(getFormattedDate(1));

  // Interactive Guest Selector States
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showGuestsPopover, setShowGuestsPopover] = useState(false);
  const guestsRef = useRef<HTMLDivElement>(null);

  // Live SerpApi Search Autocomplete States
  const [suggestions, setSuggestions] = useState<SerpOrganicResult[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationInputRef = useRef<HTMLDivElement>(null);

  // Search Results & Loading State
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Live SerpApi Google Search query debouncer for location input
  useEffect(() => {
    if (!location.trim() || location.trim().length < 2) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const query = `${location.trim()} travel tourism attractions`;
        const data = await SerpAPI.searchHome(query);
        const extracted = SerpAPI.extractOrganicResults(data, 5);
        setSuggestions(extracted);
      } catch (err) {
        console.warn("SerpApi live suggestions error:", err);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [location]);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setShowGuestsPopover(false);
      }
      if (locationInputRef.current && !locationInputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabChange = (tab: BookingTab) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tab);
    }
    onTabChange?.(tab);
    setSearchResults([]);
    setSearched(false);
    setShowGuestsPopover(false);
  };

  const swapAirports = () => {
    const temp = originIata;
    setOriginIata(destIata);
    setDestIata(temp);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setShowGuestsPopover(false);

    try {
      if (activeTab === "hotels") {
        const query = location.trim() || "Goa, India";
        const data = await SerpAPI.searchHotels({
          q: query,
          check_in: checkIn || undefined,
          check_out: checkOut || undefined,
          adults,
        });
        const results = SerpAPI.extractHotels(data, 6);
        setSearchResults(results);
      } else if (activeTab === "flights") {
        const data = await SerpAPI.searchFlights({
          departure_id: originIata,
          arrival_id: destIata,
          outbound_date: checkIn || undefined,
          query: `flights from ${originIata} to ${destIata}`,
        });
        const results = SerpAPI.extractFlights(data, 6);
        setSearchResults(results);
      } else if (activeTab === "travels") {
        const query = location.trim() ? `travel guide itineraries ${location}` : "top travel itineraries & luxury guides";
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

  const navigateToDestination = (destName: string) => {
    const slug = destName.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    window.history.pushState({}, "", `/destination/${slug}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
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

  const isDestinationMatch = location.trim() && POPULAR_DESTINATIONS.some(
    (d) => d.toLowerCase() === location.trim().toLowerCase()
  );

  return (
    <div className="tp-booking-form-area py-3" style={{ marginTop: "-60px", position: "relative", zIndex: 30 }}>
      <div className="container container-1350">
        <div className="row justify-content-center">
          <div className="col-12">
            {/* ── Luxury Card Container ─────────────────────────────── */}
            <div
              className="tp-luxury-booking-card shadow-lg"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                borderRadius: "28px",
                padding: "26px 32px",
                boxShadow: "0 24px 50px -12px rgba(15, 23, 42, 0.12)",
              }}
            >
              {/* Category Navigation Tabs */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    className={`btn btn-sm px-4 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-2 transition-all ${
                      activeTab === "hotels"
                        ? "tp-btn-universal-bg text-white shadow-sm"
                        : "bg-light text-dark border-0 hover-bg-light"
                    }`}
                    style={{ fontSize: "13.5px" }}
                    onClick={() => handleTabChange("hotels")}
                  >
                    <Building size={16} /> Hotels & Resorts
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm px-4 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-2 transition-all ${
                      activeTab === "flights"
                        ? "tp-btn-universal-bg text-white shadow-sm"
                        : "bg-light text-dark border-0 hover-bg-light"
                    }`}
                    style={{ fontSize: "13.5px" }}
                    onClick={() => handleTabChange("flights")}
                  >
                    <Plane size={16} /> Flights
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm px-4 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-2 transition-all ${
                      activeTab === "travels"
                        ? "tp-btn-universal-bg text-white shadow-sm"
                        : "bg-light text-dark border-0 hover-bg-light"
                    }`}
                    style={{ fontSize: "13.5px" }}
                    onClick={() => handleTabChange("travels")}
                  >
                    <Route size={16} /> Curated Travels
                  </button>
                </div>

                <span className="text-muted small d-none d-md-inline-flex align-items-center gap-1">
                  <Sparkles size={14} className="text-success" /> Best Rate Guarantee
                </span>
              </div>

              {/* Main Booking Search Form */}
              <form onSubmit={handleSearch}>
                <div className="row align-items-end g-3">
                  {/* Field 1: Destination / Hotel or Flight Origin */}
                  {activeTab === "flights" ? (
                    <>
                      {/* Origin Airport */}
                      <div className="col-xl-3 col-lg-3 col-md-6">
                        <label className="form-label text-dark fw-bold mb-1" style={{ fontSize: "12.5px" }}>
                          From (Origin)
                        </label>
                        <div className="position-relative">
                          <span className="position-absolute text-muted" style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }}>
                            <Plane size={16} />
                          </span>
                          <select
                            className="form-select bg-light border-0 ps-5 fw-semibold"
                            value={originIata}
                            onChange={(e) => setOriginIata(e.target.value)}
                            style={{ height: "48px", borderRadius: "14px", fontSize: "13.5px" }}
                          >
                            {IATA_AIRPORTS.map((ap, idx) => (
                              <option key={idx} value={ap.code}>
                                {ap.code} - {ap.city}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Swap Airport Button */}
                      <div className="col-auto d-none d-lg-flex align-items-center justify-content-center p-0" style={{ marginBottom: "6px" }}>
                        <button
                          type="button"
                          onClick={swapAirports}
                          className="btn btn-light rounded-circle shadow-sm border p-0 d-flex align-items-center justify-content-center"
                          style={{ width: "36px", height: "36px" }}
                          title="Swap Airports"
                        >
                          <ArrowLeftRight size={14} className="text-dark" />
                        </button>
                      </div>

                      {/* Destination Airport */}
                      <div className="col-xl-3 col-lg-3 col-md-6">
                        <label className="form-label text-dark fw-bold mb-1" style={{ fontSize: "12.5px" }}>
                          To (Destination)
                        </label>
                        <div className="position-relative">
                          <span className="position-absolute text-muted" style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }}>
                            <MapPin size={16} />
                          </span>
                          <select
                            className="form-select bg-light border-0 ps-5 fw-semibold"
                            value={destIata}
                            onChange={(e) => setDestIata(e.target.value)}
                            style={{ height: "48px", borderRadius: "14px", fontSize: "13.5px" }}
                          >
                            {IATA_AIRPORTS.map((ap, idx) => (
                              <option key={idx} value={ap.code}>
                                {ap.code} - {ap.city}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="col-xl-4 col-lg-4 col-md-6">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <label className="form-label text-dark fw-bold mb-0" style={{ fontSize: "12.5px" }}>
                          {activeTab === "hotels" ? "City, Destination or Hotel" : "Travel Region or Spot"}
                        </label>
                        {isDestinationMatch && (
                          <button
                            type="button"
                            onClick={() => navigateToDestination(location)}
                            className="btn p-0 border-0 bg-transparent text-success fw-bold d-inline-flex align-items-center gap-1"
                            style={{ fontSize: "11.5px" }}
                          >
                            <Compass size={12} /> Open {location} Hub
                          </button>
                        )}
                      </div>
                      <div className="position-relative" ref={locationInputRef}>
                        <span className="position-absolute text-muted" style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }}>
                          <MapPin size={16} />
                        </span>
                        <input
                          type="text"
                          className="form-control bg-light border-0 ps-5 fw-semibold"
                          value={location}
                          onFocus={() => setShowSuggestions(true)}
                          onChange={(e) => {
                            setLocation(e.target.value);
                            setShowSuggestions(true);
                          }}
                          placeholder={activeTab === "hotels" ? "Where are you going? (e.g. Goa, Paris, Dubai)" : "Where to explore?"}
                          style={{ height: "48px", borderRadius: "14px", fontSize: "13.5px" }}
                        />
                        {suggestionsLoading && (
                          <span className="position-absolute text-muted" style={{ right: "14px", top: "50%", transform: "translateY(-50%)" }}>
                            <Loader2 size={15} className="animate-spin text-success" />
                          </span>
                        )}

                        {/* Live SerpApi Google Search Autocomplete Suggestions Popover */}
                        {showSuggestions && (suggestions.length > 0 || suggestionsLoading) && (
                          <div
                            className="position-absolute bg-white shadow-lg border rounded-4 p-2 z-3 w-100"
                            style={{
                              top: "calc(100% + 8px)",
                              left: 0,
                              minWidth: "320px",
                              maxHeight: "340px",
                              overflowY: "auto",
                              boxShadow: "0 20px 40px -10px rgba(15, 23, 42, 0.16)",
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-between px-2 py-1 mb-1 border-bottom">
                              <span className="text-muted small fw-semibold d-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                                <Sparkles size={11} className="text-success" /> Google Live Search via SerpApi
                              </span>
                              {suggestionsLoading && <span className="badge bg-light text-muted" style={{ fontSize: "10px" }}>Searching...</span>}
                            </div>

                            {suggestions.map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  // Clean up title for location
                                  const cleanName = item.title.split(/[-–|:•]/)[0].trim();
                                  setLocation(cleanName || item.title);
                                  setShowSuggestions(false);
                                }}
                                className="btn w-100 text-start p-2 rounded-3 border-0 bg-transparent hover-bg-light d-flex align-items-start gap-2 transition-all mb-1"
                                style={{ textAlign: "left" }}
                              >
                                {item.thumbnail ? (
                                  <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    style={{ width: "38px", height: "38px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                                  />
                                ) : (
                                  <div
                                    className="bg-light rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{ width: "38px", height: "38px" }}
                                  >
                                    <MapPin size={16} className="text-success" />
                                  </div>
                                )}
                                <div className="overflow-hidden flex-grow-1">
                                  <div className="fw-bold text-dark text-truncate" style={{ fontSize: "12.5px" }}>
                                    {item.title}
                                  </div>
                                  <div className="text-muted text-truncate" style={{ fontSize: "11px" }}>
                                    {item.snippet || "Explore destination details"}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Field 2: Dates (Check-In & Check-Out: Defaults to Today & Tomorrow) */}
                  <div className={activeTab === "flights" ? "col-xl-3 col-lg-3 col-md-6" : "col-xl-4 col-lg-4 col-md-6"}>
                    <label className="form-label text-dark fw-bold mb-1" style={{ fontSize: "12.5px" }}>
                      {activeTab === "flights" ? "Departure Date" : "Check-in & Check-out"}
                    </label>
                    <div className="position-relative d-flex align-items-center gap-2">
                      <div className="position-relative flex-grow-1">
                        <span className="position-absolute text-muted" style={{ left: "12px", top: "50%", transform: "translateY(-50%)" }}>
                          <Calendar size={15} />
                        </span>
                        <input
                          type="date"
                          className="form-control bg-light border-0 ps-5 fw-semibold"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          style={{ height: "48px", borderRadius: "14px", fontSize: "13px" }}
                        />
                      </div>
                      {activeTab !== "flights" && (
                        <div className="position-relative flex-grow-1">
                          <input
                            type="date"
                            className="form-control bg-light border-0 ps-3 fw-semibold"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            style={{ height: "48px", borderRadius: "14px", fontSize: "13px" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Field 3: Interactive Luxury Guest & Room Selector */}
                  <div className={activeTab === "flights" ? "col-xl-2 col-lg-2 col-md-6" : "col-xl-2 col-lg-2 col-md-6"}>
                    <label className="form-label text-dark fw-bold mb-1" style={{ fontSize: "12.5px" }}>
                      Guests & Rooms
                    </label>
                    <div className="position-relative" ref={guestsRef}>
                      <button
                        type="button"
                        onClick={() => setShowGuestsPopover(!showGuestsPopover)}
                        className="btn bg-light border-0 w-100 d-flex align-items-center text-start px-3 fw-semibold text-dark position-relative"
                        style={{ height: "48px", borderRadius: "14px", fontSize: "13px" }}
                      >
                        <span className="text-muted me-2">
                          <Users size={15} />
                        </span>
                        <span className="text-truncate">
                          {adults + childrenCount} Guests{rooms > 1 ? `, ${rooms} R` : ""}
                        </span>
                      </button>

                      {/* Interactive Guests Popover Dropdown */}
                      {showGuestsPopover && (
                        <div
                          className="position-absolute bg-white shadow-lg border rounded-4 p-3 z-3"
                          style={{
                            top: "calc(100% + 8px)",
                            left: 0,
                            minWidth: "260px",
                            boxShadow: "0 20px 40px -10px rgba(15, 23, 42, 0.16)",
                          }}
                        >
                          {/* Adults */}
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                              <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>Adults</div>
                              <div className="text-muted" style={{ fontSize: "11px" }}>Ages 13 or above</div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                disabled={adults <= 1}
                                className="btn btn-sm btn-light rounded-circle border p-0 d-flex align-items-center justify-content-center"
                                style={{ width: "28px", height: "28px" }}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="fw-bold text-dark" style={{ width: "16px", textAlign: "center" }}>
                                {adults}
                              </span>
                              <button
                                type="button"
                                onClick={() => setAdults(adults + 1)}
                                className="btn btn-sm btn-light rounded-circle border p-0 d-flex align-items-center justify-content-center"
                                style={{ width: "28px", height: "28px" }}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                              <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>Children</div>
                              <div className="text-muted" style={{ fontSize: "11px" }}>Ages 0 to 12</div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                                disabled={childrenCount <= 0}
                                className="btn btn-sm btn-light rounded-circle border p-0 d-flex align-items-center justify-content-center"
                                style={{ width: "28px", height: "28px" }}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="fw-bold text-dark" style={{ width: "16px", textAlign: "center" }}>
                                {childrenCount}
                              </span>
                              <button
                                type="button"
                                onClick={() => setChildrenCount(childrenCount + 1)}
                                className="btn btn-sm btn-light rounded-circle border p-0 d-flex align-items-center justify-content-center"
                                style={{ width: "28px", height: "28px" }}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Rooms */}
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                              <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>Rooms</div>
                              <div className="text-muted" style={{ fontSize: "11px" }}>Rooms count</div>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setRooms(Math.max(1, rooms - 1))}
                                disabled={rooms <= 1}
                                className="btn btn-sm btn-light rounded-circle border p-0 d-flex align-items-center justify-content-center"
                                style={{ width: "28px", height: "28px" }}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="fw-bold text-dark" style={{ width: "16px", textAlign: "center" }}>
                                {rooms}
                              </span>
                              <button
                                type="button"
                                onClick={() => setRooms(rooms + 1)}
                                className="btn btn-sm btn-light rounded-circle border p-0 d-flex align-items-center justify-content-center"
                                style={{ width: "28px", height: "28px" }}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>

                          <Button
                            variant="background"
                            size="sm"
                            fullWidth
                            onClick={() => setShowGuestsPopover(false)}
                            icon={<Check size={14} />}
                            iconPosition="left"
                          >
                            Apply Selection
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Field 4: Search CTA Button */}
                  <div className={activeTab === "flights" ? "col-xl-12 col-lg-auto" : "col-xl-2 col-lg-2 col-md-12"}>
                    <Button
                      variant="background"
                      size="md"
                      type="submit"
                      loading={loading}
                      icon={<Search size={16} />}
                      iconPosition="left"
                      fullWidth
                      style={{ height: "48px", borderRadius: "14px", fontSize: "14px" }}
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </form>

              {/* Real-time SerpApi Live Results Display */}
              {searched && (
                <div className="tp-booking-results mt-4 pt-4 border-top">
                  <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                    <div>
                      <h5 className="fw-bold text-dark mb-0 d-inline-flex align-items-center gap-2" style={{ fontSize: "17px" }}>
                        <Sparkles size={17} className="text-success" />
                        Live {activeTab.toUpperCase()} Results {location ? `for "${location}"` : ""}
                      </h5>
                      {location && (
                        <div className="text-muted small mt-1">
                          Check-in: <strong>{checkIn}</strong> • Check-out: <strong>{checkOut}</strong> • {adults + childrenCount} Guests
                        </div>
                      )}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      {location && (
                        <button
                          type="button"
                          onClick={() => navigateToDestination(location)}
                          className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold d-inline-flex align-items-center gap-1"
                          style={{ fontSize: "12px" }}
                        >
                          <Compass size={13} /> View All {location} Tours
                        </button>
                      )}
                      <span className="badge bg-success bg-opacity-10 text-success px-3 py-1 font-monospace small">
                        Powered by Google Search
                      </span>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-5 text-muted">
                      <Loader2 size={30} className="animate-spin mb-2 d-inline-block text-success" />
                      <p className="small mb-0">Fetching real-time {activeTab} rates & options from SerpApi...</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <p className="mb-0">No live {activeTab} results found. Try a different destination or date.</p>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {/* Hotels View */}
                      {activeTab === "hotels" &&
                        searchResults.map((item: SerpHotelResult, idx: number) => (
                          <div key={idx} className="col-lg-4 col-md-6">
                            <div className="card h-100 border-0 rounded-4 overflow-hidden shadow-sm hover-shadow transition-all bg-white">
                              {item.thumbnail ? (
                                <img
                                  src={item.thumbnail}
                                  className="card-img-top"
                                  alt={item.name}
                                  style={{ height: "160px", objectFit: "cover" }}
                                />
                              ) : (
                                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "160px" }}>
                                  <Building size={32} className="text-muted" />
                                </div>
                              )}
                              <div className="card-body p-3 d-flex flex-column justify-content-between">
                                <div>
                                  <h6 className="fw-bold text-dark text-truncate mb-1" style={{ fontSize: "14.5px" }}>
                                    {item.name}
                                  </h6>
                                  {item.rating > 0 && (
                                    <div className="small text-warning mb-2 d-flex align-items-center gap-1">
                                      <Star size={13} fill="currentColor" /> {item.rating} ({item.reviews} reviews)
                                    </div>
                                  )}
                                  <div className="fw-bold text-dark mb-3" style={{ fontSize: "16px" }}>
                                    {item.price || "Check Live Rate"}{" "}
                                    <span className="text-muted small fw-normal">/ night</span>
                                  </div>
                                </div>
                                <Button
                                  variant="background"
                                  size="sm"
                                  onClick={() => navigateToTour(item.name, location || "Hotel", item.price)}
                                  fullWidth
                                >
                                  View Hotel Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* Flights View */}
                      {activeTab === "flights" &&
                        searchResults.map((item: SerpFlightResult, idx: number) => (
                          <div key={idx} className="col-md-6">
                            <div className="p-3 border-0 rounded-4 bg-white shadow-sm d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2" style={{ fontSize: "14.5px" }}>
                                  <Plane size={15} className="text-success" /> {item.airline}
                                </h6>
                                <p className="text-muted small mb-1">
                                  {item.from} → {item.to}
                                </p>
                                <div className="d-flex align-items-center gap-2">
                                  <span className="badge bg-secondary bg-opacity-10 text-secondary small">
                                    {item.stops === 0 ? "Non-stop Flight" : `${item.stops} Stop(s)`}
                                  </span>
                                  {item.duration > 0 && (
                                    <span className="text-muted small d-inline-flex align-items-center gap-1">
                                      <Clock size={12} /> {Math.floor(item.duration / 60)}h {item.duration % 60}m
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-end">
                                <div className="fw-bold text-dark fs-6 mb-2">{item.price}</div>
                                <Button
                                  variant="background"
                                  size="sm"
                                  href={`https://www.google.com/travel/flights?q=flights+from+${originIata}+to+${destIata}`}
                                  target="_blank"
                                >
                                  Book Flight
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* Travels View */}
                      {activeTab === "travels" &&
                        searchResults.map((item: SerpOrganicResult, idx: number) => (
                          <div key={idx} className="col-md-6">
                            <div className="p-3 border-0 rounded-4 bg-white shadow-sm h-100 d-flex flex-column justify-content-between">
                              <div>
                                <h6 className="fw-bold text-dark mb-1 text-truncate" style={{ fontSize: "14.5px" }}>
                                  {item.title}
                                </h6>
                                <p className="text-muted small line-clamp-2 mb-3" style={{ fontSize: "12.5px" }}>
                                  {item.snippet}
                                </p>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="badge bg-info bg-opacity-10 text-info small">Travel Guide</span>
                                <Button
                                  variant="stroke"
                                  size="sm"
                                  icon={<ArrowUpRight size={13} />}
                                  iconPosition="right"
                                  onClick={() => navigateToTour(item.title, location || "Travel Guide")}
                                >
                                  Read Guide
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
