import React, { useEffect, useRef } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import { loadAllPexelsMedia } from "../components/sections/pexels/PexelsMediaSection";

interface BlogPageProps {
  onBackHome?: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBackHome }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      loadAllPexelsMedia(containerRef.current);
    }
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <>
      <Header />
      <main ref={containerRef}>
<div class="tp-breadcrumb-area tp-breadcrumb-ptb tp-breadcrumb-overly bg-position" data-background="assets/img/breadcrumb/bg-9.jpg" style="background-image: url(&quot;assets/img/breadcrumb/bg-9.jpg&quot;);">
         <div class="container">
            <div class="row">
               <div class="col-12">
                  <div class="tp-breadcrumb-wrap text-center">
                     <h2 class="tp-breadcrumb-title fs-112 text-center mb-0">Blog Grid</h2>
                  </div>
               </div>
            </div>
         </div>
      </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogPage;
