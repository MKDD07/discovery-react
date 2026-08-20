import React, { useEffect, useRef, useState } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import { loadAllPexelsMedia } from "../components/sections/pexels/PexelsMediaSection";
import BlogCard, { BlogItem } from "../components/snippets/blog-card/blog-card";
import Pagination from "../components/snippets/pagination/pagination";

const BLOG_POSTS: BlogItem[] = [
  {
    id: 1,
    title: "Exploring Sacred Temples and Cultural Heritage Across Asia",
    category: "Art and culture",
    date: "Aug 15, 2026",
    author: "Admin",
    slug: "exploring-sacred-temples-heritage",
    pexelsQuery: "ancient sacred temple asian architecture culture travel",
    excerpt: "Delve into centuries-old traditions, spiritual sanctuaries, and timeless artistic architecture.",
  },
  {
    id: 2,
    title: "Colorful City Life Surrounded by Green Mountain Hills",
    category: "Adventure",
    date: "Aug 18, 2026",
    author: "Admin",
    slug: "city-life-green-hills",
    pexelsQuery: "vibrant city mountains valley landscape sunset travel",
    excerpt: "Where urban lifestyle meets untouched natural grandeur in the valley.",
  },
  {
    id: 3,
    title: "Historic Architecture with Golden Artistic Details & Domes",
    category: "Art and culture",
    date: "Aug 20, 2026",
    author: "Admin",
    slug: "historic-architecture-golden-details",
    pexelsQuery: "historic european architecture cathedral golden dome travel",
    excerpt: "A visual walking tour through royal palaces and ornate historical landmarks.",
  },
  {
    id: 4,
    title: "Mountain View Journeys Filled with Natural Beauty & Trails",
    category: "Nature",
    date: "Aug 22, 2026",
    author: "Admin",
    slug: "mountain-view-journeys",
    pexelsQuery: "himalayan mountain hiking trekking scenic alpine travel",
    excerpt: "Breathe in the freshest crisp air along high-altitude trekking trails.",
  },
  {
    id: 5,
    title: "Peaceful Railway Routes Through Scenic Urban Landscapes",
    category: "Travel Tips",
    date: "Aug 24, 2026",
    author: "Admin",
    slug: "peaceful-railway-routes",
    pexelsQuery: "scenic train railway journey through nature mountains",
    excerpt: "Slow travel tips: why riding cross-country scenic trains is the ultimate peaceful getaway.",
  },
  {
    id: 6,
    title: "Vibrant Street Temples & Night Markets Full of Local Traditions",
    category: "Food & Travel",
    date: "Aug 26, 2026",
    author: "Admin",
    slug: "street-temples-night-markets",
    pexelsQuery: "night market street food asian lanterns travel",
    excerpt: "Taste the best authentic street delicacies while soaking in local evening festivities.",
  },
  {
    id: 7,
    title: "Ancient Churches Showcasing Timeless European Coastal Design",
    category: "Art and culture",
    date: "Aug 27, 2026",
    author: "Admin",
    slug: "ancient-churches-european-design",
    pexelsQuery: "mediterranean coastal church stone architecture ocean",
    excerpt: "Centuries of maritime history and cobblestone coastal villages waiting to be explored.",
  },
  {
    id: 8,
    title: "Tropical Island Escapes & Crystal Lagoon Adventures",
    category: "Beach Trips",
    date: "Aug 28, 2026",
    author: "Admin",
    slug: "tropical-island-escapes",
    pexelsQuery: "tropical turquoise lagoon island beach resort palms",
    excerpt: "Unwind on powdery white sand beaches and snorkel alongside vibrant marine reefs.",
  },
  {
    id: 9,
    title: "Riverside Cities Blending Living History and Modern Skyline",
    category: "Adventure",
    date: "Aug 29, 2026",
    author: "Admin",
    slug: "riverside-cities-history-modern",
    pexelsQuery: "riverside city river bridge sunset cityscape travel",
    excerpt: "Discover waterfront promenades, sunset river cruises, and vibrant nightlife.",
  },
  {
    id: 10,
    title: "The Ultimate Guide to Desert Glamping & Stargazing",
    category: "Adventure",
    date: "Aug 30, 2026",
    author: "Admin",
    slug: "desert-glamping-stargazing",
    pexelsQuery: "desert luxury camp tents sand dunes starry night sky",
    excerpt: "Luxury bedouin camps, camel treks across glowing dunes, and pristine stargazing.",
  },
  {
    id: 11,
    title: "Hidden Culinary Gems of Southern Coastal India",
    category: "Food & Travel",
    date: "Sep 01, 2026",
    author: "Admin",
    slug: "culinary-gems-coastal-india",
    pexelsQuery: "indian traditional food spices seafood coastal dining",
    excerpt: "From spice plantations to fresh coastal catches served on banana leaves.",
  },
  {
    id: 12,
    title: "Essential Packing Tips for High-Altitude Himalayan Expeditions",
    category: "Travel Tips",
    date: "Sep 02, 2026",
    author: "Admin",
    slug: "packing-tips-himalayan-expedition",
    pexelsQuery: "hiking backpack gear camping snowy mountain landscape",
    excerpt: "Master your backpack with lightweight layers, safety essentials, and weatherproofing.",
  },
];

const CATEGORIES = [
  "All",
  "Art and culture",
  "Adventure",
  "Nature",
  "Beach Trips",
  "Food & Travel",
  "Travel Tips",
];

const ITEMS_PER_PAGE = 6;

interface BlogPageProps {
  onBackHome?: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBackHome }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter posts by category
  const filteredPosts =
    selectedCategory === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((post) => post.category.toLowerCase() === selectedCategory.toLowerCase());

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Trigger Pexels loader on page/category change
  useEffect(() => {
    if (containerRef.current) {
      loadAllPexelsMedia(containerRef.current);
    }
  }, [selectedCategory, currentPage]);

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
      <Header />
      <main ref={containerRef}>
        {/* Breadcrumb Header */}
        <div
          className="tp-breadcrumb-area tp-breadcrumb-ptb tp-breadcrumb-overly bg-position"
          data-background="assets/img/breadcrumb/bg-9.jpg"
          data-pexels="scenic mountain travel road journey 4k landscape"
          data-type="background"
          data-quality="large"
          style={{ backgroundImage: 'url("https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1920")' }}
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
                      Travel Articles &amp; Insights
                    </h2>
                    <p className="text-muted">
                      Handcrafted destination guides, insider tips, and unforgettable travel stories.
                    </p>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="tp-tour-tab">
                    <ul role="tablist" className="d-flex align-items-center justify-content-center flex-wrap gap-2 list-unstyled">
                      {CATEGORIES.map((cat) => (
                        <li key={cat} className="nav-tab-item">
                          <button
                            type="button"
                            className={`btn btn-sm px-4 py-2 rounded-pill fw-600 border-0 ${
                              selectedCategory === cat ? "tp-btn text-white shadow-sm" : "btn-light text-dark"
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
              {currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <BlogCard key={post.id} item={post} onNavigate={handleNavigate} />
                ))
              ) : (
                <div className="col-12 text-center py-5 text-muted">
                  <p>No articles found for "{selectedCategory}".</p>
                </div>
              )}

              {/* Reusable Pagination Snippet */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogPage;
