// Cloudflare Pages Function: /api/serp
// Proxies requests to SerpApi with sequential fallback across key 1 -> 2 -> 3 -> 4 -> 5.
// If any key is exhausted or errors, it immediately falls back to the next key in the array.

interface Env {
  SERP_API_KEY_1?: string;
  SERP_API_KEY_2?: string;
  SERP_API_KEY_3?: string;
  SERP_API_KEY_4?: string;
  SERP_API_KEY_5?: string;
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

  const clientKey = searchParams.get("api_key");
  searchParams.delete("slot");
  searchParams.delete("api_key");

  const DEFAULT_KEY = "7f83c49c4ab7a773e871e42237fd4775f124a8abb77e148899d0bbad6d307d69";

  // Build sequential key array: KEY_1 -> KEY_2 -> KEY_3 -> KEY_4 -> KEY_5 -> clientKey -> DEFAULT_KEY
  const rawKeys = [
    context.env?.SERP_API_KEY_1,
    context.env?.SERP_API_KEY_2,
    context.env?.SERP_API_KEY_3,
    context.env?.SERP_API_KEY_4,
    context.env?.SERP_API_KEY_5,
    clientKey,
    DEFAULT_KEY,
  ];

  // Deduplicate and filter out empty keys
  const keysToTry: string[] = [];
  for (const k of rawKeys) {
    if (k && k.trim() && !keysToTry.includes(k.trim())) {
      keysToTry.push(k.trim());
    }
  }

  let lastStatus = 502;
  let lastErrorText = "All SerpApi keys exhausted or failed";

  // Try each key in sequence: if exhausted/fails, use next
  for (let i = 0; i < keysToTry.length; i++) {
    const apiKey = keysToTry[i];
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
      console.warn(`SerpApi key #${i + 1} exhausted/failed with status ${response.status}. Trying next key in array...`);
    } catch (err: any) {
      lastErrorText = err.message || "Failed to fetch from SerpApi";
      console.warn(`SerpApi key #${i + 1} network error. Trying next key in array...`, err);
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