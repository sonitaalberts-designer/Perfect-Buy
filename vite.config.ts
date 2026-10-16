// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const vercelHostname = process.env["VERCEL_PROJECT_PRODUCTION_URL"] || process.env["VERCEL_URL"];
const siteUrl =
  process.env["VITE_SITE_URL"] ||
  process.env["PUBLIC_SITE_URL"] ||
  (vercelHostname ? `https://${vercelHostname}` : undefined);

const baseConfig = {
  ...(siteUrl
    ? { vite: { define: { "import.meta.env.VITE_SITE_URL": JSON.stringify(siteUrl) } } }
    : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
};

export default defineConfig(
  // When building on Vercel (VERCEL=1 is set by their CI), target Vercel's
  // runtime instead of the default Cloudflare preset. Lovable's own publish
  // builds override this back to cloudflare-module inside its sandbox.
  process.env["VERCEL"] === "1" ? { ...baseConfig, nitro: { preset: "vercel" } } : baseConfig,
);
