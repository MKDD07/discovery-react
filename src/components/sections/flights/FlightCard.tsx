import React from "react";
import { SerpFlightResult } from "../../../services/serpApi";

export interface FlightCardProps {
  flight: SerpFlightResult;
  onBook?: (flight: SerpFlightResult) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onBook }) => {
  const formatDuration = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hrs}h ${m > 0 ? `${m}m` : ""}`;
  };

  return (
    <div className="tp-tour-item h-100 d-flex flex-column justify-content-between">
      <div>
        {/* Top Airline Header & Badge */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: "40px",
                height: "40px",
                overflow: "hidden",
              }}
            >
              {flight.logo ? (
                <img
                  src={flight.logo}
                  alt={flight.airline}
                  style={{ width: "24px", height: "24px", objectFit: "contain" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <i className="fa-solid fa-plane" style={{ color: "#ff5e14" }}></i>
              )}
            </div>
            <div>
              <h4 className="tp-tour-title fw-600 mb-0" style={{ fontSize: "16px" }}>
                <a href="#flight-details" onClick={(e) => e.preventDefault()}>
                  {flight.airline}
                </a>
              </h4>
              <div className="tp-tour-review">
                <span>
                  <i className="fa-solid fa-star"></i>
                </span>
                <span className="tp-tour-review-score tp-ff-inter">
                  {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop`}
                </span>
              </div>
            </div>
          </div>


        </div>

        {/* Route Details Content */}
        <div className="tp-tour-content pt-20">
          <div className="d-flex align-items-center justify-content-between text-center mb-15">
            {/* Departure */}
            <div className="text-start">
              <span className="tp-tour-new-price fw-700 d-block" style={{ fontSize: "14px" }}>
                {flight.departure}
              </span>
              <span className="tp-ff-inter fw-400 text-muted d-block" style={{ fontSize: "13px" }}>
                {flight.from.split(" ")[0]}
              </span>
            </div>

            {/* Flight Path Indicator */}
            <div className="flex-grow-1 px-3 d-flex flex-column align-items-center">
              <span className="tp-tour-suffix mb-1" style={{ fontSize: "12px" }}>
                {formatDuration(flight.duration)}
              </span>
              <div
                className="w-100 p-relative d-flex align-items-center justify-content-center"
                style={{ height: "2px", backgroundColor: "#e2e8f0" }}
              >
                <i
                  className="fa-solid fa-plane p-absolute"
                  style={{
                    color: "#ff5e14",
                    fontSize: "12px",
                    backgroundColor: "#fff",
                    padding: "0 4px",
                  }}
                ></i>
              </div>
            </div>

            {/* Arrival */}
            <div className="text-end">
              <span className="tp-tour-new-price fw-700 d-block" style={{ fontSize: "14px" }}>
                {flight.arrival}
              </span>
              <span className="tp-ff-inter fw-400 text-muted d-block" style={{ fontSize: "13px" }}>
                {flight.to.split(" ")[0]}
              </span>
            </div>
          </div>

          {/* Info meta badges */}
          <div className="tp-tour-info mt-15 mb-0 pb-0">
            <span>
              <i className="fa-solid fa-plane-departure mr-5"></i>
              {flight.from.split(" ")[0]}
            </span>
            <span>
              <i className="fa-regular fa-clock mr-5"></i>
              {formatDuration(flight.duration)}
            </span>
            <span>
              <i className="fa-solid fa-suitcase-rolling mr-5"></i>
              Cabin + Check-in
            </span>
          </div>
        </div>
      </div>

      {/* Footer Price & Booking Button */}
      <div className="tp-tour-content pt-0">
        <div className="tp-tour-footer d-flex justify-content-between gap-2 align-items-center pt-15 border-top">
          <div className="tp-tour-price">
            <div className="tp-tour-top-price d-flex align-items-center gap-2">
              <span className="tp-tour-prefix">From:</span>
            </div>
            <div className="tp-tour-bottom-price">
              <span className="tp-tour-new-price fw-700">{flight.price}</span>
              <span className="tp-tour-suffix">/passenger</span>
            </div>
          </div>
          <div className="tp-tour-btn">
            <a
              href={`https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(
                flight.from.split(" ")[0]
              )}+to+${encodeURIComponent(flight.to.split(" ")[0])}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (onBook) {
                  e.preventDefault();
                  onBook(flight);
                }
              }}
              className="tp-btn-sm fw-500 tp-ff-inter border-0 d-inline-block text-center"
              style={{ cursor: "pointer", textDecoration: "none" }}
            >
              Book Flight
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;

