import React from "react";

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
  item: BlogItem;
  onNavigate?: (slug: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ item, onNavigate }) => {
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
          <div className="tp-blog-thumb fix mb-30">
            <a href={`/blog/${item.slug}`} onClick={handleClick} className="d-block">
              <img
                className="w-100"
                src={item.fallbackImage || "assets/img/blog/three/thumb.jpg"}
                data-pexels={item.pexelsQuery}
                data-type="image"
                data-quality="medium"
                alt={item.title}
                style={{ height: "240px", objectFit: "cover" }}
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
