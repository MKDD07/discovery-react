import React, { useState, useEffect } from "react";
import DomesticCard from "../../snippets/domestic-card/domestic-card";
import DomesticCardSkeleton from "../../snippets/domestic-card/domestic-card-skeleton";
import SerpAPI, { SerpHotelResult } from "../../../services/serpApi";

interface CategoryCityProps {
  location?: string;
}

export const CategoryCity: React.FC<CategoryCityProps> = ({ location = "Kashmir" }) => {
  const [hotels, setHotels] = useState<SerpHotelResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("explore");
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    SerpAPI.searchHotels({ q: location })
      .then((data) => {
        if (!isMounted) return;
        const extracted = SerpAPI.extractHotels(data, 12);
        setHotels(extracted);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("CategoryCity SerpApi Error:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [location]);

  // Sorting
  const sortedHotels = [...hotels].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    if (sortBy === "rating-desc") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="tp-category-city-area tp-tour-red tp-tour-city-sidebar tp-tour-city-sidebar-2 pb-90">
      {/* Content Area */}
      <div className="pt-50">
        <div className="container container-1350">
          {/* Header Filter Bar */}
          <div className="tp-tour-filter-wrap p-0 mb-30">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="tp-tour-filter mb-20 mb-md-0">
                  <span className="tp-tour-filter-result fw-600">
                    Showing {hotels.length} curated stays & packages in {location}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="tp-tour-sort d-flex justify-content-md-end align-items-center">
                  <select
                    className="form-select w-auto fw-500 rounded-pill px-3 py-2"
                    style={{ border: "1px solid #e2e8f0", fontSize: "14px" }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">Sort By: Recommended</option>
                    <option value="rating-desc">Top Rated</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="row gx-25">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <DomesticCardSkeleton key={n} />
              ))}
            </div>
          ) : (
            <div className="row gx-25">
              {sortedHotels.map((hotel, idx) => (
                <DomesticCard key={idx} hotel={hotel} location={location} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCity;
