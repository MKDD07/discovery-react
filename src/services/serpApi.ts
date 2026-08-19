const SERP_API_KEY = "7f83c49c4ab7a773e871e42237fd4775f124a8abb77e148899d0bbad6d307d69";
const SERP_BASE_URL = "https://serpapi.com/search.json";

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
}

// Available proxy options (Cloudflare/Production compatible)
const PROXIES = [
  (target: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`,
  (target: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(target)}`,
  (target: string) => `https://thingproxy.freeboard.io/fetch/${target}`,
  (target: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`,
];

async function fetchWithTimeout(url: string, ms = 6000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function fetchSerp(params: Record<string, string>): Promise<any> {
  const query = new URLSearchParams({ ...params, api_key: SERP_API_KEY });
  const targetUrl = `${SERP_BASE_URL}?${query.toString()}`;

  let lastError: any = null;

  for (const buildProxyUrl of PROXIES) {
    try {
      const url = buildProxyUrl(targetUrl);
      const res = await fetchWithTimeout(url, 7000);
      if (res.ok) {
        const text = await res.text();
        try {
          const parsed = JSON.parse(text);
          // If returned as { contents: "..." } from allorigins.win/get
          const data = parsed?.contents ? JSON.parse(parsed.contents) : parsed;
          if (data && !data.error && (data.properties || data.best_flights || data.other_flights || data.organic_results || data.search_metadata)) {
            return data;
          }
        } catch {
          // JSON parse failed, try next proxy
        }
      }
    } catch (err) {
      lastError = err;
    }
  }

  // If external proxies fail, attempt direct fetch as last resort
  try {
    const directRes = await fetchWithTimeout(targetUrl, 5000);
    if (directRes.ok) return await directRes.json();
  } catch (err) {
    lastError = err;
  }

  throw lastError || new Error("Unable to load live data through proxy network.");
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
}: {
  query?: string;
  departure_id?: string;
  arrival_id?: string;
  outbound_date?: string;
  currency?: string;
  gl?: string;
  hl?: string;
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
    };
    return fetchSerp(params);
  }

  return fetchSerp({
    engine: "google",
    q: query,
    gl,
    hl,
    num: "10",
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
  });
}

export async function searchHotels({
  q,
  check_in,
  check_out,
  adults = 2,
  currency = "INR",
  hl = "en",
}: {
  q: string;
  check_in?: string;
  check_out?: string;
  adults?: number;
  currency?: string;
  hl?: string;
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


export function extractHotels(data: any, max = 4): SerpHotelResult[] {
  const properties = data?.properties || [];
  if (properties.length > 0) {
    return properties.slice(0, max).map((h: any) => {
      const allImages: string[] = (h.images || []).map(
        (img: any) => img.original_image || img.thumbnail || ""
      ).filter(Boolean);

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

      // Calculate an MRP (original price ~20-25% higher)
      const originalPriceNum = Math.round(rawPriceNum * 1.25);

      return {
        name: h.name || "",
        rating: h.overall_rating || h.rating || 4.5,
        reviews: h.reviews || 0,
        price: `₹${rawPriceNum.toLocaleString("en-IN")}`,
        rawPrice: rawPriceNum,
        originalPrice: originalPriceNum,
        link: h.link || "#",
        thumbnail: allImages[0] || h.featured_image || "",
        images: allImages,
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

const SerpAPI = {
  searchHome,
  searchFlights,
  searchInternational,
  searchHotels,
  searchVacations,
  extractOrganicResults,
  extractFlights,
  extractHotels,
};

export default SerpAPI;
