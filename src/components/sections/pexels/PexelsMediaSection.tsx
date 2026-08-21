import React, { useEffect, useRef } from "react";

const PEXELS_API_KEY =
  (import.meta as any).env?.VITE_PEXELS_API_KEY ||
  "y6WP5reQNH7abdL2uzdLTyV8pq0kMmF3CHf7ZNkiHo98DXIvORUOBSfi";
const PEXELS_IMAGE_ENDPOINT = "https://api.pexels.com/v1/search";
const PEXELS_VIDEO_ENDPOINT = "https://api.pexels.com/videos/search";

/**
 * Fetch image results from Pexels
 */
export async function fetchPexelsImage(query: string, orientation?: string | null) {
  const url = new URL(PEXELS_IMAGE_ENDPOINT);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "5");
  if (orientation) url.searchParams.set("orientation", orientation);

  const res = await fetch(url.toString(), {
    headers: { Authorization: PEXELS_API_KEY },
  });
  if (!res.ok) throw new Error(`Pexels image API error: ${res.status}`);
  const data = await res.json();
  return data.photos || [];
}

/**
 * Fetch video results from Pexels
 */
export async function fetchPexelsVideo(query: string, orientation?: string | null) {
  const url = new URL(PEXELS_VIDEO_ENDPOINT);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "5");
  if (orientation) url.searchParams.set("orientation", orientation);

  const res = await fetch(url.toString(), {
    headers: { Authorization: PEXELS_API_KEY },
  });
  if (!res.ok) throw new Error(`Pexels video API error: ${res.status}`);
  const data = await res.json();
  return data.videos || [];
}

/**
 * Pick correct image URL by quality/size key with support for 1000px resolution
 */
/**
 * Pick correct image URL by quality/size key with support for 1000px resolution
 */
export function pickImageUrl(photo: any, quality: string) {
  const src = photo.src || {};
  if (quality === "1000x" || quality === "1000x1000" || quality === "1000") {
    // Generate high quality 1000px wide image from Pexels
    return src.original ? `${src.original}?auto=compress&cs=tinysrgb&w=1000&fit=crop` : (src.large2x || src.large || "");
  }
  if (quality === "1920" || quality === "large" || quality === "original" || quality === "full") {
    return src.original ? `${src.original}?auto=compress&cs=tinysrgb&w=1920` : (src.large2x || src.large || "");
  }
  return src[quality] || src.large2x || src.original || src.large || "";
}

/**
 * Pick correct video file URL by quality
 */
export function pickVideoUrl(video: any, quality: string) {
  const files = video.video_files || [];
  let match = files.find((f: any) => f.quality === quality);
  if (!match) {
    match = files.sort((a: any, b: any) => (b.width || 0) - (a.width || 0))[0];
  }
  return match ? match.link : "";
}

/**
 * Apply loaded media to the target element
 */
export function applyMedia(el: HTMLElement, type: string, url: string) {
  if (!url) return;
  if (type === "video") {
    (el as HTMLVideoElement).src = url;
    (el as HTMLVideoElement).load?.();
  } else if (type === "background" || !(el instanceof HTMLImageElement)) {
    el.style.backgroundImage = `url("${url}")`;
  } else {
    (el as HTMLImageElement).src = url;
  }
}

/**
 * Process a single element with data-pexels attribute
 */
