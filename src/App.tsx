import { useState, useEffect } from "react";
import Header from "./components/sections/header/Header";
import HeroBanner from "./components/sections/hero/hero-banner";
import BookingForm, { BookingTab } from "./components/sections/booking-form/booking-form";
import { CircularPexelsLocationSelection } from "./components/sections/location-selection/circular-pexels-location";
import AboutArea from "./components/sections/about-area/about-area";
import HotelOffersSection from "./components/sections/offers/hotel-offers";
import FlightOffersSection from "./components/sections/offers/flight-offers";
import InternationalOffersSection from "./components/sections/offers/international-offers";
import InternationalFlightOffersSection from "./components/sections/offers/international-flight-offers";
import ChoseArea from "./components/sections/chose-area/chose-area";
import BlogArea from "./components/sections/blog-area/blog-area";
import VideoArea from "./components/sections/video-area/video-area";
import FaqSection from "./components/sections/faq-section/faq-section";
import BrandsArea from "./components/sections/brands-area/brands-area";
import HeroAreaVertical from "./components/sections/hero-area-vertical/hero-area-vertical";
import FlightSection from "./components/sections/flights/flight-section";
import DomesticLocation from "./components/sections/domestic-location/domestic-location";
import InternationalLocation from "./components/sections/international-location/international-location";
import ServiceArea from "./components/sections/service-area/service-area";
import Footer from "./components/sections/footer/Footer";
import CityDetailsPage from "./pages/city-details";
import TourDetailsPage from "./pages/tour-details";

