# Perfect Buy

South African ecommerce storefront built with React, TanStack Start, Vite, Tailwind CSS, and Nitro. Includes product browsing, a cart, and a server-side Yoco checkout integration.

## Local development

Use Node.js 24 and pnpm 11.25.0:

```sh
npx pnpm@11.25.0 install --frozen-lockfile
npx pnpm@11.25.0 run dev
```

## Deploy to Vercel

1. Import `sonitaalberts-designer/Perfect-Buy` into Vercel.
2. Use the repository root as the Root Directory. The checked-in `vercel.json` sets the TanStack Start framework, installation, and build commands. Leave the Output Directory at its framework default.
3. Add the environment variables below in Vercel Project Settings. Never commit real secrets.
4. Deploy. `VERCEL=1` selects Nitro's Vercel preset and generates `.vercel/output` with static assets and a Node.js server function. Deep links and checkout server functions are routed to the server; this is a full-stack app.

| Variable          | Purpose                                                                                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_SITE_URL`   | Public canonical URL, such as your final custom domain. Used for metadata and generated sitemap links. If unset on Vercel, the build uses `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`. |
| `PUBLIC_SITE_URL` | Full public origin used for payment return URLs. Set it to the final production website URL. If unset, checkout uses the incoming request's origin.                                           |
| `YOCO_SECRET_KEY` | Yoco server-side API secret, required to start payments. Configure it in Vercel only; use a test key for testing. Never prefix it with `VITE_`.                                               |

The storefront can render without a Yoco key, but payment initiation remains unavailable until the key is configured. A payment return URL is not proof of payment; verify payment with Yoco before fulfilling orders.

To check a Vercel production build locally:

```sh
VERCEL=1 npx pnpm@11.25.0 run build
```

## Source files

- `src/routes`: storefront pages and server-side checkout.
- `src/components`: shared interface components.
- `src/lib/catalog.ts`: product catalogue.
- `public`: images, video, and generated SEO files.
- `scripts/generate-seo-files.mjs`: regenerates `robots.txt` and `sitemap.xml` before production builds.

The project originated in Lovable. Keep any connected Git history intact when syncing changes.
