import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Clock3 } from "lucide-react";
import { StoreFooter } from "@/components/StoreFooter";
import { blogPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/blog")({
  // The parent route also wraps articles. Only the index should emit its
  // canonical; each article owns its own metadata and canonical URL.
  head: ({ matches }) =>
    matches.some((match) => "slug" in match.params)
      ? {}
      : {
          meta: [
            { title: "Sneaker & Pajama Shopping Guides | Perfect Buy South Africa" },
            {
              name: "description",
              content:
                "Read Perfect Buy's sneaker and pajama buying guides, plus gift ideas and product comparisons for South African shoppers.",
            },
            {
              property: "og:title",
              content: "Sneaker & Pajama Shopping Guides | Perfect Buy South Africa",
            },
            {
              property: "og:description",
              content:
                "Useful guides to women's sneakers, wellness gummies, squishy toys and trending products in South Africa.",
            },
            { property: "og:type", content: "website" },
            {
              property: "og:image",
              content: absoluteUrl("/blog/trending-products-south-africa.webp"),
            },
            { name: "twitter:card", content: "summary_large_image" },
          ],
          links: [{ rel: "canonical", href: absoluteUrl("/blog") }],
        },
  component: BlogPage,
});

function BlogPage() {
  const isBlogIndex = useRouterState({
    select: (state) => state.location.pathname === "/blog" || state.location.pathname === "/blog/",
  });

  if (!isBlogIndex) return <Outlet />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="shell flex items-center justify-between py-4 md:py-5">
          <Link to="/" aria-label="Perfect Buy home">
            <img
              src="/perfect-buy-logo-wide.webp"
              alt="Perfect Buy"
              width={240}
              height={64}
              className="h-auto w-36 md:w-44"
            />
          </Link>
          <Link
            to="/"
            className="font-display inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Back to shop <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <main className="pb-16 md:pb-24">
        <section className="shell pt-5 md:pt-8">
          <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] bg-blush md:min-h-[520px]">
            <img
              src="/blog/trending-products-south-africa.webp"
              alt="Trending products in South Africa including a pink handbag, collagen and a magnetic phone charger"
              width={2048}
              height={1365}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,247,250,.98)_0%,rgba(255,247,250,.94)_34%,rgba(255,247,250,.25)_66%,rgba(255,247,250,0)_100%)]" />
            <div className="relative flex min-h-[430px] max-w-2xl flex-col justify-end p-7 sm:p-10 md:min-h-[520px] md:p-14 lg:p-16">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                The Perfect Buy edit
              </p>
              <h1 className="mt-4 text-4xl leading-[1.02] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                Stories worth adding to your basket.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-foreground/70 md:text-lg">
                Explore useful guides to women&apos;s sneakers, wellness gummies, squishy toys and
                the trending products South African shoppers are loving now.
              </p>
              <a href="#latest-stories" className="btn-base btn-pink mt-7 w-fit rounded-full">
                Explore the stories <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="latest-stories" className="shell pt-14 md:pt-20">
          <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                Latest stories
              </p>
              <h2 className="mt-2 text-3xl tracking-tight md:text-4xl">Read, discover, repeat.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Helpful, easy-to-read advice for comparing popular products before you buy.
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {blogPosts.map((post, index) => (
              <article
                key={post.slug}
                className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-soft transition-transform duration-300 hover:-translate-y-1"
              >
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="relative block aspect-[16/9] overflow-hidden bg-blush"
                  aria-label={`Read ${post.title}`}
                >
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    width={2048}
                    height={1152}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="font-display absolute top-5 left-5 rounded-full bg-background/95 px-4 py-2 text-[0.65rem] font-semibold tracking-[0.16em] text-primary uppercase shadow-sm backdrop-blur">
                    {post.tag}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span aria-hidden="true">•</span>
                    <Clock3 className="size-3.5" />
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="mt-4 text-2xl leading-tight tracking-tight transition-colors group-hover:text-primary md:text-3xl">
                    <Link to="/blog/$slug" params={{ slug: post.slug }}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {post.excerpt}
                  </p>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="font-display mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    {post.linkLabel} <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="shell pt-14 md:pt-20">
          <div className="overflow-hidden rounded-[1.75rem] bg-secondary px-7 py-10 text-secondary-foreground sm:px-10 md:flex md:items-center md:justify-between md:gap-10 md:px-12">
            <div>
              <p className="font-display text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                Ready to browse?
              </p>
              <h2 className="mt-2 text-2xl tracking-tight md:text-3xl">
                Find your next favourite.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-secondary-foreground/65">
                Put the inspiration into action with the latest arrivals from Perfect Buy.
              </p>
            </div>
            <Link
              to="/shop/$category"
              params={{ category: "new-arrivals" }}
              className="btn-base mt-7 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary-deep md:mt-0"
            >
              Shop new arrivals <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <StoreFooter />
    </div>
  );
}
