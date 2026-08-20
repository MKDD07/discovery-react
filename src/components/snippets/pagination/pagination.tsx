import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="col-lg-12">
      <div className="tp-pagination text-center mt-40 mb-30">
        <nav aria-label="Page navigation">
          <ul className="d-flex align-items-center justify-content-center gap-2 list-unstyled mb-0">
            {/* Prev Arrow Button */}
            <li>
              <button
                type="button"
                className={`d-inline-flex align-items-center justify-content-center rounded-circle border transition-all ${
                  currentPage === 1
                    ? "opacity-30 pe-none bg-light text-muted border-light"
                    : "bg-white text-dark border-secondary-subtle shadow-sm hover-primary"
                }`}
                style={{
                  width: "42px",
                  height: "42px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous Page"
              >
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            </li>

            {/* Numeric Page Buttons */}
            {pages.map((p) => (
              <li key={p}>
                {p === currentPage ? (
                  <span
                    className="d-inline-flex align-items-center justify-content-center rounded-circle fw-bold shadow-sm"
                    style={{
                      width: "42px",
                      height: "42px",
                      fontSize: "14px",
                      background: "var(--tp-theme-1)",
                      color: "var(--tp-common-white)",
                    }}
                  >
                    {p}
                  </span>
                ) : (
                  <button
                    type="button"
                    className="d-inline-flex align-items-center justify-content-center rounded-circle border border-secondary-subtle bg-white text-dark fw-semibold shadow-sm"
                    style={{
                      width: "42px",
                      height: "42px",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onClick={() => onPageChange(p)}
                  >
                    {p}
                  </button>
                )}
              </li>
            ))}

            {/* Next Arrow Button */}
            <li>
              <button
                type="button"
                className={`d-inline-flex align-items-center justify-content-center rounded-circle border transition-all ${
                  currentPage === totalPages
                    ? "opacity-30 pe-none bg-light text-muted border-light"
                    : "bg-white text-dark border-secondary-subtle shadow-sm hover-primary"
                }`}
                style={{
                  width: "42px",
                  height: "42px",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
              >
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
