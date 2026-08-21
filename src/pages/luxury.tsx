import React, { useState, useEffect } from "react";
import Header from "../components/sections/header/Header";
import Footer from "../components/sections/footer/Footer";
import {
  Crown,
  Sparkles,
  ShieldCheck,
  Gem,
  Tag,
  Star,
  MapPin,
  ChevronRight,
  ArrowRight,
  Compass,
  Building2,
  Heart,
  Quote,
  CheckCircle,
  Clock,
  PhoneCall,
  SlidersHorizontal,
  Flame,
  Loader2,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { searchHotels, resizeImage } from "../services/serpApi";
import { fetchPexelsVideo, pickVideoUrl } from "../components/sections/pexels/PexelsMediaSection";
import SEO from "../components/snippets/seo/SEO";

interface LuxuryPageProps {
  onBackHome?: () => void;
  onSelectTour?: (tour: {
    name: string;
    location: string;
    price?: string;
    originalPrice?: number;
    initialHotel?: any;
  }) => void;
}

/* ── Luxe Themes Data ────────────────────────────────────────────────── */
const LUXE_THEMES = [
  {
    id: "contemporary-heavens",
    title: "Contemporary Heavens",
    subtitle: "Modern architectural masterworks & infinity pools",
    count: "45+ Stays",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
    slug: "contemporary",
  },
  {
    id: "hilly-hideaways",
    title: "Hilly Hideaways",
    subtitle: "Misty mountain estates & alpine retreats",
    count: "38+ Stays",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
    slug: "hilly",
  },
  {
    id: "nature-getaways",
    title: "Nature Getaways",
    subtitle: "Untouched forest lodges & safari sanctuaries",
    count: "29+ Stays",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    slug: "nature",
  },
  {
    id: "beachside-escapes",
    title: "Beachside Escapes",
    subtitle: "Private beachfront villas & turquoise lagoons",
    count: "52+ Stays",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
    slug: "beachside",
  },
  {
    id: "vintage-stays",
    title: "Vintage & Royal Palaces",
    subtitle: "Centuries-old royal forts & heritage suites",
    count: "24+ Stays",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80",
    slug: "vintage",
  },
  {
    id: "wellness-wonderlands",
    title: "Wellness Wonderlands",
    subtitle: "Holistic ayurveda spas & rejuvenating havens",
    count: "20+ Stays",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    slug: "wellness",
  },
];

/* ── Luxury Brands Data (Official MMT Luxe CDN Logos) ─────────────────── */
const MMT_LUXE_IMG_BASE = "https://promos.makemytrip.com/Hotels_product/Luxe/mmtLuxeDT/images/";

const LUXURY_BRANDS = [
  {
    name: "Taj Hotels, Resorts & Palaces",
    shortName: "Taj Hotels",
    properties: "50+ Properties",
    tagline: "Quintessential Indian Hospitality",
    logoUrl: `${MMT_LUXE_IMG_BASE}logo_taj.jpeg`,
  },
  {
    name: "Marriott Hotels & Resorts",
    shortName: "Marriott Luxury",
    properties: "40+ Properties",
    tagline: "World-Class Refinement & St. Regis",
    logoUrl: `${MMT_LUXE_IMG_BASE}Marriott-Hotels-Resorts-logo.png`,
  },
  {
    name: "The Leela",
    shortName: "The Leela",
    properties: "10+ Properties",
    tagline: "Pure Indian Luxury & Opulence",
    logoUrl: `${MMT_LUXE_IMG_BASE}Leela-Logo.png`,
  },
  {
    name: "The Oberoi Group",
    shortName: "The Oberoi",
    properties: "10+ Properties",
    tagline: "Unrivalled Service Excellence",
    logoUrl: `${MMT_LUXE_IMG_BASE}logo_oberoi.jpeg`,
  },
  {
    name: "Hyatt",
    shortName: "Hyatt",
    properties: "10+ Properties",
    tagline: "Distinctive Designs & Gourmet Dining",
    logoUrl: `${MMT_LUXE_IMG_BASE}logo_hyatt.jpeg`,
  },
  {
    name: "ITC Hotels",
    shortName: "ITC Hotels",
    properties: "10+ Properties",
    tagline: "Responsible Luxury & Grand Palaces",
    logoUrl: `${MMT_LUXE_IMG_BASE}logo_itc.jpeg`,
  },
  {
    name: "Radisson Hotels",
    shortName: "Radisson",
    properties: "10+ Properties",
    tagline: "Contemporary Elegance & Iconic Vibe",
    logoUrl: `${MMT_LUXE_IMG_BASE}RH-Radisson-Hotel.png`,
  },
  {
    name: "Mayfair Group",
    shortName: "Mayfair Group",
    properties: "5+ Properties",
    tagline: "Lagoon & Forest Luxury Escapes",
    logoUrl: `${MMT_LUXE_IMG_BASE}Mayfair-Group.jpg`,
  },
  {
    name: "CGH Earth",
    shortName: "CGH Earth",
    properties: "5+ Properties",
    tagline: "Eco-Conscious Heritage Luxury",
    logoUrl: `${MMT_LUXE_IMG_BASE}cgh-earth.png`,
  },
  {
    name: "Hilton",
    shortName: "Hilton",
    properties: "5+ Properties",
    tagline: "Timeless Hospitality Across Globe",
    logoUrl: `${MMT_LUXE_IMG_BASE}logo_hilton.png`,
  },
  {
    name: "Welcomhotel",
    shortName: "Welcomhotel",
    properties: "5+ Properties",
    tagline: "Enriched Experiences of India",
    logoUrl: `${MMT_LUXE_IMG_BASE}welcom-hotel.png`,
  },
  {
    name: "Postcard Hotels and Resorts",
    shortName: "Postcard Hotels",
    properties: "5+ Properties",
    tagline: "Intimate Boutique Hideaways",
    logoUrl: `${MMT_LUXE_IMG_BASE}The-Postcard-Logo.png`,
  },
  {
    name: "RAAS Group",
    shortName: "RAAS Group",
    properties: "4 Units",
    tagline: "Iconic Haveli & Heritage Forts",
    logoUrl: `${MMT_LUXE_IMG_BASE}raas-logo.png`,
  },
  {
    name: "MRS Group",
    shortName: "MRS Group",
    properties: "4 Units",
    tagline: "Suryagarh & Narendra Bhawan",
    logoUrl: `${MMT_LUXE_IMG_BASE}mrs-group.png`,
  },
  {
    name: "IHG Hotels",
    shortName: "IHG Hotels",
    properties: "4 Units",
    tagline: "InterContinental & Luxury Stays",
    logoUrl: `${MMT_LUXE_IMG_BASE}ihg-logo.png`,
  },
  {
    name: "The Lalit Groups",
    shortName: "The Lalit",
    properties: "4 Units",
    tagline: "Traditionally Luxurious Palaces",
    logoUrl: `${MMT_LUXE_IMG_BASE}logo_lalit.jpeg`,
  },
  {
    name: "Accor Hotels",
    shortName: "Accor Hotels",
    properties: "4 Units",
    tagline: "Raffles & Fairmont Heritage",
    logoUrl: `${MMT_LUXE_IMG_BASE}accor.jpg`,
  },
  {
    name: "Niraamaya Hotels",
    shortName: "Niraamaya",
    properties: "3 Units",
    tagline: "Transformative Ayurveda Retreats",
    logoUrl: `${MMT_LUXE_IMG_BASE}niraamya-logo.png`,
  },
  {
    name: "Brij Hotels",
    shortName: "Brij Hotels",
    properties: "4 Units",
    tagline: "Immersive Cultural Sanctuaries",
    logoUrl: `${MMT_LUXE_IMG_BASE}Brij-Logo.png`,
  },
  {
    name: "Evolve Back",
    shortName: "Evolve Back",
    properties: "3 Units",
    tagline: "Untamed Luxury in Nature",
    logoUrl: `${MMT_LUXE_IMG_BASE}evolve-back-logo.png`,
  },
  {
    name: "House of Rohet",
    shortName: "House of Rohet",
    properties: "3 Units",
    tagline: "Equestrian & Wilderness Havens",
    logoUrl: `${MMT_LUXE_IMG_BASE}house-of-rohet.png`,
  },
  {
    name: "Spice Tree Hotels",
    shortName: "Spice Tree",
    properties: "3 Units",
    tagline: "Tranquil Plantation Paradises",
    logoUrl: `${MMT_LUXE_IMG_BASE}spice-tree.png`,
  },
];

/* ── Most Loved Luxe Stays ───────────────────────────────────────────── */
const MOST_LOVED_PROPERTIES = [
  {
    id: "oberoi-bengaluru",
    name: "The Oberoi, Bengaluru",
    city: "Bangalore",
    rating: 4.9,
    reviews: 1420,
    price: "₹24,500",
    originalPrice: 32000,
    image: "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/flyfish/raw/NH75164323389430/QS1042/QS1042-Q1/1715244362742.jpeg",
    reviewQuote: "You feel in the midst of serene nature in the heart of Bengaluru. The garden balcony view and bespoke butler service are truly world-class.",
    tags: ["Signature Butler", "Tropical Gardens", "Fine Dining"],
  },
  {
    id: "imperial-new-delhi",
    name: "The Imperial New Delhi",
    city: "New Delhi",
    rating: 4.9,
    reviews: 1850,
    price: "₹28,000",
    originalPrice: 36000,
    image: "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/201711151432357205-b7ecd48626df11eeb4b30a58a9feac02.jpg",
    reviewQuote: "Iconic colonial heritage blended with unparalleled royal treatment. The staff's willingness to personalize every moment is magnificent.",
    tags: ["Heritage Palace", "Art Museum", "High Tea"],
  },
  {
    id: "ronil-goa-hyatt",
    name: "Ronil Goa - A JdV by Hyatt Hotel",
    city: "Goa",
    rating: 4.8,
    reviews: 940,
    price: "₹18,500",
    originalPrice: 25000,
    image: "https://r1imghtlak.mmtcdn.com/e9bb6a86-10e2-46d0-8104-00d61af32f39.jpg",
    reviewQuote: "Fabulous stay! The energetic pool vibe, signature cocktails, and personalized concierge made our coastal getaway unforgettable.",
    tags: ["Beachside", "Boutique Vibe", "Private Cabanas"],
  },
  {
    id: "leela-palace-udaipur",
    name: "The Leela Palace Udaipur",
    city: "Udaipur",
    rating: 5.0,
    reviews: 2100,
    price: "₹42,000",
    originalPrice: 55000,
    image: "https://r1imghtlak.mmtcdn.com/97ba66706e6e11e48f70daf4768ad8d9.jfif",
    reviewQuote: "Surrounded by Lake Pichola on 3 sides with private royal boat arrival. Truly a fairy-tale palace experience beyond imagination.",
    tags: ["Lake Pichola", "Royal Boat Arrival", "Spa by ESPA"],
  },
  {
    id: "stok-palace-heritage",
    name: "Stok Palace Heritage",
    city: "Leh, Ladakh",
    rating: 4.8,
    reviews: 580,
    price: "₹34,000",
    originalPrice: 44000,
    image: "https://r1imghtlak.mmtcdn.com/1e735c52d68311eba5ea0242ac110002.jpg",
    reviewQuote: "Stayed in the royal family's castle with breathtaking Himalayan valley vistas and authentic gourmet Ladakhi royal cuisine.",
    tags: ["Royal Fortress", "Himalayan Views", "Bespoke Tours"],
  },
  {
    id: "itc-royal-bengal",
    name: "ITC Royal Bengal - Luxury Collection",
    city: "Kolkata",
    rating: 4.9,
    reviews: 1680,
    price: "₹19,500",
    originalPrice: 27000,
    image: "https://r1imghtlak.mmtcdn.com/84d1258e0f0811ec89360a58a9feac02.jpg",
    reviewQuote: "Grand palatial architecture, magnificent culinary excellence, and impeccable attention to detail across every department.",
    tags: ["Responsible Luxury", "Grand Ballroom", "Gourmet Dining"],
  },
];

/* ── Top 10 Ranked New to Luxe ───────────────────────────────────────── */
const TOP_10_PICKS = [
  {
    rank: 1,
    name: "The St. Regis Goa Resort",
    city: "Goa",
    rating: 4.9,
    price: "₹36,000",
    image: "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/200805261514037199-5e12c77e-f35c-424e-af9c-7fad14a40999.jpg",
  },
  {
    rank: 2,
    name: "Araiya Palampur",
    city: "Palampur, Himachal",
    rating: 4.8,
    price: "₹16,500",
    image: "https://r1imghtlak.mmtcdn.com/78eb0774-e14b-4e6a-af9e-d9b7a5f9fba8.jpg",
  },
  {
    rank: 3,
    name: "Bookmark Manali",
    city: "Manali",
    rating: 4.9,
    price: "₹18,000",
    image: "https://r1imghtlak.mmtcdn.com/e03d8d46053711ee8c420a58a9feac02.jpg",
  },
  {
    rank: 4,
    name: "Modi Yoga Retreat",
    city: "Rishikesh",
    rating: 4.8,
    price: "₹22,000",
    image: "https://r1imghtlak.mmtcdn.com/1a3ba2dcc2af11ee87fb0a58a9feac02.jpeg",
  },
  {
    rank: 5,
    name: "Anantam Resort and Spa",
    city: "Kasauli",
    rating: 4.7,
    price: "₹15,000",
    image: "https://r1imghtlak.mmtcdn.com/3028d42ac66011eeb50e0a58a9feac02.jfif",
  },
  {
    rank: 6,
    name: "Brunton Boatyard, CGH Earth",
    city: "Cochin, Kerala",
    rating: 4.9,
    price: "₹21,000",
    image: "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/flyfish/raw/NH72171226221990/QS1042/QS1042-Q1/1664701470360.jpeg",
  },
  {
    rank: 7,
    name: "Taj Sawai, Ranthambore",
    city: "Sawai Madhopur",
    rating: 4.9,
    price: "₹29,000",
    image: "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/202009222310068413-74cee60d-b9f9-49de-b259-d1ee509a1867.jpg",
  },
  {
    rank: 8,
    name: "Taj Cidade de Goa Horizon",
    city: "Goa",
    rating: 4.9,
    price: "₹23,000",
    image: "https://r1imghtlak.mmtcdn.com/23a3163e46ad11ea88970242ac110009.jpg",
  },
  {
    rank: 9,
    name: "J Wild Resort, Jawai",
    city: "Sheoganj, Rajasthan",
    rating: 4.8,
    price: "₹26,000",
    image: "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/202311131433387657-719a7006ac7c11eea99b0a58a9feac02.jpg",
  },
  {
    rank: 10,
    name: "Taj The Trees Mumbai",
    city: "Mumbai",
    rating: 4.9,
    price: "₹21,500",
    image: "https://r1imghtlak.mmtcdn.com/d5c841584be111ee8c1e0a58a9feac02.jpg",
  },
];

/* ── Luxe Destinations Data ──────────────────────────────────────────── */
const LUXE_DESTINATIONS = [
  { name: "Maldives", count: "25+ Properties", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&q=80" },
  { name: "Goa", count: "20+ Properties", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80" },
  { name: "Delhi & NCR", count: "18+ Properties", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80" },
  { name: "Dubai", count: "30+ Properties", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80" },
  { name: "Mumbai", count: "16+ Properties", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80" },
  { name: "Jaipur", count: "14+ Properties", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80" },
  { name: "Bengaluru", count: "12+ Properties", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80" },
  { name: "Coorg", count: "10+ Properties", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80" },
  { name: "Udaipur", count: "12+ Properties", image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=400&q=80" },
  { name: "Kolkata", count: "8+ Properties", image: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=400&q=80" },
  { name: "Kabini", count: "6+ Properties", image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=400&q=80" },
  { name: "Alleppey", count: "8+ Properties", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80" },
];

export const LuxuryPage: React.FC<LuxuryPageProps> = ({
  onBackHome,
  onSelectTour,
}) => {
  const [luxeProperties, setLuxeProperties] = useState<any[]>(MOST_LOVED_PROPERTIES);
  const [isLoadingLuxe, setIsLoadingLuxe] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadSerpLuxeHotels() {
      setIsLoadingLuxe(true);
      try {
        const data = await searchHotels({
          q: "5 star luxury palace resort hotels India",
          slot: "1",
        });
        if (data?.properties && data.properties.length > 0 && isMounted) {
          const mapped = data.properties.slice(0, 6).map((h: any, idx: number) => {
            const defaultFallback = MOST_LOVED_PROPERTIES[idx % MOST_LOVED_PROPERTIES.length];
            const imgUrl = h.thumbnail || (h.images && h.images[0]?.thumbnail) || defaultFallback.image;
            let rawPriceNum = 24500;
            if (h.rate_per_night?.extracted_lowest) {
              rawPriceNum = h.rate_per_night.extracted_lowest;
            } else if (h.rate_per_night?.extracted_before_taxes_fees) {
              rawPriceNum = h.rate_per_night.extracted_before_taxes_fees;
            } else if (typeof h.rate_per_night?.lowest === "number") {
              rawPriceNum = h.rate_per_night.lowest;
            }

            const formattedPrice = `₹${rawPriceNum.toLocaleString("en-IN")}`;
            const tagsList = h.amenities && h.amenities.length > 0
              ? h.amenities.slice(0, 3)
              : defaultFallback.tags;

            return {
              id: `serp-luxe-${idx}`,
              name: h.name || defaultFallback.name,
              city: defaultFallback.city,
              rating: h.overall_rating || h.rating || 4.9,
              reviews: h.reviews || 1420 + idx * 110,
              price: formattedPrice,
              originalPrice: Math.round(rawPriceNum * 1.25),
              image: imgUrl,
              reviewQuote: defaultFallback.reviewQuote,
              tags: tagsList,
              serpHotel: h,
            };
          });
          setLuxeProperties(mapped);
        }
      } catch (e) {
        console.warn("SerpAPI luxury hotels fetch error:", e);
      } finally {
        if (isMounted) setIsLoadingLuxe(false);
      }
    }

    loadSerpLuxeHotels();
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePropertyClick = (property: {
    name: string;
    city: string;
    price: string;
    image: string;
    serpHotel?: any;
  }) => {
    if (onSelectTour) {
      onSelectTour({
        name: property.name,
        location: property.city,
        price: property.price,
        initialHotel: property.serpHotel || {
          name: property.name,
          thumbnail: property.image,
          images: [property.image],
          price: property.price,
        },
      });
    } else {
      const tourUrl = `/tour/${encodeURIComponent(property.name)}?loc=${encodeURIComponent(property.city)}&price=${encodeURIComponent(property.price)}`;
      window.history.pushState({}, "", tourUrl);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  const LUXURY_HOTEL_VIDEOS = [
    {
      url: "https://player.vimeo.com/external/434045526.hd.mp4?s=c27ee38f0c740006c26f7b15a440182479e0a09e&profile_id=175",
      poster: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1000",
      title: "Royal Infinity Villa & Palatial Pool",
    },
    {
      url: "https://player.vimeo.com/external/371837092.hd.mp4?s=d11c0f0d2c0b022ad0518ff7ab8d313d42c3c6f2&profile_id=175",
      poster: "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1000",
      title: "Palatial 5-Star Heritage Sanctuary",
    },
    {
      url: "https://player.vimeo.com/external/517090025.hd.mp4?s=6c2a11bf3f295b9c037920786cf81f4405a76ca2&profile_id=175",
      poster: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1000",
      title: "Presidential Luxury Suite & Ocean Deck",
    },
    {
      url: "https://player.vimeo.com/external/394331825.hd.mp4?s=ca0e3cb20a4bb334208a0ebc948e64c39832aa60&profile_id=175",
      poster: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1000",
      title: "Private Tropical Haven & Serenity Lagoon",
    },
  ];

  const [videoList, setVideoList] = useState<{ url: string; poster: string; title: string }[]>(LUXURY_HOTEL_VIDEOS);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(() =>
    Math.floor(Math.random() * LUXURY_HOTEL_VIDEOS.length)
  );

  useEffect(() => {
    let isMounted = true;

    // Fetch dynamic luxury hotel & resort videos from Pexels
    fetchPexelsVideo("luxury 5 star hotel resort swimming pool villa room", "landscape")
      .then((videos) => {
        if (!isMounted || !videos || videos.length === 0) return;
        const formatted = videos
          .map((v: any, index: number) => {
            const bestUrl =
              pickVideoUrl(v, "hd") ||
              pickVideoUrl(v, "medium") ||
              (v.video_files && v.video_files[0]?.link);
            const hotelTitles = [
              "Royal Infinity Villa & Palatial Pool",
              "Palatial 5-Star Heritage Sanctuary",
              "Presidential Luxury Suite & Ocean Deck",
              "Private Tropical Haven & Serenity Lagoon",
              "Bespoke Butler Penthouse Retreat",
              "Private Cliffside Villa & Sunset Vista",
            ];
            return {
              url: bestUrl,
              poster: v.image || "",
              title: hotelTitles[index % hotelTitles.length],
            };
          })
          .filter((v: any) => Boolean(v.url));

        if (formatted.length > 0) {
          setVideoList(formatted);
          setCurrentVideoIndex(Math.floor(Math.random() * formatted.length));
        }
      })
      .catch((err) => {
        console.warn("LuxuryPage: Failed to load Pexels luxury videos, using curated list", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleVideoEnded = () => {
    // When video ends, pick next random video towards luxury hotels (no single loop)
    if (videoList.length > 1) {
      let nextIndex = Math.floor(Math.random() * videoList.length);
      while (nextIndex === currentVideoIndex) {
        nextIndex = Math.floor(Math.random() * videoList.length);
      }
      setCurrentVideoIndex(nextIndex);
    } else {
      setCurrentVideoIndex((prev) => (prev + 1) % videoList.length);
    }
  };

  const activeVideo = videoList[currentVideoIndex] || LUXURY_HOTEL_VIDEOS[0];

  const navigateToCollection = (themeId: string) => {
    window.history.pushState({}, "", `/collection/${themeId}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="discovery-luxe-page bg-light-luxury">
      <SEO
        title="Luxe Selections | 5-Star Palaces, Villas & Luxury Resorts"
        description="Immerse in unparalleled luxury with Discovery Convoy's handpicked 5-star heritage palaces, private pool villas, overwater suites, and bespoke concierge experiences."
        keywords={["luxury palaces", "5-star luxury hotels", "private pool villas", "overwater suites", "Discovery Convoy Luxe", "bespoke luxury retreats"]}
        url="https://discoveryconvoy.com/luxury"
      />
      <Header />

      {/* ── 1. Hero Luxury Showcase Banner ─────────────────────────────────── */}
      <section className="tp-luxe-hero-area p-relative">
        <div className="tp-luxe-hero-bg-overlay"></div>
        <div className="container p-relative z-index-2">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className="tp-luxe-hero-content">
                <div className="tp-luxe-badge mb-15">
                  <Crown size={15} />
                  <span>DISCOVERY CONVOY SIGNATURE</span>
                </div>
                <h1 className="tp-luxe-hero-title mb-20">
                  Discovery Luxe <span className="text-gold-gradient">Selections</span>
                </h1>
                <p className="tp-luxe-hero-subtitle mb-30">
                  Escape to the epitome of ultra-luxury in our handpicked palatial stays, private villas, and iconic resorts packed with dedicated butler services, private pools, and bespoke experiences.
                </p>

                {/* Quick Anchor Link */}
                <div className="tp-luxe-hero-actions d-flex flex-wrap gap-3 mb-35">
                  <button
                    type="button"
                    className="tp-luxe-btn-gold"
                    onClick={() => scrollToSection("themes")}
                  >
                    <Compass size={16} /> Explore By Themes
                  </button>
                </div>

                {/* Trust Stats */}
                <div className="tp-luxe-stats-strip d-flex gap-4 pt-20">
                  <div>
                    <h4 className="tp-luxe-stat-num">250+</h4>
                    <span className="tp-luxe-stat-lbl">Ultra-Luxe Stays</span>
                  </div>
                  <div className="tp-luxe-stat-divdr"></div>
                  <div>
                    <h4 className="tp-luxe-stat-num">100%</h4>
                    <span className="tp-luxe-stat-lbl">Handpicked Vetted</span>
                  </div>
                  <div className="tp-luxe-stat-divdr"></div>
                  <div>
                    <h4 className="tp-luxe-stat-num">24/7</h4>
                    <span className="tp-luxe-stat-lbl">Dedicated Concierge</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Video / Visual Card */}
            <div className="col-lg-6">
              <div className="tp-luxe-video-showcase">
                <div className="tp-luxe-video-wrapper">
                  <video
                    key={activeVideo.url}
                    muted
                    autoPlay
                    playsInline
                    onEnded={handleVideoEnded}
                    poster={activeVideo.poster}
                    className="tp-luxe-video-player"
                    style={{
                      width: "100%",
                      height: "380px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  >
                    <source src={activeVideo.url} type="video/mp4" />
                  </video>
                  <div className="tp-luxe-video-overlay">
                    <div className="tp-luxe-video-tag">
                      <Sparkles size={14} className="text-gold" />
                      <span>Signature Luxury Selection</span>
                    </div>
                    <h3 className="tp-luxe-video-caption">
                      {activeVideo.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Why Choose Luxe Properties ─────────────────────────────────── */}
      <section className="tp-luxe-why-area py-60">
        <div className="container">
          <div className="text-center mb-45">
            <span className="tp-luxe-section-sub">THE DISCOVERY PROMISE</span>
            <h2 className="tp-luxe-section-title">Why Choose Luxe Properties?</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="tp-luxe-why-card">
                <div className="tp-luxe-why-icon">
                  <Crown size={28} />
                </div>
                <h4 className="tp-luxe-why-title">Handpicked Ultra-Premium Properties</h4>
                <p className="tp-luxe-why-desc">
                  Every villa, fort, and private island is strictly audited for superior architecture, scenic locations, and palatial comfort.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="tp-luxe-why-card">
                <div className="tp-luxe-why-icon">
                  <Gem size={28} />
                </div>
                <h4 className="tp-luxe-why-title">Extraordinary Signature Amenities</h4>
                <p className="tp-luxe-why-desc">
                  Enjoy private heated infinity pools, personal butlers, bespoke chef dining, helipad arrivals, and tailored excursions.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="tp-luxe-why-card">
                <div className="tp-luxe-why-icon">
                  <Tag size={28} />
                </div>
                <h4 className="tp-luxe-why-title">Unmatched Privileges & Offers</h4>
                <p className="tp-luxe-why-desc">
                  Complimentary suite upgrades, gourmet breakfast spreads, spa dining credits, and round-the-clock priority assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Discover by Themes ─────────────────────────────────────────── */}
      <section className="tp-luxe-themes-area py-60" id="themes">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between mb-40 flex-wrap gap-3">
            <div>
              <span className="tp-luxe-section-sub">CURATED COLLECTIONS</span>
              <h2 className="tp-luxe-section-title">Discover By Themes</h2>
            </div>
            <p className="tp-luxe-section-desc max-w-450">
              Immerse yourself in themes designed for your distinct mood — from misty Himalayan estates to royal palaces.
            </p>
          </div>

          <div className="row g-4">
            {LUXE_THEMES.map((theme) => (
              <div key={theme.id} className="col-lg-4 col-md-6">
                <div
                  className="tp-luxe-theme-card cursor-pointer"
                  onClick={() => navigateToCollection(theme.id)}
                >
                  <div className="tp-luxe-theme-img-wrap">
                    <img
                      src={resizeImage(theme.image, 600)}
                      alt={theme.title}
                      loading="lazy"
                    />
                    <span className="tp-luxe-theme-count">{theme.count}</span>
                  </div>
                  <div className="tp-luxe-theme-body">
                    <h4 className="tp-luxe-theme-title">{theme.title}</h4>
                    <p className="tp-luxe-theme-sub">{theme.subtitle}</p>
                    <span className="tp-luxe-theme-link">
                      Explore Selection <ChevronRight size={15} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Luxury Brands Showcase with Swiper & Autoplay ─────────────── */}
      <section className="tp-luxe-brands-area py-60" id="brands">
        <div className="container">
          <div className="text-center mb-45">
            <span className="tp-luxe-section-sub">THE WORLD'S FINEST HOSPITALITY</span>
            <h2 className="tp-luxe-section-title">Luxury Brands</h2>
            <p className="tp-luxe-section-desc mx-auto text-center max-w-600">
              Select from prestigious hospitality houses known globally for timeless architecture and legendary service.
            </p>
          </div>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={18}
            slidesPerView={2}
            loop={true}
            autoplay={{
              delay: 2400,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              576: { slidesPerView: 3, spaceBetween: 16 },
              768: { slidesPerView: 4, spaceBetween: 18 },
              992: { slidesPerView: 5, spaceBetween: 20 },
              1200: { slidesPerView: 6, spaceBetween: 20 },
            }}
            className="tp-luxe-brands-swiper"
          >
            {LUXURY_BRANDS.map((brand, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className="tp-luxe-brand-card cursor-pointer text-center"
                  onClick={() => scrollToSection("guestloved")}
                >
                  <div className="tp-luxe-brand-img-wrapper mb-15">
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="tp-luxe-brand-logo-img"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="tp-luxe-brand-name mb-1">{brand.name}</h4>
                  <p className="tp-luxe-brand-props mb-0">{brand.properties}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ── 5. Most Loved Luxe Properties (SerpAPI Key Integrated) ─────────── */}
      <section className="tp-luxe-loved-area py-60" id="guestloved">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between mb-40 flex-wrap gap-3">
            <div>
              <span className="tp-luxe-section-sub">HIGHEST RATED EXPERIENCES</span>
              <h2 className="tp-luxe-section-title">Most Loved Luxe Properties</h2>
            </div>
            <div className="d-flex align-items-center gap-2">
              {isLoadingLuxe && (
                <span className="tp-luxe-pill d-inline-flex align-items-center gap-1">
                  <Loader2 size={13} className="spin-animation" /> Live SerpAPI Rates
                </span>
              )}
              <span className="tp-luxe-verified-tag">
                <CheckCircle size={15} /> 100% Verified Guest Reviews
              </span>
            </div>
          </div>

          <div className="row g-4">
            {luxeProperties.map((prop) => (
              <div key={prop.id} className="col-lg-4 col-md-6">
                <div className="tp-luxe-prop-card">
                  <div className="tp-luxe-prop-img-wrap">
                    <img
                      src={resizeImage(prop.image, 600)}
                      alt={prop.name}
                      loading="lazy"
                    />
                    <div className="tp-luxe-prop-top-meta">
                      <span className="tp-luxe-prop-city">
                        <MapPin size={12} /> {prop.city}
                      </span>
                      <span className="tp-luxe-prop-rating">
                        <Star size={12} fill="#ffb703" color="#ffb703" /> {prop.rating} ({prop.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="tp-luxe-prop-body">
                    <h4 className="tp-luxe-prop-title">{prop.name}</h4>

                    {/* Tag Pills */}
                    <div className="d-flex flex-wrap gap-1 mb-15">
                      {(prop.tags || []).map((t: string, ti: number) => (
                        <span key={ti} className="tp-luxe-pill">{t}</span>
                      ))}
                    </div>

                    {/* Review Snippet */}
                    <div className="tp-luxe-review-box mb-20">
                      <Quote size={14} className="tp-luxe-quote-icon" />
                      <p className="tp-luxe-review-text">{prop.reviewQuote}</p>
                    </div>

                    <div className="tp-luxe-prop-footer d-flex align-items-center justify-content-between pt-15">
                      <div>
                        <span className="tp-luxe-price-lbl">Starting from</span>
                        <div className="tp-luxe-price-val">
                          {prop.price} <span className="tp-luxe-price-sub">/night</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="tp-luxe-book-btn"
                        onClick={() => handlePropertyClick(prop)}
                      >
                        View Property
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Discover by Destination ───────────────────────────────────── */}
      <section className="tp-luxe-dest-area py-60" id="destinations">
        <div className="container">
          <div className="text-center mb-45">
            <span className="tp-luxe-section-sub">TOP LOCATIONS</span>
            <h2 className="tp-luxe-section-title">Discover By Destination</h2>
          </div>

          <div className="row g-3">
            {LUXE_DESTINATIONS.map((dest, i) => (
              <div key={i} className="col-xl-3 col-lg-4 col-md-6 col-6">
                <div
                  className="tp-luxe-dest-card cursor-pointer"
                  onClick={() => scrollToSection("guestloved")}
                >
                  <img
                    src={resizeImage(dest.image, 400)}
                    alt={dest.name}
                    loading="lazy"
                  />
                  <div className="tp-luxe-dest-overlay">
                    <h5 className="tp-luxe-dest-name">{dest.name}</h5>
                    <span className="tp-luxe-dest-count">{dest.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. New to Luxe Selection / Top 10 Picks ───────────────────────── */}
      <section className="tp-luxe-top10-area py-60" id="toppicks">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between mb-40 flex-wrap gap-3">
            <div>
              <span className="tp-luxe-section-sub">TRENDING NOW</span>
              <h2 className="tp-luxe-section-title">New to Luxe Selection</h2>
            </div>
            <span className="tp-luxe-pill-gold">
              <Flame size={14} /> Top 10 Curated Stays
            </span>
          </div>

          <div className="row g-3">
            {TOP_10_PICKS.map((pick) => (
              <div key={pick.rank} className="col-xl-6 col-12">
                <div
                  className="tp-luxe-top-item d-flex align-items-center gap-3 cursor-pointer"
                  onClick={() => handlePropertyClick(pick)}
                >
                  <div className="tp-luxe-rank-badge">
                    <span>#{pick.rank}</span>
                  </div>
                  <div className="tp-luxe-top-thumb">
                    <img
                      src={resizeImage(pick.image, 300)}
                      alt={pick.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="tp-luxe-top-info flex-1">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="tp-luxe-top-rating">
                        <Star size={11} fill="#ffb703" color="#ffb703" /> {pick.rating}
                      </span>
                      <span className="tp-luxe-top-loc">
                        <MapPin size={11} /> {pick.city}
                      </span>
                    </div>
                    <h5 className="tp-luxe-top-name mb-1">{pick.name}</h5>
                    <span className="tp-luxe-top-price">From {pick.price} /night</span>
                  </div>
                  <div className="tp-luxe-top-action">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Offers & Privileges ────────────────────────────────────────── */}
      <section className="tp-luxe-offers-area py-60" id="offers">
        <div className="container">
          <div className="text-center mb-45">
            <span className="tp-luxe-section-sub">EXCLUSIVE BENEFITS</span>
            <h2 className="tp-luxe-section-title">Luxe Offers & Privileges</h2>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="tp-luxe-offer-card">
                <div className="tp-luxe-offer-top">
                  <span className="tp-luxe-offer-discount">FLAT 15% OFF</span>
                  <span className="tp-luxe-offer-badge">MEMBERS ONLY</span>
                </div>
                <h4 className="tp-luxe-offer-title">Instant Savings on Select Palaces</h4>
                <div className="tp-luxe-coupon-box">
                  <span>USE CODE:</span>
                  <strong>DISCOVERYLUXE</strong>
                </div>
                <p className="tp-luxe-offer-sub">*Applicable on Taj, Oberoi & Leela stays over 2 nights.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="tp-luxe-offer-card">
                <div className="tp-luxe-offer-top">
                  <span className="tp-luxe-offer-discount">₹10,000 SPA CREDIT</span>
                  <span className="tp-luxe-offer-badge">WELLNESS</span>
                </div>
                <h4 className="tp-luxe-offer-title">Complimentary Ayurvedic Healing</h4>
                <div className="tp-luxe-coupon-box">
                  <span>USE CODE:</span>
                  <strong>LUXESPA</strong>
                </div>
                <p className="tp-luxe-offer-sub">*Valid on select resort spas and holistic wellness packages.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="tp-luxe-offer-card">
                <div className="tp-luxe-offer-top">
                  <span className="tp-luxe-offer-discount">VIP UPGRADE</span>
                  <span className="tp-luxe-offer-badge">BESPOKE</span>
                </div>
                <h4 className="tp-luxe-offer-title">Complimentary Chauffeur & High Tea</h4>
                <div className="tp-luxe-coupon-box">
                  <span>USE CODE:</span>
                  <strong>ROYALPRIVILEGE</strong>
                </div>
                <p className="tp-luxe-offer-sub">*Includes airport luxury transfers and royal welcoming rituals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Final CTA Banner ────────────────────────────────────────────── */}
      <section className="tp-luxe-cta-area py-60">
        <div className="container">
          <div className="tp-luxe-cta-card text-center p-relative">
            <Crown size={36} className="text-gold mb-15 mx-auto" />
            <h2 className="tp-luxe-cta-title mb-15">
              Still Can’t Make Up Your Mind?
            </h2>
            <p className="tp-luxe-cta-subtitle mb-30 mx-auto max-w-600">
              Speak directly with our Private Luxe Travel Specialists to curate your customized itinerary, private jet charter, and royal villa reservations.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button
                type="button"
                className="tp-luxe-btn-gold"
                onClick={() => scrollToSection("guestloved")}
              >
                View All Discovery Luxe Properties
              </button>
              <a
                href="/contact"
                className="tp-luxe-btn-outline d-inline-flex align-items-center gap-2 text-decoration-none"
              >
                <PhoneCall size={16} /> Contact Luxe Concierge
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LuxuryPage;
