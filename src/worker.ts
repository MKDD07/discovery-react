export interface Env {
  SERP_API_KEY_1?: string;
  SERP_API_KEY_2?: string;
  VITE_PEXELS_API_KEY?: string;
  GROQ_API_KEY?: string;
  SESSION_SECRET?: string;
  DB?: any; // Cloudflare D1 Database binding (Users)
  BLOGS_DB?: any; // Cloudflare D1 Database binding (Blogs: b15e9273-0279-42e7-b909-5cee71b871c0)
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

    // Common CORS helper
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // ── 1. Intercept /api/register & /api/signup requests ────────────────
    if (url.pathname === "/api/register" || url.pathname === "/api/signup") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json", ...corsHeaders },
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
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        if (password.length < 6) {
          return new Response(
            JSON.stringify({ error: "Password must be at least 6 characters" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
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
                { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
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
                { status: 409, headers: { "Content-Type": "application/json", ...corsHeaders } }
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
          { status: 201, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: err.message || "Failed to process registration" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // ── 2. Intercept /api/login requests ────────────────────────────────
    if (url.pathname === "/api/login") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      try {
        const body = (await request.json()) as { email?: string; password?: string };
        const { email, password } = body;

        if (!email || !password) {
          return new Response(
            JSON.stringify({ error: "Email and password are required" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
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
              headers: { "Content-Type": "application/json", ...corsHeaders },
            });
          }

          const isValid = await verifyPassword(password, user.password_salt, user.password_hash);
          if (!isValid) {
            return new Response(JSON.stringify({ error: "Invalid email or password" }), {
              status: 401,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            });
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: "Login successful",
              user: { id: user.id, email: user.email, name: user.name },
            }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Mock / KV fallback
        return new Response(
          JSON.stringify({
            success: true,
            message: "Login successful",
            user: { email: normalizedEmail },
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: err.message || "Failed to process login" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // ── 3. Intercept /api/blogs (List & Query Specific Blog by Slug) ──
    if (url.pathname.startsWith("/api/blogs")) {
      const slug = url.searchParams.get("slug");
      const category = url.searchParams.get("category");
      const location = url.searchParams.get("location");

      const blogsDb = env?.BLOGS_DB || env?.DB;

      // Ensure blogs table exists
      if (blogsDb) {
        try {
          await blogsDb.prepare(
            `CREATE TABLE IF NOT EXISTS blogs (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              slug TEXT UNIQUE NOT NULL,
              title TEXT NOT NULL,
              category TEXT NOT NULL,
              location TEXT,
              author TEXT DEFAULT 'Admin',
              author_role TEXT DEFAULT 'Travel Specialist',
              author_avatar TEXT,
              cover_query TEXT,
              summary TEXT,
              content_json TEXT NOT NULL,
              faqs_json TEXT,
              tags TEXT,
              created_at INTEGER NOT NULL,
              updated_at INTEGER NOT NULL
            )`
          ).run();
        } catch (e) {
          console.error("D1 blogs table init error:", e);
        }
      }

      // GET Blog(s)
      if (request.method === "GET") {
        if (blogsDb) {
          try {
            if (slug) {
              const blog = await blogsDb.prepare(
                `SELECT * FROM blogs WHERE slug = ?`
              )
                .bind(slug)
                .first();

              if (!blog) {
                return new Response(JSON.stringify({ error: "Blog not found" }), {
                  status: 404,
                  headers: { "Content-Type": "application/json", ...corsHeaders },
                });
              }

              return new Response(
                JSON.stringify({
                  success: true,
                  blog: {
                    ...blog,
                    content: JSON.parse(blog.content_json || "[]"),
                    faqs: JSON.parse(blog.faqs_json || "[]"),
                  },
                }),
                { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
              );
            }

            // List all blogs with optional filtering
            let query = `SELECT id, slug, title, category, location, author, author_role, cover_query, summary, tags, created_at FROM blogs`;
            const params: any[] = [];

            if (category) {
              query += ` WHERE category = ?`;
              params.push(category);
            } else if (location) {
              query += ` WHERE location LIKE ?`;
              params.push(`%${location}%`);
            }

            query += ` ORDER BY created_at DESC LIMIT 50`;

            const stmt = blogsDb.prepare(query);
            const res = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();

            return new Response(
              JSON.stringify({ success: true, blogs: res.results || [] }),
              { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          } catch (dbErr: any) {
            return new Response(
              JSON.stringify({ error: dbErr.message || "Failed to fetch blogs from D1" }),
              { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }
        }

        return new Response(
          JSON.stringify({ success: true, blogs: [] }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // POST create/save blog
      if (request.method === "POST") {
        try {
          const body = (await request.json()) as any;
          const {
            slug: rawSlug,
            title,
            category,
            location,
            author,
            author_role,
            cover_query,
            summary,
            content,
            faqs,
            tags,
          } = body;

          if (!title) {
            return new Response(
              JSON.stringify({ error: "Blog title is required" }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }

          const blogSlug =
            rawSlug ||
            title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");

          const now = Date.now();
          const contentJson = JSON.stringify(content || []);
          const faqsJson = JSON.stringify(faqs || []);

          if (blogsDb) {
            await blogsDb.prepare(
              `INSERT INTO blogs (slug, title, category, location, author, author_role, cover_query, summary, content_json, faqs_json, tags, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(slug) DO UPDATE SET
                 title=excluded.title,
                 category=excluded.category,
                 location=excluded.location,
                 cover_query=excluded.cover_query,
                 summary=excluded.summary,
                 content_json=excluded.content_json,
                 faqs_json=excluded.faqs_json,
                 tags=excluded.tags,
                 updated_at=excluded.updated_at`
            )
              .bind(
                blogSlug,
                title,
                category || "Adventure",
                location || null,
                author || "Admin",
                author_role || "Travel Specialist",
                cover_query || `${title} travel 4k landscape`,
                summary || "",
                contentJson,
                faqsJson,
                tags || "",
                now,
                now
              )
              .run();
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: "Blog post saved successfully!",
              slug: blogSlug,
            }),
            { status: 201, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({ error: err.message || "Failed to save blog post" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }
    }

    // ── 4. Intercept /api/generate-blog (Groq AI Auto-Generation) ──────
    if (url.pathname === "/api/generate-blog") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      try {
        const body = (await request.json()) as {
          topic?: string;
          category?: string;
          location?: string;
          apiKey?: string;
        };

        const { topic, category, location, apiKey: clientApiKey } = body;

        if (!topic) {
          return new Response(
            JSON.stringify({ error: "Topic / Subject is required for AI generation" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const groqKey = clientApiKey || env?.GROQ_API_KEY;
        if (!groqKey) {
          return new Response(
            JSON.stringify({ error: "Groq API Key is missing. Please provide GROQ_API_KEY." }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const systemPrompt = `You are a professional travel writer and SEO content creator for Discovery Convoy.
Generate a comprehensive, engaging, highly structured travel blog post in valid JSON format only (no markdown quotes outside JSON).

Return a JSON object with the following schema:
{
  "title": "Compelling, catchy headline",
  "category": "${category || "Adventure"}",
  "location": "${location || "India"}",
  "cover_query": "Specific 3-5 word Pexels query for main cover image",
  "summary": "2-sentence engaging summary",
  "sections": [
    {
      "heading": "Section sub-heading",
      "paragraphs": ["Paragraph 1 text...", "Paragraph 2 text..."],
      "pexelsQuery": "3-5 word specific visual query for pexels image (e.g. 'goa beach sunset cocktail')",
      "highlights": ["Key highlight or tip 1", "Key highlight or tip 2"]
    }
  ],
  "quote": {
    "text": "Inspirational traveler quote about this place",
    "author": "Local Guide or Author Name"
  },
  "faqs": [
    {
      "question": "Clear common traveler question?",
      "answer": "Concise, helpful answer with actionable advice."
    }
  ],
  "tags": "tag1, tag2, tag3, tag4"
}

Constraints:
- Include 4 to 8 detailed sections with up to 10 unique, descriptive pexels queries total.
- Include 5 to 10 comprehensive FAQs.
- Format all text engagingly with natural travel guidance.`;

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Write a full travel article about: ${topic}. Location: ${location || "Global"}.` },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
          }),
        });

        if (!groqResponse.ok) {
          const errText = await groqResponse.text();
          return new Response(
            JSON.stringify({ error: `Groq API error: ${errText}` }),
            { status: groqResponse.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const groqData = (await groqResponse.json()) as any;
        const generatedContent = JSON.parse(groqData.choices[0].message.content);

        return new Response(
          JSON.stringify({ success: true, data: generatedContent }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: err.message || "Failed to generate blog with Groq" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // ── 5. Intercept /api/serp requests ────────────────────────────────
    if (url.pathname.startsWith("/api/serp")) {
      const searchParams = new URLSearchParams(url.search);

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
        } catch (err: any) {
          lastErrorText = err.message || "Failed to fetch from SerpApi";
        }
      }

      return new Response(lastErrorText, {
        status: lastStatus,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // ── 6. Serve static React assets from /dist ────────────────────────
    return env.ASSETS.fetch(request);
  },
};
