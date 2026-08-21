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
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import DashboardPage from "./pages/dashboard";
import BlogPage from "./pages/blog";
import BlogDetailsPage from "./pages/blog-details";
import LuxuryPage from "./pages/luxury";
import CollectionPage from "./pages/collection";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import FaqPage from "./pages/faq";
import SEO from "./components/snippets/seo/SEO";

function App() {
  const [bookingTab, setBookingTab] = useState<BookingTab>("hotels");
  const [selectedDestination, setSelectedDestination] = useState<{
    name: string;
    query: string;
  } | null>(null);
  const [selectedTour, setSelectedTour] = useState<{
    name: string;
    location: string;
    price?: string;
    originalPrice?: number;
    initialHotel?: any;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState<string | null>(null);

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
      const searchParams = new URLSearchParams(window.location.search);
      const price = searchParams.get("price") || undefined;
      const mrp = searchParams.get("mrp") ? Number(searchParams.get("mrp")) : undefined;
      const loc = searchParams.get("loc") || tourName;
      const historyState = window.history.state?.hotel;
      setSelectedTour({
        name: tourName,
        location: loc,
        price,
        originalPrice: mrp,
        initialHotel: historyState,
      });
    } else if (path === "/login") {
      setCurrentPage("login");
    } else if (path === "/register") {
      setCurrentPage("register");
    } else if (path === "/dashboard") {
      setCurrentPage("dashboard");
    } else if (path === "/blog") {
      setCurrentPage("blog");
    } else if (path.startsWith("/blog/")) {
      setCurrentPage(path);
    } else if (path === "/luxury" || path === "/luxe") {
      setCurrentPage("luxury");
    } else if (path.startsWith("/collection/") || path.startsWith("/collections")) {
      setCurrentPage(path);
    } else if (path === "/about" || path === "/about-us") {
      setCurrentPage("about");
    } else if (path === "/contact" || path === "/contact-us") {
      setCurrentPage("contact");
    } else if (path === "/faq" || path === "/faqs" || path === "/help") {
      setCurrentPage("faq");
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
        const searchParams = new URLSearchParams(window.location.search);
        const price = searchParams.get("price") || undefined;
        const mrp = searchParams.get("mrp") ? Number(searchParams.get("mrp")) : undefined;
        const loc = searchParams.get("loc") || tourName;
        const historyState = window.history.state?.hotel;
        setSelectedTour({
          name: tourName,
          location: loc,
          price,
          originalPrice: mrp,
          initialHotel: historyState,
        });
        setSelectedDestination(null);
        setCurrentPage(null);
      } else if (currentPath === "/login") {
        setCurrentPage("login");
        setSelectedDestination(null);
        setSelectedTour(null);
      } else if (currentPath === "/register") {
        setCurrentPage("register");
        setSelectedDestination(null);
        setSelectedTour(null);
      } else if (currentPath === "/dashboard") {
        setCurrentPage("dashboard");
        setSelectedDestination(null);
        setSelectedTour(null);
      } else if (currentPath === "/blog") {
        setCurrentPage("blog");
        setSelectedDestination(null);
        setSelectedTour(null);
      } else if (currentPath.startsWith("/blog/")) {
        setCurrentPage(currentPath);
        setSelectedDestination(null);
        setSelectedTour(null);
      } else if (currentPath === "/luxury" || currentPath === "/luxe") {
        setCurrentPage("luxury");
        setSelectedDestination(null);
        setSelectedTour(null);
      } else if (currentPath.startsWith("/collection/") || currentPath.startsWith("/collections")) {
        setCurrentPage(currentPath);
        setSelectedDestination(null);
        setSelectedTour(null);
      } else if (currentPath === "/about" || currentPath === "/about-us") {
        setCurrentPage("about");
        setSelectedDestination(null);
        setSelectedTour(null);
      } else if (currentPath === "/contact" || currentPath === "/contact-us") {
        setCurrentPage("contact");
        setSelectedDestination(null);
        setSelectedTour(null);
      } else if (currentPath === "/faq" || currentPath === "/faqs" || currentPath === "/help") {
        setCurrentPage("faq");
        setSelectedDestination(null);
        setSelectedTour(null);
      } else {
        setSelectedDestination(null);
        setSelectedTour(null);
        setCurrentPage(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (currentPage === "blog") {
    return (
      <BlogPage
        onBackHome={() => {
          window.history.pushState({}, "", "/");
          setCurrentPage(null);
        }}
      />
    );
  }

  if (currentPage && currentPage.startsWith("/blog/")) {
    const blogSlug = currentPage.replace("/blog/", "");
    return (
      <BlogDetailsPage
        slug={blogSlug}
        onBackHome={() => {
          window.history.pushState({}, "", "/blog");
          setCurrentPage("blog");
        }}
      />
    );
  }

  if (currentPage === "login") {
    return (
      <LoginPage
        onBackHome={() => {
          window.history.pushState({}, "", "/");
          setCurrentPage(null);
        }}
      />
    );
  }

  if (currentPage === "register") {
    return (
      <RegisterPage
        onBackHome={() => {
          window.history.pushState({}, "", "/");
          setCurrentPage(null);
        }}
      />
    );
  }

  if (currentPage === "dashboard") {
    return (
      <DashboardPage
        onBackHome={() => {
          window.history.pushState({}, "", "/");
          setCurrentPage(null);
        }}
      />
    );
  }

  if (currentPage === "luxury") {
    return (
      <LuxuryPage
        onBackHome={() => {
          window.history.pushState({}, "", "/");
          setCurrentPage(null);
        }}
        onSelectTour={(tour) => {
          setSelectedTour(tour);
          setSelectedDestination(null);
          setCurrentPage(null);
          const tourUrl = `/tour/${encodeURIComponent(tour.name)}?loc=${encodeURIComponent(tour.location)}${tour.price ? `&price=${encodeURIComponent(tour.price)}` : ""}`;
          window.history.pushState({ hotel: tour.initialHotel }, "", tourUrl);
        }}
      />
    );
  }

  if (currentPage && (currentPage.startsWith("/collection/") || currentPage.startsWith("/collections"))) {
    const colSlug = currentPage.replace("/collection/", "").replace("/collections/", "").replace("/collections", "");
    return (
      <CollectionPage
        slug={colSlug}
        onBackLuxe={() => {
          window.history.pushState({}, "", "/luxury");
          setCurrentPage("luxury");
        }}
        onSelectTour={(tour) => {
          setSelectedTour(tour);
          setSelectedDestination(null);
          setCurrentPage(null);
          const tourUrl = `/tour/${encodeURIComponent(tour.name)}?loc=${encodeURIComponent(tour.location)}${tour.price ? `&price=${encodeURIComponent(tour.price)}` : ""}`;
          window.history.pushState({ hotel: tour.initialHotel }, "", tourUrl);
        }}
      />
    );
  }

  if (currentPage === "about") {
    return (
      <AboutPage
        onBackHome={() => {
          window.history.pushState({}, "", "/");
          setCurrentPage(null);
        }}
      />
    );
  }

  if (currentPage === "contact") {
    return (
      <ContactPage
        onBackHome={() => {
          window.history.pushState({}, "", "/");
          setCurrentPage(null);
        }}
      />
    );
  }

  if (currentPage === "faq") {
    return (
      <FaqPage
        onBackHome={() => {
          window.history.pushState({}, "", "/");
          setCurrentPage(null);
        }}
      />
    );
  }

  if (selectedTour) {
    return (
      <TourDetailsPage
        tourName={selectedTour.name}
        location={selectedTour.location}
        cardPrice={selectedTour.price}
        cardOriginalPrice={selectedTour.originalPrice}
        initialHotel={selectedTour.initialHotel}
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
      <SEO
        title="Discovery Convoy | Luxury Stays, Flight Intelligence & Bespoke Escapes"
        description="Experience unparalleled luxury travel with Discovery Convoy. Handpicked 5-star palace hotels, private overwater villas, real-time Google flight search intelligence, and 24/7 concierge assistance."
        url="https://discoveryconvoy.com/"
      />
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
