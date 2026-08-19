import React, { useEffect, useState, useRef } from "react";
import {
  fetchPexelsImage,
  fetchPexelsVideo,
  pickImageUrl,
  pickVideoUrl,
} from "../pexels/PexelsMediaSection";

interface HeroCollectionProps {
  cityName?: string;
  query?: string;
}

export const HeroCollection: React.FC<HeroCollectionProps> = ({
  cityName = "Kashmir",
  query = "kashmir dal lake shikara snow mountains landscape scenery",
}) => {
  const [bgImage, setBgImage] = useState<string>("assets/img/breadcrumb/bg-6.jpg");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let isMounted = true;
    setVideoLoaded(false);

    // 1. Fetch High-Res Image Poster first
    fetchPexelsImage(query, "landscape")
      .then((photos: any[]) => {
        if (isMounted && photos && photos.length > 0) {
          const imgUrl = pickImageUrl(photos[0], "large2x");
          if (imgUrl) setBgImage(imgUrl);
        }
      })
      .catch((err) => console.error("HeroCollection image err:", err));

    // 2. Fetch Video to play in background once loaded
    fetchPexelsVideo(`${cityName} travel landscape nature`, "landscape")
      .then((videos: any[]) => {
        if (isMounted && videos && videos.length > 0) {
          const vUrl = pickVideoUrl(videos[0], "hd") || pickVideoUrl(videos[0], "sd");
          if (vUrl) setVideoUrl(vUrl);
        }
      })
      .catch((err) => console.error("HeroCollection video err:", err));

    return () => {
      isMounted = false;
    };
  }, [cityName, query]);

  return (
    <div
      className="tp-breadcrumb-area tp-breadcrumb-ptb-3 tp-breadcrumb-overly p-relative overflow-hidden"
      style={{
        minHeight: "440px",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#071516",
        position: "relative",
      }}
    >
      {/* 1. Static/Placeholder Poster Image */}
      <img
        src={bgImage}
        alt={cityName}
        className="position-absolute w-100 h-100 top-0 left-0"
        style={{
          objectFit: "cover",
          zIndex: 1,
          opacity: videoLoaded ? 0 : 1,
          transition: "opacity 0.8s ease",
        }}
      />

      {/* 2. HD Video Player */}
      {videoUrl && (
        <video
          ref={videoRef}
          className="position-absolute w-100 h-100 top-0 left-0"
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          style={{
            objectFit: "cover",
            zIndex: 2,
            opacity: videoLoaded ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* 3. Dark Overlay */}
      <div
        className="position-absolute w-100 h-100 top-0 left-0"
        style={{
          backgroundColor: "rgba(7, 21, 22, 0.55)",
          zIndex: 3,
        }}
      ></div>

      {/* 4. Text Content */}
      <div className="container p-relative" style={{ zIndex: 4 }}>
        <div className="row justify-content-center">
          <div className="col-lg-12 col-md-10">
            <div className="tp-breadcrumb-wrap text-center">
              <span className="tp-section-two-subtitle text-white d-inline-block mb-10 text-uppercase fw-600">
                <i className="fa-solid fa-location-dot mr-6" style={{ color: "#ff5e14" }}></i>
                Destination Experience
              </span>
              <h2 className="tp-breadcrumb-title fs-112 text-center text-white mb-0 fw-700">
                {cityName}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCollection;
