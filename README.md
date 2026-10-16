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
# Domains.co.za cPanel deployment

Run `pnpm run build:cpanel` with Node.js 24 to create `deploy-cpanel/`. This renders
all product, category, blog and information pages at build time, copies the public
assets, and includes a PHP checkout endpoint. A Node.js process is not required on
the hosting account. The existing Vercel build remains available separately.

Upload the **contents** of `deploy-cpanel/` (including `.htaccess`) into the domain's
own document root, `/home/houseofcreat/public_html/perfectbuy.co.za`. Do not upload
the repository, `.env` files, dependencies, or Vercel function output.

For Yoco payments, copy `hosting/cpanel/perfectbuy-config.example.php` to
`/home/houseofcreat/.perfectbuy-config.php`, outside every public website folder.
Set its secret key directly on the server. The endpoint validates customer input,
product options and quantities, and calculates totals from its generated server
catalog. Without a configured key it returns a clear 503 message and never
starts a payment. PHP 8+ with cURL and outbound HTTPS is required.

Rebuild and upload after editing products or pages. Point the domain's website
records to the hosting account's shared IP and issue an SSL certificate before
enabling HTTPS redirects or accepting customer information. Preserve existing
email records when updating DNS. As with the Vercel checkout, payment redirects
are not fulfillment confirmation: verify payment in Yoco before fulfilling an order.

## Image performance

Product cards and galleries use checked-in WebP variants at 320, 640 and 1280 pixels.
Browsers select a suitable size; newly added images fall back to their original URL.
To regenerate variants after replacing catalog photos, run `node scripts/optimize-images.mjs`
from the repository root with Sharp installed, or set `SHARP_MODULE` to an installed
Sharp module. Commit the generated `public/image-sizes` files and
`src/lib/image-variants.json` together. Normal builds do not require Sharp.

The homepage uses `hero-video-light.mp4` (720p H.264, 24 fps, no audio, fast-start),
starting after the initial page loads. Data saving, 2G and reduced-motion preferences
keep the still poster. The original video is retained for future editing.
