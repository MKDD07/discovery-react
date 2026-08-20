import React, { useEffect, useRef, useState } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import { loadAllPexelsMedia } from "../components/sections/pexels/PexelsMediaSection";
import DomesticLocation from "../components/sections/domestic-location/domestic-location";

interface BlogDetailsPageProps {
  slug?: string;
  onBackHome?: () => void;
}

export const BlogDetailsPage: React.FC<BlogDetailsPageProps> = ({ slug, onBackHome }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [blogData, setBlogData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch blog data from D1 Database
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
          } else {
            setBlogData(null);
          }
        }
      } catch (err) {
        console.warn("D1 blog fetch error:", err);
        setBlogData(null);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadBlog();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  // Trigger Pexels loader once content is rendered
  useEffect(() => {
    if (!loading && blogData && containerRef.current) {
      loadAllPexelsMedia(containerRef.current);
    }
  }, [loading, blogData]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="py-5 text-center">
          <div className="container py-5">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="text-muted">Loading article from Cloudflare D1...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!blogData) {
    return (
      <>
        <Header />
        <main className="py-5 text-center">
          <div className="container py-5">
            <h3 className="fw-bold text-dark mb-2">Article Not Found</h3>
            <p className="text-muted small mb-4">
              This blog has not been published to Cloudflare D1 yet.
            </p>
            <a
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, "", "/blog");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="tp-btn text-white px-4 py-2"
            >
              Browse Published Blogs
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main ref={containerRef}>
        <div className="tp-blog-area tp-tour-ptb-2 pt-80 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-xxl-9 col-xl-8">
                <div className="postbox-details-main-wrap mb-40 pr-135">
                  <div className="postbox-details-info-wrap mb-60">
                    <div className="tp-blog-meta-wrap d-flex flex-wrap align-items-center mb-15">
                      <span className="tp-blog-category">{blogData.category || "Adventure"}</span>
                      <div className="tp-blog-meta">
                        <span>{blogData.date || "Dec 12, 2025"}</span>
                      </div>
                    </div>
                    <h3 className="postbox-title mb-30">
                      {blogData.title}
                    </h3>
                    <div className="postbox-details-social-wrap d-flex align-items-center justify-content-between flex-wrap gap-3">
                      <div className="d-flex align-items-center">
                        <div className="tp-testimonial-user d-flex align-items-center mr-15">
                          <img
                            src="assets/img/testimonial/avatar.png"
                            data-pexels="traveler photographer smiling portrait face"
                            data-type="image"
                            data-quality="small"
                            alt={blogData.author || "Author"}
                            style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }}
                          />
                        </div>
                        <div className="tp-testimonial-avatar-info">
                          <h3 className="tp-testimonial-avatar-title">{blogData.author || "Michael Lewis"}</h3>
                          <span className="tp-testimonial-avatar-pos">
                            {blogData.author_role || "Product Designer"}
                          </span>
                        </div>
                      </div>
                      <div className="postbox-social tp-bounce d-flex align-items-center gap-1">
                        <a href="#">
                          <svg
                            width={9}
                            height={17}
                            viewBox="0 0 9 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 0H6.54545C5.46048 0 4.41994 0.447767 3.65275 1.2448C2.88555 2.04183 2.45455 3.12283 2.45455 4.25V6.8H0V10.2H2.45455V17H5.72727V10.2H8.18182L9 6.8H5.72727V4.25C5.72727 4.02457 5.81347 3.80837 5.96691 3.64896C6.12035 3.48955 6.32846 3.4 6.54545 3.4H9V0Z"
                              fill="currentColor"
                            />
                          </svg>
                          <span />
                        </a>
                        <a href="#">
                          <svg
                            width={17}
                            height={16}
                            viewBox="0 0 17 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.3885 0H15.9953L10.3002 6.77744L17 16H11.7541L7.64539 10.4066L2.94405 16H0.335697L6.42711 8.75077L0 0H5.37904L9.09299 5.11262L13.3885 0ZM12.4736 14.3754H13.918L4.59417 1.53928H3.04413L12.4736 14.3754Z"
                              fill="currentColor"
                            />
                          </svg>
                          <span />
                        </a>
                        <a href="#">
                          <svg
                            width={17}
                            height={16}
                            viewBox="0 0 17 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.7875 5.05225C13.1277 5.05225 14.413 5.58459 15.3607 6.53218C16.3083 7.47977 16.8407 8.76497 16.8407 10.1051V16H13.4719V10.1051C13.4719 9.65836 13.2945 9.22996 12.9786 8.9141C12.6627 8.59824 12.2343 8.42079 11.7875 8.42079C11.3408 8.42079 10.9124 8.59824 10.5965 8.9141C10.2806 9.22996 10.1031 9.65836 10.1031 10.1051V16H6.73438V10.1051C6.73438 8.76497 7.26676 7.47977 8.21441 6.53218C9.16206 5.58459 10.4474 5.05225 11.7875 5.05225Z"
                              fill="currentColor"
                            />
                            <path
                              d="M3.36877 5.89188H0V15.9975H3.36877V5.89188Z"
                              fill="currentColor"
                            />
                            <path
                              d="M1.68439 3.36854C2.61465 3.36854 3.36877 2.61447 3.36877 1.68427C3.36877 0.754073 2.61465 0 1.68439 0C0.754126 0 0 0.754073 0 1.68427C0 2.61447 0.754126 3.36854 1.68439 3.36854Z"
                              fill="currentColor"
                            />
                          </svg>
                          <span />
                        </a>
                        <a href="#">
                          <svg
                            width={17}
                            height={17}
                            viewBox="0 0 17 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <ellipse
                              cx="8.25"
                              cy="8.24941"
                              rx="7.5"
                              ry="7.49941"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M15.75 9.19825C15.0549 9.0679 14.34 8.99997 13.6104 8.99997C9.59614 8.99997 6.02576 11.0567 3.75 14.2496"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M13.5 2.99973C11.1529 5.75008 7.62592 7.49937 3.68221 7.49937C2.67327 7.49937 1.69161 7.38488 0.75 7.16842"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10.2133 15.75C10.4013 14.8396 10.5 13.8967 10.5 12.9308C10.5 8.19407 8.12575 4.01074 4.5 1.5011"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="postbox-wrapper">
                    {/* Main Cover Section */}
                    <div className="postbox-details-text mb-45">
                      <div className="postbox-details-thumb mb-45">
                        <img
                          className="w-100"
                          src="assets/img/blog/details/thumb.jpg"
                          data-pexels={blogData.cover_query || `${blogData.title} 4k travel landscape`}
                          data-type="image"
                          data-quality="large"
                          alt={blogData.title}
                        />
                      </div>
                      <h4 className="postbox-details-title mb-10">
                        {blogData.title}
                      </h4>
                      {blogData.summary && <p>{blogData.summary}</p>}
                    </div>

                    {/* Dynamic Sections with Headings, Paragraphs & Pexels Visuals */}
                    {blogData.sections &&
                      blogData.sections.map((sec: any, idx: number) => (
                        <div key={idx} className="postbox-details-text mb-50">
                          {sec.pexelsQuery && (
                            <div className="postbox-details-thumb postbox-details-thumb-overly mb-45 p-relative">
                              <img
                                className="w-100"
                                src="assets/img/blog/details/thumb-2.jpg"
                                data-pexels={sec.pexelsQuery}
                                data-type="image"
                                data-quality="large"
                                alt={sec.heading}
                              />
                              <div className="postbox-details-thumb-content d-flex flex-wrap gap-1 align-items-center justify-content-between">
                                <div className="postbox-details-thumb-info">
                                  <span>{blogData.location || "Explore"}</span>
                                  <p className="mb-0">Click to discover more!</p>
                                </div>
                                <div className="tp-bounce">
                                  <a href="#" className="postbox-details-thumb-btn">
                                    <svg
                                      width={9}
                                      height={16}
                                      viewBox="0 0 9 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M0.75 14.75L7.75 7.75L0.75 0.75"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <span />
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                          <h4 className="postbox-details-title mb-10">
                            {sec.heading}
                          </h4>
                          {sec.paragraphs &&
                            sec.paragraphs.map((p: string, pIdx: number) => (
                              <p key={pIdx} className="mb-20">{p}</p>
                            ))}
                        </div>
                      ))}

                    {/* Blockquote Quote */}
                    {blogData.quote && (
                      <div className="postbox-details-quote-boxs mb-50">
                        <blockquote>
                          <div className="postbox-details-quote-box d-flex align-items-start">
                            <i>
                              <svg
                                width={44}
                                height={40}
                                viewBox="0 0 44 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M44 1.05264L39.9691 0L25.2477 37.0175L28.0518 40L41.1959 36.8421L44 1.05264Z"
                                  fill="#FD4621"
                                />
                                <path
                                  d="M18.7523 1.05264L14.7214 0L0 37.0175L2.80408 40L15.9482 36.8421L18.7523 1.05264Z"
                                  fill="#FD4621"
                                />
                              </svg>
                            </i>
                            <div className="postbox-details-quote">
                              <p>{blogData.quote.text}</p>
                              <div className="postbox-details-quote-author">
                                <span>{blogData.quote.author}</span>
                                <span className="destination">{blogData.quote.destination || "Discovery"}</span>
                              </div>
                            </div>
                          </div>
                        </blockquote>
                      </div>
                    )}

                    {/* FAQs as Section Headers & Paragraphs */}
                    {blogData.faqs && blogData.faqs.length > 0 && (
                      <div className="postbox-details-text mb-60">
                        <h4 className="postbox-details-title mb-30">
                          Frequently Asked Questions
                        </h4>
                        {blogData.faqs.map((faq: any, fIdx: number) => (
                          <div key={fIdx} className="mb-25">
                            <h5 className="postbox-details-title-sm mb-10">
                              {fIdx + 1}. {faq.question}
                            </h5>
                            <p>{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="postbox-details-tag-wrap d-flex align-items-center justify-content-between flex-wrap gap-3">
                      <div className="tagcloud">
                        <a href="/blog">Adventure</a>
                        <a href="/blog">Travel Tips</a>
                        <a href="/blog">City Tour</a>
                        <a href="/blog">Nature Escape</a>
                      </div>
                      <div className="postbox-social tp-bounce d-flex align-items-center gap-1">
                        <a href="#">
                          <svg
                            width={9}
                            height={15}
                            viewBox="0 0 9 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.0447 0H5.85069C4.88088 0 3.95079 0.383236 3.26503 1.0654C2.57927 1.74756 2.19401 2.67278 2.19401 3.6375V5.82H0V8.73H2.19401V14.55H5.11936V8.73H7.31337L8.0447 5.82H5.11936V3.6375C5.11936 3.44456 5.19641 3.25951 5.33356 3.12308C5.47071 2.98665 5.65673 2.91 5.85069 2.91H8.0447V0Z"
                              fill="currentColor"
                            />
                          </svg>
                          <span />
                        </a>
                        <a href="#">
                          <svg
                            width={17}
                            height={16}
                            viewBox="0 0 17 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.3885 0H15.9953L10.3002 6.77744L17 16H11.7541L7.64539 10.4066L2.94405 16H0.335697L6.42711 8.75077L0 0H5.37904L9.09299 5.11262L13.3885 0ZM12.4736 14.3754H13.918L4.59417 1.53928H3.04413L12.4736 14.3754Z"
                              fill="currentColor"
                            />
                          </svg>
                          <span />
                        </a>
                      </div>
                    </div>

                    {/* Author Box */}
                    <div className="tp-postbox-details-author mb-60 mt-50">
                      <div className="postbox-details-author d-flex align-items-start">
                        <div className="postbox-details-author-img mr-30 overflow-hidden rounded-3">
                          <img
                            src="assets/img/blog/postbox/image.png"
                            data-pexels="travel writer photographer man portrait outdoor smiling"
                            data-type="image"
                            data-quality="medium"
                            alt={blogData.author || "Author"}
                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                          />
                        </div>
                        <div className="postbox-details-author-info">
                          <div className="postbox-details-author-content">
                            <span>About Author</span>
                            <h4 className="postbox-details-author-name">
                              {blogData.author || "Michael Harris"}
                            </h4>
                            <p>
                              A passionate globe-trotter and adventure seeker, I love
                              exploring new cultures, tasting local cuisines, and
                              capturing unforgettable moments through photography.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar with exact original HTML markup */}
              <div className="col-xxl-3 col-xl-4">
                <div className="sidebar-wrapper mb-40">
                  <div className="sidebar-widget mb-45">
                    <div className="sidebar-search">
                      <form action="#" onSubmit={(e) => e.preventDefault()}>
                        <div className="sidebar-search-input p-relative">
                          <input type="text" placeholder="Search..." />
                          <button type="submit">
                            <svg
                              width={15}
                              height={15}
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.50041 12.4999C9.81435 12.4999 12.5008 9.81363 12.5008 6.49995C12.5008 3.18627 9.81435 0.5 6.50041 0.5C3.18648 0.5 0.5 3.18627 0.5 6.49995C0.5 9.81363 3.18648 12.4999 6.50041 12.4999Z"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M14.5002 14.5L11.5 11.5"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="sidebar-widget mb-45">
                    <h3 className="sidebar-widget-title mb-30">Categories</h3>
                    <div className="sidebar-widget-category">
                      <ul>
                        <li>
                          <a
                            className="d-flex align-items-center justify-content-between"
                            href="/blog"
                            onClick={(e) => {
                              e.preventDefault();
                              window.history.pushState({}, "", "/blog");
                              window.dispatchEvent(new PopStateEvent("popstate"));
                            }}
                          >
                            Journey
                            <span>08</span>
                          </a>
                        </li>
                        <li>
                          <a
                            className="d-flex align-items-center justify-content-between"
                            href="/blog"
                            onClick={(e) => {
                              e.preventDefault();
                              window.history.pushState({}, "", "/blog");
                              window.dispatchEvent(new PopStateEvent("popstate"));
                            }}
                          >
                            Adventure
                            <span>04</span>
                          </a>
                        </li>
                        <li>
                          <a
                            className="d-flex align-items-center justify-content-between"
                            href="/blog"
                            onClick={(e) => {
                              e.preventDefault();
                              window.history.pushState({}, "", "/blog");
                              window.dispatchEvent(new PopStateEvent("popstate"));
                            }}
                          >
                            Ocean
                            <span>12</span>
                          </a>
                        </li>
                        <li>
                          <a
                            className="d-flex align-items-center justify-content-between"
                            href="/blog"
                            onClick={(e) => {
                              e.preventDefault();
                              window.history.pushState({}, "", "/blog");
                              window.dispatchEvent(new PopStateEvent("popstate"));
                            }}
                          >
                            Family Adventure
                            <span>16</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="sidebar-widget mb-45">
                    <h3 className="sidebar-widget-title mb-30">Latest Posts</h3>
                    <div className="rc-post-wrap">
                      <div className="rc-post d-flex align-items-center">
                        <div className="rc-post-thumb">
                          <a href="/blog">
                            <img
                              src="assets/img/blog/rc/thumb.jpg"
                              data-pexels="travel luggage airport adventure"
                              data-type="image"
                              data-quality="small"
                              alt=""
                            />
                          </a>
                        </div>
                        <div className="rc-post-content">
                          <div className="rc-post-category">
                            <a href="/blog">Travel</a>
                          </div>
                          <h3 className="rc-post-title">
                            <a href="/blog">
                              Fueling ambition &amp; Achieving your goals
                            </a>
                          </h3>
                          <div className="rc-post-meta tp-blog-meta d-flex flex-wrap align-items-center ">
                            <span>July 15, 2025</span>
                            <span>12 Min</span>
                          </div>
                        </div>
                      </div>
                      <div className="rc-post d-flex align-items-center">
                        <div className="rc-post-thumb">
                          <a href="/blog">
                            <img
                              src="assets/img/blog/rc/thumb-2.jpg"
                              data-pexels="creative design photography travel camera"
                              data-type="image"
                              data-quality="small"
                              alt=""
                            />
                          </a>
                        </div>
                        <div className="rc-post-content">
                          <div className="rc-post-category">
                            <a href="/blog">Design</a>
                          </div>
                          <h3 className="rc-post-title">
                            <a href="/blog">
                              Behind the scenes of creative processes
                            </a>
                          </h3>
                          <div className="rc-post-meta tp-blog-meta d-flex flex-wrap align-items-center ">
                            <span>July 15, 2025</span>
                            <span>1 Min</span>
                          </div>
                        </div>
                      </div>
                      <div className="rc-post d-flex align-items-center">
                        <div className="rc-post-thumb">
                          <a href="/blog">
                            <img
                              src="assets/img/blog/rc/thumb-3.jpg"
                              data-pexels="digital nomad laptop coffee cafe travel"
                              data-type="image"
                              data-quality="small"
                              alt=""
                            />
                          </a>
                        </div>
                        <div className="rc-post-content">
                          <div className="rc-post-category">
                            <a href="/blog">Design</a>
                          </div>
                          <h3 className="rc-post-title">
                            <a href="/blog">
                              Starting journey as your dream escape
                            </a>
                          </h3>
                          <div className="rc-post-meta tp-blog-meta d-flex flex-wrap align-items-center ">
                            <span>July 15, 2025</span>
                            <span>16 Min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sidebar-widget">
                    <h3 className="sidebar-widget-title mb-30">Popular Tag</h3>
                    <div className="sidebar-widget-content">
                      <div className="tagcloud">
                        <a href="/blog">Adventure</a>
                        <a href="/blog">Travel Tips</a>
                        <a href="/blog">City Tour</a>
                        <a href="/blog">Nature Escape</a>
                        <a href="/blog">Beach Life</a>
                        <a href="/blog">Mountain Hike</a>
                      </div>
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
