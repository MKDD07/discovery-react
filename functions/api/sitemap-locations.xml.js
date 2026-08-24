export async function onRequest(context) {
  const { env } = context;
  const today = new Date().toISOString().split("T")[0];

  const { results } = await env.BLOGS_DB.prepare(
    `SELECT slug, updated_at FROM locations
     WHERE is_active = 1 AND content_status = 'published'
     ORDER BY updated_at DESC`
  ).all();

  const urls = results.map(loc => {
    const lastmod = loc.updated_at
      ? new Date(loc.updated_at.replace(" ", "T") + "Z").toISOString().split("T")[0]
      : today;
    return `
<url>
  <loc>https://discoveryconvoy.com/location/${loc.slug}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.80</priority>
</url>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
