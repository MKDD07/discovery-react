import React from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import HeroCollection from "../components/sections/hero-collection/hero-collection";
import HotelOffersSection from "../components/sections/offers/hotel-offers";
import CategoryCity from "../components/sections/category-city/category-city";
import OfferBannerArea from "../components/sections/offer-banner-area/offer-banner-area";
import CollectionFaq from "../components/sections/collection-faq/collection-faq";

interface CityDetailsPageProps {
  location?: string;
  query?: string;
  onBackHome?: () => void;
}

export const CityDetailsPage: React.FC<CityDetailsPageProps> = ({
  location = "Kashmir",
  query = "kashmir dal lake shikara snow mountains landscape scenery",
  onBackHome,
}) => {
  return (
    <>
      <Header />
      <main>
        {/* Navigation Breadcrumb back link */}
        <div className="bg-light py-2 border-bottom">
          <div className="container container-1350">
            <div className="d-flex align-items-center gap-2" style={{ fontSize: "13px" }}>
              <a
                href="/"
                onClick={(e) => {
                  if (onBackHome) {
                    e.preventDefault();
                    onBackHome();
                  }
                }}
                className="text-muted text-decoration-none hover-primary"
              >
                <i className="fa-solid fa-house mr-5"></i> Home
              </a>
              <span className="text-muted">/</span>
              <span className="text-muted">Destinations</span>
              <span className="text-muted">/</span>
              <span className="fw-600 text-dark">{location}</span>
            </div>
          </div>
        </div>

        {/* 1. Hero Collection Banner (Image -> Video Background) */}
        <HeroCollection cityName={location} query={query} />

        {/* 2. Hotel Offers Section at top */}
        <div className="pt-20">
          <HotelOffersSection />
        </div>

        {/* 3. Category City Section with SerpApi live packages */}
        <CategoryCity location={location} />

        {/* 4. Offer Banner Area with Pexels */}
        <OfferBannerArea location={location} query={query} />

        {/* 5. Collection FAQ Section */}
        <CollectionFaq location={location} />
      </main>
      <Footer />
    </>
  );
};

export default CityDetailsPage;
