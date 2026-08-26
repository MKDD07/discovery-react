import React, { useEffect, useRef, useState } from "react";
import logo from "../../../logo.png";
import { loadAllPexelsMedia } from "../pexels/PexelsMediaSection";
import { getStoredUser, logoutUser, UserProfile } from "../../../services/auth";

interface LocationItem {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  short_description: string;
  header_order: number;
  show_in_header: number;
}

// Fallback static destinations in case API is unavailable
const FALLBACK_DOMESTIC: LocationItem[] = [
  { id: 1, name: "Kashmir & Ladakh", slug: "kashmir-ladakh", image_url: "https://images.pexels.com/photos/25786566/pexels-photo-25786566.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "Dal Lake & Snowpeaks", header_order: 1, show_in_header: 1 },
  { id: 2, name: "Goa", slug: "goa", image_url: "https://images.pexels.com/photos/8037061/pexels-photo-8037061.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "Villas & Beach Parties", header_order: 2, show_in_header: 1 },
  { id: 3, name: "Royal Rajasthan", slug: "rajasthan", image_url: "https://images.pexels.com/photos/12931430/pexels-photo-12931430.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "Forts, Palaces & Haveli", header_order: 3, show_in_header: 1 },
  { id: 4, name: "Kerala", slug: "kerala", image_url: "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "God's Own Country", header_order: 4, show_in_header: 1 },
  { id: 5, name: "Manali & Himachal", slug: "manali-himachal", image_url: "https://images.pexels.com/photos/1591361/pexels-photo-1591361.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "Mountain Escape", header_order: 5, show_in_header: 1 },
];
const FALLBACK_INTL: LocationItem[] = [
  { id: 21, name: "Dubai & UAE", slug: "dubai", image_url: "https://images.pexels.com/photos/10579166/pexels-photo-10579166.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "Burj Khalifa & Desert", header_order: 1, show_in_header: 1 },
  { id: 22, name: "Maldives Islands", slug: "maldives", image_url: "https://images.pexels.com/photos/9394274/pexels-photo-9394274.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "Overwater Ocean Villas", header_order: 2, show_in_header: 1 },
  { id: 23, name: "Bali, Indonesia", slug: "bali", image_url: "https://images.pexels.com/photos/34674858/pexels-photo-34674858.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "Ubud Forest & Beaches", header_order: 3, show_in_header: 1 },
  { id: 24, name: "Thailand", slug: "thailand", image_url: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "Land of Smiles", header_order: 4, show_in_header: 1 },
  { id: 25, name: "Vietnam", slug: "vietnam", image_url: "https://images.pexels.com/photos/1566417/pexels-photo-1566417.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "Ancient Landscapes", header_order: 5, show_in_header: 1 },
];
const FALLBACK_EU: LocationItem[] = [
  { id: 31, name: "Swiss Alps", slug: "switzerland", image_url: "https://images.pexels.com/photos/792167/pexels-photo-792167.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "Matterhorn & Lakes", header_order: 1, show_in_header: 1 },
  { id: 32, name: "Singapore City", slug: "singapore", image_url: "https://images.pexels.com/photos/2880607/pexels-photo-2880607.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "Marina Bay & Sentosa", header_order: 2, show_in_header: 1 },
  { id: 33, name: "Turkey & Cappadocia", slug: "turkey", image_url: "https://images.pexels.com/photos/36936167/pexels-photo-36936167.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "Hot Air Balloons", header_order: 3, show_in_header: 1 },
  { id: 34, name: "Japan", slug: "japan", image_url: "https://images.pexels.com/photos/161401/fushimi-inari-taisha-shrine-kyoto-japan-161401.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "Tradition Meets Tomorrow", header_order: 4, show_in_header: 1 },
  { id: 35, name: "Santorini, Greece", slug: "greece-santorini", image_url: "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&h=130", short_description: "Sunsets & Blue Domes", header_order: 5, show_in_header: 1 },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getStoredUser());
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [megaMenuDomestic, setMegaMenuDomestic] = useState<LocationItem[]>(FALLBACK_DOMESTIC);
  const [megaMenuIntl, setMegaMenuIntl] = useState<LocationItem[]>(FALLBACK_INTL);
  const [megaMenuEU, setMegaMenuEU] = useState<LocationItem[]>(FALLBACK_EU);

  useEffect(() => {
    // Fetch header destinations from D1
    fetch("/api/locations/header")
      .then((r) => r.json())
      .then((data: any) => {
        const dom = (data.domestic || []).filter((l: LocationItem) => l.show_in_header === 1).slice(0, 5);
        const intl = (data.international || []).filter((l: LocationItem) => l.show_in_header === 1).slice(0, 5);
        const eu = (data.europeAsia || []).filter((l: LocationItem) => l.show_in_header === 1).slice(0, 5);
        if (dom.length > 0) setMegaMenuDomestic(dom);
        if (intl.length > 0) setMegaMenuIntl(intl);
        if (eu.length > 0) setMegaMenuEU(eu);
      })
      .catch(() => { /* silently use fallback */ });

    if (headerRef.current) {
      loadAllPexelsMedia(headerRef.current);
    }

    const onAuthChange = () => {
      setCurrentUser(getStoredUser());
    };

    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("auth_state_changed", onAuthChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("auth_state_changed", onAuthChange);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateTo = (url: string) => {
    setIsMobileOpen(false);
    window.history.pushState({}, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const AUTO_FIND_ITEMS = [
    { type: "destination", title: "Kashmir & Ladakh", subtitle: "Dal Lake, Gulmarg Snowpeaks", url: "/destination/kashmir", tag: "Domestic", icon: "fa-mountain-sun" },
    { type: "destination", title: "Goa Coastlines", subtitle: "Private Luxury Villas & Beaches", url: "/destination/goa", tag: "Popular", icon: "fa-umbrella-beach" },
    { type: "destination", title: "Dubai & Emirates", subtitle: "Burj Khalifa, Desert Safaris", url: "/destination/dubai", tag: "International", icon: "fa-city" },
    { type: "destination", title: "Maldives Islands", subtitle: "Overwater Villas, Azure Atolls", url: "/destination/maldives", tag: "Luxe", icon: "fa-water" },
    { type: "destination", title: "Swiss Alps & Zurich", subtitle: "Matterhorn, Glacier Express", url: "/destination/switzerland", tag: "Europe", icon: "fa-snowflake" },
    { type: "destination", title: "Bali & Ubud", subtitle: "Infinity Pools, Temple Retreats", url: "/destination/bali", tag: "Tropical", icon: "fa-tree" },
    { type: "destination", title: "Rajasthan Palaces", subtitle: "Jaipur, Udaipur Lake Palace", url: "/destination/rajasthan", tag: "Heritage", icon: "fa-chess-rook" },
    { type: "hotel", title: "The Oberoi Udaivilas", subtitle: "Udaipur, Rajasthan • 5-Star Luxury", url: "/tour/The%20Oberoi%20Udaivilas", tag: "Hotel", icon: "fa-hotel" },
    { type: "hotel", title: "Taj Exotica Resort & Spa", subtitle: "Benaulim, Goa • Oceanfront Stays", url: "/tour/Taj%20Exotica%20Resort", tag: "Resort", icon: "fa-star" },
    { type: "hotel", title: "Burj Al Arab Jumeirah", subtitle: "Dubai, UAE • 7-Star Ultra Luxury", url: "/tour/Burj%20Al%20Arab", tag: "Luxe", icon: "fa-crown" },
    { type: "flight", title: "Delhi (DEL) → Dubai (DXB)", subtitle: "Direct Flights • Live Rates", url: "https://www.google.com/travel/flights?q=flights+from+DEL+to+DXB", isExternal: true, tag: "Flight", icon: "fa-plane" },
    { type: "flight", title: "Mumbai (BOM) → London (LHR)", subtitle: "Non-stop Flights • Live Rates", url: "https://www.google.com/travel/flights?q=flights+from+BOM+to+LHR", isExternal: true, tag: "Flight", icon: "fa-plane-departure" },
    { type: "flight", title: "Bangalore (BLR) → Singapore (SIN)", subtitle: "Direct Flights • Live Rates", url: "https://www.google.com/travel/flights?q=flights+from+BLR+to+SIN", isExternal: true, tag: "Flight", icon: "fa-plane-up" },
  ];

  const filteredAutoFind = searchQuery.trim()
    ? AUTO_FIND_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : AUTO_FIND_ITEMS.slice(0, 7);

  const handleSelectAutoFind = (item: typeof AUTO_FIND_ITEMS[0]) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    if (item.isExternal) {
      window.open(item.url, "_blank");
    } else {
      navigateTo(item.url);
    }
  };

  return (
    <header ref={headerRef} className="tp-modern-header">
      {/* ── 1. Slim Luxury Announcement / Helpline Topbar ────────────────── */}
      <div className="tp-header-topbar">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="d-inline-flex align-items-center gap-1 opacity-90">
                <i className="fa-solid fa-headset" style={{ fontSize: "11px" }}></i>
                <span className="d-none d-sm-inline">24/7 Concierge:</span>
                <a href="tel:+919319300560" className="fw-bold text-white">
                  +91 9319300560
                </a>
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="d-inline-flex align-items-center gap-1 opacity-90">
                <i className="fa-regular fa-envelope" style={{ fontSize: "11px" }}></i>
                <a href="mailto:support@discoveryconvoy.com" className="text-white">
                  support@discoveryconvoy.com
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Main Glassmorphic Sticky Navigation Bar ───────────────────── */}
      <div className={`tp-header-main-nav ${isSticky ? "is-sticky" : ""}`}>
        {/* Top Row: Logo (Left) | Search Bar (Center) | Auth (Right) */}
        <div className="tp-header-top-row">
          <div className="container">
            <div className="row align-items-center g-3">
              {/* Left: Brand Logo */}
              <div className="col-xl-3 col-lg-3 col-6">
                <div className="tp-header-logo-wrap">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/");
                    }}
                    className="d-inline-flex align-items-center text-decoration-none"
                  >
                    <img src={logo} alt="Discovery Convoy Logo" width={128} />
                  </a>
                </div>
              </div>

              {/* Center: Luxury Minimal Search Capsule with Real-time Auto-Find */}
              <div className="col-xl-6 col-lg-5 d-none d-lg-block">
                <div className="tp-header-center-search position-relative" ref={searchContainerRef}>
                  <form action="#" onSubmit={(e) => e.preventDefault()} className="tp-luxe-search-form">
                    <span className="tp-luxe-search-icon-left">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Search luxury stays, destinations, flights..."
                      className="tp-luxe-search-input"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchOpen(true);
                      }}
                      onFocus={() => setIsSearchOpen(true)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setIsSearchOpen(false);
                        }}
                        className="btn p-0 border-0 bg-transparent text-muted me-1"
                        style={{ fontSize: "12px" }}
                        aria-label="Clear search"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    )}
                  </form>

                  {/* ── Auto-Find Floating Dropdown ────────────────────────── */}
                  {isSearchOpen && (
                    <div className="tp-autofind-dropdown shadow-lg">
                      <div className="tp-autofind-header d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
                        <span className="text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                          {searchQuery.trim() ? "MATCHING SEARCH RESULTS" : "TRENDING & POPULAR SEARCHES"}
                        </span>
                        <span className="badge bg-light text-muted" style={{ fontSize: "10px" }}>
                          Instant Search
                        </span>
                      </div>

                      <div className="tp-autofind-list">
                        {filteredAutoFind.length > 0 ? (
                          filteredAutoFind.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleSelectAutoFind(item)}
                              className="tp-autofind-item d-flex align-items-center justify-content-between px-3 py-2 cursor-pointer"
                            >
                              <div className="d-flex align-items-center gap-3 text-truncate">
                                <div className="tp-autofind-icon-wrap">
                                  <i className={`fa-solid ${item.icon}`}></i>
                                </div>
                                <div className="text-truncate">
                                  <div className="tp-autofind-title text-truncate fw-bold">{item.title}</div>
                                  <div className="tp-autofind-sub text-truncate text-muted">{item.subtitle}</div>
                                </div>
                              </div>
                              <span className="tp-autofind-tag ms-2">{item.tag}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-muted small">
                            No direct matches for "{searchQuery}". Try "Goa", "Dubai", "Flight" or "Resort".
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Auth Buttons & Mobile Menu Toggle */}
              <div className="col-xl-3 col-lg-4 col-6">
                <div className="d-flex align-items-center justify-content-end gap-2">
                  {/* User Authentication Menu */}
                  {currentUser ? (
                    <div className="position-relative">
                      <button
                        type="button"
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                        className="btn p-0 d-flex align-items-center gap-2 border-0 bg-transparent shadow-none"
                      >
                        <div
                          className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
                          style={{
                            width: "36px",
                            height: "36px",
                            fontSize: "14px",
                            background: "linear-gradient(52deg, #84C418 11.5%, #A8D94E 129.52%)",
                          }}
                        >
                          {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="d-none d-md-block text-start lh-1">
                          <span className="d-block fw-bold text-dark" style={{ fontSize: "13px" }}>
                            {currentUser.name || "My Account"}
                          </span>
                          <span className="text-muted" style={{ fontSize: "11px" }}>Member</span>
                        </div>
                        <i className="fa-solid fa-chevron-down text-muted" style={{ fontSize: "10px" }}></i>
                      </button>

                      {showUserDropdown && (
                        <div className="tp-user-dropdown-menu">
                          <div className="tp-user-dropdown-header">
                            <div className="tp-user-dropdown-name">
                              {currentUser.name || "Discovery Member"}
                            </div>
                            <div className="tp-user-dropdown-email">
                              {currentUser.email}
                            </div>
                          </div>

                          <a
                            href="/dashboard"
                            className="tp-user-dropdown-link"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowUserDropdown(false);
                              navigateTo("/dashboard");
                            }}
                          >
                            <i className="fa-solid fa-gauge me-2 text-primary"></i>
                            <span>Member Dashboard</span>
                          </a>

                          <div className="tp-user-dropdown-divider"></div>

                          <button
                            type="button"
                            className="tp-user-dropdown-link danger w-100 border-0 bg-transparent text-start"
                            onClick={() => {
                              setShowUserDropdown(false);
                              logoutUser();
                            }}
                          >
                            <i className="fa-solid fa-arrow-right-from-bracket me-2"></i>
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="d-none d-sm-flex align-items-center gap-2">
                      <a
                        href="/login"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo("/login");
                        }}
                        className="tp-btn-universal-stroke tp-btn-size-sm"
                      >
                        Sign In
                      </a>
                      <a
                        href="/register"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo("/register");
                        }}
                        className="tp-btn-universal-bg tp-btn-size-sm"
                      >
                        Sign Up
                      </a>
                    </div>
                  )}

                  {/* Mobile Hamburger Button */}
                  <button
                    type="button"
                    className="btn d-xl-none p-2 border-0 bg-light rounded-circle text-dark shadow-sm ms-2"
                    onClick={() => setIsMobileOpen(true)}
                    aria-label="Open Mobile Menu"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="fa-solid fa-bars" style={{ fontSize: "18px" }}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Navigation Menu Placed Below Logo/Search/Auth */}
        <div className="tp-header-bottom-nav d-none d-xl-block">
          <div className="container">
            <nav className="d-flex justify-content-center">
              <ul className="tp-nav-menu-list">
                {/* Home */}
                <li className="tp-nav-item active">
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/");
                    }}
                    className="tp-nav-link"
                  >
                    Home
                  </a>
                </li>

                {/* Destinations Mega Menu */}
                <li className="tp-nav-item">
                  <a
                    href="/destinations"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/destinations");
                    }}
                    className="tp-nav-link"
                  >
                    <span>Destinations</span>
                    <i className="fa-solid fa-chevron-down opacity-50" style={{ fontSize: "9px" }}></i>
                  </a>

                  <div className="tp-nav-megamenu">
                    <div className="row g-3">
                      {/* Column 1 — Domestic Wonders (from D1) */}
                      <div className="col-4">
                        <div className="tp-megamenu-header mb-2 pb-1 border-bottom">
                          <span className="tp-megamenu-sub" style={{ fontSize: "10px", fontWeight: 500 }}>DOMESTIC WONDERS</span>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          {megaMenuDomestic.map((loc) => (
                            <a
                              key={loc.id}
                              href={`/destination/${loc.slug}`}
                              onClick={(e) => { e.preventDefault(); navigateTo(`/destination/${loc.slug}`); }}
                              className="tp-megamenu-card py-1 px-2"
                            >
                              <div>
                                <span className="tp-megamenu-title">{loc.name}</span>
                                <span className="text-muted d-block" style={{ fontSize: "10px", fontWeight: 400 }}>{loc.short_description}</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Column 2 — Iconic International (from D1) */}
                      <div className="col-4">
                        <div className="tp-megamenu-header mb-2 pb-1 border-bottom">
                          <span className="tp-megamenu-sub" style={{ fontSize: "10px", fontWeight: 500 }}>ICONIC INTERNATIONAL</span>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          {megaMenuIntl.map((loc) => (
                            <a
                              key={loc.id}
                              href={`/destination/${loc.slug}`}
                              onClick={(e) => { e.preventDefault(); navigateTo(`/destination/${loc.slug}`); }}
                              className="tp-megamenu-card py-1 px-2"
                            >
                              <div>
                                <span className="tp-megamenu-title">{loc.name}</span>
                                <span className="text-muted d-block" style={{ fontSize: "10px", fontWeight: 400 }}>{loc.short_description}</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Column 3 — Europe & Asia (from D1) */}
                      <div className="col-4">
                        <div className="tp-megamenu-header mb-2 pb-1 border-bottom">
                          <span className="tp-megamenu-sub" style={{ fontSize: "10px", fontWeight: 500 }}>EUROPE &amp; ASIA</span>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          {megaMenuEU.map((loc) => (
                            <a
                              key={loc.id}
                              href={`/destination/${loc.slug}`}
                              onClick={(e) => { e.preventDefault(); navigateTo(`/destination/${loc.slug}`); }}
                              className="tp-megamenu-card py-1 px-2"
                            >
                              <div>
                                <span className="tp-megamenu-title">{loc.name}</span>
                                <span className="text-muted d-block" style={{ fontSize: "10px", fontWeight: 400 }}>{loc.short_description}</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                {/* Flights */}
                <li className="tp-nav-item">
                  <a
                    href="/flights"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/flights");
                    }}
                    className="tp-nav-link"
                  >
                    <span>Flights</span>
                    <i className="fa-solid fa-chevron-down opacity-50" style={{ fontSize: "9px" }}></i>
                  </a>
                  <ul className="tp-nav-dropdown">
                    <li className="tp-nav-dropdown-item">
                      <a
                        href="/flights/domestic"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo("/flights/domestic");
                        }}
                      >
                        Domestic Routes
                      </a>
                    </li>
                    <li className="tp-nav-dropdown-item">
                      <a
                        href="/flights/international"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo("/flights/international");
                        }}
                      >
                        International Flights
                      </a>
                    </li>
                  </ul>
                </li>

                {/* Packages */}
                <li className="tp-nav-item">
                  <a
                    href="/packages"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/packages");
                    }}
                    className="tp-nav-link"
                  >
                    <span>Packages</span>
                    <i className="fa-solid fa-chevron-down opacity-50" style={{ fontSize: "9px" }}></i>
                  </a>
                  <ul className="tp-nav-dropdown">
                    <li className="tp-nav-dropdown-item">
                      <a
                        href="/domestic"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo("/domestic");
                        }}
                      >
                        Domestic Packages
                      </a>
                    </li>
                    <li className="tp-nav-dropdown-item">
                      <a
                        href="/international"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo("/international");
                        }}
                      >
                        International Tours
                      </a>
                    </li>
                    <li className="tp-nav-dropdown-item">
                      <a
                        href="/packages/honeymoon"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo("/packages/honeymoon");
                        }}
                      >
                        Honeymoon Specials
                      </a>
                    </li>
                    <li className="tp-nav-dropdown-item">
                      <a
                        href="/packages/family"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo("/packages/family");
                        }}
                      >
                        Family Getaways
                      </a>
                    </li>
                  </ul>
                </li>

                {/* 👑 Luxe Selections Badge */}
                <li className="tp-nav-item">
                  <a
                    href="/luxury"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/luxury");
                    }}
                    className="tp-header-luxe-pill text-decoration-none"
                  >
                    <i className="fa-solid fa-crown"></i>
                    <span>Luxe Selections</span>
                  </a>
                </li>

                {/* Blog */}
                <li className="tp-nav-item">
                  <a
                    href="/blog"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/blog");
                    }}
                    className="tp-nav-link"
                  >
                    Blog
                  </a>
                </li>

                {/* Company */}
                <li className="tp-nav-item">
                  <a
                    href="/about"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("/about");
                    }}
                    className="tp-nav-link"
                  >
                    <span>Company</span>
                    <i className="fa-solid fa-chevron-down opacity-50" style={{ fontSize: "9px" }}></i>
                  </a>
                  <ul className="tp-nav-dropdown">
                    <li className="tp-nav-dropdown-item">
                      <a
                        href="/about"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo("/about");
                        }}
                      >
                        About Us
                      </a>
                    </li>
                    <li className="tp-nav-dropdown-item">
                      <a
                        href="/contact"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo("/contact");
                        }}
                      >
                        Contact Concierge
                      </a>
                    </li>
                    <li className="tp-nav-dropdown-item">
                      <a
                        href="/faq"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo("/faq");
                        }}
                      >
                        Frequently Asked Questions
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* ── 3. Mobile Offcanvas Navigation Drawer ────────────────────────── */}
      <div
        className={`tp-offcanvas-backdrop ${isMobileOpen ? "is-open" : ""}`}
        onClick={() => setIsMobileOpen(false)}
      ></div>

      <div className={`tp-offcanvas-drawer ${isMobileOpen ? "is-open" : ""}`}>
        {/* Sleek bottom sheet pull handle */}
        <div className="tp-offcanvas-handle mx-auto mb-3"></div>

        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
          <img src={logo} alt="Logo" width={110} />
          <button
            type="button"
            className="btn btn-sm btn-light rounded-circle"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Mobile Search */}
        <div className="mb-3">
          <div className="tp-header-search-capsule w-100">
            <form action="#" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Search destinations..." />
              <button type="submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Nav Links with Minimal Bottom Borders */}
        <div className="d-flex flex-column mb-3 flex-1">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("/");
            }}
            className="tp-mobile-nav-link"
          >
            <span>Home</span>
            <i className="fa-solid fa-chevron-right opacity-25" style={{ fontSize: "10px" }}></i>
          </a>
          <a
            href="/destinations"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("/destinations");
            }}
            className="tp-mobile-nav-link"
          >
            <span>Destinations</span>
            <i className="fa-solid fa-chevron-right opacity-25" style={{ fontSize: "10px" }}></i>
          </a>
          <a
            href="/flights"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("/flights");
            }}
            className="tp-mobile-nav-link"
          >
            <span>Flights</span>
            <i className="fa-solid fa-chevron-right opacity-25" style={{ fontSize: "10px" }}></i>
          </a>
          <a
            href="/packages"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("/packages");
            }}
            className="tp-mobile-nav-link"
          >
            <span>Packages</span>
            <i className="fa-solid fa-chevron-right opacity-25" style={{ fontSize: "10px" }}></i>
          </a>

          {/* Luxe Selections Badge - Centered & No Stretch */}
          <div className="d-flex py-2">
            <a
              href="/luxury"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("/luxury");
              }}
              className="tp-header-luxe-pill text-decoration-none text-center"
            >
              <i className="fa-solid fa-crown"></i>
              <span>Luxe Selections</span>
            </a>
          </div>

          <a
            href="/blog"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("/blog");
            }}
            className="tp-mobile-nav-link"
          >
            <span>Blog</span>
            <i className="fa-solid fa-chevron-right opacity-25" style={{ fontSize: "10px" }}></i>
          </a>
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("/about");
            }}
            className="tp-mobile-nav-link"
          >
            <span>About Us</span>
            <i className="fa-solid fa-chevron-right opacity-25" style={{ fontSize: "10px" }}></i>
          </a>
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("/contact");
            }}
            className="tp-mobile-nav-link"
          >
            <span>Contact Concierge</span>
            <i className="fa-solid fa-chevron-right opacity-25" style={{ fontSize: "10px" }}></i>
          </a>
          <a
            href="/faq"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("/faq");
            }}
            className="tp-mobile-nav-link"
          >
            <span>FAQ & Help Center</span>
            <i className="fa-solid fa-chevron-right opacity-25" style={{ fontSize: "10px" }}></i>
          </a>
        </div>

        {/* Mobile Auth Bottom Section */}
        <div className="pt-3 border-top mt-auto">
          {currentUser ? (
            <div className="d-flex flex-column gap-2">
              <span className="fw-bold text-dark">{currentUser.name || currentUser.email}</span>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm w-100"
                onClick={() => {
                  setIsMobileOpen(false);
                  logoutUser();
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("/login");
                }}
                className="btn btn-outline-dark btn-sm flex-1"
              >
                Sign In
              </a>
              <a
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo("/register");
                }}
                className="btn btn-primary btn-sm flex-1 text-white"
                style={{ backgroundColor: "var(--tp-theme-1)", borderColor: "var(--tp-theme-1)" }}
              >
                Sign Up
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
