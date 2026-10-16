const { default: sharp } = await import(process.env.SHARP_MODULE || "sharp");
import { products, categories } from "../src/lib/catalog.ts";
import { mkdir, stat, writeFile, readFile, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
const sources = [
  ...new Set([...products.flatMap((p) => p.images), ...categories.map((c) => c.img)]),
];
const manifest = {};
await rm("public/image-sizes", { recursive: true, force: true });
await mkdir("public/image-sizes", { recursive: true });
let before = 0,
  after = 0;
for (const source of sources) {
  if (!source.startsWith("/")) continue;
  const input = `public${source}`;
  const meta = await sharp(input).metadata();
  const key = createHash("sha256")
    .update(await readFile(input))
    .digest("hex")
    .slice(0, 12);
  const variants = [];
  before += (await stat(input)).size;
  for (const width of [...new Set([320, 640, 1280].map((w) => Math.min(w, meta.width)))]) {
    const dest = `/image-sizes/${key}-${width}.webp`;
    await mkdir("public/image-sizes", { recursive: true });
    await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(`public${dest}`);
    const size = (await stat(`public${dest}`)).size;
    variants.push({ src: dest, width });
    if (width === Math.min(640, meta.width)) after += size;
  }
  manifest[source] = variants;
}
await writeFile("src/lib/image-variants.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(
  JSON.stringify({
    images: sources.length,
    originalBytes: before,
    cardBytes: after,
    reduction: Math.round((1 - after / before) * 100) + "%",
  }),
);