export async function processElement(el: HTMLElement) {
  const query = el.getAttribute("data-pexels");
  if (!query) return;

  const type = (el.getAttribute("data-type") || "image").toLowerCase();
  const quality = el.getAttribute("data-quality") || (type === "video" ? "hd" : "large");
  const orientation = el.getAttribute("data-orientation") || null;
  const rawIndex = el.getAttribute("data-index");

  try {
    if (type === "video") {
      const videos = await fetchPexelsVideo(query, orientation);
      if (videos && videos.length > 0) {
        const index = rawIndex !== null ? parseInt(rawIndex, 10) : Math.floor(Math.random() * videos.length);
        const video = videos[index] || videos[0];
        if (video) applyMedia(el, "video", pickVideoUrl(video, quality));
      }
    } else {
      const photos = await fetchPexelsImage(query, orientation);
      if (photos && photos.length > 0) {
        // Pick random photo or specific index if data-index provided to prevent duplicates
        const index = rawIndex !== null ? parseInt(rawIndex, 10) : Math.floor(Math.random() * photos.length);
        const photo = photos[index] || photos[0];
        if (photo) applyMedia(el, type, pickImageUrl(photo, quality));
      }
    }
  } catch (err) {
    console.error(`Pexels load failed for query "${query}":`, err);
  }
}

/**
 * Scan the DOM or container and process all elements with data-pexels attribute
 */
export function loadAllPexelsMedia(root: ParentNode = document) {
  const elements = root.querySelectorAll("[data-pexels]");
  elements.forEach((el) => processElement(el as HTMLElement));
}

// Expose globally for window.PexelsLoader
if (typeof window !== "undefined") {
  (window as any).PexelsLoader = {
    load: processElement,
    loadAll: loadAllPexelsMedia,
    fetchImage: fetchPexelsImage,
    fetchVideo: fetchPexelsVideo,
  };
}

/**
 * PexelsMediaSection Component
 * Wraps any content/elements with data-pexels attribute and auto-loads media when mounted or rendered.
 */
interface PexelsMediaSectionProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export const PexelsMediaSection: React.FC<PexelsMediaSectionProps> = ({ children, className = "", id }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      loadAllPexelsMedia(containerRef.current);
    }
  }, [children]);

  return (
    <div ref={containerRef} className={className} id={id}>
      {children}
    </div>
  );
};

/**
 * PexelsShowcase Component
 * A standalone section demonstrating Universal Pexels Media loader functionality
 */
export const PexelsShowcase: React.FC = () => {
  return (
    <PexelsMediaSection className="tp-pexels-showcase-section py-12 px-4 bg-slate-900 text-white my-8 rounded-xl max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 bg-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider rounded-full mb-2">
          Universal Media Loader
        </span>
        <h2 className="text-3xl font-bold">Pexels Dynamic Showcase</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Media elements automatically fetch and render high quality images & videos using <code>data-pexels</code> attributes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Mountain Image */}
        <div className="bg-slate-800/60 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
          <div className="h-52 overflow-hidden relative bg-slate-900">
            <img
              data-pexels="mountains"
              data-type="image"
              data-quality="large"
              data-orientation="landscape"
              alt="Mountains"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg text-slate-100">Mountains Landscape</h3>
            <p className="text-xs text-slate-400 mt-1">
              <code>data-pexels="mountains" data-type="image" data-quality="large"</code>
            </p>
          </div>
        </div>

        {/* Card 2: Ocean Video */}
        <div className="bg-slate-800/60 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
          <div className="h-52 overflow-hidden relative bg-slate-900">
            <video
              data-pexels="ocean waves"
              data-type="video"
              data-quality="hd"
              data-orientation="landscape"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            ></video>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg text-slate-100">Ocean Waves Video</h3>
            <p className="text-xs text-slate-400 mt-1">
              <code>data-pexels="ocean waves" data-type="video" data-quality="hd"</code>
            </p>
          </div>
        </div>

        {/* Card 3: City Traffic Video */}
        <div className="bg-slate-800/60 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
          <div className="h-52 overflow-hidden relative bg-slate-900">
            <video
              data-pexels="city traffic"
              data-type="video"
              data-quality="hd"
              data-orientation="landscape"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            ></video>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg text-slate-100">City Traffic Video</h3>
            <p className="text-xs text-slate-400 mt-1">
              <code>data-pexels="city traffic" data-type="video" data-quality="hd"</code>
            </p>
          </div>
        </div>
      </div>
    </PexelsMediaSection>
  );
};

export default PexelsMediaSection;
