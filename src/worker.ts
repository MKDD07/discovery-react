export interface Env {
  SERP_API_KEY_1?: string;
  SERP_API_KEY_2?: string;
  VITE_PEXELS_API_KEY?: string;
  SESSION_SECRET?: string;
  DB?: any; // Cloudflare D1 Database binding
  USERS_KV?: any; // Cloudflare KV binding
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

// ── Web Crypto PBKDF2 Password Hashing ─────────────────────────────
async function hashPassword(password: string, saltB64?: string): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();
  const salt = saltB64
    ? Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0))
    : crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const hashB64 = btoa(String.fromCharCode(...new Uint8Array(bits)));
  const saltOut = btoa(String.fromCharCode(...salt));
  return { hash: hashB64, salt: saltOut };
}

async function verifyPassword(password: string, saltB64: string, hashB64: string): Promise<boolean> {
  const { hash } = await hashPassword(password, saltB64);
  return hash === hashB64;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // ── 1. Intercept /api/register & /api/signup requests ────────────────
    if (url.pathname === "/api/register" || url.pathname === "/api/signup") {
      // Handle CORS preflight
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        });
      }

      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }

      try {
        const body = (await request.json()) as {
          name?: string;
          email?: string;
          password?: string;
        };

        const { name, email, password } = body;

        if (!email || !password) {
          return new Response(
            JSON.stringify({ error: "Email and password are required" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            }
          );
        }

        if (password.length < 6) {
          return new Response(
            JSON.stringify({ error: "Password must be at least 6 characters" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            }
          );
        }

        const normalizedEmail = email.trim().toLowerCase();
        const userName = name ? name.trim() : null;
        const { hash, salt } = await hashPassword(password);
        const now = Date.now();
        let createdUserId: string | number = `usr_${now}_${Math.random().toString(36).substr(2, 6)}`;

        // A. If Cloudflare D1 Database is bound as env.DB (matching register/schema.sql)
        if (env?.DB) {
          try {
            await env.DB.prepare(
              `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                name TEXT,
                password_hash TEXT NOT NULL,
                password_salt TEXT NOT NULL,
                created_at INTEGER NOT NULL
              )`
            ).run();

            const existing = await env.DB.prepare(
              `SELECT id FROM users WHERE email = ?`
            )
              .bind(normalizedEmail)
              .first();

            if (existing) {
              return new Response(
                JSON.stringify({ error: "Email already registered. Please sign in." }),
                {
                  status: 409,
                  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                }
              );
            }

            const insertResult = await env.DB.prepare(
              `INSERT INTO users (email, name, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?, ?)`
            )
              .bind(normalizedEmail, userName, hash, salt, now)
              .run();

            if (insertResult?.meta?.last_row_id) {
              createdUserId = insertResult.meta.last_row_id;
            }
          } catch (dbErr: any) {
            console.error("Cloudflare D1 Error:", dbErr);
            if (dbErr?.message?.includes("UNIQUE constraint failed")) {
              return new Response(
                JSON.stringify({ error: "Email already registered. Please sign in." }),
                {
                  status: 409,
                  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                }
              );
            }
          }
        }

        // B. If Cloudflare KV is bound as env.USERS_KV
        if (env?.USERS_KV) {
          await env.USERS_KV.put(
            `user:${normalizedEmail}`,
            JSON.stringify({ id: createdUserId, name: userName, email: normalizedEmail, hash, salt, createdAt: now })
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: "Account registered successfully!",
            user: { id: createdUserId, name: userName, email: normalizedEmail },
          }),
          {
            status: 201,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: err.message || "Failed to process registration" }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
    }

    // ── 2. Intercept /api/login requests ────────────────────────────────
    if (url.pathname === "/api/login") {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        });
      }

      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }

      try {
        const body = (await request.json()) as { email?: string; password?: string };
        const { email, password } = body;

        if (!email || !password) {
          return new Response(
            JSON.stringify({ error: "Email and password are required" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            }
          );
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check D1
        if (env?.DB) {
          const user = await env.DB.prepare(
            `SELECT id, email, name, password_hash, password_salt FROM users WHERE email = ?`
          )
            .bind(normalizedEmail)
            .first();

          if (!user) {
            return new Response(JSON.stringify({ error: "Invalid email or password" }), {
              status: 401,
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            });
          }

          const isValid = await verifyPassword(password, user.password_salt, user.password_hash);
          if (!isValid) {
            return new Response(JSON.stringify({ error: "Invalid email or password" }), {
              status: 401,
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            });
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: "Login successful",
              user: { id: user.id, email: user.email, name: user.name },
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            }
          );
        }

        // Mock / KV fallback
        return new Response(
          JSON.stringify({
            success: true,
            message: "Login successful",
            user: { email: normalizedEmail },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: err.message || "Failed to process login" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          }
        );
      }
    }

    // ── 3. Intercept /api/serp requests ────────────────────────────────
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

      const key1 = env?.SERP_API_KEY_1;
      const key2 = env?.SERP_API_KEY_2;
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

      // Fallback to client key or default key
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

    // ── 4. Serve static React assets from /dist ────────────────────────
    return env.ASSETS.fetch(request);
  },
};
