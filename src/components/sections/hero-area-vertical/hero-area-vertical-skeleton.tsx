import React from "react";

export const HeroAreaVerticalSkeleton: React.FC = () => {
  const dummyItems = Array.from({ length: 6 });

  return (
    <div className="tp-hero-area tp-hero-5-spacing p-relative z-index-2">
      <div className="container container-1876">
        <div className="tp-hero-5-bg" style={{ backgroundColor: "#f8fafc" }}>
          <div className="row align-items-center">
            {/* Left Content Skeleton */}
            <div className="col-xxl-6">
              <div className="tp-hero-5-content">
                {/* Subtitle skeleton */}
                <div
                  className="tp-skeleton-line mb-20 rounded-pill"
                  style={{ width: "130px", height: "18px", backgroundColor: "#e2e8f0" }}
                ></div>
                {/* Title skeleton */}
                <div
                  className="tp-skeleton-line mb-15 rounded-3"
                  style={{ width: "85%", height: "48px", backgroundColor: "#e2e8f0" }}
                ></div>
                {/* Description skeleton */}
                <div
                  className="tp-skeleton-line mb-35 rounded-3"
                  style={{ width: "60%", height: "22px", backgroundColor: "#e2e8f0" }}
                ></div>
                {/* Search Bar Skeleton */}
                <div
                  className="rounded-pill p-3 shadow-sm"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    height: "75px",
                    maxWidth: "540px",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between h-100 px-3">
                    <div
                      className="tp-skeleton-line rounded-pill"
                      style={{ width: "28%", height: "20px", backgroundColor: "#e2e8f0" }}
                    ></div>
                    <div
                      style={{ width: "1px", height: "35px", backgroundColor: "#e2e8f0" }}
                    ></div>
                    <div
                      className="tp-skeleton-line rounded-pill"
                      style={{ width: "28%", height: "20px", backgroundColor: "#e2e8f0" }}
                    ></div>
                    <div
                      style={{ width: "1px", height: "35px", backgroundColor: "#e2e8f0" }}
                    ></div>
                    <div
                      className="tp-skeleton-line rounded-circle"
                      style={{ width: "42px", height: "42px", backgroundColor: "#cbd5e1" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Vertical Gallery Skeleton */}
            <div className="col-xxl-6">
              <div className="tp-hero-5-gallery">
                <div className="row gx-15">
                  {/* Col 1 */}
                  <div className="col-4">
                    <div className="tp-gallery-wrap">
                      {dummyItems.map((_, idx) => (
                        <div
                          className="tp-gallery-item mb-15 rounded-4 overflow-hidden tp-skeleton-thumb"
                          key={`skel1-${idx}`}
                          style={{
                            height: "185px",
                            backgroundColor: "#e2e8f0",
                            borderRadius: "14px",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  {/* Col 2 */}
                  <div className="col-4">
                    <div className="tp-gallery-wrap tp-gallery-wrap-2">
                      {dummyItems.map((_, idx) => (
                        <div
                          className="tp-gallery-item mb-15 overflow-hidden tp-skeleton-thumb"
                          key={`skel2-${idx}`}
                          style={{
                            height: "185px",
                            backgroundColor: "#e2e8f0",
                            borderRadius: "14px",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  {/* Col 3 */}
                  <div className="col-4">
                    <div className="tp-gallery-wrap">
                      {dummyItems.map((_, idx) => (
                        <div
                          className="tp-gallery-item mb-15 overflow-hidden tp-skeleton-thumb"
                          key={`skel3-${idx}`}
                          style={{
                            height: "185px",
                            backgroundColor: "#e2e8f0",
                            borderRadius: "14px",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAreaVerticalSkeleton;
