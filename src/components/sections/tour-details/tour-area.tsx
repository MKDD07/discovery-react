import React, { useEffect, useState } from "react";
import SerpAPI, { SerpHotelResult } from "../../../services/serpApi";
import DomesticCard from "../../snippets/domestic-card/domestic-card";
import DomesticCardSkeleton from "../../snippets/domestic-card/domestic-card-skeleton";

interface TourAreaProps {
  location?: string;
  maxCards?: number;
}

const TourArea: React.FC<TourAreaProps> = ({
  location = "India",
  maxCards = 4,
}) => {
  const [hotels, setHotels] = useState<SerpHotelResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    SerpAPI.searchHotels({ q: location })
      .then((data) => {
        if (!isMounted) return;
        setHotels(SerpAPI.extractHotels(data, maxCards));
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Could not load related tours.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [location, maxCards]);

  return (
    <>
      {/* tp-tour-area-start */}
      <section className="tp-tour-area pt-60 pb-40">
        <div className="container container-1350">
          {/* Section header */}
          <div className="row mb-35">
            <div className="col-12">
              <div className="tp-section-title-wrapper d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <span className="tp-section-subtitle mb-5 d-block">
                    <i className="fa-solid fa-compass me-1"></i> Related
                  </span>
                  <h2 className="tp-section-title fw-700 mb-0">
                    Tours in <span className="tp-highlight">{location}</span>
                  </h2>
                </div>
                <a href="/" className="tp-btn-sm fw-500 tp-ff-inter">
                  View All Tours
                </a>
              </div>
            </div>
          </div>

          {/* Skeleton loaders */}
          {loading && (
            <div className="row">
              {Array.from({ length: maxCards }).map((_, idx) => (
                <DomesticCardSkeleton key={idx} />
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="alert alert-danger text-center my-4" role="alert">
              {error}
            </div>
          )}

          {/* Hotel cards — same component as the main hotel section */}
          {!loading && !error && (
            <div className="row">
              {hotels.map((hotel, idx) => (
                <DomesticCard key={idx} hotel={hotel} location={location} />
              ))}
            </div>
          )}
        </div>
      </section>
      {/* tp-tour-area-end */}
    </>
  );
};

export default TourArea;
