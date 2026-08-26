import React from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import TourBreadcrumbs from "../components/sections/tour-details/tour-breadcrumbs";
import TourDetails from "../components/sections/tour-details/tour-details";
import TourArea from "../components/sections/tour-details/tour-area";
import SEO from "../components/snippets/seo/SEO";

interface TourDetailsPageProps {
  tourName?: string;
  location?: string;
  cardPrice?: string;
  cardOriginalPrice?: number;
  initialHotel?: any;
  onBackHome?: () => void;
}

const TourDetailsPage: React.FC<TourDetailsPageProps> = ({
  tourName = "Tour Details",
  location = "India",
  cardPrice,
  cardOriginalPrice,
  initialHotel,
  onBackHome,
}) => {
  return (
    <>
      <SEO
        title={`${tourName} | Luxury Stay in ${location}`}
        description={`Reserve your stay at ${tourName} in ${location}. Best price guarantee, live rate computation, verified 5-star amenities & 24/7 concierge support.`}
        keywords={[tourName, location, `${tourName} booking`, `${location} luxury hotels`, "Discovery Convoy"]}
        url={`https://discoveryconvoy.com/tour/${encodeURIComponent(tourName)}`}
        type="product"
        schema={{
          "@context": "https://schema.org",
          "@type": "Hotel",
          name: tourName,
          description: `Luxury accommodations at ${tourName} located in ${location}.`,
          address: {
            "@type": "PostalAddress",
            addressLocality: location,
          },
          url: `https://discoveryconvoy.com/tour/${encodeURIComponent(tourName)}`,
        }}
      />
      <Header />
      <main>
        {/* Section 1: Breadcrumbs */}
        <TourBreadcrumbs tourName={tourName} location={location} onBackHome={onBackHome} />

        {/* Section 2: Tour Details (tp-tour-details) */}
        <TourDetails
          tourName={tourName}
          location={location}
          cardPrice={cardPrice}
          cardOriginalPrice={cardOriginalPrice}
          initialHotel={initialHotel}
        />

        {/* Section 3: Tour Area (tp-tour-area) */}
        <TourArea location={location} />
      </main>
      <Footer />
    </>
  );
};

export default TourDetailsPage;
