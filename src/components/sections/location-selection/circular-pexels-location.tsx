import React, { useEffect, useState } from "react";
import { fetchPexelsImage } from "../pexels/PexelsMediaSection";

// List of 20 popular Indian locations / destinations for query search (focused on scenery/landscape/nature/architecture without people)
const INDIA_LOCATIONS = [
  { name: "Taj Mahal", query: "taj mahal agra architecture landscape scenery", region: "North India", defaultImg: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Jaipur", query: "jaipur palace rajasthan architecture landscape", region: "Rajasthan", defaultImg: "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Goa", query: "goa beach sea landscape nature", region: "West Coast", defaultImg: "https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Kerala", query: "kerala backwaters nature landscape lake", region: "South India", defaultImg: "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Varanasi", query: "varanasi ganges river ghat landscape", region: "North India", defaultImg: "https://images.pexels.com/photos/814499/pexels-photo-814499.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Ladakh", query: "ladakh pangong lake mountains landscape", region: "Himalayas", defaultImg: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Mumbai", query: "mumbai gateway of india skyline architecture", region: "Maharashtra", defaultImg: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Udaipur", query: "udaipur lake palace architecture landscape", region: "Rajasthan", defaultImg: "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Manali", query: "manali snow mountains landscape nature", region: "Himachal", defaultImg: "https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Rishikesh", query: "rishikesh ganges river mountains landscape", region: "Uttarakhand", defaultImg: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Darjeeling", query: "darjeeling tea gardens mountains landscape", region: "East India", defaultImg: "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Ooty", query: "ooty tea gardens mountains landscape nature", region: "Tamil Nadu", defaultImg: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Amritsar", query: "golden temple amritsar architecture landscape", region: "Punjab", defaultImg: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Hampi", query: "hampi ruins architecture landscape heritage", region: "Karnataka", defaultImg: "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Kashmir", query: "dal lake srinagar kashmir mountains landscape", region: "Kashmir", defaultImg: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Munnar", query: "munnar tea estate green hills landscape", region: "Kerala", defaultImg: "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Shimla", query: "shimla hill station mountains landscape", region: "Himachal", defaultImg: "https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Coorg", query: "coorg green hills nature landscape", region: "Karnataka", defaultImg: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Andaman", query: "andaman radhanagar beach turquoise sea landscape", region: "Islands", defaultImg: "https://images.pexels.com/photos/1078983/pexels-photo-1078983.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { name: "Meghalaya", query: "meghalaya waterfall nature forest landscape", region: "North East", defaultImg: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=300" }
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
        const initialResults: LocationItem[] = INDIA_LOCATIONS.map((loc, idx) => ({
          id: `loc-${idx}`,
          name: loc.name,
          region: loc.region,
          imageUrl: loc.defaultImg,
        }));

        if (isMounted) {
          setLocations(initialResults);
          setLoading(false);
        }

        // Lazy load dynamic high-res photos without blocking
        const dynamicResults = await Promise.all(
          INDIA_LOCATIONS.map(async (loc, idx) => {
            try {
              const photos = await fetchPexelsImage(loc.query, "landscape");
              const photo = photos[0];
              const imageUrl =
                photo?.src?.medium ||
                photo?.src?.large ||
                photo?.src?.original ||
                loc.defaultImg;

              return {
                id: `loc-${idx}`,
                name: loc.name,
                region: loc.region,
                imageUrl,
              };
            } catch {
              return {
                id: `loc-${idx}`,
                name: loc.name,
                region: loc.region,
                imageUrl: loc.defaultImg,
              };
            }
          })
        );

        if (isMounted) {
          setLocations(dynamicResults);
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
