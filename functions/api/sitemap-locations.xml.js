export async function onRequest(context) {
  const { env } = context;
  const today = new Date().toISOString().split("T")[0];

  const toDateString = (val) => {
    if (!val) return today;
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return today;
      return d.toISOString().split("T")[0];
    } catch {
      return today;
    }
  };

  let results = [];
  if (env?.BLOGS_DB || env?.DB) {
    const db = env.BLOGS_DB || env.DB;
    try {
      const queryRes = await db.prepare(
        `SELECT slug, updated_at, created_at FROM locations
         WHERE is_active = 1
         ORDER BY updated_at DESC`
      ).all();
      results = queryRes?.results || [];
    } catch (err) {
      console.error("sitemap-locations query error:", err);
    }
  }

  const urls = results
    .filter(loc => loc && loc.slug)
    .map(loc => {
      const lastmod = toDateString(loc.updated_at || loc.created_at);
      return `
<url>
  <loc>https://discoveryconvoy.com/destination/${loc.slug}</loc>
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
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
