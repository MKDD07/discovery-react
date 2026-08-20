import React, { useState } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";

interface LoginPageProps {
  onBackHome?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackHome }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email.trim() || !password) {
      setMessage({ type: "error", text: "Please enter your email and password." });
      return;
    }

    setLoading(true);

    try {
      // Post to login endpoint
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Logged in successfully! Redirecting..." });
        setTimeout(() => {
          window.history.pushState({}, "", "/");
          window.dispatchEvent(new PopStateEvent("popstate"));
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Invalid email or password. Please try again.",
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to connect to server." });
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <>
      <Header />
      <main>
        <div className="tp-login-area pre-header pt-90 pb-120 p-relative z-index-1 fix">
          <div className="container container-1350">
            <div className="row justify-content-center">
              <div className="col-xxl-10 col-xl-11 col-lg-12">
                <div
                  className="tp-login-card-box bg-white rounded-4 overflow-hidden border shadow-sm"
                  style={{ minHeight: "540px" }}
                >
                  <div className="row g-0 align-items-stretch">
                    {/* Left Banner with Pure Image & Subtle Gradient Overlay */}
                    <div className="col-lg-6 d-none d-lg-block p-relative">
                      <div
                        className="h-100 w-100 p-relative"
                        style={{
                          backgroundImage:
                            "url('https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1000')",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          minHeight: "540px",
                        }}
                      >
                        {/* Overlay */}
                        <div
                          className="position-absolute top-0 start-0 w-100 h-100"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.55) 100%)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Right Login Form */}
                    <div className="col-lg-6 col-12">
                      <div className="tp-login-wrapper p-30 p-sm-40 p-md-50">
                        {/* Tab Switcher */}
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-25">
                          <button
                            type="button"
                            className="tp-btn text-white px-4 py-2"
                            style={{ fontSize: "13px" }}
                          >
                            Sign In
                          </button>
                          <button
                            type="button"
                            className="tp-btn bg-light text-muted border px-4 py-2"
                            style={{ fontSize: "13px" }}
                            onClick={() => navigateTo("/register")}
                          >
                            Sign Up
                          </button>
                        </div>

                        <div className="tp-login-top text-center mb-25">
                          <h4 className="tp-login-title fw-700 text-dark mb-5" style={{ fontSize: "20px" }}>
                            Sign In to Account
                          </h4>
                          <p className="text-muted" style={{ fontSize: "13px" }}>
                            Don’t have an account?{" "}
                            <span>
                              <a
                                href="/register"
                                className="fw-600 text-primary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigateTo("/register");
                                }}
                              >
                                Create free account
                              </a>
                            </span>
                          </p>
                        </div>

                        {message && (
                          <div
                            className={`alert ${
                              message.type === "success" ? "alert-success" : "alert-danger"
                            } text-center mb-20 rounded-3 py-2 px-3`}
                            style={{ fontSize: "13px" }}
                          >
                            {message.text}
                          </div>
                        )}

                        <div className="tp-login-option">
                          <form onSubmit={handleSubmit}>
                            <div className="tp-login-input-wrapper tp-contact-form">
                              <div className="tp-review-input mb-15">
                                <label className="tp-label mb-5" htmlFor="email" style={{ fontSize: "13px" }}>
                                  Your Email
                                </label>
                                <input
                                  className="tp-input"
                                  type="email"
                                  id="email"
                                  placeholder="name@example.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                  style={{ fontSize: "13px" }}
                                />
                              </div>
                              <div className="tp-review-input mb-15">
                                <label className="tp-label mb-5" htmlFor="password" style={{ fontSize: "13px" }}>
                                  Password
                                </label>
                                <div className="p-relative">
                                  <input
                                    className="tp-input"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ fontSize: "13px" }}
                                  />
                                  <div
                                    className="tp-login-input-eye"
                                    id="password-show-toggle"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    <span className={showPassword ? "open-close" : "open-eye"}>
                                      {showPassword ? (
                                        <svg width={18} height={18} viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M6.8822 11.7457C6.72311 11.7457 6.56402 11.6871 6.43842 11.5615C5.7518 10.8749 5.375 9.9622 5.375 8.99926C5.375 6.99803 6.99943 5.3736 9.00066 5.3736C9.9636 5.3736 10.8763 5.7504 11.5629 6.43701C11.6801 6.55424 11.7471 6.71333 11.7471 6.8808C11.7471 7.04827 11.6801 7.20736 11.5629 7.32459L7.32599 11.5615C7.20039 11.6871 7.0413 11.7457 6.8822 11.7457ZM9.00066 6.6296C7.69442 6.6296 6.631 7.69302 6.631 8.99926C6.631 9.41793 6.73986 9.81985 6.94082 10.1715L10.1729 6.93941C9.82125 6.73845 9.41933 6.6296 9.00066 6.6296Z" fill="currentColor" />
                                          <path opacity="0.5" d="M3.63816 14.4503C3.49582 14.4503 3.3451 14.4001 3.22787 14.2996C2.33192 13.5376 1.52808 12.5998 0.841463 11.5112C-0.0461127 10.1296 -0.0461127 7.87721 0.841463 6.48723C2.88456 3.28861 5.8571 1.44647 8.99711 1.44647C10.8393 1.44647 12.6563 2.08285 14.2472 3.28024C14.5235 3.48957 14.5821 3.88312 14.3728 4.15944C14.1635 4.43576 13.7699 4.49437 13.4936 4.28504C12.1204 3.24674 10.5629 2.70248 8.99711 2.70248C6.29252 2.70248 3.70515 4.32691 1.89651 7.16547C1.2685 8.14516 1.2685 9.85332 1.89651 10.833C2.52451 11.8127 3.24462 12.6584 4.04009 13.345C4.29966 13.5711 4.33315 13.9646 4.10707 14.2326C3.98984 14.3749 3.814 14.4503 3.63816 14.4503Z" fill="currentColor" />
                                        </svg>
                                      ) : (
                                        <svg width={18} height={14} viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M1 6.77778C1 6.77778 3.90909 1 9 1C14.0909 1 17 6.77778 17 6.77778C17 6.77778 14.0909 12.5556 9 12.5556C3.90909 12.5556 1 6.77778 1 6.77778Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                          <path d="M9.00018 8.94466C10.2052 8.94466 11.182 7.97461 11.182 6.77799C11.182 5.58138 10.2052 4.61133 9.00018 4.61133C7.79519 4.61133 6.81836 5.58138 6.81836 6.77799C6.81836 7.97461 7.79519 8.94466 9.00018 8.94466Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="tp-login-suggetions d-flex align-items-center justify-content-between mb-20">
                              <div className="tp-review-input d-flex align-items-center">
                                <input
                                  className="tp-checkbox me-2"
                                  type="checkbox"
                                  id="rememberMe"
                                  checked={rememberMe}
                                  onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label className="tp-agree mb-0" htmlFor="rememberMe" style={{ cursor: "pointer", fontSize: "12.5px" }}>
                                  Remember me
                                </label>
                              </div>
                              <div className="tp-login-forgot">
                                <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: "12.5px" }}>
                                  Forgot Password?
                                </a>
                              </div>
                            </div>

                            <div className="tp-contact-form-btn">
                              <button
                                type="submit"
                                className="tp-btn tp-btn-xl w-100 text-center fw-600"
                                disabled={loading}
                              >
                                {loading ? "Signing In..." : "Sign In"}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LoginPage;
