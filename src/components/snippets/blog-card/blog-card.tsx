import React, { useState } from "react";

export interface BlogItem {
  id: string | number;
  title: string;
  category: string;
  date: string;
  author: string;
  slug: string;
  pexelsQuery: string;
  fallbackImage?: string;
  excerpt?: string;
}

interface BlogCardProps {
  item?: BlogItem;
  loading?: boolean;
  onNavigate?: (slug: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ item, loading = false, onNavigate }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  if (loading || !item) {
    return (
      <div className="col-xl-4 col-lg-6 col-md-6">
        <div className="tp-blog-item tp-blog-3-item mb-30 h-100 d-flex flex-column justify-content-between">
          <div>
            {/* Image Skeleton */}
            <div className="tp-blog-thumb fix mb-30 p-relative" style={{ height: "240px" }}>
              <div className="tp-skeleton-thumb position-absolute top-0 start-0 w-100 h-100 rounded-3"></div>
            </div>

            {/* Content Skeletons */}
            <div className="tp-blog-content">
              {/* Category & Date Skeleton */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="tp-skeleton" style={{ width: "70px", height: "18px" }}></div>
                <div className="tp-skeleton" style={{ width: "90px", height: "14px" }}></div>
              </div>

              {/* Title Skeleton */}
              <div className="tp-skeleton mb-2" style={{ width: "95%", height: "22px" }}></div>
              <div className="tp-skeleton mb-3" style={{ width: "65%", height: "22px" }}></div>

              {/* Excerpt Skeleton */}
              <div className="tp-skeleton mb-1" style={{ width: "100%", height: "14px" }}></div>
              <div className="tp-skeleton" style={{ width: "80%", height: "14px" }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(item.slug);
    } else {
      window.history.pushState({}, "", `/blog/${item.slug}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  return (
    <div className="col-xl-4 col-lg-6 col-md-6">
      <div className="tp-blog-item tp-blog-3-item mb-30 h-100 d-flex flex-column justify-content-between">
        <div>
          <div className="tp-blog-thumb fix mb-30 p-relative" style={{ minHeight: "240px" }}>
            <a href={`/blog/${item.slug}`} onClick={handleClick} className="d-block h-100">
              {!imgLoaded && (
                <div
                  className="tp-skeleton-thumb position-absolute top-0 start-0 w-100 h-100"
                  style={{ zIndex: 1 }}
                ></div>
              )}
              <img
                className="w-100"
                src={item.fallbackImage || "assets/img/blog/three/thumb.jpg"}
                data-pexels={item.pexelsQuery}
                data-type="image"
                data-quality="medium"
                alt={item.title}
                loading="lazy"
                decoding="async"
                onLoad={() => setImgLoaded(true)}
                style={{
                  height: "240px",
                  objectFit: "cover",
                  opacity: imgLoaded ? 1 : 0,
                  transition: "opacity 0.35s ease-in-out",
                }}
              />
            </a>
          </div>
          <div className="tp-blog-content">
            <div className="tp-blog-meta-wrap d-flex flex-wrap align-items-center mb-15">
              <span className="tp-blog-category">{item.category}</span>
              <div className="tp-blog-meta">
                <span>{item.date}</span>
                <span>{item.author}</span>
              </div>
            </div>
            <h3 className="tp-blog-title fw-600">
              <a href={`/blog/${item.slug}`} onClick={handleClick}>
                {item.title}
              </a>
            </h3>
            {item.excerpt && (
              <p className="text-muted small mt-2 line-clamp-2">
                {item.excerpt}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
