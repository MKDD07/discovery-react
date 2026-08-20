import React from "react";

interface TourBreadcrumbsProps {
  tourName?: string;
  location?: string;
  onBackHome?: () => void;
}

const TourBreadcrumbs: React.FC<TourBreadcrumbsProps> = ({
  tourName = "Tour Details",
  location = "India",
  onBackHome,
}) => {
  return (
    <>
      {/* tp-breadcrumb-area-start */}
      <div
        className="tp-breadcrumb-area"
        style={{
          background: "linear-gradient(135deg, #0f2c5c 0%, #1a4a8a 60%, #2563b0 100%)",
          padding: "28px 0 22px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="container container-1350">
          <div className="row align-items-center">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol
                  className="breadcrumb mb-0 align-items-center"
                  style={{ background: "none", padding: 0, gap: "6px" }}
                >
                  <li className="breadcrumb-item">
                    <a
                      href="/"
                      onClick={(e) => {
                        if (onBackHome) {
                          e.preventDefault();
                          onBackHome();
                        }
                      }}
                      style={{
                        color: "rgba(255,255,255,0.75)",
                        textDecoration: "none",
                        fontSize: "14px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        transition: "color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.color = "#fff")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.75)")
                      }
                    >
                      <i className="fa-solid fa-house" style={{ fontSize: "12px" }}></i>
                      Home
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item"
                    style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}
                  >
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: "10px" }}></i>
                  </li>
                  <li className="breadcrumb-item">
                    <span
                      style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "14px",
                        cursor: "default",
                      }}
                    >
                      {location}
                    </span>
                  </li>
                  <li
                    className="breadcrumb-item"
                    style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}
                  >
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: "10px" }}></i>
                  </li>
                  <li
                    className="breadcrumb-item active"
                    aria-current="page"
                    style={{
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "14px",
                      maxWidth: "420px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tourName}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* tp-breadcrumb-area-end */}
    </>
  );
};

export default TourBreadcrumbs;
