import React, { useState } from "react";
import SerpAPI from "../../../services/serpApi";

export type BookingTab = "packages" | "hotels" | "flights" | "travels";

// Major Airport IATA codes mapping
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
  const [childrenCount, setChildrenCount] = useState(1);
  
  // Dropdown visibility toggles
  const [showLocationList, setShowLocationList] = useState(false);
  const [showGuestsList, setShowGuestsList] = useState(false);

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
    setShowGuestsList(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setShowLocationList(false);
    setShowGuestsList(false);

    try {
      if (activeTab === "packages") {
        const query = location.trim() || "Goa vacation";
        const data = await SerpAPI.searchVacations(query);
        const results = SerpAPI.extractOrganicResults(data, 6);
        setSearchResults(results);
      } else if (activeTab === "hotels") {
        const query = location.trim() || "Mumbai";
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
        const query = location.trim() ? `travel guide ${location}` : "top travel destinations";
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

return (
    <div className="tp-booking-form-area py-4">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="tp-booking-form tp-booking-6-form">
              {/* Category Selection Tabs */}
              <div className="tp-booking-nav-tabs d-flex align-items-center gap-2 mb-3">
                <button
                  type="button"
                  className={`btn btn-sm px-4 py-2 rounded-pill fw-600 ${
                    activeTab === "packages" ? "tp-btn text-white" : "btn-light text-dark"
                  }`}
                  onClick={() => handleTabChange("packages")}
                >
                  <i className="fa-solid fa-box-archive mr-8"></i> Packages
                </button>

                <button
                  type="button"
                  className={`btn btn-sm px-4 py-2 rounded-pill fw-600 ${
                    activeTab === "hotels" ? "tp-btn text-white" : "btn-light text-dark"
                  }`}
                  onClick={() => handleTabChange("hotels")}
                >
                  <i className="fa-solid fa-hotel mr-8"></i> Hotels
                </button>

                <button
                  type="button"
                  className={`btn btn-sm px-4 py-2 rounded-pill fw-600 ${
                    activeTab === "flights" ? "tp-btn text-white" : "btn-light text-dark"
                  }`}
                  onClick={() => handleTabChange("flights")}
                >
                  <i className="fa-solid fa-plane mr-8"></i> Flights (IATA)
                </button>

                <button
                  type="button"
                  className={`btn btn-sm px-4 py-2 rounded-pill fw-600 ${
                    activeTab === "travels" ? "tp-btn text-white" : "btn-light text-dark"
                  }`}
                  onClick={() => handleTabChange("travels")}
                >
                  <i className="fa-solid fa-route mr-8"></i> Travels
                </button>
              </div>

              <form onSubmit={handleSearch}>
                <div className="tp-booking-wrap d-flex p-relative align-items-end gap-2">
                  {/* Field 1: Location / IATA Origin */}
                  {activeTab !== "flights" ? (
                    <div className="tp-booking-location tp-booking-col-1 p-relative flex-grow-1">
                      <span className="tp-booking-6-title fw-500 d-inline-block mb-5">
                        {activeTab === "packages" && "Package Destination"}
                        {activeTab === "hotels" && "Hotel Location"}
                        {activeTab === "travels" && "Travel Spot"}
                      </span>
                      <div className="tp-booking-location-input tp-booking-toggle p-relative">
                        <span className="tp-booking-input-icon">
                          <i className="fa-solid fa-location-dot"></i>
                        </span>
                        <input
                          className="tp-input"
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          onFocus={() => setShowLocationList(true)}
                          placeholder="Where to ?"
                        />
                      </div>
                      {showLocationList && (
                        <div className="tp-booking-location-list tp-booking-toggle-active">
                          <div className="tp-booking-location-inner">
                            <span className="tp-booking-location-suggested">Suggested destinations</span>
                            <ul>
                              {[
                                { city: "Goa, India", desc: "For pristine beaches" },
                                { city: "Bangkok, Thailand", desc: "For bustling nightlife" },
                                { city: "London, UK", desc: "For historic landmarks" },
                                { city: "New Delhi, India", desc: "For rich culture" },
                                { city: "Paris, France", desc: "For Eiffel Tower & romance" }
                              ].map((item, idx) => (
                                <li
                                  key={idx}
                                  onClick={() => {
                                    setLocation(item.city);
                                    setShowLocationList(false);
                                  }}
                                >
                                  <div className="tp-booking-location-content">
                                    <span>{item.city}</span>
                                    <p>{item.desc}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Flight IATA Origin & Destination Selection */
                    <>
                      <div className="tp-booking-location tp-booking-col-1 p-relative flex-grow-1">
                        <span className="tp-booking-6-title fw-500 d-inline-block mb-5">
                          From (Origin IATA)
                        </span>
                        <div className="tp-booking-location-input p-relative">
                          <span className="tp-booking-input-icon">
                            <i className="fa-solid fa-plane-departure"></i>
                          </span>
                          <select
                            className="tp-input w-100 bg-transparent border-0"
                            value={originIata}
                            onChange={(e) => setOriginIata(e.target.value)}
                          >
                            {IATA_AIRPORTS.map((ap, idx) => (
                              <option key={idx} value={ap.code || ap.name}>
                                {ap.code || ap.city} - {ap.city} ({ap.name})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="tp-booking-location tp-booking-col-1 p-relative flex-grow-1">
                        <span className="tp-booking-6-title fw-500 d-inline-block mb-5">
                          To (Destination IATA)
                        </span>
                        <div className="tp-booking-location-input p-relative">
                          <span className="tp-booking-input-icon">
                            <i className="fa-solid fa-plane-arrival"></i>
                          </span>
                          <select
                            className="tp-input w-100 bg-transparent border-0"
                            value={destIata}
                            onChange={(e) => setDestIata(e.target.value)}
                          >
                            {IATA_AIRPORTS.map((ap, idx) => (
                              <option key={idx} value={ap.code || ap.name}>
                                {ap.code || ap.city} - {ap.city} ({ap.name})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Field 2: Dates */}
                  <div className="tp-booking-location tp-booking-col-2 tp-booking-datepicker p-relative flex-grow-1">
                    <span className="tp-booking-6-title fw-500 d-inline-block mb-5">
                      Check In - Check Out
                    </span>
                    <div className="tp-booking-location-input p-relative d-flex align-items-center gap-2">
                      <span className="tp-booking-input-icon">
                        <i className="fa-regular fa-calendar-days"></i>
                      </span>
                      <input
                        className="tp-input w-50"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                      />
                      <input
                        className="tp-input w-50"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Field 3: Guests */}
                  <div className="tp-booking-location tp-booking-col-3 tp-booking-nohide p-relative flex-grow-1">
                    <span className="tp-booking-6-title fw-500 d-inline-block mb-5">Guests</span>
                    <div
                      className="tp-booking-location-input tp-booking-toggle p-relative d-flex align-items-center gap-2"
                      style={{ maxWidth: "300px" }}
                    >
                      <span className="tp-booking-input-icon">
                        <i className="fa-solid fa-user-group"></i>
                      </span>
                      <select
                        className="tp-input w-50 bg-transparent border-0 font-medium text-xs cursor-pointer"
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
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
                        className="tp-input w-50 bg-transparent border-0 font-medium text-xs cursor-pointer"
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(Number(e.target.value))}
                      >
                        <option value={0}>0 Child</option>
                        <option value={1}>1 Child</option>
                        <option value={2}>2 Children</option>
                        <option value={3}>3 Children</option>
                        <option value={4}>4 Children</option>
                      </select>
                    </div>
                  </div>

                  {/* Search Submit Button */}
                  <div className="tp-booking-submit-btn">
                    <button type="submit" disabled={loading}>
                      <i className="fa-solid fa-magnifying-glass mr-5"></i>
                      {loading ? "Searching..." : "Search"}
                    </button>
                  </div>
                </div>
              </form>

              {/* Dynamic Results Display */}
              {searched && (
                <div className="tp-booking-results mt-4 p-3 rounded-3">
                  <h5 className="fw-600 mb-3 text-capitalize">
                    <i className="fa-solid fa-list-check tp-icon-theme mr-2"></i>
                    {activeTab} Search Results
                  </h5>

                  {loading ? (
                    <div className="text-center py-4 tp-text-muted">
                      <i className="fa-solid fa-spinner fa-spin fa-2x mb-2 d-block"></i>
                      Loading best {activeTab} deals via SerpAPI...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <p className="tp-text-muted mb-0">No results found for your query. Try another search!</p>
                  ) : (
                    <div className="row g-3">
                      {activeTab === "hotels" &&
                        searchResults.map((item, idx) => (
                          <div key={idx} className="col-md-4">
                            <div className="card h-100 border-0">
                              {item.thumbnail && (
                                <img
                                  src={item.thumbnail}
                                  className="card-img-top"
                                  alt={item.name}
                                  style={{ height: "140px", objectFit: "cover" }}
                                />
                              )}
                              <div className="card-body p-3">
                                <h6 className="card-title text-truncate mb-1">{item.name}</h6>
                                <p className="small tp-icon-theme mb-1">
                                  <i className="fa-solid fa-star"></i> {item.rating} ({item.reviews} reviews)
                                </p>
                                <p className="fw-700 text-dark mb-2">{item.price} <span className="small tp-text-muted font-normal">/night</span></p>
                                <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-sm tp-btn-fill w-100">
                                  Book Hotel
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}

                      {activeTab === "flights" &&
                        searchResults.map((item, idx) => (
                          <div key={idx} className="col-md-6">
                            <div className="p-3 border rounded tp-flight-row d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="mb-1 tp-icon-theme">
                                  <i className="fa-solid fa-plane mr-2"></i> {item.airline}
                                </h6>
                                <p className="small tp-text-muted mb-0">
                                  {item.from} → {item.to}
                                </p>
                                <span className="badge tp-badge">
                                  {item.stops === 0 ? "Non-stop" : `${item.stops} Stop`}
                                </span>
                              </div>
                              <div className="text-end">
                                <span className="fs-5 fw-700 tp-price-text d-block">{item.price}</span>
                                <button className="btn btn-sm tp-btn-outline mt-1">Book Flight</button>
                              </div>
                            </div>
                          </div>
                        ))}

                      {(activeTab === "packages" || activeTab === "travels") &&
                        searchResults.map((item, idx) => (
                          <div key={idx} className="col-md-6">
                            <div className="p-3 border rounded tp-card-flat">
                              <h6 className="text-truncate mb-1">
                                <a href={item.link} target="_blank" rel="noreferrer" className="text-dark text-decoration-none">
                                  {item.title}
                                </a>
                              </h6>
                              <p className="small tp-text-muted mb-2 line-clamp-2">{item.snippet}</p>
                              <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-sm tp-btn-outline">
                                View Deal <i className="fa-solid fa-arrow-up-right-from-square ms-1"></i>
                              </a>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              <p className="tp-booking-6-dec mt-10">
                Can't find what you're looking for? Create your{" "}
                <a href="#" className="common-underline">
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
