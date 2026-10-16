import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";

const root = resolve(import.meta.dirname, "..");
const siteUrl = (process.env.VITE_SITE_URL || "https://perfectbuy.co.za").replace(/\/$/, "");
const env = {
  ...process.env,
  VERCEL: "1",
  VITE_HOSTING_TARGET: "cpanel",
  VITE_SITE_URL: siteUrl,
  PUBLIC_SITE_URL: siteUrl,
};
for (const args of [
  ["scripts/generate-seo-files.mjs"],
  ["node_modules/vite/bin/vite.js", "build"],
]) {
  const result = spawnSync(process.execPath, args, { cwd: root, env, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}

// Render the real SSR responses during the build. The uploaded website then needs
// only Apache and PHP, with no Node.js process on the hosting account.
const output = resolve(root, "deploy-cpanel");
await rm(output, { recursive: true, force: true });
await mkdir(output);
await cp(resolve(root, ".vercel/output/static"), output, { recursive: true });
const { default: server } = await import("../.vercel/output/functions/__server.func/index.mjs");
const sitemap = await readFile(resolve(output, "sitemap.xml"), "utf8");
const { categories } = await import("../src/lib/catalog.ts");
const paths = new Set([
  ...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname),
  ...categories.map((category) => `/shop/${category.slug}`),
  "/shop/footwear",
  "/shop/womens-clothing",
  "/checkout",
]);

for (const path of [...paths, "/__perfectbuy_missing_page__"]) {
  const response = await server.fetch(new Request(`${siteUrl}${path}`));
  const expected = path === "/__perfectbuy_missing_page__" ? 404 : 200;
  if (response.status !== expected)
    throw new Error(`${path}: expected ${expected}, got ${response.status}`);
  const html = await response.text();
  if (!html.includes("<html") || !html.includes("<script"))
    throw new Error(`Invalid page: ${path}`);
  const filename =
    expected === 404 ? "404.html" : path === "/" ? "index.html" : `${path.slice(1)}.html`;
  const destination = resolve(output, filename);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, html);
}

await cp(resolve(root, "hosting/cpanel/public"), output, { recursive: true });
const { products } = await import("../src/lib/catalog.ts");
await writeFile(
  resolve(output, "api/catalog.json"),
  JSON.stringify(
    products.map(({ id, name, price, sizes, colors }) => ({ id, name, price, sizes, colors })),
  ),
);
console.log(
  `cPanel package ready: ${paths.size} rendered pages, assets and PHP checkout in ${output}`,
);
