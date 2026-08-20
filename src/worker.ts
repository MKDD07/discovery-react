export interface Env {
  SERP_API_KEY_1?: string;
  SERP_API_KEY_2?: string;
  VITE_PEXELS_API_KEY?: string;
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Intercept /api/serp requests
    if (url.pathname.startsWith("/api/serp")) {
      const searchParams = new URLSearchParams(url.search);

      // Handle CORS preflight
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
          },
        });
      }

      const key1 = env.SERP_API_KEY_1;
      const key2 = env.SERP_API_KEY_2;
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

      if (keysToTry.length === 0) {
        return new Response(
          JSON.stringify({ error: "No SerpApi keys configured on Cloudflare Worker" }),
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
              "User-Agent": "Discovery-Convoy-Cloudflare-Worker/1.0",
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
          console.warn(`Worker SerpApi key failed with status ${response.status}`);
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
    }

    // 2. Serve static React assets from /dist
    return env.ASSETS.fetch(request);
  },
};
