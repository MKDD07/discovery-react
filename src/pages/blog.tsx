import React, { useEffect, useRef, useState } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import { loadAllPexelsMedia } from "../components/sections/pexels/PexelsMediaSection";
import BlogCard, { BlogItem } from "../components/snippets/blog-card/blog-card";
import Pagination from "../components/snippets/pagination/pagination";
import { Sparkles, Compass } from "lucide-react";
import SEO from "../components/snippets/seo/SEO";

const CATEGORIES = [
  "All",
  "Adventure",
  "Luxury Escapes",
  "Beach Trips",
  "Nature",
  "Art and culture",
  "Honeymoon & Romance",
  "Food & Travel",
  "Heritage & History",
  "Mountain Treks",
  "Wellness & Spa",
  "Wildlife & Safari",
  "Cruise & Island Hopping",
  "Travel Tips",
  "Budget & Solo Travel",
  "City Breaks",
];

const ITEMS_PER_PAGE = 20;

interface BlogPageProps {
  onBackHome?: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBackHome }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch blogs ONLY from Cloudflare D1 Database
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    async function fetchD1Blogs() {
      try {
        const url = selectedCategory === "All"
          ? "/api/blogs"
          : `/api/blogs?category=${encodeURIComponent(selectedCategory)}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.success) {
            const mapped: BlogItem[] = (data.blogs || []).map((b: any) => ({
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
        console.error("Failed to load blogs from D1:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchD1Blogs();

    return () => {
      isCancelled = true;
    };
  }, [selectedCategory]);

  // Filter posts by category — no artificial cap, show all from DB
  const filteredPosts =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((post) => post.category.toLowerCase() === selectedCategory.toLowerCase());

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Trigger Pexels loader on page/category change
  useEffect(() => {
    if (!loading && containerRef.current) {
      loadAllPexelsMedia(containerRef.current);
    }
  }, [loading, selectedCategory, currentPage, blogs]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleNavigate = (slug: string) => {
    window.history.pushState({}, "", `/blog/${slug}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <>
      <SEO
        title="Travel Journal & Editorial Blog | Discovery Convoy"
        description="Inspiring luxury travel dossiers, secret destination guides, 5-star resort reviews, and expert itineraries from Discovery Convoy's global editors."
        keywords={["travel blog", "luxury travel guides", "itineraries", "hotel reviews", "Discovery Convoy"]}
        url="https://discoveryconvoy.com/blog"
      />
      <Header />
      <main ref={containerRef}>
        {/* Breadcrumb Header with Parallax Effect */}
        <div
          className="tp-breadcrumb-area tp-breadcrumb-ptb tp-breadcrumb-overly bg-position tp-breadcrumb-parallax"
          data-background="assets/img/breadcrumb/bg-9.jpg"
          data-pexels="scenic mountain travel road journey 4k landscape"
          data-type="background"
          data-quality="large"
          style={{
            backgroundImage:
              'url("https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1920")',
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="tp-breadcrumb-wrap text-center">
                  <h2 className="tp-breadcrumb-title fs-112 text-center mb-0 text-white">
                    Travel Journal &amp; Blog
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid Content */}
        <div className="tp-blog-area tp-tour-ptb tp-animate-tab pt-100 pb-120">
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="tp-blog-grid-tab mb-50 text-center">
                  <div className="tp-about-section-title p-relative pb-25">
                    <h2 className="tp-section-title fs-32 fw-600 mb-2">
                      Travel Articles
                    </h2>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="tp-tour-tab">
                    <ul
                      role="tablist"
                      className="d-flex align-items-center justify-content-center flex-wrap gap-2 list-unstyled"
                    >
                      {CATEGORIES.map((cat) => (
                        <li key={cat} className="nav-tab-item">
                          <button
                            type="button"
                            className={`btn btn-sm px-4 py-2 rounded-pill fw-600 border-0 ${
                              selectedCategory === cat
                                ? "tp-btn text-white shadow-sm"
                                : "btn-light text-dark"
                            }`}
                            onClick={() => handleCategoryChange(cat)}
                            style={{ fontSize: "13px" }}
                          >
                            {cat}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Blog Grid */}
            <div className="row g-4">
              {loading ? (
                <>
                  {[1, 2, 3].map((n) => (
                    <BlogCard key={n} loading={true} />
                  ))}
                </>
              ) : currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <BlogCard key={post.id} item={post} onNavigate={handleNavigate} />
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <div className="p-5 bg-white border rounded-4 shadow-sm mx-auto" style={{ maxWidth: "550px" }}>
                    <Compass size={40} className="text-primary mb-3 mx-auto d-block" />
                    <h4 className="fw-700 text-dark mb-2">No Published Blogs Found</h4>
                    <p className="text-muted small mb-4">
                      There are no published articles in this D1 category yet. Go to your Member Dashboard to generate and publish instant AI articles directly to Cloudflare D1.
                    </p>
                    <a
                      href="/dashboard"
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.pushState({}, "", "/dashboard");
                        window.dispatchEvent(new PopStateEvent("popstate"));
                      }}
                      className="tp-btn text-white px-4 py-2 d-inline-flex align-items-center gap-2"
                      style={{ fontSize: "13px" }}
                    >
                      <Sparkles size={15} /> Create &amp; Publish with AI
                    </a>
                  </div>
                </div>
              )}

              {/* Reusable Pagination Snippet */}
              {!loading && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 400, behavior: "smooth" });
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogPage;
