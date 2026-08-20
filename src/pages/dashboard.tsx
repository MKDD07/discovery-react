import React, { useEffect, useState } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import { getStoredUser, logoutUser, UserProfile } from "../services/auth";
import {
  User,
  Mail,
  Calendar,
  Heart,
  Briefcase,
  LogOut,
  MapPin,
  Settings,
  Bell,
  CreditCard,
  Compass,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface DashboardPageProps {
  onBackHome?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onBackHome }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "saved" | "settings">("overview");

  useEffect(() => {
    const authUser = getStoredUser();
    if (!authUser) {
      // If not logged in, redirect to login page
      window.history.pushState({}, "", "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }
    setUser(authUser);
  }, []);

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="bg-light py-5">
        <div className="container container-1350">
          {/* Breadcrumb / Top greeting */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 pb-2">
            <div>
              <span className="tp-section-subtitle mb-1 d-block text-uppercase fw-600" style={{ fontSize: "12px" }}>
                Member Dashboard
              </span>
              <h2 className="fw-700 text-dark mb-0" style={{ fontSize: "24px" }}>
                Welcome back, {user.name || "Traveler"}! 👋
              </h2>
            </div>
            <div className="d-flex align-items-center gap-2">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, "", "/");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="tp-btn-sm bg-white text-dark border shadow-none"
              >
                <Compass size={14} className="me-1 text-primary" /> Explore Tours
              </a>
              <button
                type="button"
                className="tp-btn-sm bg-danger text-white border-0 shadow-none d-inline-flex align-items-center gap-1"
                onClick={logoutUser}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>

          <div className="row g-4">
            {/* Sidebar Profile Card */}
            <div className="col-lg-3 col-md-4">
              <div className="bg-white rounded-4 border p-4 shadow-sm text-center mb-4">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm"
                  style={{ width: "72px", height: "72px", fontSize: "26px", fontWeight: "bold" }}
                >
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
                <h5 className="fw-700 text-dark mb-1">{user.name || "Traveler"}</h5>
                <p className="text-muted small mb-3">{user.email}</p>
                <div className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill font-monospace small mb-3">
                  <ShieldCheck size={13} className="me-1" /> Verified Member
                </div>

                <div className="border-top pt-3 text-start small text-muted d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between">
                    <span>Member Since:</span>
                    <strong className="text-dark">{user.joinedAt || "Aug 2026"}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Active Bookings:</span>
                    <strong className="text-dark">{user.bookingsCount ?? 2}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Saved Tours:</span>
                    <strong className="text-dark">{user.savedToursCount ?? 5}</strong>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="bg-white rounded-4 border p-2 shadow-sm">
                <nav className="nav flex-column gap-1">
                  <button
                    className={`btn text-start d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 ${
                      activeTab === "overview" ? "bg-primary text-white fw-600" : "text-dark bg-transparent"
                    }`}
                    style={{ fontSize: "14px" }}
                    onClick={() => setActiveTab("overview")}
                  >
                    <User size={16} /> Account Overview
                  </button>
                  <button
                    className={`btn text-start d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 ${
                      activeTab === "bookings" ? "bg-primary text-white fw-600" : "text-dark bg-transparent"
                    }`}
                    style={{ fontSize: "14px" }}
                    onClick={() => setActiveTab("bookings")}
                  >
                    <Briefcase size={16} /> My Bookings
                  </button>
                  <button
                    className={`btn text-start d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 ${
                      activeTab === "saved" ? "bg-primary text-white fw-600" : "text-dark bg-transparent"
                    }`}
                    style={{ fontSize: "14px" }}
                    onClick={() => setActiveTab("saved")}
                  >
                    <Heart size={16} /> Saved Wishlist
                  </button>
                  <button
                    className={`btn text-start d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 ${
                      activeTab === "settings" ? "bg-primary text-white fw-600" : "text-dark bg-transparent"
                    }`}
                    style={{ fontSize: "14px" }}
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings size={16} /> Profile Settings
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-lg-9 col-md-8">
              {activeTab === "overview" && (
                <div>
                  {/* Quick Stat Cards */}
                  <div className="row g-3 mb-4">
                    <div className="col-sm-4">
                      <div className="bg-white rounded-4 border p-4 shadow-sm">
                        <div className="text-muted small fw-semibold text-uppercase mb-1">Upcoming Trips</div>
                        <div className="fs-3 fw-bold text-primary">2 Trips</div>
                        <div className="text-muted small mt-1">Confirmed & Scheduled</div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="bg-white rounded-4 border p-4 shadow-sm">
                        <div className="text-muted small fw-semibold text-uppercase mb-1">Reward Points</div>
                        <div className="fs-3 fw-bold text-success">1,450 pts</div>
                        <div className="text-muted small mt-1">₹1,450 redeemable balance</div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="bg-white rounded-4 border p-4 shadow-sm">
                        <div className="text-muted small fw-semibold text-uppercase mb-1">Saved Tours</div>
                        <div className="fs-3 fw-bold text-danger">5 Places</div>
                        <div className="text-muted small mt-1">In your travel wishlist</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings Section */}
                  <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 className="fw-700 text-dark mb-0">Upcoming Bookings</h5>
                      <button
                        type="button"
                        className="btn btn-link text-primary text-decoration-none p-0 small fw-semibold"
                        onClick={() => setActiveTab("bookings")}
                      >
                        View All
                      </button>
                    </div>

                    <div className="d-flex flex-column gap-3">
                      <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-3 overflow-hidden"
                            style={{ width: "65px", height: "55px", background: "#ddd" }}
                          >
                            <img
                              src="https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=300"
                              alt=""
                              className="w-100 h-100 object-fit-cover"
                            />
                          </div>
                          <div>
                            <h6 className="fw-700 text-dark mb-1">Kashmir Snow Valley Resort</h6>
                            <span className="text-muted small d-inline-flex align-items-center gap-1">
                              <Calendar size={13} /> 25 Aug – 28 Aug 2026 • 2 Adults
                            </span>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-700 text-dark">₹18,500</div>
                          <span className="badge bg-success bg-opacity-10 text-success small">Confirmed</span>
                        </div>
                      </div>

                      <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-3 overflow-hidden"
                            style={{ width: "65px", height: "55px", background: "#ddd" }}
                          >
                            <img
                              src="https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=300"
                              alt=""
                              className="w-100 h-100 object-fit-cover"
                            />
                          </div>
                          <div>
                            <h6 className="fw-700 text-dark mb-1">Goa Luxury Beachside Villa</h6>
                            <span className="text-muted small d-inline-flex align-items-center gap-1">
                              <Calendar size={13} /> 12 Sep – 15 Sep 2026 • 2 Adults
                            </span>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-700 text-dark">₹24,999</div>
                          <span className="badge bg-success bg-opacity-10 text-success small">Confirmed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "bookings" && (
                <div className="bg-white rounded-4 border p-4 shadow-sm">
                  <h5 className="fw-700 text-dark mb-3">All Trip Bookings</h5>
                  <p className="text-muted small mb-4">Manage your hotel stays, domestic flights, and international tour packages.</p>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr className="small text-muted text-uppercase">
                          <th>Destination</th>
                          <th>Dates</th>
                          <th>Guests</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody className="small">
                        <tr>
                          <td><strong>Kashmir Valley Luxury Package</strong></td>
                          <td>25 Aug – 28 Aug 2026</td>
                          <td>2 Adults</td>
                          <td className="fw-bold">₹18,500</td>
                          <td><span className="badge bg-success">Confirmed</span></td>
                        </tr>
                        <tr>
                          <td><strong>Goa Private Pool Villa</strong></td>
                          <td>12 Sep – 15 Sep 2026</td>
                          <td>2 Adults</td>
                          <td className="fw-bold">₹24,999</td>
                          <td><span className="badge bg-success">Confirmed</span></td>
                        </tr>
                        <tr>
                          <td><strong>Dubai 4N/5D Desert Safari</strong></td>
                          <td>10 Nov – 14 Nov 2026</td>
                          <td>2 Adults, 1 Child</td>
                          <td className="fw-bold">₹78,000</td>
                          <td><span className="badge bg-warning text-dark">Pending</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "saved" && (
                <div className="bg-white rounded-4 border p-4 shadow-sm">
                  <h5 className="fw-700 text-dark mb-3">Saved Destinations & Tours</h5>
                  <p className="text-muted small mb-4">Your personalized bucket list of hotels and experiences.</p>

                  <div className="row g-3">
                    {[
                      { name: "The Oberoi Vanyavilas, Ranthambore", loc: "Rajasthan", price: "₹14,200", img: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400" },
                      { name: "Taj Exotica Resort & Spa", loc: "Goa", price: "₹19,500", img: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=400" },
                      { name: "Khyber Himalayan Resort", loc: "Gulmarg, Kashmir", price: "₹22,000", img: "https://images.pexels.com/photos/2088203/pexels-photo-2088203.jpeg?auto=compress&cs=tinysrgb&w=400" },
                    ].map((item, idx) => (
                      <div key={idx} className="col-md-4">
                        <div className="card rounded-3 border overflow-hidden shadow-sm h-100">
                          <img src={item.img} alt="" style={{ height: "140px", objectFit: "cover" }} />
                          <div className="p-3">
                            <h6 className="fw-700 text-dark mb-1" style={{ fontSize: "13.5px" }}>{item.name}</h6>
                            <span className="text-muted small d-block mb-2"><MapPin size={12} className="text-danger" /> {item.loc}</span>
                            <div className="d-flex justify-content-between align-items-center">
                              <strong className="text-primary">{item.price}</strong>
                              <a
                                href={`/tour/${encodeURIComponent(item.name)}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.history.pushState({}, "", `/tour/${encodeURIComponent(item.name)}`);
                                  window.dispatchEvent(new PopStateEvent("popstate"));
                                }}
                                className="btn btn-sm btn-primary rounded-pill px-3"
                                style={{ fontSize: "11.5px" }}
                              >
                                View Tour
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="bg-white rounded-4 border p-4 shadow-sm">
                  <h5 className="fw-700 text-dark mb-3">Profile & Account Settings</h5>
                  <form onSubmit={(e) => { e.preventDefault(); alert("Profile updated successfully!"); }}>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-semibold">Full Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          defaultValue={user.name || ""}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-semibold">Email Address</label>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          defaultValue={user.email}
                          disabled
                        />
                      </div>
                    </div>
                    <button type="submit" className="tp-btn text-white px-4 py-2" style={{ fontSize: "13px" }}>
                      Save Changes
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DashboardPage;
