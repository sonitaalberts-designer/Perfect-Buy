import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, SlidersHorizontal, ShieldCheck } from "lucide-react";

import { useEffect, useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { categories as shopCategories, products } from "@/lib/catalog";
import heroPink from "@/assets/hero-pink.jpg";
import { ProductCard } from "@/components/ProductCard";
import { StoreFooter } from "@/components/StoreFooter";
import { absoluteUrl, SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Perfect Buy — Shop Smart, Choose Perfect" },
      {
        name: "description",
        content:
          "Perfect Buy is a South African online store for affordable fashion, playful picks and useful everyday finds. Find your next favourite.",
      },
      { property: "og:title", content: "Perfect Buy — Shop Smart, Choose Perfect" },
      {
        property: "og:description",
        content:
          "Affordable fashion, playful picks and useful everyday finds from Perfect Buy, South Africa.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: absoluteUrl("/new-arrivals-hero.webp") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: Home,
});

const categories = shopCategories;

const steps = [
  {
    icon: Sparkles,
    title: "Discover your favourites",
    copy: "Browse departments organised under one brand.",
  },
  {
    icon: SlidersHorizontal,
    title: "Choose your options",
    copy: "Pick your size, colour and quantity with clear pricing.",
  },
  {
    icon: ShieldCheck,
    title: "Checkout with confidence",
    copy: "Secure checkout, in Rand, with your order details kept safe.",
  },
];

const heroWords = ["Your next outfit", "Your next little treat", "Your next everyday favourite"];
const heroBenefits = ["Fresh new arrivals", "Curated collections", "Secure checkout in Rand"];

function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [loadHeroVideo, setLoadHeroVideo] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => setWordIndex((i) => (i + 1) % heroWords.length), 2200);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    let videoTimer: number | undefined;
    const enableVideo = () => {
      videoTimer = window.setTimeout(() => setLoadHeroVideo(true), 250);
    };

    if (document.readyState === "complete") enableVideo();
    else window.addEventListener("load", enableVideo, { once: true });

    return () => {
      window.removeEventListener("load", enableVideo);
      if (videoTimer) window.clearTimeout(videoTimer);
    };
  }, []);
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: "Perfect Buy",
                url: SITE_URL,
                logo: absoluteUrl("/perfect-buy-logo-wide.webp"),
              },
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                name: "Perfect Buy",
                url: SITE_URL,
                publisher: { "@id": `${SITE_URL}/#organization` },
                inLanguage: "en-ZA",
              },
            ],
          }),
        }}
      />
      <div className="bg-secondary py-2.5 text-center">
        <p className="font-display text-xs font-semibold tracking-[0.18em] text-secondary-foreground uppercase">
          Shop Smart, Choose Perfect.
        </p>
      </div>

      <StoreHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-primary lg:min-h-[100svh]">
          <video
            src={loadHeroVideo ? "/hero-video.mp4" : undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={heroPink}
            aria-hidden="true"
            tabIndex={-1}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-black/10"
          />

          <div className="relative flex min-h-[660px] flex-col justify-end pt-28 lg:min-h-[100svh] lg:pt-36">
            <div className="rise grid w-full min-w-0 items-end gap-8 px-5 pb-10 sm:px-10 sm:pb-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14 lg:px-[5vw] lg:pb-14">
              <div className="min-w-0">
                <p className="font-display text-xs font-semibold tracking-[0.2em] text-primary-foreground/85 uppercase">
                  Welcome to Perfect Buy
                </p>
                <h1 className="mt-4 max-w-5xl break-words text-4xl leading-[0.94] tracking-[-0.045em] text-primary-foreground min-[400px]:text-5xl sm:text-7xl lg:text-[clamp(5rem,8vw,9rem)] lg:leading-[0.92] lg:tracking-[-0.055em]">
                  Find Your Next Favourite.
                </h1>
              </div>

              <Link
                to="/shop/$category"
                params={{ category: "new-arrivals" }}
                className="btn-base mb-1 w-fit rounded-full bg-background px-7 text-foreground shadow-lg hover:bg-blush lg:mb-3"
              >
                See What&apos;s New <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="hidden border-t border-primary-foreground/25 bg-black/20 text-primary-foreground backdrop-blur-md sm:block">
              <div className="grid w-full min-w-0 gap-6 px-5 py-6 sm:px-10 lg:grid-cols-[1.2fr_1fr] lg:items-stretch lg:gap-10 lg:px-[5vw] lg:py-0">
                <div className="min-w-0 lg:py-7">
                  <p
                    className="font-display text-xs font-semibold tracking-[0.14em] text-primary uppercase"
                    aria-live="polite"
                  >
                    <span key={wordIndex} className="rise inline-block">
                      {heroWords[wordIndex]}
                    </span>
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/75 sm:text-base">
                    Discover affordable fashion, playful picks and useful everyday finds, selected
                    to make every shop feel simple and special.
                  </p>
                </div>

                <div className="hidden min-w-0 grid-cols-3 border-primary-foreground/20 sm:grid lg:border-l">
                  {heroBenefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex min-w-0 items-center gap-3 border-l border-primary-foreground/20 px-5 py-4 text-xs leading-tight font-semibold tracking-[0.08em] uppercase first:border-l-0 lg:border-t lg:border-l-0 lg:px-7 lg:first:border-t-0"
                    >
                      <span className="h-2 w-2 shrink-0 bg-primary" aria-hidden="true" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div
          className="overflow-hidden border-y border-primary/20 bg-secondary py-3 text-secondary-foreground sm:hidden"
          aria-label={heroBenefits.join(", ")}
        >
          <div className="mobile-benefit-track">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center"
                aria-hidden={copy === 1 ? "true" : undefined}
              >
                {heroBenefits.map((benefit) => (
                  <span
                    key={`${copy}-${benefit}`}
                    className="flex shrink-0 items-center gap-2 px-5 font-display text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap uppercase"
                  >
                    <span className="h-2 w-2 shrink-0 bg-primary" aria-hidden="true" />
                    {benefit}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Cosy nights and Christmas sparkle */}
        <section className="shell py-12 md:py-24">
          <p className="eyebrow">More from Perfect Buy</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Cosy Nights &amp; Christmas Sparkle</h2>
          <div className="mt-8 grid grid-cols-1 gap-10 sm:mt-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {products
              .filter(
                (product) =>
                  product.category === "womens-clothing" ||
                  product.id === "blue-christmas-advent-calendar" ||
                  product.id === "pink-christmas-advent-calendar",
              )
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </section>

        {/* Fashion feature */}
        <section className="bg-muted" aria-labelledby="fashion-feature-heading">
          <div className="relative min-h-[420px] w-full overflow-hidden sm:min-h-0">
            <h2 id="fashion-feature-heading" className="sr-only">
              Your evenings, in timeless style
            </h2>
            <p className="sr-only">
              Discover white timeless pajama sets in cheeta print and classic stripes, from R399.
            </p>
            <img
              src="/fashion-feature-pajamas.webp"
              alt="White Timeless striped pajama set fashion feature"
              loading="lazy"
              decoding="async"
              width={1680}
              height={941}
              className="block h-[420px] w-full object-cover object-[72%_center] sm:h-auto sm:object-contain sm:object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-primary-deep/95 via-primary/75 to-transparent sm:hidden"
            />
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 text-primary-foreground sm:hidden">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase">
                Timeless sleepwear
              </p>
              <p className="mt-3 max-w-xs font-display text-4xl leading-tight">
                Your evenings, in timeless style.
              </p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-primary-foreground/85">
                Discover timeless pajama sets in cheeta print and classic stripes, from R399.
              </p>
              <Link
                to="/shop/$category"
                params={{ category: "attire" }}
                className="btn-base mt-6 w-fit bg-background text-foreground"
              >
                Shop Pajama Sets <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <Link
              to="/shop/$category"
              params={{ category: "attire" }}
              aria-label="Shop pajama sets"
              title="Shop Pajama Sets"
              className="fashion-feature-button absolute top-[66.2%] left-[7.2%] hidden h-[8.5%] w-[20.7%] min-h-8 min-w-28 whitespace-nowrap focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white sm:flex"
            >
              <span>Shop Pajama Sets</span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Popular items */}
        <section className="bg-muted">
          <div className="shell py-12 md:py-24">
            <p className="eyebrow">Trending now</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Popular Items</h2>
            <div className="mt-8 grid grid-cols-1 gap-10 sm:mt-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
              {products
                .filter(
                  (product) => product.category === "footwear" || product.category === "gifts-toys",
                )
                .slice(0, 8)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        </section>

        {/* Christmas gifting */}
        <section className="bg-blush" aria-labelledby="christmas-gifting-heading">
          <div className="relative min-h-[360px] w-full overflow-hidden sm:min-h-0">
            <h2 id="christmas-gifting-heading" className="sr-only">
              A Little Christmas Sparkle
            </h2>
            <p className="sr-only">
              Create your own bracelet with a Christmas Advent calendar. Choose blue and silver or
              pink and silver, each R320.
            </p>
            <img
              src="/christmas-gifting-feature.webp"
              alt="Blue and silver Christmas bracelet Advent calendars displayed in a pink festive scene"
              loading="lazy"
              decoding="async"
              width={2048}
              height={702}
              className="block h-[360px] w-full object-cover object-[72%_center] sm:h-auto sm:object-contain sm:object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 z-10 bg-gradient-to-r from-primary-deep/95 via-primary/75 to-transparent sm:hidden"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-primary-foreground sm:hidden">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase">Christmas gifting</p>
              <p className="mt-3 max-w-xs font-display text-4xl leading-tight">
                A Little Christmas Sparkle.
              </p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-primary-foreground/85">
                Create your own bracelet with a Christmas Advent calendar, each R320.
              </p>
              <Link
                to="/shop/$category"
                params={{ category: "accessories" }}
                className="btn-base mt-6 w-fit bg-background text-foreground"
              >
                Browse Calendars <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="christmas-snow hidden sm:block" aria-hidden="true">
              {Array.from({ length: 18 }, (_, index) => (
                <span
                  key={index}
                  className="christmas-snowflake"
                  style={{
                    left: `${(index * 13) % 100}%`,
                    animationDelay: `${-(index % 7) * 1.15}s`,
                    animationDuration: `${6 + (index % 5) * 1.1}s`,
                    fontSize: `${0.8 + (index % 4) * 0.35}rem`,
                  }}
                >
                  ❄
                </span>
              ))}
            </div>
            <Link
              to="/shop/$category"
              params={{ category: "accessories" }}
              aria-label="Browse bracelet calendars"
              title="Browse Bracelet Calendars"
              className="fashion-feature-button absolute top-[66.5%] left-[9.35%] z-20 hidden h-[8.7%] w-[22.5%] min-h-8 min-w-36 whitespace-nowrap focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white sm:flex"
            >
              <span>Browse Bracelet Calendars</span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="shell py-16 md:py-24">
          <div className="max-w-xl">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Shopping, made simple.</h2>
          </div>

          <ol className="relative mt-12 grid gap-10 md:grid-cols-3">
            <div
              aria-hidden="true"
              className="absolute top-7 right-[16%] left-[16%] hidden h-px bg-primary/30 md:block"
            />
            {steps.map((step, i) => (
              <li key={step.title} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary/25 bg-background text-primary">
                  <step.icon className="h-6 w-6" />
                </div>
                <p className="mt-5 font-display text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Step {i + 1}
                </p>
                <h3 className="mt-2 text-lg">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">{step.copy}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Newsletter */}
        <section className="bg-secondary">
          <div className="shell grid items-center gap-8 py-16 md:grid-cols-2 md:py-20">
            <div>
              <h2 className="text-3xl text-secondary-foreground sm:text-4xl">
                Get First Dibs on New Finds.
              </h2>
              <p className="mt-4 max-w-md text-sm text-secondary-foreground/70">
                Join the Perfect Buy list for new arrivals, product picks and store updates.
              </p>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="news" className="sr-only">
                Email address
              </label>
              <input
                id="news"
                type="email"
                required
                placeholder="you@email.co.za"
                className="h-14 min-h-14 w-full rounded-md bg-background px-4 text-base outline-none focus:ring-2 focus:ring-primary sm:flex-1"
              />
              <button type="submit" className="btn-base btn-pink h-12">
                Sign me up
              </button>
            </form>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
