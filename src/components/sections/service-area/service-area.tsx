import React from "react";

export const ServiceArea: React.FC = () => {
  return (
    <div
      className="tp-service-area pt-80 pb-50 p-relative"
      data-bg-color="#f7f9f9"
      style={{ backgroundColor: "#f7f9f9" }}
    >
      <img
        className="tp-service-shape"
        src="assets/img/service/shape.png"
        alt=""
      />
      <div className="container">
        <div className="row g-4">
          {/* Service 1 */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div
              className="tp-service-item text-center mb-30 p-4 rounded-4 bg-white shadow-sm h-100"
              style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
            >
              <div
                className="tp-service-icon mb-25 d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#fff3ed",
                  color: "#111111",
                  fontSize: "24px",
                }}
              >
                <i className="fa-solid fa-tags"></i>
              </div>
              <div className="tp-service-content">
                <h3 className="tp-service-title fw-600 fs-20 mb-10">Affordable Pricing</h3>
                <p className="mb-0" style={{ fontSize: "14px", color: "#666" }}>
                  Best price guarantees and flexible budgets for memorable trips.
                </p>
              </div>
            </div>
          </div>

          {/* Service 2 */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div
              className="tp-service-item text-center mb-30 p-4 rounded-4 bg-white shadow-sm h-100"
              style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
            >
              <div
                className="tp-service-icon mb-25 d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#fff3ed",
                  color: "#111111",
                  fontSize: "24px",
                }}
              >
                <i className="fa-solid fa-map-location-dot"></i>
              </div>
              <div className="tp-service-content">
                <h3 className="tp-service-title fw-600 fs-20 mb-10">Special Event Trips</h3>
                <p className="mb-0" style={{ fontSize: "14px", color: "#666" }}>
                  Join unforgettable festivals, concerts, and rich local celebrations.
                </p>
              </div>
            </div>
          </div>

          {/* Service 3 */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div
              className="tp-service-item text-center mb-30 p-4 rounded-4 bg-white shadow-sm h-100"
              style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
            >
              <div
                className="tp-service-icon mb-25 d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#fff3ed",
                  color: "#111111",
                  fontSize: "24px",
                }}
              >
                <i className="fa-solid fa-headset"></i>
              </div>
              <div className="tp-service-content">
                <h3 className="tp-service-title fw-600 fs-20 mb-10">24/7 Customer Support</h3>
                <p className="mb-0" style={{ fontSize: "14px", color: "#666" }}>
                  Round-the-clock dedicated assistance before, during, and after travel.
                </p>
              </div>
            </div>
          </div>

          {/* Service 4 */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div
              className="tp-service-item text-center mb-30 p-4 rounded-4 bg-white shadow-sm h-100"
              style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
            >
              <div
                className="tp-service-icon mb-25 d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#fff3ed",
                  color: "#111111",
                  fontSize: "24px",
                }}
              >
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div className="tp-service-content">
                <h3 className="tp-service-title fw-600 fs-20 mb-10">Complete Safety</h3>
                <p className="mb-0" style={{ fontSize: "14px", color: "#666" }}>
                  Verified partners, insured bookings, and secure payment protocols.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceArea;

