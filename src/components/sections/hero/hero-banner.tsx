import React, { useEffect, useState, useRef } from "react";
import { fetchPexelsVideo, pickVideoUrl } from "../pexels/PexelsMediaSection";
import { BookingTab } from "../booking-form/booking-form";

// Tab specific queries and default fallback videos with high quality posters
const TAB_VIDEO_CONFIG: Record<
  BookingTab,
  {
    query: string;
    fallbackVideo: string;
    fallbackPoster: string;
    subtitle: string;
    title: string;
    description: string;
  }
> = {
  packages: {
    query: "tropical island resort travel drone",
    fallbackVideo: "https://html.aqlova.com/videos/turie/video-4.mp4",
    fallbackPoster: "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1920",
    subtitle: "Popular Packages",
    title: "Turn Every Destination\nInto Pure Wonder",
    description: "Explore 10,300+ Curated Holiday Packages",
  },
  hotels: {
    query: "luxury hotel resort swimming pool",
    fallbackVideo: "https://player.vimeo.com/external/371842426.sd.mp4?s=d7e366a7b744005b451ec9496a7962ef9ea09a16&profile_id=164&oauth2_token_id=57447761",
    fallbackPoster: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920",
    subtitle: "Luxury Hotels & Stays",
    title: "Experience World-Class\nComfort & Serenity",
    description: "Book 25,000+ Premium Resorts & Boutique Hotels",
  },
  flights: {
    query: "airplane flying clouds sunset",
    fallbackVideo: "https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27ffd4fa706c4f538e16b6f4d67dcd&profile_id=165&oauth2_token_id=57447761",
    fallbackPoster: "https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=1920",
    subtitle: "Global Flight Deals",
    title: "Fly Anywhere With\nUnmatched Ease",
    description: "Compare Real-time Flights Across 500+ Airlines",
  },
  travels: {
    query: "nature mountain adventure hiking travel",
    fallbackVideo: "https://player.vimeo.com/external/494254075.sd.mp4?s=08945cf40f9076f8b1cb3550e501ce6bcae8dbe8&profile_id=165&oauth2_token_id=57447761",
    fallbackPoster: "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1920",
    subtitle: "Epic Guided Travels",
    title: "Discover Hidden Gems\n& Majestic Routes",
    description: "Personalized Itineraries & Local Experiences",
  },
};

interface HeroBannerProps {
  activeTab?: BookingTab;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ activeTab = "packages" }) => {
  const currentConfig = TAB_VIDEO_CONFIG[activeTab] || TAB_VIDEO_CONFIG.packages;

  const [videoUrl, setVideoUrl] = useState<string>(currentConfig.fallbackVideo);
  const [posterUrl, setPosterUrl] = useState<string>(currentConfig.fallbackPoster);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch dynamic video from Pexels API whenever activeTab changes
  useEffect(() => {
    let isCancelled = false;
    setVideoLoaded(false);

    async function loadTabMedia() {
      try {
        const videos = await fetchPexelsVideo(currentConfig.query, "landscape");
        if (!isCancelled && videos && videos.length > 0) {
          const firstVideo = videos[0];
          // High quality MP4 file
          const picked = pickVideoUrl(firstVideo, "hd") || pickVideoUrl(firstVideo, "sd");
          // Video poster image (first frame snapshot provided by Pexels)
          const poster = firstVideo.image || currentConfig.fallbackPoster;

          if (picked) {
            setPosterUrl(poster);
            setVideoUrl(picked);
          }
        }
      } catch (err) {
        console.warn(`Pexels video load fallback for ${activeTab}:`, err);
        if (!isCancelled) {
          setPosterUrl(currentConfig.fallbackPoster);
          setVideoUrl(currentConfig.fallbackVideo);
        }
      }
    }

    loadTabMedia();

    return () => {
      isCancelled = true;
    };
  }, [activeTab]);

  // Ensure seamless playback whenever videoUrl updates
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented; video is muted so safe to ignore
        });
      }
    }
  }, [videoUrl]);

  return (
    <div className="tp-hero-6-spacing tp-hero-bg z-index-2 p-relative overflow-hidden">
      {/* Background Video Container with Poster Frame First */}
      <div
        className="tp-hero-two-video tp-hero-6-video p-absolute fix"
        style={{
          backgroundImage: `url(${posterUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#071516",
        }}
      >
        <video
          ref={videoRef}
          key={videoUrl}
          poster={posterUrl}
          loop
          muted
          autoPlay
          playsInline
          preload="auto"
          onCanPlayThrough={() => setVideoLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            transition: "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: videoLoaded ? 1 : 0.85,
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Dark overlay for text contrast */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(7, 21, 22, 0.48)",
            pointerEvents: "none",
          }}
        />
      </div>

      <div className="container p-relative" style={{ zIndex: 3 }}>
        <div className="row">
          <div className="col-lg-12">
            <div className="tp-hero-6-content">
              <span className="tp-hero-6-subtitle fw-700 text-white tp-ff-dancing mb-15 d-inline-block">
                {currentConfig.subtitle}
              </span>
              <h4 className="tp-hero-6-title fw-600 text-white" style={{ whiteSpace: "pre-line" }}>
                {currentConfig.title}
              </h4>
              <p className="tp-hero-6-dec fw-500 text-white">
                {currentConfig.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

