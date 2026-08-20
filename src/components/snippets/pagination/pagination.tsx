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
        <nav>
          <ul className="d-flex align-items-center justify-content-center gap-1 list-unstyled mb-0">
            {/* Prev Button */}
            <li>
              <button
                type="button"
                className={`tp-pagination-prev prev page-numbers btn p-0 ${
                  currentPage === 1 ? "disabled opacity-50 pe-none" : ""
                }`}
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous Page"
              >
                <svg
                  width={7}
                  height={12}
                  viewBox="0 0 7 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.75 10.75L0.75 5.75L5.75 0.75"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </li>

            {/* Numeric Page Buttons */}
            {pages.map((p) => (
              <li key={p}>
                {p === currentPage ? (
                  <span className="current">{p}</span>
                ) : (
                  <button
                    type="button"
                    className="btn p-0 page-numbers"
                    onClick={() => onPageChange(p)}
                  >
                    {p}
                  </button>
                )}
              </li>
            ))}

            {/* Next Button */}
            <li>
              <button
                type="button"
                className={`next page-numbers btn p-0 ${
                  currentPage === totalPages ? "disabled opacity-50 pe-none" : ""
                }`}
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
              >
                <svg
                  width={7}
                  height={12}
                  viewBox="0 0 7 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.75 10.75L5.75 5.75L0.75 0.75"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
