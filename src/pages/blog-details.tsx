import React, { useEffect, useRef } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import { loadAllPexelsMedia } from "../components/sections/pexels/PexelsMediaSection";

interface BlogDetailsPageProps {
  slug?: string;
  onBackHome?: () => void;
}

export const BlogDetailsPage: React.FC<BlogDetailsPageProps> = ({ slug, onBackHome }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      loadAllPexelsMedia(containerRef.current);
    }
  }, []);

  return (
    <>
      <Header />
      <main ref={containerRef}>
        <div className="tp-blog-details-area">
          <div className="container">
            {/* Empty base structure for Blog Details - user will customize */}
            <div className="tp-blog-details-wrapper">
              <div className="tp-blog-details-thumb">
                <img
                  src=""
                  data-pexels={`${slug || "tropical travel resort vacation"} 4k landscape`}
                  data-type="image"
                  data-quality="large"
                  alt="Blog post cover"
                />
              </div>
              <div className="tp-blog-details-content">
                <h2>{slug ? decodeURIComponent(slug).replace(/-/g, " ") : "Blog Details"}</h2>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogDetailsPage;
