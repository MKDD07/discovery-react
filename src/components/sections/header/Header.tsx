import React, { useEffect, useRef, useState } from "react";
import logo from "../../../logo.png";
import { loadAllPexelsMedia } from "../pexels/PexelsMediaSection";
import { getStoredUser, logoutUser, UserProfile } from "../../../services/auth";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getStoredUser());
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
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
                      {/* Column 1 - Domestic Highlights */}
                      <div className="col-4">
                        <div className="tp-megamenu-header mb-2 pb-1 border-bottom">
                          <span className="tp-megamenu-sub">DOMESTIC WONDERS</span>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <a
                            href="/destination/kashmir"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo("/destination/kashmir");
                            }}
                            className="tp-megamenu-card"
                          >
                            <div className="tp-megamenu-thumb">
                              <img
                                src="https://images.pexels.com/photos/25786566/pexels-photo-25786566.jpeg?auto=compress&cs=tinysrgb&h=130"
                                alt="Kashmir"
                              />
                            </div>
                            <div>
                              <span className="tp-megamenu-title">Kashmir & Ladakh</span>
                              <span className="text-muted" style={{ fontSize: "11.5px" }}>Dal Lake & Snowpeaks</span>
                            </div>
                          </a>

                          <a
                            href="/destination/goa"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo("/destination/goa");
                            }}
                            className="tp-megamenu-card"
                          >
                            <div className="tp-megamenu-thumb">
                              <img
                                src="https://images.pexels.com/photos/8037061/pexels-photo-8037061.jpeg?auto=compress&cs=tinysrgb&h=130"
                                alt="Goa"
                              />
                            </div>
                            <div>
                              <span className="tp-megamenu-title">Goa Sun & Coast</span>
                              <span className="text-muted" style={{ fontSize: "11.5px" }}>Villas & Beach Parties</span>
                            </div>
                          </a>

                          <a
                            href="/destination/rajasthan"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo("/destination/rajasthan");
                            }}
                            className="tp-megamenu-card"
                          >
                            <div className="tp-megamenu-thumb">
                              <img
                                src="https://images.pexels.com/photos/12931430/pexels-photo-12931430.jpeg?auto=compress&cs=tinysrgb&h=130"
                                alt="Rajasthan"
                              />
                            </div>
                            <div>
                              <span className="tp-megamenu-title">Royal Rajasthan</span>
                              <span className="text-muted" style={{ fontSize: "11.5px" }}>Forts, Palaces & Haveli</span>
                            </div>
                          </a>
                        </div>
                      </div>

                      {/* Column 2 - Popular International */}
                      <div className="col-4">
                        <div className="tp-megamenu-header mb-2 pb-1 border-bottom">
                          <span className="tp-megamenu-sub">ICONIC INTERNATIONAL</span>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <a
                            href="/destination/dubai"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo("/destination/dubai");
                            }}
                            className="tp-megamenu-card"
                          >
                            <div className="tp-megamenu-thumb">
                              <img
                                src="https://images.pexels.com/photos/10579166/pexels-photo-10579166.jpeg?auto=compress&cs=tinysrgb&h=130"
                                alt="Dubai"
                              />
                            </div>
                            <div>
                              <span className="tp-megamenu-title">Dubai & UAE</span>
                              <span className="text-muted" style={{ fontSize: "11.5px" }}>Burj Khalifa & Desert</span>
                            </div>
                          </a>

                          <a
                            href="/destination/maldives"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo("/destination/maldives");
                            }}
                            className="tp-megamenu-card"
                          >
                            <div className="tp-megamenu-thumb">
                              <img
                                src="https://images.pexels.com/photos/9394274/pexels-photo-9394274.jpeg?auto=compress&cs=tinysrgb&h=130"
                                alt="Maldives"
                              />
                            </div>
                            <div>
                              <span className="tp-megamenu-title">Maldives Islands</span>
                              <span className="text-muted" style={{ fontSize: "11.5px" }}>Overwater Ocean Villas</span>
                            </div>
                          </a>

                          <a
                            href="/destination/bali"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo("/destination/bali");
                            }}
                            className="tp-megamenu-card"
                          >
                            <div className="tp-megamenu-thumb">
                              <img
                                src="https://images.pexels.com/photos/34674858/pexels-photo-34674858.jpeg?auto=compress&cs=tinysrgb&h=130"
                                alt="Bali"
                              />
                            </div>
                            <div>
                              <span className="tp-megamenu-title">Bali, Indonesia</span>
                              <span className="text-muted" style={{ fontSize: "11.5px" }}>Ubud Forest & Beaches</span>
                            </div>
                          </a>
                        </div>
                      </div>

                      {/* Column 3 - Europe & Global Escapes */}
                      <div className="col-4">
                        <div className="tp-megamenu-header mb-2 pb-1 border-bottom">
                          <span className="tp-megamenu-sub">EUROPE & ASIA</span>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <a
                            href="/destination/switzerland"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo("/destination/switzerland");
                            }}
                            className="tp-megamenu-card"
                          >
                            <div className="tp-megamenu-thumb">
                              <img
                                src="https://images.pexels.com/photos/792167/pexels-photo-792167.jpeg?auto=compress&cs=tinysrgb&h=130"
                                alt="Switzerland"
                              />
                            </div>
                            <div>
                              <span className="tp-megamenu-title">Swiss Alps</span>
                              <span className="text-muted" style={{ fontSize: "11.5px" }}>Matterhorn & Lakes</span>
                            </div>
                          </a>

                          <a
                            href="/destination/singapore"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo("/destination/singapore");
                            }}
                            className="tp-megamenu-card"
                          >
                            <div className="tp-megamenu-thumb">
                              <img
                                src="https://images.pexels.com/photos/2880607/pexels-photo-2880607.jpeg?auto=compress&cs=tinysrgb&h=130"
                                alt="Singapore"
                              />
                            </div>
                            <div>
                              <span className="tp-megamenu-title">Singapore City</span>
                              <span className="text-muted" style={{ fontSize: "11.5px" }}>Marina Bay & Sentosa</span>
                            </div>
                          </a>

                          <a
                            href="/destination/turkey"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo("/destination/turkey");
                            }}
                            className="tp-megamenu-card"
                          >
                            <div className="tp-megamenu-thumb">
                              <img
                                src="https://images.pexels.com/photos/36936167/pexels-photo-36936167.jpeg?auto=compress&cs=tinysrgb&h=130"
                                alt="Turkey"
                              />
                            </div>
                            <div>
                              <span className="tp-megamenu-title">Turkey & Cappadocia</span>
                              <span className="text-muted" style={{ fontSize: "11.5px" }}>Hot Air Balloons</span>
                            </div>
                          </a>
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