function App() {
  const [bookingTab, setBookingTab] = useState<BookingTab>("packages");
  const [selectedDestination, setSelectedDestination] = useState<{
    name: string;
    query: string;
  } | null>(null);
  const [selectedTour, setSelectedTour] = useState<{
    name: string;
    location: string;
  } | null>(null);

  // Check URL pathname for initial load
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/destination/")) {
      const citySlug = path.replace("/destination/", "");
      const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);
      setSelectedDestination({
        name: cityName,
        query: `${cityName} landscape travel scenery`,
      });
    } else if (path.startsWith("/tour/")) {
      const tourSlug = path.replace("/tour/", "");
      const tourName = decodeURIComponent(tourSlug);
      setSelectedTour({ name: tourName, location: tourName });
    }

    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/destination/")) {
        const citySlug = currentPath.replace("/destination/", "");
        const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);
        setSelectedDestination({
          name: cityName,
          query: `${cityName} landscape travel scenery`,
        });
        setSelectedTour(null);
      } else if (currentPath.startsWith("/tour/")) {
        const tourSlug = currentPath.replace("/tour/", "");
        const tourName = decodeURIComponent(tourSlug);
        setSelectedTour({ name: tourName, location: tourName });
        setSelectedDestination(null);
      } else {
        setSelectedDestination(null);
        setSelectedTour(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (selectedTour) {
    return (
      <TourDetailsPage
        tourName={selectedTour.name}
        location={selectedTour.location}
        onBackHome={() => {
          window.history.pushState({}, "", "/");
          setSelectedTour(null);
        }}
      />
    );
  }

  if (selectedDestination) {
    return (
      <CityDetailsPage
        location={selectedDestination.name}
        query={selectedDestination.query}
        onBackHome={() => {
          window.history.pushState({}, "", "/");
          setSelectedDestination(null);
        }}
      />
    );
  }

  return (
    <>
      <Header />
      <main>
        <HeroBanner activeTab={bookingTab} />
        <BookingForm activeTab={bookingTab} onTabChange={setBookingTab} />
                <CircularPexelsLocationSelection
          onSelectLocation={(locName, query) => {
            window.history.pushState({}, "", `/destination/${encodeURIComponent(locName.toLowerCase())}`);
            setSelectedDestination({ name: locName, query });
          }}
        />

                        <HotelOffersSection />


{/* ================= Domestic Packages ================= */}

<DomesticLocation
  location="India"
  layout="swiper"
  subtitle="Trending Domestic Destinations"
  title="Explore India"
  iconClass="fa-solid fa-fire"
  showBtn={true}
  btnText="View All Domestic"
  btnHref="/domestic"
  maxCards={8}
/>

<DomesticLocation
  location="North India"
  layout="swiper"
  subtitle="Mountains, Valleys & Spiritual Destinations"
  title="North India"
  iconClass="fa-solid fa-mountain"
  showBtn={true}
  btnText="View All North India"
  btnHref="/domestic/north"
  maxCards={8}
/>
        <AboutArea />
<DomesticLocation
  location="West India"
  layout="swiper"
  subtitle="Beaches, Heritage & Royalty"
  title="West India"
  iconClass="fa-solid fa-sun"
  showBtn={true}
  btnText="View All West India"
  btnHref="/domestic/west"
  maxCards={8}
/>

<DomesticLocation
  location="South India"
  layout="swiper"
  subtitle="Backwaters, Temples & Coastal Charms"
  title="South India"
  iconClass="fa-solid fa-umbrella-beach"
  showBtn={true}
  btnText="View All South India"
  btnHref="/domestic/south"
  maxCards={8}
/>

<DomesticLocation
  location="East India"
  layout="swiper"
  subtitle="Nature, Tea Gardens & Culture"
  title="East India"
  iconClass="fa-solid fa-leaf"
  showBtn={true}
  btnText="View All East India"
  btnHref="/domestic/east"
  maxCards={8}
/>
        <FlightOffersSection />

{/* ================= Domestic Flights Section ================= */}
<FlightSection
  type="domestic"
  subtitle="Popular Air Routes Across India"
  title="Top Domestic Flights"
  iconClass="fa-solid fa-plane-departure"
  routes={[
    { id: "del-bom", from: "DEL", to: "BOM", label: "Delhi ⇄ Mumbai", icon: "fa-solid fa-plane" },
    { id: "del-blr", from: "DEL", to: "BLR", label: "Delhi ⇄ Bengaluru", icon: "fa-solid fa-plane" },
    { id: "bom-goi", from: "BOM", to: "GOI", label: "Mumbai ⇄ Goa", icon: "fa-solid fa-plane" },
    { id: "del-sxr", from: "DEL", to: "SXR", label: "Delhi ⇄ Srinagar", icon: "fa-solid fa-plane" },
    { id: "hyd-maa", from: "HYD", to: "MAA", label: "Hyderabad ⇄ Chennai", icon: "fa-solid fa-plane" },
  ]}
/>

{/* ================= International Offers Section ================= */}
<InternationalOffersSection />

{/* ================= International Packages ================= */}

<InternationalLocation
  location="Asia"
  layout="swiper"
  subtitle="Trending International Destinations"
  title="Explore International"
  iconClass="fa-solid fa-globe"
  showBtn={true}
  btnText="View All International"
  btnHref="/international"
  maxCards={8}
  tabs={[
    { id: "Asia", label: "Asia", icon: "fa-solid fa-earth-asia" },
    { id: "Europe", label: "Europe", icon: "fa-solid fa-landmark" },
    { id: "Middle East", label: "Middle East", icon: "fa-solid fa-mosque" },
    { id: "Americas", label: "Americas", icon: "fa-solid fa-globe-americas" }
  ]}
/>

{/* ================= International Flight Offers Section ================= */}
<InternationalFlightOffersSection />

{/* ================= International Flights Section ================= */}
<FlightSection
  type="international"
  subtitle="Global Direct & Connecting Flights"
  title="Top International Flights"
  iconClass="fa-solid fa-earth-americas"
  routes={[
    { id: "del-dxb", from: "DEL", to: "DXB", label: "Delhi ⇄ Dubai", icon: "fa-solid fa-plane-departure" },
    { id: "del-sin", from: "DEL", to: "SIN", label: "Delhi ⇄ Singapore", icon: "fa-solid fa-plane-departure" },
    { id: "bom-doh", from: "BOM", to: "DOH", label: "Mumbai ⇄ Doha", icon: "fa-solid fa-plane-departure" },
    { id: "del-bkk", from: "DEL", to: "BKK", label: "Delhi ⇄ Bangkok", icon: "fa-solid fa-plane-departure" },
    { id: "del-lhr", from: "DEL", to: "LHR", label: "Delhi ⇄ London", icon: "fa-solid fa-plane-departure" },
  ]}
/>

        {/* ================= Why Choose Us Area ================= */}
        <ChoseArea />

        {/* ================= Video Banner Area ================= */}
        <VideoArea />

        {/* ================= FAQ Section ================= */}
        <FaqSection />

        {/* ================= Blog Section ================= */}
        <BlogArea />

        {/* ================= Vertical Hero Showcase ================= */}
        <HeroAreaVertical />

        {/* ================= Brands Partner Area ================= */}
        <BrandsArea />

        {/* ================= Service / Features Area ================= */}
        <ServiceArea />
      </main>
      <Footer />
    </>
  );
}

export default App;
