import React, { useEffect, useRef, useState } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import { loadAllPexelsMedia } from "../components/sections/pexels/PexelsMediaSection";
import DomesticLocation from "../components/sections/domestic-location/domestic-location";
import {
  Calendar,
  User,
  Share2,
  Bookmark,
  Heart,
  HelpCircle,
  MapPin,
  Sparkles,
  Quote,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

interface BlogDetailsPageProps {
  slug?: string;
  onBackHome?: () => void;
}

export const BlogDetailsPage: React.FC<BlogDetailsPageProps> = ({ slug, onBackHome }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [blogData, setBlogData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Fetch blog data from D1 Database (or use rich fallback if not created yet)
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    async function loadBlog() {
      try {
        if (slug) {
          const res = await fetch(`/api/blogs?slug=${encodeURIComponent(slug)}`);
          if (res.ok) {
            const data = await res.json();
            if (!isCancelled && data.success && data.blog) {
              setBlogData(data.blog);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn("D1 blog fetch fallback:", err);
      }

      // Default high quality dynamic template based on slug
      if (!isCancelled) {
        const readableTitle = slug
          ? decodeURIComponent(slug)
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())
          : "Discovering Hidden Wonders & Majestic Trails";

        setBlogData({
          title: readableTitle,
          category: "Adventure & Exploration",
          location: "India",
          date: "Aug 20, 2026",
          author: "Michael Harris",
          author_role: "Senior Travel Journalist",
          summary: "From sunrise mountain summits to serene coastal lagoons, experience our comprehensive insider guide to unforgettable moments and cultural discoveries.",
          cover_query: `${slug || "scenic landscape travel mountain sunset"} 4k landscape`,
          sections: [
            {
              heading: "1. The Call of the Wild & Scenic Landscapes",
              paragraphs: [
                "There is an undeniable magic in setting out before dawn to catch the first golden rays illuminating ancient summits. As morning mist gently rolls across the valleys, every winding pathway reveals breathtaking panoramic vistas that leave even seasoned travelers speechless.",
                "Whether you choose to trek through untouched evergreen woodlands or relax beside tranquil azure waters, taking time to immerse yourself in nature’s rhythm restores the mind and rejuvenates the spirit.",
              ],
              pexelsQuery: `${slug || "mountain sunrise hiking trail scenic"} travel`,
              highlights: [
                "Best time to visit: October through April for optimal weather and clear skies.",
                "Local eco-passes are required at primary nature reserves.",
              ],
            },
            {
              heading: "2. Cultural Heritage & Timeless Architecture",
              paragraphs: [
                "Stepping into historical sanctuaries offers an intimate glimpse into centuries of artistic brilliance. Intricately carved stone facades, gilded domes, and tranquil courtyards reflect generations of master craftsmanship.",
                "Engaging with local village elders and knowledgeable guides unlocks stories and folk legends that are seldom found in conventional guidebooks.",
              ],
              pexelsQuery: `${slug || "heritage ancient temple golden architecture"} culture`,
              highlights: [
                "Respect local customs and modest dress codes at sacred heritage sites.",
                "Early morning visits provide serene photographic lighting without crowds.",
              ],
            },
            {
              heading: "3. Authentic Flavors & Local Culinary Delights",
              paragraphs: [
                "No journey is complete without savoring regional gastronomy. From vibrant bustling evening bazaars serving piping-hot delicacies to peaceful countryside dining featuring organic farm-to-table harvests, each dish tells a vibrant story of tradition and spice.",
              ],
              pexelsQuery: `${slug || "street food traditional cuisine spices dinner"} dining`,
              highlights: [
                "Do not miss the specialty signature brew unique to this province.",
                "Evening food walks offer authentic tastings directly with generational chefs.",
              ],
            },
          ],
          quote: {
            text: "Travel isn't always about the destination, but the quiet moments of wonder that change how we see the world.",
            author: "Eleanor Vance, Travel Enthusiast",
          },
          faqs: [
            {
              question: "What is the best time of year to visit this destination?",
              answer: "The ideal travel season spans from autumn through early spring when temperatures are pleasant and outdoor sightseeing conditions are at their best.",
            },
            {
              question: "Are these tours family-friendly and accessible for children?",
              answer: "Yes, most itineraries feature customizable pacing, comfortable boutique stays, and activities suited for all age groups.",
            },
            {
              question: "How do I reach the main sights from the nearest airport?",
              answer: "Pre-booked private chauffeurs, express rail connections, and reliable rental cabs are readily accessible from all major regional hubs.",
            },
            {
              question: "What should I pack for this trip?",
              answer: "Comfortable trekking shoes, breathable cotton layers, a lightweight windbreaker jacket, sunscreen, and a universal power adapter are highly recommended.",
            },
          ],
        });
        setLoading(false);
      }
    }

    loadBlog();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  // Trigger Pexels loader once content is rendered
  useEffect(() => {
    if (!loading && containerRef.current) {
      loadAllPexelsMedia(containerRef.current);
    }
  }, [loading, blogData]);

  if (!blogData) return null;

  return (
    <>
      <Header />
      <main ref={containerRef}>
        <div className="tp-blog-area tp-tour-ptb-2 pt-60 pb-100">
          <div className="container container-1350">
            <div className="row">
              {/* Main Article Content */}
              <div className="col-xxl-8 col-xl-8 col-lg-8">
                <div className="postbox-details-main-wrap mb-40">
                  {/* Article Top Header & Meta */}
                  <div className="postbox-details-info-wrap mb-40">
                    <div className="tp-blog-meta-wrap d-flex flex-wrap align-items-center gap-3 mb-15">
                      <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill font-monospace small">
                        {blogData.category || "Adventure"}
                      </span>
                      <div className="tp-blog-meta text-muted small d-flex align-items-center gap-2">
                        <Calendar size={14} />
                        <span>{blogData.date || "Aug 2026"}</span>
                        <span>•</span>
                        <span>{blogData.author || "Admin"}</span>
                      </div>
                    </div>

                    <h1 className="fw-700 text-dark mb-25" style={{ fontSize: "32px", lineHeight: 1.25 }}>
                      {blogData.title}
                    </h1>

                    {/* Author Bar & Social Sharing */}
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 pb-25 border-bottom">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
                          style={{ width: "45px", height: "45px", fontSize: "16px" }}
                        >
                          {(blogData.author || "M").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h6 className="fw-700 text-dark mb-0" style={{ fontSize: "14px" }}>
                            {blogData.author || "Travel Journalist"}
                          </h6>
                          <span className="text-muted small">
                            {blogData.author_role || "Discovery Specialist"}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-light border rounded-pill px-3 py-2 text-dark small d-flex align-items-center gap-1"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({ title: blogData.title, url: window.location.href });
                            } else {
                              navigator.clipboard.writeText(window.location.href);
                              alert("Article link copied to clipboard!");
                            }
                          }}
                        >
                          <Share2 size={14} /> Share
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Main Cover Image with Pexels Auto-Resolution & Skeleton */}
                  <div className="postbox-details-thumb mb-40 rounded-4 overflow-hidden shadow-sm p-relative" style={{ minHeight: "380px" }}>
                    <img
                      className="w-100"
                      src=""
                      data-pexels={blogData.cover_query || `${blogData.title} 4k travel landscape`}
                      data-type="image"
                      data-quality="large"
                      alt={blogData.title}
                      style={{ height: "420px", objectFit: "cover" }}
                    />
                  </div>

                  {/* Summary Callout */}
                  {blogData.summary && (
                    <div className="p-4 bg-light rounded-4 border mb-40">
                      <p className="lead mb-0 text-dark fw-500" style={{ fontSize: "15.5px", lineHeight: 1.7 }}>
                        {blogData.summary}
                      </p>
                    </div>
                  )}

                  {/* Dynamic Sections with Headings, Paragraphs & Pexels Visuals (up to 10 max) */}
                  <div className="postbox-content-sections">
                    {blogData.sections &&
                      blogData.sections.map((sec: any, idx: number) => (
                        <div key={idx} className="mb-45">
                          <h3 className="fw-700 text-dark mb-15" style={{ fontSize: "22px" }}>
                            {sec.heading}
                          </h3>

                          {sec.paragraphs &&
                            sec.paragraphs.map((p: string, pIdx: number) => (
                              <p key={pIdx} className="text-secondary mb-20" style={{ fontSize: "14.5px", lineHeight: 1.8 }}>
                                {p}
                              </p>
                            ))}

                          {sec.pexelsQuery && (
                            <div className="rounded-3 overflow-hidden my-30 shadow-sm" style={{ maxHeight: "340px" }}>
                              <img
                                className="w-100"
                                src=""
                                data-pexels={sec.pexelsQuery}
                                data-type="image"
                                data-quality="large"
                                alt={sec.heading}
                                style={{ height: "320px", objectFit: "cover" }}
                              />
                            </div>
                          )}

                          {sec.highlights && sec.highlights.length > 0 && (
                            <div className="p-3 bg-white border-start border-4 border-primary rounded-3 shadow-sm my-20">
                              <h6 className="fw-700 text-dark mb-2 small d-flex align-items-center gap-1">
                                <Sparkles size={14} className="text-primary" /> Key Takeaways &amp; Tips:
                              </h6>
                              <ul className="mb-0 small text-muted ps-3">
                                {sec.highlights.map((h: string, hIdx: number) => (
                                  <li key={hIdx} className="mb-1">{h}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  {/* Inspirational Quote Box */}
                  {blogData.quote && (
                    <div className="postbox-details-quote-box p-4 rounded-4 bg-light border mb-50 position-relative">
                      <div className="d-flex align-items-start gap-3">
                        <Quote size={32} className="text-primary flex-shrink-0" />
                        <div>
                          <p className="fst-italic text-dark fw-600 mb-2" style={{ fontSize: "16px", lineHeight: 1.6 }}>
                            "{blogData.quote.text}"
                          </p>
                          <span className="text-muted small fw-bold">— {blogData.quote.author}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FAQ Accordion Section (up to 10 FAQs) */}
                  {blogData.faqs && blogData.faqs.length > 0 && (
                    <div className="postbox-faqs mb-50">
                      <h4 className="fw-700 text-dark mb-25 d-flex align-items-center gap-2" style={{ fontSize: "20px" }}>
                        <HelpCircle size={20} className="text-primary" /> Frequently Asked Questions
                      </h4>

                      <div className="accordion d-flex flex-column gap-2" id="blogFaqAccordion">
                        {blogData.faqs.map((faq: any, fIdx: number) => (
                          <div key={fIdx} className="border rounded-3 bg-white overflow-hidden shadow-sm">
                            <button
                              type="button"
                              className="btn w-100 text-start p-3 fw-600 text-dark d-flex align-items-center justify-content-between border-0 shadow-none"
                              onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                              style={{ fontSize: "14px" }}
                            >
                              <span>{faq.question}</span>
                              <ChevronDown
                                size={16}
                                className={`text-muted transition-all ${openFaq === fIdx ? "rotate-180 text-primary" : ""}`}
                                style={{ transform: openFaq === fIdx ? "rotate(180deg)" : "rotate(0deg)" }}
                              />
                            </button>
                            {openFaq === fIdx && (
                              <div className="p-3 pt-0 text-muted small border-top bg-light" style={{ lineHeight: 1.7 }}>
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-xxl-4 col-xl-4 col-lg-4">
                <div className="sidebar-wrapper mb-40 sticky-top" style={{ top: "100px" }}>
                  {/* AI & Travel Assistant Badge */}
                  <div className="bg-primary text-white p-4 rounded-4 shadow-sm mb-4">
                    <span className="badge bg-white bg-opacity-25 text-white font-monospace small mb-2">
                      ⭐ EXPERT GUIDE
                    </span>
                    <h5 className="text-white fw-bold mb-2">Planning a trip here?</h5>
                    <p className="text-white-50 small mb-3">
                      Get custom itineraries, private transport, and boutique hotel bookings tailored to your preferences.
                    </p>
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.pushState({}, "", "/");
                        window.dispatchEvent(new PopStateEvent("popstate"));
                      }}
                      className="btn btn-sm btn-light text-primary fw-600 rounded-pill px-3 py-2 w-100"
                    >
                      Explore Hotel &amp; Tour Deals
                    </a>
                  </div>

                  {/* Categories Widget */}
                  <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
                    <h5 className="fw-700 text-dark mb-3" style={{ fontSize: "16px" }}>
                      Popular Categories
                    </h5>
                    <div className="d-flex flex-column gap-2">
                      {[
                        { name: "Adventure Expeditions", count: 18 },
                        { name: "Cultural & Heritage", count: 24 },
                        { name: "Beach & Island Getaways", count: 12 },
                        { name: "Luxury Mountain Resorts", count: 15 },
                        { name: "Food & Culinary Walks", count: 9 },
                      ].map((c, idx) => (
                        <a
                          key={idx}
                          href="/blog"
                          onClick={(e) => {
                            e.preventDefault();
                            window.history.pushState({}, "", "/blog");
                            window.dispatchEvent(new PopStateEvent("popstate"));
                          }}
                          className="d-flex align-items-center justify-content-between text-decoration-none text-dark small py-1 border-bottom"
                        >
                          <span>{c.name}</span>
                          <span className="badge bg-light text-muted">{c.count}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Related Tour Cards Below Blog */}
            {blogData.location && (
              <div className="mt-60 pt-5 border-top">
                <DomesticLocation
                  location={blogData.location}
                  layout="grid"
                  subtitle="Explore Exclusive Offers"
                  title={`Recommended Hotel & Tour Packages in ${blogData.location}`}
                  iconClass="fa-solid fa-hotel"
                  showBtn={true}
                  btnText={`View All ${blogData.location} Deals`}
                  btnHref="/"
                  maxCards={4}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogDetailsPage;
