export interface Env {
  SERP_API_KEY_1?: string;
  SERP_API_KEY_2?: string;
  SERP_API_KEY_3?: string;
  SERP_API_KEY_4?: string;
  SERP_API_KEY_5?: string;
  VITE_PEXELS_API_KEY?: string;
  GROQ_API_KEY?: string;
  OPENAI_API_KEY?: string;
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

// ── Cloudflare D1 Locations Schema & Helpers ────────────────────────
async function ensureLocationsTable(db: any) {
  if (!db) return;
  try {
    await db.prepare(
      `CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        country TEXT,
        state_region TEXT,
        location_type TEXT DEFAULT 'city',
        parent_location TEXT,
        latitude REAL,
        longitude REAL,
        image_url TEXT,
        pexels_query TEXT,
        heading TEXT,
        short_description TEXT,
        seo_title TEXT,
        seo_description TEXT,
        hotel_search_query TEXT,
        currency TEXT DEFAULT 'INR',
        timezone TEXT,
        destination_content TEXT,
        content_status TEXT DEFAULT 'pending',
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ).run();
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(slug)`).run();
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_locations_country ON locations(country)`).run();
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(is_active)`).run();
  } catch (err) {
    console.error("Locations table init error:", err);
  }
}

async function fetchWebSnippets(query: string, env: Env): Promise<string> {
  const DEFAULT_KEY = "7f83c49c4ab7a773e871e42237fd4775f124a8abb77e148899d0bbad6d307d69";
  const rawKeys = [
    env?.SERP_API_KEY_1,
    env?.SERP_API_KEY_2,
    env?.SERP_API_KEY_3,
    env?.SERP_API_KEY_4,
    env?.SERP_API_KEY_5,
    DEFAULT_KEY,
  ];

  const keysToTry: string[] = [];
  for (const k of rawKeys) {
    if (k && k.trim() && !keysToTry.includes(k.trim())) {
      keysToTry.push(k.trim());
    }
  }

  for (let i = 0; i < keysToTry.length; i++) {
    const key = keysToTry[i];
    try {
      const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&engine=google&api_key=${key}`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (res.ok) {
        const data = (await res.json()) as any;
        const snippets: string[] = [];
        if (data.knowledge_graph?.title) {
          snippets.push(`Entity: ${data.knowledge_graph.title} (${data.knowledge_graph.type || ""})`);
        }
        if (data.knowledge_graph?.description) {
          snippets.push(`Overview: ${data.knowledge_graph.description}`);
        }
        if (data.answer_box?.snippet) {
          snippets.push(`Quick Info: ${data.answer_box.snippet}`);
        }
        if (Array.isArray(data.organic_results)) {
          data.organic_results.slice(0, 4).forEach((r: any) => {
            if (r.snippet) snippets.push(`${r.title || ""}: ${r.snippet}`);
          });
        }
        if (snippets.length > 0) {
          return snippets.join("\n").slice(0, 2500);
        }
      }
    } catch (e) {
      console.warn("Serp snippet search error:", e);
    }
  }
  return "";
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

    // ── 0. Dynamic Sitemap Index & Sub-Sitemaps ───────────────────────
    if (url.pathname === "/sitemap.xml") {
      const BASE = "https://discoveryconvoy.com";
      const today = new Date().toISOString().split("T")[0];
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<sitemap>
  <loc>${BASE}/sitemap-pages.xml</loc>
  <lastmod>${today}</lastmod>
</sitemap>
<sitemap>
  <loc>${BASE}/sitemap-blogs.xml</loc>
  <lastmod>${today}</lastmod>
</sitemap>
<sitemap>
  <loc>${BASE}/sitemap-locations.xml</loc>
  <lastmod>${today}</lastmod>
</sitemap>
</sitemapindex>`;

      return new Response(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
          ...corsHeaders,
        },
      });
    }

    if (url.pathname === "/sitemap-pages.xml") {
      const BASE = "https://discoveryconvoy.com";
      const today = new Date().toISOString().split("T")[0];
      const staticUrls = [
        { loc: `${BASE}/`, priority: "1.0", changefreq: "daily" },
        { loc: `${BASE}/destinations`, priority: "0.95", changefreq: "daily" },
        { loc: `${BASE}/luxury`, priority: "0.95", changefreq: "daily" },
        { loc: `${BASE}/blog`, priority: "0.90", changefreq: "daily" },
        { loc: `${BASE}/about`, priority: "0.80", changefreq: "monthly" },
        { loc: `${BASE}/contact`, priority: "0.80", changefreq: "monthly" },
        { loc: `${BASE}/faq`, priority: "0.80", changefreq: "monthly" },
        { loc: `${BASE}/collection/luxury-palaces-villas`, priority: "0.85", changefreq: "weekly" },
        { loc: `${BASE}/collection/honeymoon-getaways`, priority: "0.85", changefreq: "weekly" },
        { loc: `${BASE}/collection/mountain-wilderness-retreats`, priority: "0.85", changefreq: "weekly" },
        { loc: `${BASE}/collection/beachfront-private-islands`, priority: "0.85", changefreq: "weekly" },
        { loc: `${BASE}/collection/heritage-cultural-odysseys`, priority: "0.85", changefreq: "weekly" },
        { loc: `${BASE}/collection/wellness-ayurveda-sanctuaries`, priority: "0.85", changefreq: "weekly" },
        { loc: `${BASE}/collection/safari-wildlife-expeditions`, priority: "0.85", changefreq: "weekly" },
      ];

      const urls = staticUrls
        .map(
          (page) => `
<url>
  <loc>${page.loc}</loc>
  <lastmod>${today}</lastmod>
  <changefreq>${page.changefreq}</changefreq>
  <priority>${page.priority}</priority>
</url>`
        )
        .join("");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

      return new Response(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
          ...corsHeaders,
        },
      });
    }

    if (url.pathname === "/sitemap-blogs.xml") {
      const BASE = "https://discoveryconvoy.com";
      const d1Db = env?.BLOGS_DB || env?.DB;
      const today = new Date().toISOString().split("T")[0];
      let results: any[] = [];

      if (d1Db) {
        try {
          const blogRes = await d1Db
            .prepare("SELECT slug, updated_at FROM blogs ORDER BY updated_at DESC")
            .all();
          results = (blogRes?.results || []) as any[];
        } catch (e) {
          console.warn("D1 blogs sitemap query error:", e);
        }
      }

      const urls = results
        .map((post) => {
          const ts = post.updated_at > 10000000000 ? post.updated_at : post.updated_at * 1000;
          const lastmod = ts ? new Date(ts).toISOString().split("T")[0] : today;
          return `
<url>
  <loc>${BASE}/blog/${post.slug}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.75</priority>
</url>`;
        })
        .join("");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

      return new Response(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
          ...corsHeaders,
        },
      });
    }

    if (url.pathname === "/sitemap-locations.xml") {
      const BASE = "https://discoveryconvoy.com";
      const d1Db = env?.BLOGS_DB || env?.DB;
      const today = new Date().toISOString().split("T")[0];

      const toSafeDate = (val?: string | number | null): string => {
        if (!val) return today;
        try {
          const d = new Date(val);
          if (isNaN(d.getTime())) return today;
          return d.toISOString().split("T")[0];
        } catch {
          return today;
        }
      };

      let results: any[] = [];
      if (d1Db) {
        try {
          const locRes = await d1Db
            .prepare(
              `SELECT slug, updated_at, created_at FROM locations
               WHERE is_active = 1
               ORDER BY updated_at DESC`
            )
            .all();
          results = (locRes?.results || []) as any[];
        } catch (e) {
          console.warn("D1 locations sitemap query error:", e);
        }
      }

      const urls = results
        .filter((loc) => loc && loc.slug)
        .map((loc) => {
          const lastmod = toSafeDate(loc.updated_at || loc.created_at);
          return `
<url>
  <loc>${BASE}/destination/${loc.slug}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.80</priority>
</url>`;
        })
        .join("");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

      return new Response(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
          ...corsHeaders,
        },
      });
    }

    // ── 0.1 Dynamic /robots.txt ─────────────────────────────────────────
    if (url.pathname === "/robots.txt") {
      const BASE = `${url.protocol}//${url.host}`;
      const robotsContent = `# Discovery Convoy - robots.txt
User-agent: *
Allow: /
Allow: /destinations
Allow: /blog
Allow: /blog/*
Allow: /destination/
Allow: /destination/*
Allow: /tour/
Allow: /tour/*
Allow: /luxury
Allow: /collection/
Allow: /collection/*
Allow: /collections/*
Allow: /about
Allow: /contact
Allow: /faq
Allow: /llms.txt

# Disallow private user portals
Disallow: /dashboard
Disallow: /login
Disallow: /register
Disallow: /api/login
Disallow: /api/register
Disallow: /api/signup

# Search Engines & AI Crawlers
User-agent: Googlebot
Allow: /
Allow: /destination/*
Allow: /blog/*

User-agent: Bingbot
Allow: /
Allow: /destination/*
Allow: /blog/*

User-agent: Applebot
Allow: /
Allow: /destination/*

User-agent: GPTBot
Allow: /
Allow: /destination/*
Allow: /blog/*
Allow: /llms.txt

User-agent: Claude-Web
Allow: /
Allow: /destination/*
Allow: /blog/*
Allow: /llms.txt

User-agent: PerplexityBot
Allow: /
Allow: /destination/*
Allow: /blog/*
Allow: /llms.txt

# Sitemaps & LLM documentation
Sitemap: ${BASE}/sitemap.xml
`;
      return new Response(robotsContent, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=86400",
          ...corsHeaders,
        },
      });
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

              let parsedSections: any[] = [];
              try {
                if (typeof blog.content_json === "string") {
                  parsedSections = JSON.parse(blog.content_json || "[]");
                } else if (Array.isArray(blog.content_json)) {
                  parsedSections = blog.content_json;
                }
              } catch (e) {
                console.warn("Failed to parse content_json:", e);
                parsedSections = [];
              }

              let parsedFaqs: any[] = [];
              try {
                if (typeof blog.faqs_json === "string") {
                  parsedFaqs = JSON.parse(blog.faqs_json || "[]");
                } else if (Array.isArray(blog.faqs_json)) {
                  parsedFaqs = blog.faqs_json;
                }
              } catch (e) {
                console.warn("Failed to parse faqs_json:", e);
                parsedFaqs = [];
              }

              return new Response(
                JSON.stringify({
                  success: true,
                  blog: {
                    ...blog,
                    sections: parsedSections,
                    content: parsedSections,
                    faqs: parsedFaqs,
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

            query += ` ORDER BY created_at DESC LIMIT 500`;

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

    // ── 3.5 Intercept /api/locations (CRUD & List Operations) ────────
    if (url.pathname === "/api/locations" || url.pathname.startsWith("/api/locations/")) {
      const locationsDb = env?.BLOGS_DB || env?.DB;
      if (locationsDb) {
        await ensureLocationsTable(locationsDb);
      }

      // Special Sub-route: AI Content Generation for a Location
      if (url.pathname === "/api/locations/generate-ai") {
        if (request.method !== "POST") {
          return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        try {
          const body = (await request.json()) as {
            id?: number;
            name: string;
            slug?: string;
            country?: string;
            state_region?: string;
            useWebSearch?: boolean;
            apiKey?: string;
          };

          const { id, name, slug: providedSlug, country: providedCountry, state_region: providedRegion, useWebSearch = true, apiKey: clientApiKey } = body;

          if (!name || !name.trim()) {
            return new Response(
              JSON.stringify({ error: "Location name is required" }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }

          const apiKey = clientApiKey || env?.OPENAI_API_KEY || env?.GROQ_API_KEY;
          if (!apiKey) {
            return new Response(
              JSON.stringify({ error: "API Key is missing. Please provide your OpenAI or Groq API key." }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }

          // 1. Fetch live web search snippets if enabled
          let webContext = "";
          if (useWebSearch !== false) {
            try {
              const searchQuery = `${name} ${providedCountry || ""} tourism travel facts coordinates best time attractions`;
              webContext = await fetchWebSnippets(searchQuery, env);
            } catch (e) {
              console.warn("Web search lookup failed, continuing with LLM knowledge:", e);
            }
          }

          // 2. Query LLM for complete location dataset
          const isGroq = apiKey.startsWith("gsk_");
          const endpoint = isGroq
            ? "https://api.groq.com/openai/v1/chat/completions"
            : "https://api.openai.com/v1/chat/completions";

          const systemPrompt = `You are a world-class travel database architect & geographer for Discovery Convoy.
Your job is to generate accurate, high-conversion, comprehensive destination and location metadata.

OUTPUT REQUIREMENTS:
- Format: Return ONLY a valid JSON object matching the exact schema below.
- Accuracy: Use real geographical coordinates (latitude, longitude), real country, timezone (e.g. "Asia/Kolkata", "Europe/Paris", "America/New_York"), official currency code (e.g. "INR", "USD", "EUR", "AED", "JPY").
- Heading: Catchy, inspiring 4 to 6 word title (e.g. "Timeless Royalty & Golden Sunsets").
- Short Description: 2-3 vivid sentences describing what makes this destination iconic.
- SEO Title: High-converting meta title strictly under 60 characters (e.g. "Visit Jaipur: Top Forts, Palaces & Travel Guide").
- SEO Description: Meta description strictly between 130 and 155 characters summarizing the best experiences.
- Pexels Query: 3-5 lowercase visual keywords for scenic photos (e.g. "jaipur hawa mahal palace").
- Hotel Search Query: Targeted hotel search query (e.g. "luxury heritage hotels and resorts in jaipur").
- Destination Content: Rich markdown format (approx 300-500 words) containing sections:
  ### Overview & Heritage
  ### Must-Visit Highlights
  ### Best Time To Visit & Climate
  ### Culture, Cuisine & Insider Tips

JSON Schema to strictly output:
{
  "name": "${name.trim()}",
  "slug": "${(providedSlug || name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}",
  "country": "Country Name",
  "state_region": "State / Region / Province",
  "location_type": "city",
  "parent_location": "State or Country",
  "latitude": 26.9124,
  "longitude": 75.7873,
  "image_url": "",
  "pexels_query": "scenic keywords",
  "heading": "4-6 Words Catchy Headline",
  "short_description": "Vivid 2-3 sentence overview...",
  "seo_title": "SEO Title under 60 chars",
  "seo_description": "SEO description between 130-155 characters...",
  "hotel_search_query": "hotels and resorts in ...",
  "currency": "INR",
  "timezone": "Asia/Kolkata",
  "destination_content": "### Overview & Heritage\\n...\\n### Must-Visit Highlights\\n...",
  "content_status": "completed",
  "is_active": 1
}`;

          const userPrompt = `Location Name: "${name}"
${providedCountry ? `Country Hint: "${providedCountry}"` : ""}
${providedRegion ? `Region Hint: "${providedRegion}"` : ""}
${webContext ? `\nLive Web Search Reference Context:\n${webContext}` : ""}

Generate the complete JSON record with accurate coordinates, timezone, currency, rich travel copy, and SEO metadata. Return valid JSON only.`;

          const aiRes = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(
              isGroq
                ? {
                    model: "openai/gpt-oss-120b",
                    messages: [
                      { role: "system", content: systemPrompt },
                      { role: "user", content: userPrompt },
                    ],
                    temperature: 0.7,
                    max_completion_tokens: 3000,
                    top_p: 1,
                    reasoning_effort: "medium",
                  }
                : {
                    model: "gpt-4o",
                    messages: [
                      { role: "system", content: systemPrompt },
                      { role: "user", content: userPrompt },
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.7,
                  }
            ),
          });

          if (!aiRes.ok) {
            const errText = await aiRes.text();
            return new Response(
              JSON.stringify({ error: `AI generation failed (${aiRes.status}): ${errText}` }),
              { status: aiRes.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }

          const aiData = (await aiRes.json()) as any;
          const rawContent = aiData.choices?.[0]?.message?.content || "";

          let parsed: any;
          try {
            const jsonStart = rawContent.indexOf("{");
            const jsonEnd = rawContent.lastIndexOf("}");
            if (jsonStart !== -1 && jsonEnd !== -1) {
              parsed = JSON.parse(rawContent.slice(jsonStart, jsonEnd + 1));
            } else {
              parsed = JSON.parse(rawContent);
            }
          } catch (jsonErr) {
            return new Response(
              JSON.stringify({ error: "Failed to parse AI JSON response", raw: rawContent }),
              { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }

          // Fallback fields ensuring validity
          const finalSlug =
            parsed.slug ||
            name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");

          const record = {
            name: parsed.name || name,
            slug: finalSlug,
            country: parsed.country || providedCountry || "India",
            state_region: parsed.state_region || providedRegion || null,
            location_type: parsed.location_type || "city",
            parent_location: parsed.parent_location || null,
            latitude: typeof parsed.latitude === "number" ? parsed.latitude : parseFloat(parsed.latitude) || null,
            longitude: typeof parsed.longitude === "number" ? parsed.longitude : parseFloat(parsed.longitude) || null,
            image_url: parsed.image_url || null,
            pexels_query: parsed.pexels_query || `${name} travel landscape`,
            heading: parsed.heading || `Discover ${name}`,
            short_description: parsed.short_description || "",
            seo_title: parsed.seo_title || `Explore ${name} - Attractions & Hotels`,
            seo_description: parsed.seo_description || `Plan your luxury trip to ${name}. Discover top landmarks, resorts, and exclusive experiences.`,
            hotel_search_query: parsed.hotel_search_query || `luxury hotels in ${name}`,
            currency: parsed.currency || "INR",
            timezone: parsed.timezone || "Asia/Kolkata",
            destination_content: parsed.destination_content || "",
            content_status: "completed",
            is_active: parsed.is_active ?? 1,
          };

          // Save / Update directly in Cloudflare D1
          if (locationsDb) {
            const now = new Date().toISOString();
            if (id) {
              await locationsDb.prepare(
                `UPDATE locations SET
                  name = ?, slug = ?, country = ?, state_region = ?, location_type = ?, parent_location = ?,
                  latitude = ?, longitude = ?, image_url = ?, pexels_query = ?, heading = ?, short_description = ?,
                  seo_title = ?, seo_description = ?, hotel_search_query = ?, currency = ?, timezone = ?,
                  destination_content = ?, content_status = 'completed', is_active = ?, updated_at = ?
                WHERE id = ?`
              )
                .bind(
                  record.name,
                  record.slug,
                  record.country,
                  record.state_region,
                  record.location_type,
                  record.parent_location,
                  record.latitude,
                  record.longitude,
                  record.image_url,
                  record.pexels_query,
                  record.heading,
                  record.short_description,
                  record.seo_title,
                  record.seo_description,
                  record.hotel_search_query,
                  record.currency,
                  record.timezone,
                  record.destination_content,
                  record.is_active,
                  now,
                  id
                )
                .run();
            } else {
              await locationsDb.prepare(
                `INSERT INTO locations (
                  name, slug, country, state_region, location_type, parent_location, latitude, longitude,
                  image_url, pexels_query, heading, short_description, seo_title, seo_description,
                  hotel_search_query, currency, timezone, destination_content, content_status, is_active, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?, ?)
                ON CONFLICT(slug) DO UPDATE SET
                  name = excluded.name,
                  country = excluded.country,
                  state_region = excluded.state_region,
                  location_type = excluded.location_type,
                  parent_location = excluded.parent_location,
                  latitude = excluded.latitude,
                  longitude = excluded.longitude,
                  pexels_query = excluded.pexels_query,
                  heading = excluded.heading,
                  short_description = excluded.short_description,
                  seo_title = excluded.seo_title,
                  seo_description = excluded.seo_description,
                  hotel_search_query = excluded.hotel_search_query,
                  currency = excluded.currency,
                  timezone = excluded.timezone,
                  destination_content = excluded.destination_content,
                  content_status = 'completed',
                  is_active = excluded.is_active,
                  updated_at = excluded.updated_at`
              )
                .bind(
                  record.name,
                  record.slug,
                  record.country,
                  record.state_region,
                  record.location_type,
                  record.parent_location,
                  record.latitude,
                  record.longitude,
                  record.image_url,
                  record.pexels_query,
                  record.heading,
                  record.short_description,
                  record.seo_title,
                  record.seo_description,
                  record.hotel_search_query,
                  record.currency,
                  record.timezone,
                  record.destination_content,
                  record.is_active,
                  now,
                  now
                )
                .run();
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: `AI enriched content generated for ${record.name}`,
              location: record,
              webSearched: !!webContext,
            }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({ error: err.message || "Failed to generate AI content for location" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }

      // GET: Query & Filter Locations
      if (request.method === "GET") {
        if (!locationsDb) {
          return new Response(
            JSON.stringify({ success: true, locations: [], metrics: { total: 0, completed: 0, pending: 0, active: 0 } }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        try {
          const search = url.searchParams.get("search")?.trim();
          const status = url.searchParams.get("status")?.trim();
          const country = url.searchParams.get("country")?.trim();
          const slug = url.searchParams.get("slug")?.trim();
          const limit = parseInt(url.searchParams.get("limit") || "1000", 10);

          if (slug) {
            const loc = await locationsDb.prepare(`SELECT * FROM locations WHERE slug = ?`).bind(slug).first();
            if (!loc) {
              return new Response(JSON.stringify({ error: "Location not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              });
            }
            return new Response(JSON.stringify({ success: true, location: loc }), {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            });
          }

          let whereClauses: string[] = [];
          let params: any[] = [];

          if (search) {
            whereClauses.push(`(name LIKE ? OR country LIKE ? OR state_region LIKE ? OR heading LIKE ?)`);
            const s = `%${search}%`;
            params.push(s, s, s, s);
          }

          if (status && status !== "all") {
            whereClauses.push(`content_status = ?`);
            params.push(status);
          }

          if (country && country !== "all") {
            whereClauses.push(`country = ?`);
            params.push(country);
          }

          const whereSql = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(" AND ")}` : "";
          const listSql = `SELECT * FROM locations${whereSql} ORDER BY id ASC LIMIT ?`;
          params.push(limit);

          const stmt = locationsDb.prepare(listSql);
          const listRes = await stmt.bind(...params).all();
          const locations = listRes.results || [];

          // Compute quick metrics
          const metricsRes = await locationsDb.prepare(
            `SELECT
              COUNT(*) as total,
              SUM(CASE WHEN content_status = 'completed' THEN 1 ELSE 0 END) as completed,
              SUM(CASE WHEN content_status != 'completed' OR content_status IS NULL THEN 1 ELSE 0 END) as pending,
              SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active
            FROM locations`
          ).first();

          return new Response(
            JSON.stringify({
              success: true,
              locations,
              metrics: {
                total: metricsRes?.total || locations.length,
                completed: metricsRes?.completed || 0,
                pending: metricsRes?.pending || 0,
                active: metricsRes?.active || 0,
              },
            }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } catch (dbErr: any) {
          return new Response(
            JSON.stringify({ error: dbErr.message || "Failed to query locations from D1" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }

      // POST: Insert Single or Bulk Locations
      if (request.method === "POST") {
        if (!locationsDb) {
          return new Response(
            JSON.stringify({ error: "Cloudflare D1 Database binding is not configured." }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        try {
          const body = (await request.json()) as any;
          const items: any[] = Array.isArray(body) ? body : Array.isArray(body.items) ? body.items : [body];
          const now = new Date().toISOString();

          let insertedCount = 0;
          for (const item of items) {
            if (!item.name || !item.name.trim()) continue;

            const name = item.name.trim();
            const slug =
              item.slug ||
              name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            await locationsDb.prepare(
              `INSERT INTO locations (
                name, slug, country, state_region, location_type, parent_location, latitude, longitude,
                image_url, pexels_query, heading, short_description, seo_title, seo_description,
                hotel_search_query, currency, timezone, destination_content, content_status, is_active, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(slug) DO UPDATE SET
                name = excluded.name,
                country = COALESCE(excluded.country, locations.country),
                state_region = COALESCE(excluded.state_region, locations.state_region),
                location_type = COALESCE(excluded.location_type, locations.location_type),
                parent_location = COALESCE(excluded.parent_location, locations.parent_location),
                latitude = COALESCE(excluded.latitude, locations.latitude),
                longitude = COALESCE(excluded.longitude, locations.longitude),
                image_url = COALESCE(excluded.image_url, locations.image_url),
                pexels_query = COALESCE(excluded.pexels_query, locations.pexels_query),
                heading = COALESCE(excluded.heading, locations.heading),
                short_description = COALESCE(excluded.short_description, locations.short_description),
                seo_title = COALESCE(excluded.seo_title, locations.seo_title),
                seo_description = COALESCE(excluded.seo_description, locations.seo_description),
                hotel_search_query = COALESCE(excluded.hotel_search_query, locations.hotel_search_query),
                currency = COALESCE(excluded.currency, locations.currency),
                timezone = COALESCE(excluded.timezone, locations.timezone),
                destination_content = COALESCE(excluded.destination_content, locations.destination_content),
                content_status = COALESCE(excluded.content_status, locations.content_status),
                is_active = COALESCE(excluded.is_active, locations.is_active),
                updated_at = excluded.updated_at`
            )
              .bind(
                name,
                slug,
                item.country || "India",
                item.state_region || null,
                item.location_type || "city",
                item.parent_location || null,
                item.latitude || null,
                item.longitude || null,
                item.image_url || null,
                item.pexels_query || `${name} travel scenery`,
                item.heading || null,
                item.short_description || null,
                item.seo_title || null,
                item.seo_description || null,
                item.hotel_search_query || `luxury hotels in ${name}`,
                item.currency || "INR",
                item.timezone || "Asia/Kolkata",
                item.destination_content || null,
                item.content_status || "pending",
                item.is_active ?? 1,
                now,
                now
              )
              .run();

            insertedCount++;
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: `Successfully saved ${insertedCount} location(s) to D1.`,
              count: insertedCount,
            }),
            { status: 201, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({ error: err.message || "Failed to save location(s)" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }

      // PUT: Update an existing location
      if (request.method === "PUT") {
        if (!locationsDb) {
          return new Response(
            JSON.stringify({ error: "Cloudflare D1 Database binding is not configured." }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        try {
          const body = (await request.json()) as any;
          const { id, slug } = body;

          if (!id && !slug) {
            return new Response(
              JSON.stringify({ error: "Location ID or slug is required for update." }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }

          const now = new Date().toISOString();

          await locationsDb.prepare(
            `UPDATE locations SET
              name = COALESCE(?, name),
              slug = COALESCE(?, slug),
              country = COALESCE(?, country),
              state_region = COALESCE(?, state_region),
              location_type = COALESCE(?, location_type),
              parent_location = COALESCE(?, parent_location),
              latitude = COALESCE(?, latitude),
              longitude = COALESCE(?, longitude),
              image_url = COALESCE(?, image_url),
              pexels_query = COALESCE(?, pexels_query),
              heading = COALESCE(?, heading),
              short_description = COALESCE(?, short_description),
              seo_title = COALESCE(?, seo_title),
              seo_description = COALESCE(?, seo_description),
              hotel_search_query = COALESCE(?, hotel_search_query),
              currency = COALESCE(?, currency),
              timezone = COALESCE(?, timezone),
              destination_content = COALESCE(?, destination_content),
              content_status = COALESCE(?, content_status),
              is_active = COALESCE(?, is_active),
              updated_at = ?
            WHERE id = ? OR slug = ?`
          )
            .bind(
              body.name || null,
              body.slug || null,
              body.country || null,
              body.state_region || null,
              body.location_type || null,
              body.parent_location || null,
              body.latitude ?? null,
              body.longitude ?? null,
              body.image_url || null,
              body.pexels_query || null,
              body.heading || null,
              body.short_description || null,
              body.seo_title || null,
              body.seo_description || null,
              body.hotel_search_query || null,
              body.currency || null,
              body.timezone || null,
              body.destination_content || null,
              body.content_status || null,
              body.is_active ?? null,
              now,
              id || -1,
              slug || ""
            )
            .run();

          return new Response(
            JSON.stringify({ success: true, message: "Location updated successfully." }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({ error: err.message || "Failed to update location" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }

      // DELETE: Delete a location
      if (request.method === "DELETE") {
        if (!locationsDb) {
          return new Response(
            JSON.stringify({ error: "Cloudflare D1 Database binding is not configured." }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        try {
          const body = (await request.json().catch(() => ({}))) as any;
          const id = body.id || url.searchParams.get("id");

          if (!id) {
            return new Response(
              JSON.stringify({ error: "Location ID is required for deletion." }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }

          await locationsDb.prepare(`DELETE FROM locations WHERE id = ?`).bind(id).run();

          return new Response(
            JSON.stringify({ success: true, message: "Location deleted successfully." }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } catch (err: any) {
          return new Response(
            JSON.stringify({ error: err.message || "Failed to delete location" }),
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

        // Check API key (OpenAI key starting with sk- or Groq key starting with gsk_)
        const apiKey = clientApiKey || env?.OPENAI_API_KEY || env?.GROQ_API_KEY;
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "API Key is missing. Please provide your OpenAI or Groq API key in the dashboard." }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const isGroq = apiKey.startsWith("gsk_");
        const endpoint = isGroq
          ? "https://api.groq.com/openai/v1/chat/completions"
          : "https://api.openai.com/v1/chat/completions";

        const systemPrompt = `You are a professional travel journalist for Discovery Convoy.
Write a compact, high-quality, structured travel article in clean JSON format.

RULES:
- Title: Strictly 4 to 6 words (e.g. "Ultimate Travel Guide To Bali").
- Sections: Exactly 3 to 4 structured sections.
- Subheading: Strictly 3 to 6 words (e.g. "1. Sunrise At Mount Batur").
- Paragraphs: 2 engaging, vivid paragraphs per section.
- Pexels Query: 3-5 keywords for scenic photo search.
- FAQs: Exactly 3 helpful traveler FAQs.
- Category: ${category && category !== "Auto-Detect" ? `"${category}"` : 'Auto-select best from ["Adventure", "Luxury Escapes", "Beach Trips", "Nature", "Art and culture", "Honeymoon & Romance", "Food & Travel", "Heritage & History", "Mountain Treks", "Wellness & Spa", "Wildlife & Safari", "Cruise & Island Hopping", "Travel Tips", "Budget & Solo Travel", "City Breaks"]'}
- Location: ${location && location !== "Auto-Detect" ? `"${location}"` : 'Auto-detect destination (e.g. "Bali, Indonesia", "Kyoto, Japan")'}

Output ONLY valid JSON matching this schema:
{
  "title": "Strictly 4-6 Words Title",
  "category": "Adventure",
  "location": "Destination City, Country",
  "cover_query": "3-5 word scenic photo query",
  "summary": "Concise 2-sentence destination summary.",
  "sections": [
    {
      "heading": "Strictly 3-6 Words Subheading",
      "paragraphs": [
        "First rich travel paragraph...",
        "Second rich travel paragraph..."
      ],
      "pexelsQuery": "3-5 word photo query",
      "highlights": ["Highlight 1", "Highlight 2"]
    }
  ],
  "quote": {
    "text": "Inspiring one-line travel quote",
    "author": "Local Guide"
  },
  "faqs": [
    {
      "question": "Common travel question?",
      "answer": "Concise, helpful answer."
    }
  ],
  "tags": "luxury, travel, guide, itinerary"
}`;

        const callAi = async (messages: any[], maxTokens = 4096) => {
          return await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(
              isGroq
                ? {
                    model: "openai/gpt-oss-120b",
                    messages,
                    temperature: 0.8,
                    max_completion_tokens: maxTokens,
                    top_p: 1,
                    reasoning_effort: "medium",
                  }
                : {
                    model: "gpt-4o",
                    messages,
                    response_format: { type: "json_object" },
                    temperature: 0.7,
                  }
            ),
          });
        };

        const initialMessages = [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Write a complete, structured travel article about "${topic}". Location: "${location || "Global"}". Output valid and complete JSON only.`,
          },
        ];

        let aiResponse = await callAi(initialMessages);

        if (!aiResponse.ok) {
          const errText = await aiResponse.text();
          return new Response(
            JSON.stringify({ error: `AI API error (${aiResponse.status}): ${errText}` }),
            { status: aiResponse.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Safely parse the AI response body — empty body causes "Unexpected end of JSON input"
        const aiRawText = await aiResponse.text();
        if (!aiRawText || aiRawText.trim().length === 0) {
          return new Response(
            JSON.stringify({ error: "AI returned an empty response. Please try again." }),
            { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        let aiData: any;
        try {
          aiData = JSON.parse(aiRawText);
        } catch {
          return new Response(
            JSON.stringify({ error: `AI returned invalid JSON. Raw: ${aiRawText.slice(0, 200)}` }),
            { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        let rawContent = aiData.choices?.[0]?.message?.content || "";
        let finishReason = aiData.choices?.[0]?.finish_reason;

        if (!rawContent) {
          const apiErr = aiData.error?.message || aiData.message || "No content in AI response.";
          return new Response(
            JSON.stringify({ error: apiErr }),
            { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Repair truncated JSON helper
        const repairTruncatedJson = (str: string): string => {
          let cleaned = str.trim();
          const firstOpen = cleaned.indexOf("{");
          if (firstOpen !== -1) cleaned = cleaned.slice(firstOpen);

          // If ends with unclosed string like "highlights": ["Guid...
          let inString = false;
          let escaped = false;
          const openStack: string[] = [];

          for (let i = 0; i < cleaned.length; i++) {
            const char = cleaned[i];
            if (escaped) {
              escaped = false;
              continue;
            }
            if (char === "\\") {
              escaped = true;
              continue;
            }
            if (char === '"') {
              inString = !inString;
              continue;
            }
            if (!inString) {
              if (char === "{" || char === "[") {
                openStack.push(char);
              } else if (char === "}" || char === "]") {
                openStack.pop();
              }
            }
          }

          // If still inside string, close it
          if (inString) cleaned += '"';

          // Close all open brackets in reverse order
          while (openStack.length > 0) {
            const last = openStack.pop();
            if (last === "{") cleaned += "}";
            if (last === "[") cleaned += "]";
          }

          return cleaned;
        };

        const tryParseJson = (text: string) => {
          try {
            return JSON.parse(text);
          } catch {
            try {
              const repaired = repairTruncatedJson(text);
              return JSON.parse(repaired);
            } catch {
              return null;
            }
          }
        };

        // If finishReason is length or JSON cannot be parsed directly, send continuation request
        if (finishReason === "length" || !tryParseJson(rawContent)) {
          console.log("Truncated JSON detected. Waiting 5s before continuing completion...");
          await new Promise((resolve) => setTimeout(resolve, 5000));

          const continuationMessages = [
            ...initialMessages,
            { role: "assistant", content: rawContent },
            {
              role: "user",
              content: `You were stopped midway. Continue outputting the remainder of the JSON starting right after the truncation point. Do not repeat anything. Output valid JSON ending with }`,
            },
          ];

          try {
            const continueRes = await callAi(continuationMessages, 2048);
            if (continueRes.ok) {
              const continueData = (await continueRes.json()) as any;
              const continueText = continueData.choices?.[0]?.message?.content || "";
              rawContent += continueText;
            }
          } catch (contErr) {
            console.warn("Continuation request failed:", contErr);
          }
        }

        let generatedContent = tryParseJson(rawContent);
        if (!generatedContent) {
          try {
            const jsonMatch = rawContent.match(/\{[\s\S]*/);
            if (jsonMatch) {
              const repaired = repairTruncatedJson(jsonMatch[0]);
              generatedContent = JSON.parse(repaired);
            }
          } catch (e) {
            console.warn("Regex JSON repair fallback failed:", e);
          }
        }

        if (!generatedContent || typeof generatedContent !== "object") {
          generatedContent = {
            title: topic.split(" ").slice(0, 6).join(" "),
            category: category && category !== "Auto-Detect" ? category : "Adventure",
            location: location && location !== "Auto-Detect" ? location : "Global",
            summary: rawContent.slice(0, 200),
            sections: [
              {
                heading: `Exploring ${topic}`.split(" ").slice(0, 6).join(" "),
                paragraphs: [rawContent],
                pexelsQuery: `${topic} travel landscape`,
                highlights: ["Key destination highlight"],
              },
            ],
            faqs: [],
          };
        }

        return new Response(
          JSON.stringify({ success: true, data: generatedContent, raw: rawContent }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: err.message || "Failed to generate blog" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // ── 5. Intercept /api/ai-rewrite (Single Element AI Regeneration) ──
    if (url.pathname === "/api/ai-rewrite") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      try {
        const body = (await request.json()) as {
          type: "heading" | "subheading" | "paragraphs" | "pexelsQuery" | "faq";
          prompt: string;
          current?: string;
          apiKey?: string;
        };

        const { type, prompt, current, apiKey: clientApiKey } = body;
        const apiKey = clientApiKey || env?.OPENAI_API_KEY || env?.GROQ_API_KEY;

        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "API Key is missing." }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const isGroq = apiKey.startsWith("gsk_");
        const endpoint = isGroq
          ? "https://api.groq.com/openai/v1/chat/completions"
          : "https://api.openai.com/v1/chat/completions";

        let instruction = "";
        if (type === "heading") {
          instruction = "Generate a catchy travel blog title strictly 4 to 6 words maximum. Return ONLY the plain text title, no quotes or explanations.";
        } else if (type === "subheading") {
          instruction = "Generate a punchy section subheading strictly 3 to 6 words maximum. Return ONLY the plain text subheading, no quotes or explanations.";
        } else if (type === "pexelsQuery") {
          instruction = "Generate a specific 3 to 5 word photography visual query for Pexels search. Return ONLY 3-5 lowercase words.";
        } else if (type === "paragraphs") {
          instruction = "Generate 2 rich, engaging travel paragraphs with practical details and vivid descriptions. Return as plain text paragraphs separated by a double newline.";
        } else if (type === "faq") {
          instruction = "Generate a single travel FAQ in JSON format: {\"question\": \"...\", \"answer\": \"...\"}. Return ONLY valid JSON.";
        }

        const rewriteRes = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(
            isGroq
              ? {
                  model: "openai/gpt-oss-120b",
                  messages: [
                    { role: "system", content: instruction },
                    { role: "user", content: `Context: ${prompt}. Current version: ${current || "None"}. Rewrite with maximum creativity and adherence to rules.` },
                  ],
                  temperature: 0.9,
                  max_completion_tokens: 1024,
                  reasoning_effort: "medium",
                }
              : {
                  model: "gpt-4o",
                  messages: [
                    { role: "system", content: instruction },
                    { role: "user", content: `Context: ${prompt}. Current version: ${current || "None"}. Rewrite with maximum creativity and adherence to rules.` },
                  ],
                  temperature: 0.9,
                  max_tokens: 1024,
                }
          ),
        });

        if (!rewriteRes.ok) {
          const err = await rewriteRes.text();
          return new Response(
            JSON.stringify({ error: `Rewrite failed: ${err}` }),
            { status: rewriteRes.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const data = (await rewriteRes.json()) as any;
        const resultText = data.choices?.[0]?.message?.content?.trim() || "";

        return new Response(
          JSON.stringify({ success: true, result: resultText }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: err.message || "Failed to rewrite element" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // ── 6. Intercept /api/sqlite-console (Direct D1 SQL Execution & Inspector) ──
    if (url.pathname === "/api/sqlite-console") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      try {
        const body = (await request.json()) as { query?: string };
        const query = body.query?.trim();

        if (!query) {
          return new Response(
            JSON.stringify({ error: "SQL query is required" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const d1 = env?.BLOGS_DB || env?.DB;
        if (!d1) {
          return new Response(
            JSON.stringify({ error: "D1 Database binding not found" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const isSelect = query.toLowerCase().startsWith("select") || query.toLowerCase().startsWith("pragma");
        if (isSelect) {
          const { results } = await d1.prepare(query).all();
          return new Response(
            JSON.stringify({ success: true, results: results || [], count: results?.length || 0 }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } else {
          const res = await d1.prepare(query).run();
          return new Response(
            JSON.stringify({
              success: true,
              message: "Query executed successfully!",
              meta: res?.meta || {},
            }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: err.message || "SQL Execution Error" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // ── 7. Intercept /api/serp requests ────────────────────────────────
    if (url.pathname.startsWith("/api/serp")) {
      const searchParams = new URLSearchParams(url.search);

      const clientKey = searchParams.get("api_key");
      searchParams.delete("slot");
      searchParams.delete("api_key");

      const DEFAULT_KEY = "7f83c49c4ab7a773e871e42237fd4775f124a8abb77e148899d0bbad6d307d69";

      // Build sequential key array: KEY_1 -> KEY_2 -> KEY_3 -> KEY_4 -> KEY_5 -> clientKey -> DEFAULT_KEY
      const rawKeys = [
        env?.SERP_API_KEY_1,
        env?.SERP_API_KEY_2,
        env?.SERP_API_KEY_3,
        env?.SERP_API_KEY_4,
        env?.SERP_API_KEY_5,
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
          console.warn(`SerpApi key #${i + 1} exhausted/failed with status ${response.status}. Trying next key...`);
        } catch (err: any) {
          lastErrorText = err.message || "Failed to fetch from SerpApi";
          console.warn(`SerpApi key #${i + 1} error:`, err);
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
