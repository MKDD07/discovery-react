import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import HeadingContainer, { TabItem } from "../../snippets/heading-container/heading-container";
import DomesticCard from "../../snippets/domestic-card/domestic-card";
import DomesticCardSkeleton from "../../snippets/domestic-card/domestic-card-skeleton";
import SerpAPI, { SerpHotelResult } from "../../../services/serpApi";

export interface DomesticLocationSettings {
  // Data
  location?: string;
  maxCards?: number;

  // Layout
  layout?: "grid" | "swiper";

  // Heading
  title?: string;
  subtitle?: string;
  iconClass?: string;
  showIcon?: boolean;

  // Right button
  showBtn?: boolean;
  btnText?: string;
  btnHref?: string;

  // Tabs
  tabs?: TabItem[];
}

export const DomesticLocation: React.FC<DomesticLocationSettings> = ({
  location = "Bangkok",
  maxCards = 4,
  layout = "grid",
  title,
  subtitle = "Popular Packages",
  iconClass = "fa-solid fa-star",
  showIcon = true,
  showBtn = false,
  btnText = "View All",
  btnHref = "#",
  tabs,
}) => {
  const [hotels, setHotels] = useState<SerpHotelResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(
    tabs && tabs.length > 0 ? tabs[0].id : ""
  );

  // Use activeTab as location if tabs are provided
  const searchLocation = tabs && tabs.length > 0 ? activeTab : location;
  const displayTitle = title || `Explore ${searchLocation}`;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    SerpAPI.searchHotels({ q: searchLocation })
      .then((data) => {
        if (!isMounted) return;
        const extracted = SerpAPI.extractHotels(data, maxCards);
        setHotels(extracted);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("SerpAPI Hotels Error:", err);
        setError("Could not load hotels.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchLocation, maxCards]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderCards = () => {
    if (layout === "swiper") {
      return (
        <div className="p-relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: ".tp-tour-slider-arrow-prev",
              nextEl: ".tp-tour-slider-arrow-next",
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1400: { slidesPerView: 4 },
            }}
            className="tp-tour-swiper"
          >
            {hotels.map((hotel, idx) => (
              <SwiperSlide key={idx}>
                <DomesticCard hotel={hotel} location={searchLocation} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="tp-tour-slider-arrow-box d-none d-md-flex align-items-center justify-content-between">
            <button
              className="tp-tour-slider-arrow-prev london-prev"
              tabIndex={0}
              aria-label="Previous slide"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              className="tp-tour-slider-arrow-next london-next"
              tabIndex={0}
              aria-label="Next slide"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="row">
        {hotels.map((hotel, idx) => (
          <DomesticCard key={idx} hotel={hotel} location={searchLocation} />
        ))}
      </div>
    );
  };

  return (
    <section className="tp-tour-area tp-animate-tab pt-60 pb-40">
      <div className="container">
        <HeadingContainer
          subtitle={subtitle}
          title={displayTitle}
          iconClass={iconClass}
          showIcon={showIcon}
          showBtn={showBtn}
          btnText={btnText}
          btnHref={btnHref}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {loading && (
          <div className="row">
            {Array.from({ length: maxCards }).map((_, idx) => (
              <DomesticCardSkeleton key={idx} />
            ))}
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center my-4" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && renderCards()}
      </div>
    </section>
  );
};

export default DomesticLocation;