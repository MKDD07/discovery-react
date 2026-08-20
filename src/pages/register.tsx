import React, { useState } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";

interface RegisterPageProps {
  onBackHome?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onBackHome }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim() || !email.trim() || !password) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    if (!agree) {
      setMessage({ type: "error", text: "Please accept the Terms & Privacy Policy." });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: "success", text: data.message || "Account created successfully!" });
        setName("");
        setEmail("");
        setPassword("");
        setAgree(false);
      } else {
        setMessage({ type: "error", text: data.error || "Registration failed. Please try again." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to connect to server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="tp-login-area pre-header pt-120 pb-140 p-relative z-index-1 fix">
          <div className="container container-1350">
            <div className="row justify-content-center">
              <div className="col-xl-6 col-lg-8">
                <div className="tp-login-wrapper">
                  <div className="tp-login-top text-center mb-30">
                    <h3 className="tp-login-title">Sign up Turie.</h3>
                    <p>
                      Already have an account?{" "}
                      <span>
                        <a
                          href="/login"
                          onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState({}, "", "/login");
                            window.dispatchEvent(new PopStateEvent("popstate"));
                          }}
                        >
                          Sign In
                        </a>
                      </span>
                    </p>
                  </div>

                  {message && (
                    <div
                      className={`alert ${
                        message.type === "success" ? "alert-success" : "alert-danger"
                      } text-center mb-25 rounded-3 py-2 px-3`}
                      style={{ fontSize: "14px" }}
                    >
                      {message.text}
                    </div>
                  )}

                  <div className="tp-login-option">
                    <form onSubmit={handleSubmit}>
                      <div className="tp-login-social mb-10 d-flex flex-wrap align-items-center justify-content-center">
                        <div className="tp-login-option-item has-google">
                          <a href="#" onClick={(e) => e.preventDefault()}>
                            <img src="assets/img/login/google.svg" alt="" />
                            Sign in with google
                          </a>
                        </div>
                        <div className="tp-login-option-item">
                          <a href="#" onClick={(e) => e.preventDefault()}>
                            <img src="assets/img/login/facebook.svg" alt="" />
                          </a>
                        </div>
                        <div className="tp-login-option-item">
                          <a href="#" onClick={(e) => e.preventDefault()}>
                            <img
                              className="apple"
                              src="assets/img/login/apple.svg"
                              alt=""
                            />
                          </a>
                        </div>
                      </div>
                      <div className="tp-login-mail text-center mb-40">
                        <p>
                          or Sign up with <a href="#" onClick={(e) => e.preventDefault()}>Email</a>
                        </p>
                      </div>
                      <div className="tp-login-input-wrapper tp-contact-form">
                        <div className="tp-review-input mb-20">
                          <label className="tp-label mb-5" htmlFor="name">
                            Name
                          </label>
                          <input
                            className="tp-input"
                            type="text"
                            id="name"
                            placeholder="Your Name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="tp-review-input mb-20">
                          <label className="tp-label mb-5" htmlFor="email">
                            Your Email
                          </label>
                          <input
                            className="tp-input"
                            type="email"
                            id="email"
                            placeholder="turie@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="tp-review-input mb-20">
                          <label className="tp-label mb-5" htmlFor="password">
                            Password
                          </label>
                          <div className="p-relative">
                            <input
                              className="tp-input"
                              type={showPassword ? "text" : "password"}
                              id="password"
                              placeholder="Min. 6 character"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                            <div
                              className="tp-login-input-eye"
                              id="password-show-toggle"
                              style={{ cursor: "pointer" }}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <span className={showPassword ? "open-close" : "open-eye"}>
                                {showPassword ? (
                                  <svg
                                    width={19}
                                    height={18}
                                    viewBox="0 0 19 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M6.8822 11.7457C6.72311 11.7457 6.56402 11.6871 6.43842 11.5615C5.7518 10.8749 5.375 9.9622 5.375 8.99926C5.375 6.99803 6.99943 5.3736 9.00066 5.3736C9.9636 5.3736 10.8763 5.7504 11.5629 6.43701C11.6801 6.55424 11.7471 6.71333 11.7471 6.8808C11.7471 7.04827 11.6801 7.20736 11.5629 7.32459L7.32599 11.5615C7.20039 11.6871 7.0413 11.7457 6.8822 11.7457ZM9.00066 6.6296C7.69442 6.6296 6.631 7.69302 6.631 8.99926C6.631 9.41793 6.73986 9.81985 6.94082 10.1715L10.1729 6.93941C9.82125 6.73845 9.41933 6.6296 9.00066 6.6296Z"
                                      fill="currentcolor"
                                    />
                                    <path
                                      opacity="0.5"
                                      d="M3.63816 14.4503C3.49582 14.4503 3.3451 14.4001 3.22787 14.2996C2.33192 13.5376 1.52808 12.5998 0.841463 11.5112C-0.0461127 10.1296 -0.0461127 7.87721 0.841463 6.48723C2.88456 3.28861 5.8571 1.44647 8.99711 1.44647C10.8393 1.44647 12.6563 2.08285 14.2472 3.28024C14.5235 3.48957 14.5821 3.88312 14.3728 4.15944C14.1635 4.43576 13.7699 4.49437 13.4936 4.28504C12.1204 3.24674 10.5629 2.70248 8.99711 2.70248C6.29252 2.70248 3.70515 4.32691 1.89651 7.16547C1.2685 8.14516 1.2685 9.85332 1.89651 10.833C2.52451 11.8127 3.24462 12.6584 4.04009 13.345C4.29966 13.5711 4.33315 13.9646 4.10707 14.2326C3.98984 14.3749 3.814 14.4503 3.63816 14.4503Z"
                                      fill="currentcolor"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    width={18}
                                    height={14}
                                    viewBox="0 0 18 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M1 6.77778C1 6.77778 3.90909 1 9 1C14.0909 1 17 6.77778 17 6.77778C17 6.77778 14.0909 12.5556 9 12.5556C3.90909 12.5556 1 6.77778 1 6.77778Z"
                                      stroke="currentColor"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M9.00018 8.94466C10.2052 8.94466 11.182 7.97461 11.182 6.77799C11.182 5.58138 10.2052 4.61133 9.00018 4.61133C7.79519 4.61133 6.81836 5.58138 6.81836 6.77799C6.81836 7.97461 7.79519 8.94466 9.00018 8.94466Z"
                                      stroke="currentColor"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tp-review-input d-flex align-items-start mb-20">
                        <input
                          className="tp-checkbox"
                          type="checkbox"
                          id="agree"
                          checked={agree}
                          onChange={(e) => setAgree(e.target.checked)}
                          required
                        />
                        <label className="tp-agree" htmlFor="agree" style={{ cursor: "pointer" }}>
                          I accept the terms of the Service &amp; Privacy Policy.
                        </label>
                      </div>
                      <div className="tp-contact-form-btn">
                        <button
                          type="submit"
                          className="tp-btn tp-btn-xl w-100 text-center"
                          disabled={loading}
                        >
                          {loading ? "Creating Account..." : "Sign Up"}
                        </button>
                      </div>
                    </form>
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

export default RegisterPage;
