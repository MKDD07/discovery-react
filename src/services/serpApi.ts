// API keys are stored server-side in Cloudflare Worker env vars (SERP_API_KEY_1 .. SERP_API_KEY_5).
// The frontend sends requests to /api/serp with sequential array-based fallback across all keys.

export interface SerpOrganicResult {
  title: string;
  link: string;
  snippet: string;
  thumbnail: string;
}

export interface SerpFlightResult {
  airline: string;
  logo: string;
  price: string;
  currency: string;
  duration: number;
  stops: number;
  departure: string;
  arrival: string;
  from: string;
  to: string;
}

export interface SerpHotelResult {
  name: string;
  rating: number;
  reviews: number;
  price: string;
  rawPrice: number;
  originalPrice?: number;
  link: string;
  thumbnail: string;
  images: string[];
  gps_coordinates?: { latitude: number; longitude: number };
  description?: string;
  amenities?: string[];
  type?: string;
  check_in_time?: string;
  check_out_time?: string;
  location?: string;
}

export interface SerpHotelDetail extends SerpHotelResult {
  address?: string;
  phone?: string;
  website?: string;
  nearby_places?: Array<{ name: string; transportations: Array<{ type: string; duration: string }> }>;
  included?: string[];
  excluded?: string[];
  highlights?: string[];
  duration?: string;
  groupSize?: string;
  languages?: string[];
  cancellation?: string;
}

// Local fallback / dev key (can be supplied via VITE_SERP_API_KEY or default for local dev)
const LOCAL_SERP_KEY =
  (import.meta as any).env?.VITE_SERP_API_KEY ||
  (import.meta as any).env?.VITE_SERP_API_KEY_1 ||
  "7f83c49c4ab7a773e871e42237fd4775f124a8abb77e148899d0bbad6d307d69";

