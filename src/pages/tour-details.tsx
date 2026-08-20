import React from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import TourBreadcrumbs from "../components/sections/tour-details/tour-breadcrumbs";
import TourDetails from "../components/sections/tour-details/tour-details";
import TourArea from "../components/sections/tour-details/tour-area";

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
