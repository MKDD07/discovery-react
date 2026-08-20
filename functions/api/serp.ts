// Cloudflare Pages Function: /api/serp
// Proxies requests to SerpApi, keeping keys server-side, with CORS headers.
//
// Usage from frontend:
//   /api/serp?engine=google_hotels&...&slot=1   -> uses SERP_API_KEY_1 first
//   /api/serp?engine=google_flights&...&slot=2  -> uses SERP_API_KEY_2 first
// This spreads quota across keys per-section instead of all sections
// racing for the same key. Each slot still falls back to the other key
// if its primary is exhausted or errors.

interface Env {
  SERP_API_KEY_1?: string;
  SERP_API_KEY_2?: string;
}

interface PagesContext<T = Env> {
  request: Request;
  env: T;
  params?: Record<string, string | string[]>;
  waitUntil?: (promise: Promise<any>) => void;
  next?: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data?: Record<string, unknown>;
}

export const onRequest = async (context: PagesContext<Env>): Promise<Response> => {
  const url = new URL(context.request.url);
  const searchParams = new URLSearchParams(url.search);

  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  const key1 = context.env?.SERP_API_KEY_1;
  const key2 = context.env?.SERP_API_KEY_2;
  const clientKey = searchParams.get("api_key");
  const slot = searchParams.get("slot");
  searchParams.delete("slot");
  searchParams.delete("api_key");

  const keysToTry: string[] = [];
  if (slot === "2" && key2) {
    keysToTry.push(key2);
    if (key1) keysToTry.push(key1);
  } else {
    if (key1) keysToTry.push(key1);
    if (key2) keysToTry.push(key2);
  }

  // Fallback to client key or default key if env vars are missing
  if (clientKey && !keysToTry.includes(clientKey)) {
    keysToTry.push(clientKey);
  }
  const DEFAULT_KEY = "7f83c49c4ab7a773e871e42237fd4775f124a8abb77e148899d0bbad6d307d69";
  if (!keysToTry.includes(DEFAULT_KEY)) {
    keysToTry.push(DEFAULT_KEY);
  }

  let lastStatus = 502;
  let lastErrorText = "All SerpApi keys failed";

  for (const apiKey of keysToTry) {
    searchParams.set("api_key", apiKey);
    const targetUrl = `https://serpapi.com/search.json?${searchParams.toString()}`;

    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "Discovery-Convoy-Cloudflare-Proxy/1.0",
        },
      });

      if (response.ok) {
        const data = await response.text();
        return new Response(data, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=1800",
          },
        });
      }

      lastStatus = response.status;
      lastErrorText = await response.text();
      console.warn(`SerpApi key failed with status ${response.status}, trying next key if available.`);
    } catch (err: any) {
      lastErrorText = err.message || "Failed to fetch from SerpApi";
    }
  }

  return new Response(lastErrorText, {
    status: lastStatus,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};