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

  const key1 = context.env.SERP_API_KEY_1;
  const key2 = context.env.SERP_API_KEY_2;

  // Which key this section should try first (default: key1)
  const slot = searchParams.get("slot");
  searchParams.delete("slot"); // never forward this to SerpApi
  searchParams.delete("api_key"); // never trust a client-supplied key

  const keysToTry: string[] = [];
  if (slot === "2" && key2) {
    keysToTry.push(key2);
    if (key1) keysToTry.push(key1);
  } else {
    if (key1) keysToTry.push(key1);
    if (key2) keysToTry.push(key2);
  }

  if (keysToTry.length === 0) {
    return new Response(
      JSON.stringify({ error: "No SerpApi keys configured on server" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
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