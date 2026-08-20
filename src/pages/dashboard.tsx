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
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  FileText,
  HelpCircle,
  Eye,
  Key,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface DashboardPageProps {
  onBackHome?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onBackHome }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "saved" | "createBlog" | "settings">("overview");

  // Groq AI Blog Generator State
  const [groqKey, setGroqKey] = useState<string>(
    localStorage.getItem("discovery_groq_key") || ""
  );
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("Adventure");
  const [location, setLocation] = useState("Goa, India");
  const [generating, setGenerating] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<any>(null);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  useEffect(() => {
    const authUser = getStoredUser();
    if (!authUser) {
      window.history.pushState({}, "", "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }
    setUser(authUser);
  }, []);

  const handleGenerateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      alert("Please enter a blog topic / subject.");
      return;
    }

    setGenerating(true);
    setGeneratedBlog(null);
    setPublishStatus(null);

    try {
      if (groqKey) {
        localStorage.setItem("discovery_groq_key", groqKey.trim());
      }

      const res = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          category,
          location,
          apiKey: groqKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setGeneratedBlog(data.data);
      } else {
        alert(data.error || "Failed to generate blog. Please check your Groq API key.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to communicate with AI generation endpoint.");
    } finally {
      setGenerating(false);
    }
  };

  const handlePublishToD1 = async () => {
    if (!generatedBlog) return;
    setPublishStatus("saving");

    try {
      const slug = generatedBlog.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title: generatedBlog.title,
          category: generatedBlog.category || category,
          location: generatedBlog.location || location,
          author: user?.name || "Admin",
          author_role: "Discovery Travel Editor",
          cover_query: generatedBlog.cover_query,
          summary: generatedBlog.summary,
          content: generatedBlog.sections,
          faqs: generatedBlog.faqs,
          tags: generatedBlog.tags,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPublishStatus("published");
      } else {
        alert(data.error || "Failed to save blog to D1 database.");
        setPublishStatus(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to connect to database.");
      setPublishStatus(null);
    }
  };

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
                <h5 className="fw-500 text-dark mb-1">{user.name || "Traveler"}</h5>
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
                      activeTab === "createBlog" ? "bg-primary text-white fw-600" : "text-dark bg-transparent"
                    }`}
                    style={{ fontSize: "14px" }}
                    onClick={() => setActiveTab("createBlog")}
                  >
                    <Sparkles size={16} /> Groq AI Blog Creator
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
              {/* Groq AI Blog Generator Tab */}
              {activeTab === "createBlog" && (
                <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <span className="badge bg-primary bg-opacity-10 text-primary font-monospace small mb-1">
                        AI Content Engine
                      </span>
                      <h4 className="fw-700 text-dark mb-0 d-flex align-items-center gap-2">
                        <Sparkles size={20} className="text-primary" /> Groq AI Blog Generator
                      </h4>
                    </div>
                  </div>
                  <p className="text-muted small mb-4">
                    Enter any travel subject or destination. Groq AI generates full articles with structured headings, paragraphs, up to 10 Pexels image queries, and up to 10 FAQs — instantly connected with D1 Database and live location offer cards.
                  </p>

                  <form onSubmit={handleGenerateBlog} className="mb-4">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small text-muted fw-semibold">
                          Groq API Key (Stored securely in your browser or Worker env)
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <Key size={14} className="text-muted" />
                          </span>
                          <input
                            type="password"
                            className="form-control form-control-sm border-start-0"
                            placeholder="gsk_..."
                            value={groqKey}
                            onChange={(e) => setGroqKey(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small text-muted fw-semibold">
                          Article Topic / Subject *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. 5 Secret Beaches in Goa or Kashmir Snow Trek Guide"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-md-3">
                        <label className="form-label small text-muted fw-semibold">
                          Category
                        </label>
                        <select
                          className="form-select form-select-sm"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value="Adventure">Adventure</option>
                          <option value="Art and culture">Art and culture</option>
                          <option value="Nature">Nature</option>
                          <option value="Beach Trips">Beach Trips</option>
                          <option value="Food & Travel">Food & Travel</option>
                          <option value="Travel Tips">Travel Tips</option>
                        </select>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label small text-muted fw-semibold">
                          Target Location (For offer cards)
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. Goa, Kashmir, Dubai"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>

                      <div className="col-12 pt-2">
                        <button
                          type="submit"
                          className="tp-btn text-white px-4 py-2 d-inline-flex align-items-center gap-2"
                          disabled={generating}
                          style={{ fontSize: "13px" }}
                        >
                          {generating ? (
                            <>
                              <Loader2 size={16} className="animate-spin" /> Generating with Groq AI...
                            </>
                          ) : (
                            <>
                              <Sparkles size={16} /> Generate Travel Article
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Generated Preview & Publish Action */}
                  {generatedBlog && (
                    <div className="border-top pt-4 mt-4">
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                        <h5 className="fw-700 text-dark mb-0">Generated Article Preview</h5>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-success text-white px-3 d-inline-flex align-items-center gap-1"
                            onClick={handlePublishToD1}
                            disabled={publishStatus === "published"}
                          >
                            <CheckCircle2 size={15} />
                            {publishStatus === "published"
                              ? "Published to D1 Database!"
                              : publishStatus === "saving"
                              ? "Saving to D1..."
                              : "Publish Article to D1"}
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-light rounded-4 border">
                        <span className="badge bg-primary mb-2">{generatedBlog.category}</span>
                        <h4 className="fw-bold text-dark mb-2">{generatedBlog.title}</h4>
                        <p className="text-muted small mb-3">{generatedBlog.summary}</p>

                        <div className="small text-muted mb-3 font-monospace">
                          <strong>Cover Image Query:</strong> "{generatedBlog.cover_query}"
                        </div>

                        <div className="border-top pt-3">
                          <h6 className="fw-bold text-dark small mb-2">
                            Content Sections ({generatedBlog.sections?.length || 0} sections with Pexels queries):
                          </h6>
                          <div className="d-flex flex-column gap-2 mb-3">
                            {generatedBlog.sections?.map((sec: any, sIdx: number) => (
                              <div key={sIdx} className="bg-white p-3 rounded-3 border">
                                <strong className="d-block text-dark small">{sec.heading}</strong>
                                <span className="text-muted font-monospace" style={{ fontSize: "11.5px" }}>
                                  Pexels query: "{sec.pexelsQuery}"
                                </span>
                              </div>
                            ))}
                          </div>

                          <h6 className="fw-bold text-dark small mb-2">
                            FAQs ({generatedBlog.faqs?.length || 0} Questions):
                          </h6>
                          <div className="d-flex flex-column gap-2">
                            {generatedBlog.faqs?.map((f: any, fIdx: number) => (
                              <div key={fIdx} className="bg-white p-2 rounded-3 border small">
                                <strong>Q: {f.question}</strong>
                                <p className="mb-0 text-muted mt-1">{f.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {publishStatus === "published" && (
                          <div className="mt-3 text-end">
                            <a
                              href={`/blog/${encodeURIComponent(
                                generatedBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
                              )}`}
                              onClick={(e) => {
                                e.preventDefault();
                                const slug = generatedBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                                window.history.pushState({}, "", `/blog/${slug}`);
                                window.dispatchEvent(new PopStateEvent("popstate"));
                              }}
                              className="btn btn-sm btn-primary rounded-pill px-3"
                            >
                              <Eye size={14} className="me-1" /> View Live Blog Article
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                        <div className="text-muted small fw-semibold text-uppercase mb-1">AI Articles</div>
                        <div className="fs-3 fw-bold text-danger">Active</div>
                        <div className="text-muted small mt-1">Groq Engine ready</div>
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
                            <h6 className="fw-500 text-dark mb-1">Kashmir Snow Valley Resort</h6>
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
                            <h6 className="fw-500 text-dark mb-1">Goa Luxury Beachside Villa</h6>
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
                            <h6 className="fw-500 text-dark mb-1" style={{ fontSize: "13.5px" }}>{item.name}</h6>
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
