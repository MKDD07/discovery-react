import React, { useEffect, useRef, useState } from "react";
import { loadAllPexelsMedia } from "../pexels/PexelsMediaSection";

interface D1BlogItem {
  id: number | string;
  title: string;
  category: string;
  date: string;
  author: string;
  slug: string;
  pexelsQuery: string;
  excerpt: string;
}

// Fallback blogs if database is temporarily empty or loading
const FALLBACK_BLOGS: D1BlogItem[] = [
  {
    id: 1,
    title: "Experience vibrant festivals, explore the amazing Amazon rainforest",
    category: "Adventure",
    date: "Dec 12, 2025",
    author: "Admin",
    slug: "amazon-rainforest-adventure",
    pexelsQuery: "amazon rainforest tropical adventure nature travel",
    excerpt: "Discover the lush heart of the jungle and wildlife treasures.",
  },
  {
    id: 2,
    title: "Explore ancient pyramids & desert adventures in Egypt.",
    category: "Heritage",
    date: "Dec 10, 2025",
    author: "Admin",
    slug: "egypt-pyramids-desert-safari",
    pexelsQuery: "egypt pyramids desert safari travel",
    excerpt: "Unveil centuries of timeless history along the Nile River.",
  },
  {
    id: 3,
    title: "Collaboration turns ideas into powerful travel memories",
    category: "Luxury",
    date: "Dec 08, 2025",
    author: "Admin",
    slug: "luxury-city-rooftop-tour",
    pexelsQuery: "travel friends laughing city rooftop tour",
    excerpt: "Create lifelong memories with group excursions and rooftop dinners.",
  },
  {
    id: 4,
    title: "Great minds working together can tackle even the toughest trails.",
    category: "Trekking",
    date: "Dec 05, 2025",
    author: "Admin",
    slug: "himalayan-mountain-trail",
    pexelsQuery: "mountain climbing hiking trail scenic sunrise",
    excerpt: "Scale awe-inspiring summits with expert guides and mountain safety.",
  },
];

export const BlogArea: React.FC = () => {
  const blogRef = useRef<HTMLDivElement>(null);
  const [blogs, setBlogs] = useState<D1BlogItem[]>(FALLBACK_BLOGS);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from Cloudflare D1 /api/blogs
  useEffect(() => {
    let isCancelled = false;

    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs?limit=4");
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
            const mapped: D1BlogItem[] = data.blogs.slice(0, 4).map((b: any) => ({
              id: b.id || b.slug,
              title: b.title,
              category: b.category || "Adventure",
              date: new Date(b.created_at || Date.now()).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              author: b.author || "Admin",
              slug: b.slug,
              pexelsQuery: b.cover_query || `${b.title} travel landscape`,
              excerpt: b.summary || "",
            }));
            setBlogs(mapped);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch D1 blogs for BlogArea, using fallback:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchBlogs();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Trigger Pexels dynamic image loader
  useEffect(() => {
    if (blogRef.current) {
      loadAllPexelsMedia(blogRef.current);
    }
  }, [blogs, loading]);

  const navigateToBlog = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    window.history.pushState({}, "", `/blog/${slug}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const navigateToAllBlogs = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, "", `/blog`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const featuredBlog = blogs[0];
  const sideBlogs = blogs.slice(1, 4);

  return (
    <>
      {/* tp-blog-area-start */}
      <div ref={blogRef} className="tp-blog-area pt-140 pb-110 tp-section-pt tp-section-pb">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="tp-testimonial-section-title text-center mb-50">
                <span
                  className="tp-section-subtitle d-inline-block mb-15 wow fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".3s"
                >
                  Our Latest Blog
                </span>
                <h2
                  className="tp-section-title fw-600 wow fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".3s"
                >
                  Recent blogs &amp; updates
                </h2>
              </div>
            </div>

            {/* Col 1: Main Featured Blog */}
            {featuredBlog && (
              <div className="col-xl-7 col-md-12">
                <div
                  className="tp-blog-item tp-blog-col-1 mb-30 wow fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay=".3s"
                >
                  <div className="tp-blog-thumb mb-30 fix">
                    <a
                      href={`/blog/${featuredBlog.slug}`}
                      onClick={(e) => navigateToBlog(e, featuredBlog.slug)}
                      className="d-block"
                    >
                      <img
                        className="w-100"
                        src="assets/img/blog/thumb.jpg"
                        data-pexels={featuredBlog.pexelsQuery}
                        data-type="image"
                        data-quality="large"
                        alt={featuredBlog.title}
                      />
                    </a>
                  </div>
                  <div className="tp-blog-content">
                    <div className="tp-blog-meta-wrap d-flex flex-wrap align-items-center mb-15">
                      <span className="tp-blog-category">{featuredBlog.category}</span>
                      <div className="tp-blog-meta">
                        <span>{featuredBlog.date}</span>
                        <span>{featuredBlog.author}</span>
                      </div>
                    </div>
                    <h3 className="tp-blog-title fw-600 mb-15">
                      <a
                        href={`/blog/${featuredBlog.slug}`}
                        onClick={(e) => navigateToBlog(e, featuredBlog.slug)}
                      >
                        {featuredBlog.title}
                      </a>
                    </h3>
                    <a
                      href={`/blog/${featuredBlog.slug}`}
                      onClick={(e) => navigateToBlog(e, featuredBlog.slug)}
                      className="tp-btn-solid"
                      aria-label={`Read article: ${featuredBlog.title}`}
                    >
                      Read full article <i className="fa-solid fa-arrow-right ml-5"></i>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Col 2: 3 Side Thumbnail Blogs */}
            <div className="col-xl-5 col-md-12">
              {sideBlogs.map((b, idx) => (
                <div
                  key={b.id || idx}
                  className="tp-blog-item tp-blog-col-2 mb-30 wow fadeInUp"
                  data-wow-duration=".9s"
                  data-wow-delay={`.${4 + idx}s`}
                >
                  <div className="tp-blog-thumb fix">
                    <a
                      href={`/blog/${b.slug}`}
                      onClick={(e) => navigateToBlog(e, b.slug)}
                      className="d-inline-block"
                      aria-label={`View article: ${b.title}`}
                    >
                      <img
                        src={`assets/img/blog/thumb-sm${idx > 0 ? `-${idx + 1}` : ""}.jpg`}
                        data-pexels={b.pexelsQuery}
                        data-type="image"
                        data-quality="medium"
                        alt={b.title}
                      />
                    </a>
                  </div>
                  <div className="tp-blog-content">
                    <div className="tp-blog-meta-wrap d-flex flex-wrap align-items-center mb-15">
                      <span className="tp-blog-category">{b.category}</span>
                      <div className="tp-blog-meta">
                        <span>{b.date}</span>
                      </div>
                    </div>
                    <h3 className="tp-blog-title fw-600 mb-15">
                      <a
                        href={`/blog/${b.slug}`}
                        onClick={(e) => navigateToBlog(e, b.slug)}
                      >
                        {b.title}
                      </a>
                    </h3>
                    <a
                      href={`/blog/${b.slug}`}
                      onClick={(e) => navigateToBlog(e, b.slug)}
                      className="tp-btn-solid"
                      aria-label={`Read article: ${b.title}`}
                    >
                      Read full article <i className="fa-solid fa-arrow-right ml-5"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Blogs Button */}
            <div className="col-12 text-center mt-20">
              <a
                href="/blog"
                onClick={navigateToAllBlogs}
                className="tp-btn"
                style={{ borderRadius: "50px", padding: "14px 38px", display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <span>View All Blogs</span>
                <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* tp-blog-area-end */}
    </>
  );
};

export default BlogArea;


