import React, { useEffect, useRef } from "react";
import { loadAllPexelsMedia } from "../pexels/PexelsMediaSection";

export const BlogArea: React.FC = () => {
  const blogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blogRef.current) {
      loadAllPexelsMedia(blogRef.current);
    }
  }, []);

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
            <div className="col-xl-7">
              <div
                className="tp-blog-item tp-blog-col-1 mb-30 wow fadeInUp"
                data-wow-duration=".9s"
                data-wow-delay=".3s"
              >
                <div className="tp-blog-thumb mb-30 fix">
                  <a href="#blog-details" className="d-block">
                    <img
                      className="w-100"
                      src="assets/img/blog/thumb.jpg"
                      data-pexels="amazon rainforest tropical adventure nature travel"
                      data-type="image"
                      data-quality="large"
                      alt="Amazon Rainforest Blog"
                    />
                  </a>
                </div>
                <div className="tp-blog-content">
                  <div className="tp-blog-meta-wrap d-flex flex-wrap align-items-center mb-15">
                    <span className="tp-blog-category">Adventure</span>
                    <div className="tp-blog-meta">
                      <span>Dec 12, 2025</span>
                      <span>Admin</span>
                    </div>
                  </div>
                  <h3 className="tp-blog-title fw-600 mb-15">
                    <a href="#blog-details">
                      Experience vibrant festivals, explore the
                      <br /> amazing Amazon rainforest
                    </a>
                  </h3>
                  <a href="#blog-details" className="tp-btn-solid">
                    Learn more <i className="fa-solid fa-arrow-right ml-5"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-xl-5">
              <div
                className="tp-blog-item tp-blog-col-2 mb-30 wow fadeInUp"
                data-wow-duration=".9s"
                data-wow-delay=".4s"
              >
                <div className="tp-blog-thumb fix">
                  <a href="#blog-details" className="d-inline-block">
                    <img
                      src="assets/img/blog/thumb-sm.jpg"
                      data-pexels="egypt pyramids desert safari travel"
                      data-type="image"
                      data-quality="medium"
                      alt="Desert Adventures"
                    />
                  </a>
                </div>
                <div className="tp-blog-content">
                  <div className="tp-blog-meta-wrap d-flex flex-wrap align-items-center mb-15">
                    <span className="tp-blog-category">Adventure</span>
                    <div className="tp-blog-meta">
                      <span>Dec 12, 2025</span>
                    </div>
                  </div>
                  <h3 className="tp-blog-title fw-600 mb-15">
                    <a href="#blog-details">
                      Explore ancient pyramids &amp; desert adventures.
                    </a>
                  </h3>
                  <a href="#blog-details" className="tp-btn-solid">
                    Learn more <i className="fa-solid fa-arrow-right ml-5"></i>
                  </a>
                </div>
              </div>
              <div
                className="tp-blog-item tp-blog-col-2 mb-30 wow fadeInUp"
                data-wow-duration=".9s"
                data-wow-delay=".5s"
              >
                <div className="tp-blog-thumb fix">
                  <a href="#blog-details" className="d-inline-block">
                    <img
                      src="assets/img/blog/thumb-sm-2.jpg"
                      data-pexels="travel friends laughing city rooftop tour"
                      data-type="image"
                      data-quality="medium"
                      alt="Travel Ideas"
                    />
                  </a>
                </div>
                <div className="tp-blog-content">
                  <div className="tp-blog-meta-wrap d-flex flex-wrap align-items-center mb-15">
                    <span className="tp-blog-category">Adventure</span>
                    <div className="tp-blog-meta">
                      <span>Dec 12, 2025</span>
                    </div>
                  </div>
                  <h3 className="tp-blog-title fw-600 mb-15">
                    <a href="#blog-details">
                      Collaboration turns ideas into powerful travel memories
                    </a>
                  </h3>
                  <a href="#blog-details" className="tp-btn-solid">
                    Learn more <i className="fa-solid fa-arrow-right ml-5"></i>
                  </a>
                </div>
              </div>
              <div
                className="tp-blog-item tp-blog-col-2 mb-30 wow fadeInUp"
                data-wow-duration=".9s"
                data-wow-delay=".6s"
              >
                <div className="tp-blog-thumb fix">
                  <a href="#blog-details" className="d-inline-block">
                    <img
                      src="assets/img/blog/thumb-sm-3.jpg"
                      data-pexels="mountain climbing hiking trail scenic sunrise"
                      data-type="image"
                      data-quality="medium"
                      alt="Scenic Sunrise"
                    />
                  </a>
                </div>
                <div className="tp-blog-content">
                  <div className="tp-blog-meta-wrap d-flex flex-wrap align-items-center mb-15">
                    <span className="tp-blog-category">Adventure</span>
                    <div className="tp-blog-meta">
                      <span>Dec 12, 2025</span>
                    </div>
                  </div>
                  <h3 className="tp-blog-title fw-600 mb-15">
                    <a href="#blog-details">
                      Great minds working together can tackle even the toughest trails.
                    </a>
                  </h3>
                  <a href="#blog-details" className="tp-btn-solid">
                    Learn more <i className="fa-solid fa-arrow-right ml-5"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* tp-blog-area-end */}
    </>
  );
};

export default BlogArea;