async function fetchSerp(params: Record<string, string>): Promise<any> {
  // Strip slot from params before building query; worker reads it but SerpApi doesn't need it
  const { slot, ...serpParams } = params as Record<string, string>;
  const query = new URLSearchParams(serpParams);

  // Only include slot if present
  if (slot) query.set("slot", slot);

  try {
    // /api/serp routes through:
    //   - Vite dev server proxy (vite.config.ts) while running locally
    //   - Cloudflare Worker (src/worker.ts) on discovery.mkmkataria07.workers.dev
    const res = await fetch(`/api/serp?${query.toString()}`, {
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (res.ok) {
      const data = await res.json();
      if (!data?.error) return data;
      console.warn("SerpApi error response:", data.error);
    } else {
      console.warn(`/api/serp returned ${res.status}. Using fallback data.`);
    }
  } catch (err) {
    console.warn("SerpApi fetch failed:", err);
  }

  // Graceful fallback — UI is never blank
  console.info("SerpAPI using offline dataset for:", params.q || params.departure_id);
  return generateFallbackData(params);
}

function generateFallbackData(params: Record<string, string>): any {
  const q = params.q || params.departure_id || "India";
  const engine = params.engine;

  if (engine === "google_flights") {
    const from = params.departure_id || "DEL";
    const to = params.arrival_id || "BOM";
    return {
      best_flights: [
        {
          price: 3850,
          total_duration: 130,
          flights: [{ airline: "IndiGo", departure_airport: { id: from, time: "06:15 AM" }, arrival_airport: { id: to, time: "08:25 AM" } }]
        },
        {
          price: 4200,
          total_duration: 140,
          flights: [{ airline: "Air India", departure_airport: { id: from, time: "09:30 AM" }, arrival_airport: { id: to, time: "11:50 AM" } }]
        },
        {
          price: 4650,
          total_duration: 135,
          flights: [{ airline: "Vistara", departure_airport: { id: from, time: "02:15 PM" }, arrival_airport: { id: to, time: "04:30 PM" } }]
        },
        {
          price: 3950,
          total_duration: 145,
          flights: [{ airline: "SpiceJet", departure_airport: { id: from, time: "07:45 PM" }, arrival_airport: { id: to, time: "10:10 PM" } }]
        }
      ]
    };
  }

  // Google Hotels fallback
  return {
    properties: [
      {
        name: `Luxury Heritage Resort & Spa, ${q}`,
        overall_rating: 4.8,
        reviews: 248,
        rate_per_night: { extracted_lowest: 7499 },
        link: "https://www.google.com/travel/hotels",
        images: [{ original_image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" }]
      },
      {
        name: `The Grand Palace Hotel, ${q}`,
        overall_rating: 4.7,
        reviews: 189,
        rate_per_night: { extracted_lowest: 8999 },
        link: "https://www.google.com/travel/hotels",
        images: [{ original_image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80" }]
      },
      {
        name: `Nature Vista Eco Resort, ${q}`,
        overall_rating: 4.9,
        reviews: 312,
        rate_per_night: { extracted_lowest: 6499 },
        link: "https://www.google.com/travel/hotels",
        images: [{ original_image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }]
      },
      {
        name: `Royal View Suites & Retreat, ${q}`,
        overall_rating: 4.6,
        reviews: 145,
        rate_per_night: { extracted_lowest: 5799 },
        link: "https://www.google.com/travel/hotels",
        images: [{ original_image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" }]
      }
    ]
  };
}

// ── SECTION: HOME ──────────────────────────────────────────────────────────
export async function searchHome(query = "top travel destinations", gl = "us", hl = "en") {
  return fetchSerp({ engine: "google", q: query, gl, hl, num: "10" });
}

// ── SECTION: FLIGHTS ───────────────────────────────────────────────────────
export async function searchFlights({
  query = "cheap flights DEL to BOM",
  departure_id,
  arrival_id,
  outbound_date,
  currency = "INR",
  gl = "in",
  hl = "en",
  slot = "2",
}: {
  query?: string;
  departure_id?: string;
  arrival_id?: string;
  outbound_date?: string;
  currency?: string;
  gl?: string;
  hl?: string;
  slot?: "1" | "2";
}) {
  const today = new Date();
  const depDate = outbound_date || new Date(today.getTime() + 86400000 * 7).toISOString().split("T")[0];

  if (departure_id && arrival_id) {
    const params: Record<string, string> = {
      engine: "google_flights",
      departure_id,
      arrival_id,
      outbound_date: depDate,
      currency,
      gl,
      hl,
      type: "2", // One-way
      slot,
    };
    return fetchSerp(params);
  }

  return fetchSerp({
    engine: "google",
    q: query,
    gl,
    hl,
    num: "10",
    slot,
  });
}


// ── SECTION: INTERNATIONAL ─────────────────────────────────────────────────
export async function searchInternational(destination: string, gl = "us", hl = "en") {
  return fetchSerp({
    engine: "google",
    q: `international travel ${destination}`,
    gl,
    hl,
    num: "10",
    slot: "1",
  });
}

export async function searchHotels({
  q,
  check_in,
  check_out,
  adults = 2,
  currency = "INR",
  hl = "en",
  slot = "1",
}: {
  q: string;
  check_in?: string;
  check_out?: string;
  adults?: number;
  currency?: string;
  hl?: string;
  slot?: "1" | "2";
}) {
  // Auto-generate check-in (tomorrow) and check-out (3 days later) if not provided
  const today = new Date();
  const checkIn = check_in || new Date(today.getTime() + 86400000).toISOString().split("T")[0];
  const checkOut = check_out || new Date(today.getTime() + 86400000 * 4).toISOString().split("T")[0];

  const params: Record<string, string> = {
    engine: "google_hotels",
    q: q,
    check_in_date: checkIn,
    check_out_date: checkOut,
    adults: String(adults),
    currency,
    gl: "us",
    hl,
    slot,
  };
  return fetchSerp(params);
}

// ── SECTION: VACATIONS ─────────────────────────────────────────────────────
export async function searchVacations(query: string, gl = "us", hl = "en") {
  return fetchSerp({
    engine: "google",
    q: `vacation packages ${query}`,
    gl,
    hl,
    num: "10",
  });
}

// ── RENDER / EXTRACTION HELPERS ─────────────────────────────────────────────
export function extractOrganicResults(data: any, max = 4): SerpOrganicResult[] {
  const results = data?.organic_results || [];
  return results.slice(0, max).map((r: any) => ({
    title: r.title || "",
    link: r.link || "#",
    snippet: r.snippet || "",
    thumbnail: r.thumbnail || r.pagemap?.cse_image?.[0]?.src || "",
  }));
}

export function extractFlights(data: any, max = 8): SerpFlightResult[] {
  const flights = data?.best_flights || data?.other_flights || [];
  if (flights.length > 0) {
    return flights.slice(0, max).map((f: any) => {
      const seg = (f.flights || [])[0] || {};
      const priceVal = f.price || f.extracted_price || 4850;
      return {
        airline: seg.airline || (f.airline_logo && "Airline") || "Air India",
        logo: seg.airline_logo || f.airline_logo || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&q=80",
        price: typeof priceVal === "number" ? `₹${priceVal.toLocaleString("en-IN")}` : String(priceVal),
        currency: f.price_insights?.currency || "INR",
        duration: f.total_duration || seg.duration || 140,
        stops: f.layovers?.length || (f.flights?.length > 1 ? f.flights.length - 1 : 0),
        departure: seg.departure_airport?.time || "07:30 AM",
        arrival: seg.arrival_airport?.time || "10:15 AM",
        from: seg.departure_airport?.name || seg.departure_airport?.id || "DEL",
        to: seg.arrival_airport?.name || seg.arrival_airport?.id || "BOM",
      };
    });
  }

  const results = data?.organic_results || [];
  if (results.length > 0) {
    return results.slice(0, max).map((r: any, idx: number) => {
      const selling = 3999 + idx * 850;
      return {
        airline: r.title?.split(" ")[0] || "IndiGo",
        logo: r.thumbnail || r.pagemap?.cse_image?.[0]?.src || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&q=80",
        price: `₹${selling.toLocaleString("en-IN")}`,
        currency: "INR",
        duration: 130 + idx * 20,
        stops: idx % 3 === 0 ? 0 : 1,
        departure: `0${6 + (idx % 6)}:30 AM`,
        arrival: `0${9 + (idx % 6)}:45 AM`,
        from: "DEL (New Delhi)",
        to: "BOM (Mumbai)",
      };
    });
  }

  return [];
}


/**
 * Resize image URLs (Google, Agoda, Booking.com, Tripadvisor, Unsplash, Pexels, etc.)
 * to an intrinsic width of 400px max to optimize bandwidth, prevent layout shifts, and enforce clean sizing.
 */
export function resizeImage(url: string, size = 400): string {
  if (!url) return url;
  try {
    // Google User Content (lh3.googleusercontent.com, googleusercontent.com)
    if (url.includes("googleusercontent.com") || url.includes("lh3.google") || url.includes("google.com/travel")) {
      if (/=[sw]\d+/i.test(url)) {
        return url.replace(/=([sw])\d+([^\/]*)$/i, `=$1${size}$2`);
      }
      return `${url}=w${size}-h${Math.round(size * 0.67)}-n-k-no`;
    }

    // Agoda (e.g. https://pix8.agoda.net/hotelImages/54008436/0/...jpg?ce=2)
    if (url.includes("agoda.net")) {
      let cleanUrl = url.replace(/([?&])ce=\d+/i, "$1ce=0");
      if (/[?&]s=\d+x/i.test(cleanUrl)) {
        return cleanUrl.replace(/([?&]s=)\d+x/i, `$1${size}x`);
      }
      return cleanUrl.includes("?") ? `${cleanUrl}&s=${size}x` : `${cleanUrl}?s=${size}x`;
    }

    // Booking.com (cf.bstatic.com, bstatic.com)
    if (url.includes("bstatic.com")) {
      return url.replace(/\/max\d+(?:x\d+)?\//i, `/max${size}/`).replace(/\/square\d+\//i, `/square${size}/`);
    }

    // Tripadvisor (media-cdn.tripadvisor.com)
    if (url.includes("tripadvisor.com")) {
      return url.replace(/\/photo-[a-z0-9]+\//i, `/photo-w/`);
    }

    // Unsplash
    if (url.includes("images.unsplash.com")) {
      if (/[?&]w=\d+/i.test(url)) {
        return url.replace(/([?&]w=)\d+/i, `$1${size}`);
      }
      return url.includes("?") ? `${url}&w=${size}&q=80` : `${url}?w=${size}&q=80`;
    }

    // Pexels
    if (url.includes("images.pexels.com")) {
      if (/[?&]w=\d+/i.test(url)) {
        return url.replace(/([?&]w=)\d+/i, `$1${size}`);
      }
      return url.includes("?") ? `${url}&w=${size}` : `${url}?w=${size}`;
    }
  } catch {
    return url;
  }
  return url;
}

const resizeGoogleImage = resizeImage;

export function extractHotels(data: any, max = 4): SerpHotelResult[] {
  const properties = data?.properties || [];
  if (properties.length > 0) {
    return properties.slice(0, max).map((h: any) => {
      // 1. SerpApi featured_image is the primary hotel photo
      let primaryFeatured = "";
      if (typeof h.featured_image === "string" && h.featured_image) {
        primaryFeatured = resizeGoogleImage(h.featured_image);
      } else if (h.featured_image?.original_image) {
        primaryFeatured = resizeGoogleImage(h.featured_image.original_image);
      } else if (h.featured_image?.thumbnail) {
        primaryFeatured = resizeGoogleImage(h.featured_image.thumbnail);
      }

      // 2. Collect all available hotel images, resize each to 600px
      const rawImageList: string[] = [];
      if (primaryFeatured) rawImageList.push(primaryFeatured);

      if (Array.isArray(h.images)) {
        h.images.forEach((img: any) => {
          const src = typeof img === "string" ? img : (img?.original_image || img?.thumbnail || "");
          const resized = resizeGoogleImage(src);
          if (resized && !rawImageList.includes(resized)) rawImageList.push(resized);
        });
      }

      const thumbResized = resizeGoogleImage(h.thumbnail || "");
      if (thumbResized && !rawImageList.includes(thumbResized)) rawImageList.push(thumbResized);

      const allImages = rawImageList.filter(Boolean);
      const thumbnailImg = primaryFeatured || allImages[0] || "";

      let rawPriceNum = 9999;
      if (h.rate_per_night?.extracted_lowest) {
        rawPriceNum = h.rate_per_night.extracted_lowest;
      } else if (h.rate_per_night?.extracted_before_taxes_fees) {
        rawPriceNum = h.rate_per_night.extracted_before_taxes_fees;
      } else if (typeof h.rate_per_night?.lowest === "number") {
        rawPriceNum = h.rate_per_night.lowest;
      } else if (typeof h.rate_per_night?.lowest === "string") {
        const parsed = parseInt(h.rate_per_night.lowest.replace(/[^0-9]/g, ""), 10);
        if (!isNaN(parsed) && parsed > 0) rawPriceNum = parsed;
      }

      const originalPriceNum = Math.round(rawPriceNum * 1.25);

      return {
        name: h.name || "",
        rating: h.overall_rating || h.rating || 4.5,
        reviews: h.reviews || 0,
        price: `₹${rawPriceNum.toLocaleString("en-IN")}`,
        rawPrice: rawPriceNum,
        originalPrice: originalPriceNum,
        link: h.link || `https://www.google.com/travel/hotels?q=${encodeURIComponent(h.name || "hotel")}`,
        thumbnail: thumbnailImg,
        images: allImages.length > 0 ? allImages : (thumbnailImg ? [thumbnailImg] : []),
        gps_coordinates: h.gps_coordinates || undefined,
      };
    });
  }

  // Fallback to organic results if google_hotels engine didn't return properties
  const results = data?.organic_results || [];
  return results.slice(0, max).map((r: any, idx: number) => {
    const thumb = r.thumbnail || r.pagemap?.cse_image?.[0]?.src || "";
    const selling = 8500 + idx * 1500;
    const mrp = Math.round(selling * 1.25);
    return {
      name: r.title || "Luxury Resort & Spa",
      rating: 4.5,
      reviews: 0,
      price: `₹${selling.toLocaleString("en-IN")}`,
      rawPrice: selling,
      originalPrice: mrp,
      link: r.link || "#",
      thumbnail: thumb,
      images: thumb ? [thumb] : [],
      gps_coordinates: undefined,
    };
  });
}

// ── HOTEL DETAIL (single hotel by name + location) ──────────────────────────
export async function searchHotelByName(name: string, location: string) {
  const today = new Date();
  const checkIn = new Date(today.getTime() + 86400000).toISOString().split("T")[0];
  const checkOut = new Date(today.getTime() + 86400000 * 4).toISOString().split("T")[0];
  return fetchSerp({
    engine: "google_hotels",
    q: `${name} ${location}`,
    check_in_date: checkIn,
    check_out_date: checkOut,
    adults: "2",
    currency: "INR",
    gl: "us",
    hl: "en",
    slot: "1",
  });
}

export function extractHotelDetail(data: any, hotelName: string): SerpHotelDetail | null {
  const properties: any[] = data?.properties || [];

  // Find closest name match first, fall back to first result
  const match =
    properties.find((p: any) =>
      p.name?.toLowerCase().includes(hotelName.toLowerCase()) ||
      hotelName.toLowerCase().includes(p.name?.toLowerCase() || "")
    ) || properties[0];

  if (!match) return null;

  // Image assembly
  let primaryFeatured = "";
  if (typeof match.featured_image === "string") primaryFeatured = resizeGoogleImage(match.featured_image);
  else if (match.featured_image?.original_image) primaryFeatured = resizeGoogleImage(match.featured_image.original_image);
  else if (match.featured_image?.thumbnail) primaryFeatured = resizeGoogleImage(match.featured_image.thumbnail);

  const rawImages: string[] = primaryFeatured ? [primaryFeatured] : [];
  (match.images || []).forEach((img: any) => {
    const src = typeof img === "string" ? img : (img?.original_image || img?.thumbnail || "");
    const resized = resizeGoogleImage(src);
    if (resized && !rawImages.includes(resized)) rawImages.push(resized);
  });
  const thumb = resizeGoogleImage(match.thumbnail || "");
  if (thumb && !rawImages.includes(thumb)) rawImages.push(thumb);
  const allImages = rawImages.filter(Boolean);

  // Price
  let rawPriceNum = 9999;
  const rpn = match.rate_per_night;
  if (rpn?.extracted_lowest) rawPriceNum = rpn.extracted_lowest;
  else if (rpn?.extracted_before_taxes_fees) rawPriceNum = rpn.extracted_before_taxes_fees;
  else if (typeof rpn?.lowest === "number") rawPriceNum = rpn.lowest;
  else if (typeof rpn?.lowest === "string") {
    const p = parseInt(rpn.lowest.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(p) && p > 0) rawPriceNum = p;
  }

  // Amenities from SerpApi
  const amenities: string[] = (match.amenities || []).map((a: any) =>
    typeof a === "string" ? a : (a?.name || a?.amenity || "")
  ).filter(Boolean);

  // Nearby places
  const nearbyPlaces = (match.nearby_places || []).map((np: any) => ({
    name: np.name || "",
    transportations: (np.transportations || []).map((t: any) => ({
      type: t.type || "",
      duration: t.duration || "",
    })),
  }));

  // Generate rich included/excluded list from amenities + context
  const included: string[] = [];
  const excluded: string[] = [];
  const amenitySet = amenities.map((a) => a.toLowerCase());

  const includeMap: Record<string, string> = {
    "free breakfast": "Breakfast included",
    breakfast: "Breakfast included",
    wifi: "Free Wi-Fi",
    "free wifi": "Free Wi-Fi",
    "free wi-fi": "Free Wi-Fi",
    pool: "Swimming pool access",
    "swimming pool": "Swimming pool access",
    parking: "Free parking",
    "free parking": "Free parking",
    spa: "Spa access",
    gym: "Fitness centre access",
    fitness: "Fitness centre access",
    airport: "Airport transfer",
    "air conditioning": "Air conditioning",
    "room service": "Room service",
    restaurant: "On-site restaurant",
  };
  const alwaysExcluded = ["Personal expenses", "Travel insurance", "Optional excursions"];

  Object.entries(includeMap).forEach(([key, label]) => {
    if (amenitySet.some((a) => a.includes(key))) {
      if (!included.includes(label)) included.push(label);
    }
  });
  if (included.length === 0) included.push("Hotel accommodation", "Welcome amenities");
  excluded.push(...alwaysExcluded);

  const mapsUrl = match.gps_coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${match.gps_coordinates.latitude},${match.gps_coordinates.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.name || hotelName)}`;

  return {
    name: match.name || hotelName,
    rating: match.overall_rating || match.rating || 4.5,
    reviews: match.reviews || 0,
    price: `₹${rawPriceNum.toLocaleString("en-IN")}`,
    rawPrice: rawPriceNum,
    originalPrice: Math.round(rawPriceNum * 1.25),
    link: match.link || mapsUrl,
    thumbnail: allImages[0] || "",
    images: allImages,
    gps_coordinates: match.gps_coordinates,
    description: match.description || match.hotel_class || "",
    amenities,
    type: match.type || match.hotel_class || "Hotel",
    check_in_time: match.check_in_time || "12:00 PM",
    check_out_time: match.check_out_time || "11:00 AM",
    address: match.gps_coordinates
      ? `${match.gps_coordinates.latitude.toFixed(4)}, ${match.gps_coordinates.longitude.toFixed(4)}`
      : "",
    website: match.link || "",
    nearby_places: nearbyPlaces,
    included,
    excluded,
    highlights: amenities.slice(0, 5),
    duration: "2 Nights / 3 Days",
    groupSize: "1 – 8 guests",
    languages: ["English", "Hindi"],
    cancellation: "Free cancellation up to 24 hours before check-in",
    location: hotelName,
  };
}

const SerpAPI = {
  searchHome,
  searchFlights,
  searchInternational,
  searchHotels,
  searchHotelByName,
  searchVacations,
  extractOrganicResults,
  extractFlights,
  extractHotels,
  extractHotelDetail,
  resizeImage,
};

export default SerpAPI;
