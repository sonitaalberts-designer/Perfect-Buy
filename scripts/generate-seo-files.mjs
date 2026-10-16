import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const vercelHostname = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const siteUrl = (
  process.env.VITE_SITE_URL ||
  process.env.PUBLIC_SITE_URL ||
  (vercelHostname
    ? `https://${vercelHostname}`
    : "https://pixel-perfect-screenshot-sepia.vercel.app")
).replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const catalogSource = readFileSync(resolve(root, "src/lib/catalog.ts"), "utf8");
const blogSource = readFileSync(resolve(root, "src/lib/blog.ts"), "utf8");
const productIds = [...catalogSource.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]);
const blogSlugs = [...blogSource.matchAll(/\bslug:\s*"([^"]+)"/g)].map((match) => match[1]);

const corePages = [
  { path: "/", priority: "1.0", frequency: "weekly" },
  { path: "/shop", priority: "0.9", frequency: "weekly" },
  { path: "/shop/new-arrivals", priority: "0.9", frequency: "weekly" },
  { path: "/shop/attire", priority: "0.8", frequency: "weekly" },
  { path: "/shop/gifts-toys", priority: "0.8", frequency: "weekly" },
  { path: "/shop/perfumes", priority: "0.8", frequency: "weekly" },
  { path: "/shop/health-wellness", priority: "0.8", frequency: "weekly" },
  { path: "/shop/accessories", priority: "0.8", frequency: "weekly" },
  { path: "/blog", priority: "0.8", frequency: "weekly" },
  { path: "/about", priority: "0.5", frequency: "monthly" },
  { path: "/contact", priority: "0.5", frequency: "monthly" },
  { path: "/delivery-returns", priority: "0.5", frequency: "monthly" },
  { path: "/size-guide", priority: "0.5", frequency: "monthly" },
  { path: "/faq", priority: "0.5", frequency: "monthly" },
  { path: "/privacy", priority: "0.3", frequency: "yearly" },
  { path: "/terms", priority: "0.3", frequency: "yearly" },
];

const pages = [
  ...corePages,
  ...productIds.map((id) => ({ path: `/products/${id}`, priority: "0.8", frequency: "weekly" })),
  ...blogSlugs.map((slug) => ({ path: `/blog/${slug}`, priority: "0.7", frequency: "monthly" })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    ({ path, priority, frequency }) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${frequency}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(resolve(root, "public/sitemap.xml"), sitemap);
writeFileSync(resolve(root, "public/robots.txt"), robots);

console.log(`Generated SEO files for ${pages.length} indexable URLs at ${siteUrl}`);
