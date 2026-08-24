export async function onRequest(context) {
  const { env } = context;

  const staticUrls = [
    { loc: "https://discoveryconvoy.com/", priority: "1.0", changefreq: "daily" },
    { loc: "https://discoveryconvoy.com/luxury", priority: "0.95", changefreq: "daily" },
    { loc: "https://discoveryconvoy.com/blog", priority: "0.90", changefreq: "daily" },
    { loc: "https://discoveryconvoy.com/about", priority: "0.80", changefreq: "monthly" },
    { loc: "https://discoveryconvoy.com/contact", priority: "0.80", changefreq: "monthly" },
    { loc: "https://discoveryconvoy.com/faq", priority: "0.80", changefreq: "monthly" },
    { loc: "https://discoveryconvoy.com/collection/luxury-palaces-villas", priority: "0.85", changefreq: "weekly" },
    { loc: "https://discoveryconvoy.com/collection/honeymoon-getaways", priority: "0.85", changefreq: "weekly" },
  ];

  const today = new Date().toISOString().split("T")[0];

  const staticXml = staticUrls.map(page => `
<url>
  <loc>${page.loc}</loc>
  <lastmod>${today}</lastmod>
  <changefreq>${page.changefreq}</changefreq>
  <priority>${page.priority}</priority>
</url>`).join("");

  // Query the correct database: BLOGS_DB, not DB
  const { results } = await env.BLOGS_DB.prepare(
    "SELECT slug, updated_at FROM blogs ORDER BY updated_at DESC"
  ).all();

  const blogXml = results.map(post => {
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticXml}${blogXml}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}