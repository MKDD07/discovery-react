import React, { useEffect, useState } from "react";
import { fetchPexelsVideo, pickVideoUrl } from "../pexels/PexelsMediaSection";
import logo from "../../../logo.png";

const FALLBACK_VIDEO = "https://player.vimeo.com/external/371837092.hd.mp4?s=d11c0f0d2c0b022ad0518ff7ab8d313d42c3c6f2&profile_id=175";
const FALLBACK_POSTER = "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1920";

export const VideoArea: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>(FALLBACK_VIDEO);
  const [posterUrl, setPosterUrl] = useState<string>(FALLBACK_POSTER);

  useEffect(() => {
    let isMounted = true;

    fetchPexelsVideo("scenic world travel drone nature cinematic", "landscape")
      .then((video) => {
        if (!isMounted || !video) return;
        const bestUrl = pickVideoUrl(video, "hd") || pickVideoUrl(video, "medium");
        if (bestUrl) setVideoUrl(bestUrl);
        if (video.image) setPosterUrl(video.image);
      })
      .catch((err) => {
        console.warn("VideoArea: Failed to fetch Pexels video, using fallback", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {/* tp-video-area-start */}
      <div className="tp-video-area tp-video-shadow p-relative z-index-2 fix">
        <div className="tp-video-frame p-absolute fix">
          <video
            key={videoUrl}
            loop
            muted
            autoPlay
            playsInline
            poster={posterUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
        <div className="container p-relative">
          {/* Top Right Corner Time Badge */}
          <div
            className="p-absolute d-none d-md-block"
            style={{
              top: "20px",
              right: "20px",
              zIndex: 3,
            }}
          >
            <span
              className="tp-section-two-subtitle text-white fw-600 px-3 py-1 rounded-pill"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                fontSize: "13px",
              }}
            >
              <i className="fa-regular fa-clock mr-6"></i>
              19:45
            </span>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="tp-video-wrap text-center">
                <div className="tp-video-title-wrap d-inline-block pb-10 mb-35">
                  <h4 className="tp-section-title text-white fw-600">
                    Best In Travel
                  </h4>
                </div>
                <div className="tp-video-content-wrap">
                  <div className="d-flex align-items-center justify-content-center mb-20">
                    <span className="mr-10 text-white fw-600">Presented By :</span>
                    <img width="110px" src="/src/logo-white.png" alt="Discovery Convoy Logo" />
                  </div>
                  <p className="fw-500 text-white">
                    We transform your travel dreams into unforgettable realities.
                    <br /> From serene beaches to bustling cities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* tp-video-area-end */}
    </>
  );
};

export default VideoArea;

