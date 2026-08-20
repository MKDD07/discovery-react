import React, { useEffect, useRef } from "react";
import logo from "../../../logo.png";
import { loadAllPexelsMedia } from "../pexels/PexelsMediaSection";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      loadAllPexelsMedia(headerRef.current);
    }
  }, []);

  return (
    <header ref={headerRef} className="tp-header-height">
      {/* header-area-start */}
      <div className="tp-header-6-top">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 d-none d-lg-block">
              <div className="tp-header-6-info-wrap">
                <div className="tp-header-6-info-item d-inline-flex align-items-center">
                  <div className="tp-header-6-info-text mt-5 me-5">
                    <span className="d-block lh-1">Phone</span>
                    <a href="tel:+919319300560" className="fw-500 lh-1">
                      +91 9319300560
                    </a>
                  </div>
                </div>

                <div className="tp-header-6-info-item d-inline-flex align-items-center">
                  <div className="tp-header-6-info-text mt-5">
                    <span className="d-block lh-1">Email</span>
                    <a href="mailto:support@discoveryconvoy.com" className="fw-500 lh-1">
                      support@discoveryconvoy.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-6">
              <div className="tp-header-logo text-lg-center">
                <a href="/">
                  <img width={112} src={logo} alt="Discovery Convoy Logo" />
                </a>
              </div>
            </div>
            <div className="col-lg-5 col-6">
              <div className="tp-header-option d-flex align-items-center justify-content-end">
                <button
                  className="tp-header-cart cartmini-open-btn p-relative d-none d-md-block"
                  aria-label="Shopping Cart"
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span>2</span>
                </button>
                <div className="tp-header-contact ml-20 d-none d-sm-flex align-items-center gap-2">
                  <a
                    href="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState({}, "", "/login");
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }}
                    className="fw-600"
                  >
                    Sign In
                  </a>
                  <span className="text-muted">/</span>
                  <a
                    href="/register"
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState({}, "", "/register");
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }}
                    className="fw-600 text-primary"
                  >
                    Sign Up
                  </a>
                </div>
                <div className="tp-header-toogle-wrapper ml-10">
                  <button className="tp-header-toogle" aria-label="Toggle Menu">
                    <span />
                    <span />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        id="header-sticky"
        className="tp-header-area tp-header-lg-ptb tp-header-blur d-none d-xl-block"
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-7">
              <div className="tp-header-left">
                <div className="tp-main-menu tp-menu-dropdown">
                  <nav className="tp-mobile-menu-active">
                    <ul>
                      {/* Home */}
                      <li className="active">
                        <a href="/">Home</a>
                      </li>

                      {/* Destinations Mega Menu */}
                      <li className="has-dropdown">
                        <a href="/destinations">Destinations</a>
                        <div className="sub-menu tp-megamenu-wrapper">
                          <div className="row">
                            {/* Column 1 - Domestic Highlights */}
                            <div className="col-xl-4">
                              <div className="tp-megamenu-list">
                                <ul>
                                  <li>
                                    <a
                                      href="/destination/kashmir"
                                      className="d-flex align-items-center gap-2"
                                    >
                                      <div className="tp-megamenu-list-thumb">
                                        <img
                                          src="assets/img/destination/six/thumb.jpg"
                                          data-pexels="kashmir dal lake shikara snow mountains"
                                          data-type="image"
                                          data-quality="small"
                                          alt="Kashmir"
                                        />
                                      </div>
                                      <div className="tp-megamenu-list-content">
                                        <span className="tp-megamenu-list-subtitle">
                                          Explore
                                        </span>
                                        <span className="tp-megamenu-list-title">
                                          Kashmir & Ladakh
                                        </span>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="/destination/goa"
                                      className="d-flex align-items-center gap-2"
                                    >
                                      <div className="tp-megamenu-list-thumb">
                                        <img
                                          src="assets/img/destination/six/thumb-2.jpg"
                                          data-pexels="goa tropical beach sunset palm trees"
                                          data-type="image"
                                          data-quality="small"
                                          alt="Goa"
                                        />
                                      </div>
                                      <div className="tp-megamenu-list-content">
                                        <span className="tp-megamenu-list-subtitle">
                                          Explore
                                        </span>
                                        <span className="tp-megamenu-list-title">
                                          Goa Beaches
                                        </span>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="/destination/kerala"
                                      className="d-flex align-items-center gap-2"
                                    >
                                      <div className="tp-megamenu-list-thumb">
                                        <img
                                          src="assets/img/destination/six/thumb-3.jpg"
                                          data-pexels="kerala alleppey backwaters houseboat"
                                          data-type="image"
                                          data-quality="small"
                                          alt="Kerala"
                                        />
                                      </div>
                                      <div className="tp-megamenu-list-content">
                                        <span className="tp-megamenu-list-subtitle">
                                          Explore
                                        </span>
                                        <span className="tp-megamenu-list-title">
                                          Kerala Backwaters
                                        </span>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="/destination/rajasthan"
                                      className="d-flex align-items-center gap-2"
                                    >
                                      <div className="tp-megamenu-list-thumb">
                                        <img
                                          src="assets/img/destination/six/thumb-4.jpg"
                                          data-pexels="jaipur hawa mahal rajasthan heritage"
                                          data-type="image"
                                          data-quality="small"
                                          alt="Rajasthan"
                                        />
                                      </div>
                                      <div className="tp-megamenu-list-content">
                                        <span className="tp-megamenu-list-subtitle">
                                          Explore
                                        </span>
                                        <span className="tp-megamenu-list-title">
                                          Royal Rajasthan
                                        </span>
                                      </div>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            {/* Column 2 - Popular International */}
                            <div className="col-xl-4">
                              <div className="tp-megamenu-list">
                                <ul>
                                  <li>
                                    <a
                                      href="/destination/dubai"
                                      className="d-flex align-items-center gap-2"
                                    >
                                      <div className="tp-megamenu-list-thumb">
                                        <img
                                          src="assets/img/menu/01.png"
                                          data-pexels="dubai burj khalifa luxury skyline night"
                                          data-type="image"
                                          data-quality="small"
                                          alt="Dubai"
                                        />
                                      </div>
                                      <div className="tp-megamenu-list-content">
                                        <span className="tp-megamenu-list-subtitle">
                                          Explore
                                        </span>
                                        <span className="tp-megamenu-list-title">
                                          Dubai & UAE
                                        </span>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="/destination/bali"
                                      className="d-flex align-items-center gap-2"
                                    >
                                      <div className="tp-megamenu-list-thumb">
                                        <img
                                          src="assets/img/menu/02.png"
                                          data-pexels="bali indonesia tropical beach temple"
                                          data-type="image"
                                          data-quality="small"
                                          alt="Bali"
                                        />
                                      </div>
                                      <div className="tp-megamenu-list-content">
                                        <span className="tp-megamenu-list-subtitle">
                                          Explore
                                        </span>
                                        <span className="tp-megamenu-list-title">
                                          Bali, Indonesia
                                        </span>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="/destination/maldives"
                                      className="d-flex align-items-center gap-2"
                                    >
                                      <div className="tp-megamenu-list-thumb">
                                        <img
                                          src="assets/img/menu/03.png"
                                          data-pexels="maldives overwater villa turquoise ocean"
                                          data-type="image"
                                          data-quality="small"
                                          alt="Maldives"
                                        />
                                      </div>
                                      <div className="tp-megamenu-list-content">
                                        <span className="tp-megamenu-list-subtitle">
                                          Explore
                                        </span>
                                        <span className="tp-megamenu-list-title">
                                          Maldives Luxury
                                        </span>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="/destination/thailand"
                                      className="d-flex align-items-center gap-2"
                                    >
                                      <div className="tp-megamenu-list-thumb">
                                        <img
                                          src="assets/img/menu/04.png"
                                          data-pexels="thailand bangkok temple phuket beach"
                                          data-type="image"
                                          data-quality="small"
                                          alt="Thailand"
                                        />
                                      </div>
                                      <div className="tp-megamenu-list-content">
                                        <span className="tp-megamenu-list-subtitle">
                                          Explore
                                        </span>
                                        <span className="tp-megamenu-list-title">
                                          Thailand Island Tour
                                        </span>
                                      </div>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            {/* Column 3 - Europe & Global Escapes */}
                            <div className="col-xl-4">
                              <div className="tp-megamenu-list">
                                <ul>
                                  <li>
                                    <a
                                      href="/destination/switzerland"
                                      className="d-flex align-items-center gap-2"
                                    >
                                      <div className="tp-megamenu-list-thumb">
                                        <img
                                          src="assets/img/destination/six/thumb-5.jpg"
                                          data-pexels="switzerland zermatt matterhorn alps lake"
                                          data-type="image"
                                          data-quality="small"
                                          alt="Switzerland"
                                        />
                                      </div>
                                      <div className="tp-megamenu-list-content">
                                        <span className="tp-megamenu-list-subtitle">
                                          Explore
                                        </span>
                                        <span className="tp-megamenu-list-title">
                                          Swiss Alps
                                        </span>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="/destination/singapore"
                                      className="d-flex align-items-center gap-2"
                                    >
                                      <div className="tp-megamenu-list-thumb">
                                        <img
                                          src="assets/img/destination/six/thumb-6.jpg"
                                          data-pexels="singapore marina bay sands skyline lights"
                                          data-type="image"
                                          data-quality="small"
                                          alt="Singapore"
                                        />
                                      </div>
                                      <div className="tp-megamenu-list-content">
                                        <span className="tp-megamenu-list-subtitle">
                                          Explore
                                        </span>
                                        <span className="tp-megamenu-list-title">
                                          Singapore City
                                        </span>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="/destination/turkey"
                                      className="d-flex align-items-center gap-2"
                                    >
                                      <div className="tp-megamenu-list-thumb">
                                        <img
                                          src="assets/img/menu/05.png"
                                          data-pexels="cappadocia turkey hot air balloons sunset"
                                          data-type="image"
                                          data-quality="small"
                                          alt="Turkey"
                                        />
                                      </div>
                                      <div className="tp-megamenu-list-content">
                                        <span className="tp-megamenu-list-subtitle">
                                          Explore
                                        </span>
                                        <span className="tp-megamenu-list-title">
                                          Turkey & Cappadocia
                                        </span>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="/destination/japan"
                                      className="d-flex align-items-center gap-2"
                                    >
                                      <div className="tp-megamenu-list-thumb">
                                        <img
                                          src="assets/img/menu/06.png"
                                          data-pexels="tokyo japan mount fuji cherry blossom"
                                          data-type="image"
                                          data-quality="small"
                                          alt="Japan"
                                        />
                                      </div>
                                      <div className="tp-megamenu-list-content">
                                        <span className="tp-megamenu-list-subtitle">
                                          Explore
                                        </span>
                                        <span className="tp-megamenu-list-title">
                                          Japan & Tokyo
                                        </span>
                                      </div>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      {/* Flights */}
                      <li className="has-dropdown">
                        <a href="/flights">Flights</a>
                        <ul className="sub-menu">
                          <li>
                            <a href="/flights/domestic">Domestic Routes</a>
                          </li>
                          <li>
                            <a href="/flights/international">International Flights</a>
                          </li>
                        </ul>
                      </li>

                      {/* Tour Packages */}
                      <li className="has-dropdown">
                        <a href="/packages">Packages</a>
                        <ul className="sub-menu">
                          <li>
                            <a href="/domestic">Domestic Packages</a>
                          </li>
                          <li>
                            <a href="/international">International Tours</a>
                          </li>
                          <li>
                            <a href="/packages/honeymoon">Honeymoon Specials</a>
                          </li>
                          <li>
                            <a href="/packages/family">Family Getaways</a>
                          </li>
                        </ul>
                      </li>

                      {/* Blog */}
                      <li>
                        <a href="/blog">Blog</a>
                      </li>

                      {/* About & Contact */}
                      <li className="has-dropdown">
                        <a href="/about">Company</a>
                        <ul className="sub-menu">
                          <li>
                            <a href="/about">About Us</a>
                          </li>
                          <li>
                            <a href="/contact">Contact</a>
                          </li>
                          <li>
                            <a href="/faq">FAQ</a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>

            {/* Right Search Input */}
            <div className="col-xl-4 col-5">
              <div className="tp-header-option d-flex align-items-center justify-content-end">
                <div className="tp-header-search p-relative d-none d-xl-block w-100">
                  <form action="#" onSubmit={(e) => e.preventDefault()}>
                    <div className="tp-header-typing-wrap">
                      <span className="typed-text" />
                      <div className="typed-strings d-none">
                        <span>Dubai</span>
                        <span>Maldives</span>
                        <span>Kashmir</span>
                        <span>Bali</span>
                        <span>Goa</span>
                        <span>Switzerland</span>
                      </div>
                    </div>
                    <input
                      className="tp-input"
                      type="text"
                      placeholder="Search destinations, flights..."
                    />
                    <button
                      className="tp-header-search-btn"
                      type="submit"
                      aria-label="Search"
                    >
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* header-area-end */}
    </header>
  );
}
