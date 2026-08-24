export async function onRequest(context) {
  const today = new Date().toISOString().split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<sitemap>
  <loc>https://discoveryconvoy.com/sitemap-pages.xml</loc>
  <lastmod>${today}</lastmod>
</sitemap>
<sitemap>
  <loc>https://discoveryconvoy.com/sitemap-blogs.xml</loc>
  <lastmod>${today}</lastmod>
</sitemap>
<sitemap>
  <loc>https://discoveryconvoy.com/sitemap-locations.xml</loc>
  <lastmod>${today}</lastmod>
</sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}