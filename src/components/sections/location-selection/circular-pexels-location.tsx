import React, { useEffect, useState } from "react";

const PEXELS_API_KEY =
  (import.meta as any).env?.VITE_PEXELS_API_KEY ||
  "y6WP5reQNH7abdL2uzdLTyV8pq0kMmF3CHf7ZNkiHo98DXIvORUOBSfi";

// List of 20 popular Indian locations / destinations for query search (focused on scenery/landscape/nature/architecture without people)
const INDIA_LOCATIONS = [
  { name: "Taj Mahal", query: "taj mahal agra architecture landscape scenery", region: "North India" },
  { name: "Jaipur", query: "jaipur palace rajasthan architecture landscape", region: "Rajasthan" },
  { name: "Goa", query: "goa beach sea landscape nature", region: "West Coast" },
  { name: "Kerala", query: "kerala backwaters nature landscape lake", region: "South India" },
  { name: "Varanasi", query: "varanasi ganges river ghat landscape", region: "North India" },
  { name: "Ladakh", query: "ladakh pangong lake mountains landscape", region: "Himalayas" },
  { name: "Mumbai", query: "mumbai gateway of india skyline architecture", region: "Maharashtra" },
  { name: "Udaipur", query: "udaipur lake palace architecture landscape", region: "Rajasthan" },
  { name: "Manali", query: "manali snow mountains landscape nature", region: "Himachal" },
  { name: "Rishikesh", query: "rishikesh ganges river mountains landscape", region: "Uttarakhand" },
  { name: "Darjeeling", query: "darjeeling tea gardens mountains landscape", region: "East India" },
  { name: "Ooty", query: "ooty tea gardens mountains landscape nature", region: "Tamil Nadu" },
  { name: "Amritsar", query: "golden temple amritsar architecture landscape", region: "Punjab" },
  { name: "Hampi", query: "hampi ruins architecture landscape heritage", region: "Karnataka" },
  { name: "Kashmir", query: "dal lake srinagar kashmir mountains landscape", region: "Kashmir" },
  { name: "Munnar", query: "munnar tea estate green hills landscape", region: "Kerala" },
  { name: "Shimla", query: "shimla hill station mountains landscape", region: "Himachal" },
  { name: "Coorg", query: "coorg green hills nature landscape", region: "Karnataka" },
  { name: "Andaman", query: "andaman radhanagar beach turquoise sea landscape", region: "Islands" },
  { name: "Meghalaya", query: "meghalaya waterfall nature forest landscape", region: "North East" }
];

interface LocationItem {
  id: string;
  name: string;
  region: string;
  imageUrl: string;
}

interface CircularPexelsLocationSelectionProps {
  onSelectLocation?: (locName: string, query: string) => void;
}

export const CircularPexelsLocationSelection: React.FC<CircularPexelsLocationSelectionProps> = ({
  onSelectLocation,
}) => {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleLocationClick = (locName: string, query: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectLocation) {
      onSelectLocation(locName, query);
    } else {
      window.location.href = `/destination/${encodeURIComponent(locName.toLowerCase())}`;
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchPexelsImages() {
      setLoading(true);

      try {
        const fetchPromises = INDIA_LOCATIONS.map(async (loc, idx) => {
          // Fetch up to 15 landscape images to get a random non-person location scenery result
          const url = new URL("https://api.pexels.com/v1/search");
          url.searchParams.set("query", loc.query);
          url.searchParams.set("per_page", "15");
          url.searchParams.set("orientation", "landscape");

          const response = await fetch(url.toString(), {
            headers: { Authorization: PEXELS_API_KEY }
          });

          if (!response.ok) throw new Error("Pexels fetch error");

          const data = await response.json();
          const photos = data.photos || [];

          // Pick a random image from fetched photos
          const randomIndex = photos.length > 0 ? Math.floor(Math.random() * photos.length) : 0;
          const photo = photos[randomIndex];

          const imageUrl =
            photo?.src?.medium ||
            photo?.src?.large ||
            photo?.src?.original ||
            `https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=300`;

          return {
            id: `loc-${idx}-${Date.now()}`,
            name: loc.name,
            region: loc.region,
            imageUrl
          };
        });

        const results = await Promise.all(fetchPromises);
        if (isMounted) {
          setLocations(results);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load Pexels India location images:", error);
        if (isMounted) setLoading(false);
      }
    }

    fetchPexelsImages();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="tp-pexels-circular-section position-relative">
      <div className="tp-pexels-circular-container position-relative">
        <div className="tp-testimonial-two-navigation tp-destination-3-navigation tp-bounce justify-content-between">
          <button className="tp-testimonial-two-prev bounce" onClick={scrollLeft} aria-label="Previous">
            <i className="fa-solid fa-angle-left"></i>
            <span></span>
          </button>
          <button className="tp-testimonial-two-next bounce" onClick={scrollRight} aria-label="Next">
            <i className="fa-solid fa-angle-right"></i>
            <span></span>
          </button>
        </div>

        <div className="tp-pexels-circular-track" ref={trackRef}>
          {loading
            ? // Render 20 Skeleton placeholders while loading
              Array.from({ length: 20 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="tp-pexels-circular-item tp-pexels-skeleton-item"
                >
                  <div className="tp-pexels-circular-avatar-skeleton">
                    <div className="tp-pexels-skeleton-shimmer"></div>
                  </div>
                  <div className="tp-pexels-text-skeleton-title"></div>
                  <div className="tp-pexels-text-skeleton-subtitle"></div>
                </div>
              ))
            : // Render 20 Circular Location Cards once loaded
              locations.map((loc) => {
                const originalLoc = INDIA_LOCATIONS.find((l) => l.name === loc.name);
                const query = originalLoc ? originalLoc.query : loc.name;
                return (
                  <div
                    key={loc.id}
                    className="tp-pexels-circular-item"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => handleLocationClick(loc.name, query, e)}
                  >
                    <div className="tp-pexels-circular-ring">
                      <div className="tp-pexels-circular-inner">
                        <img
                          src={loc.imageUrl}
                          alt={loc.name}
                          className="tp-pexels-circular-img"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <span className="tp-destination-3-content">{loc.name}</span>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default CircularPexelsLocationSelection;
