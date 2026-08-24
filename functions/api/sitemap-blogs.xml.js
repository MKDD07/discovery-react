export async function onRequest(context) {
  const { env } = context;

  const { results } = await env.BLOGS_DB.prepare(
    "SELECT slug, updated_at FROM blogs ORDER BY updated_at DESC"
  ).all();

  const urls = results.map(post => {
    const ts = post.updated_at > 10000000000 ? post.updated_at : post.updated_at * 1000;
    const lastmod = new Date(ts).toISOString().split("T")[0];
    return `
<url>
  <loc>https://discoveryconvoy.com/blog/${post.slug}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.75</priority>
</url>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}