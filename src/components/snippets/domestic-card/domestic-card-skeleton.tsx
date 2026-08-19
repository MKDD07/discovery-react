import React from "react";

export const DomesticCardSkeleton: React.FC = () => {
  return (
    <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
      <div className="tp-tour-item mb-30 tp-skeleton-card">
        <div className="tp-tour-thumb p-relative fix tp-skeleton-thumb"></div>
        <div className="tp-tour-content">
          <div className="tp-skeleton-line tp-skeleton-rating mb-15"></div>
          <div className="tp-skeleton-line tp-skeleton-title mb-15"></div>
          <div className="tp-skeleton-line tp-skeleton-info mb-20"></div>
          <div className="d-flex justify-content-between align-items-center pt-10">
            <div className="tp-skeleton-line tp-skeleton-price"></div>
            <div className="tp-skeleton-line tp-skeleton-btn"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomesticCardSkeleton;
