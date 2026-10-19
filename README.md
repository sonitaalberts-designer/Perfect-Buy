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
| `VITE_SITE_URL`   | Public canonical origin for metadata and sitemap links. Defaults to `https://perfectbuy.co.za`, including on preview deployments, so copies point to the live store. |
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

Checkout shows a separate R100 shipping line and adds it once per order to the
server-calculated Yoco amount, regardless of the products or quantities. Both
checkout runtimes enforce the same fixed fee; browser-supplied totals are ignored.

The owner requested detailed paid-order notifications to `orders@perfect-buy.co.za`
(Titan Mail). These notifications are not connected yet: they require verified
Yoco payment webhooks and a configured mail sender. cPanel now saves customer,
product, option, amount and verified locker details in private 0600 JSON files under
`/home/houseofcreat/.perfectbuy-orders`, with status `awaiting_payment`. A browser
success redirect never marks these records paid or books a shipment.

PUDO locker search uses the documented Courier Guy pickup-points API. It filters
for visible, online TCG lockers supporting a Large compartment, validates the
selection again on the server, and includes the destination in Yoco metadata.
Copy `hosting/cpanel/perfectbuy-courier.example.php` to the private home directory
as `.perfectbuy-courier.php` (0600), then set the API key there. River Square Mall
(`7:RVM00186`) is the confirmed sender locker. The API/cache never exposes the key.
On Vercel, set `COURIER_GUY_API_KEY` as a server-only environment variable; paid
order storage and mail/webhook configuration there require a durable database.

Automatic Courier Guy bookings remain disabled. Large is a compartment capacity,
not an actual parcel weight: fulfillment needs accurate packed measurements and
verified payment before booking. Do not describe bookings or email alerts as active.

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

## Search and indexing

The canonical store is `https://perfectbuy.co.za/`. The cPanel configuration redirects
HTTP, www, explicit page `.html` URLs and collection trailing slashes to canonical URLs.
Unknown pages return HTTP 404; checkout is marked `noindex, follow`.

The sitemap is generated from the real catalog, collections and blog data and includes
product images. It excludes checkout and does not invent modification dates on every
build. Rebuild and upload the pages, sitemap, robots file and assets after content edits.
The focused fashion collections are `/shop/footwear` and `/shop/womens-clothing`.

Keep `public/google5fca805106f6108d.html` in all deployments: it is Google's public
ownership-verification file for the House of Creatives Search Console account.
Public customer contact details are maintained in `src/lib/site.ts`.
Do not add invented reviews, ratings, shipping guarantees, brand identifiers or return
policies to structured data. Confirm real commercial details before adding them.

## Yoco payment confirmation (cPanel)

`hosting/cpanel/public/api/yoco-webhook.php` implements the Checkout API signed
webhook. Set `yoco_webhook_secret` and `yoco_mode` in the private configuration,
register `https://perfectbuy.co.za/api/yoco-webhook.php` using the matching Yoco
Checkout API key, and test sandbox delivery before enabling live fulfillment.
The handler checks HMAC-SHA256 against the raw body, a 180-second timestamp
window, checkout identity, amount, currency and mode. A per-order lock and atomic
save make duplicate payment notifications idempotent. The checkout endpoint saves
a private checkout-id index before returning its payment URL.

Only a verified matching `payment.succeeded` marks an order paid. This handler
currently leaves courier booking and email delivery in `pending_configuration`;
it does not send notifications or create a shipment. Registration, private secret
configuration and an end-to-end sandbox test are still required. Fixed parcel
measurements must be provided by the merchant; Large's capacity is not a guessed
actual weight. Do not enable an automatic booking worker without those settings.

References: https://developer.yoco.com/guides/online-payments/webhooks/verifying-the-events
and https://developer.yoco.com/guides/online-payments/webhooks/listen-for-events.

The live cPanel checkout additionally requires `payments_enabled => true` in its
private configuration. Keep this false until domain verification and sandbox
checks pass. A separate `yoco-webhook-test.php` uses
`.perfectbuy-yoco-test-config.php` and `.perfectbuy-test-orders`; it cannot update
live order files. Register test and live subscriptions with their respective keys.
