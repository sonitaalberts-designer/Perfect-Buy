import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { products, categories, fashionCollections } from "../src/lib/catalog.ts";
import { blogPosts } from "../src/lib/blog.ts";

const root = resolve(import.meta.dirname, "..");
const siteUrl = (
  process.env.VITE_SITE_URL ||
  process.env.PUBLIC_SITE_URL ||
  "https://perfectbuy.co.za"
).replace(/\/$/, "");
const origin = new URL(siteUrl);
if (
  !["https:", "http:"].includes(origin.protocol) ||
  origin.pathname !== "/" ||
  origin.search ||
  origin.hash
) {
  throw new Error(
    "The public site URL must be an HTTP(S) origin without a path, query or fragment.",
  );
}
const xml = (value) =>
  value.replace(
    /[<>&"']/g,
    (character) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character],
  );
const corePaths = [
  "/",
  "/shop",
  "/blog",
  "/about",
  "/contact",
  "/delivery-returns",
  "/size-guide",
  "/faq",
  "/privacy",
  "/terms",
];
const entries = [
  ...corePaths.map((path) => ({ path })),
  ...[...categories, ...fashionCollections].map(({ slug }) => ({ path: `/shop/${slug}` })),
  ...products.map(({ id, images }) => ({ path: `/products/${id}`, images })),
  ...blogPosts.map(({ slug, image }) => ({ path: `/blog/${slug}`, images: [image] })),
];
if (new Set(entries.map(({ path }) => path)).size !== entries.length)
  throw new Error("Duplicate sitemap URLs");

// Do not stamp every URL with the build date: lastmod must reflect real content changes.
// Include only canonical, indexable pages and real product/editorial images.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    ({ path, images = [] }) => `  <url>
    <loc>${xml(siteUrl + path)}</loc>${images
      .map(
        (image) => `
    <image:image><image:loc>${xml(siteUrl + image)}</image:loc></image:image>`,
      )
      .join("")}
  </url>`,
  )
  .join("\n")}
</urlset>
`;
writeFileSync(resolve(root, "public/sitemap.xml"), sitemap);
writeFileSync(
  resolve(root, "public/robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);
console.log(`Generated SEO files for ${entries.length} canonical URLs at ${siteUrl}`);
