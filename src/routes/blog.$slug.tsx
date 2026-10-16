import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { StoreFooter } from "@/components/StoreFooter";
import { ProductCard } from "@/components/ProductCard";
import { getPost } from "@/lib/blog";
import { getProduct } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Post not found — Perfect Buy Blog" },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    const canonicalUrl = absoluteUrl(`/blog/${loaderData.slug}`);
    const imageUrl = absoluteUrl(loaderData.image);

    return {
      meta: [
        { title: loaderData.seoTitle },
        { name: "description", content: loaderData.seoDescription },
        { property: "og:title", content: loaderData.seoTitle },
        { property: "og:description", content: loaderData.seoDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: imageUrl },
        { property: "article:published_time", content: loaderData.datePublished },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  const featuredProducts = post.featuredProductIds
    .map(getProduct)
    .filter((product) => product !== undefined);
  const canonicalUrl = absoluteUrl(`/blog/${post.slug}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    image: absoluteUrl(post.image),
    datePublished: post.datePublished,
    dateModified: post.datePublished,
    mainEntityOfPage: canonicalUrl,
    keywords: post.keywords.join(", "),
    author: { "@type": "Organization", name: "Perfect Buy" },
    publisher: {
      "@type": "Organization",
      name: "Perfect Buy",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/perfect-buy-logo-wide.webp"),
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
            to="/blog"
            className="font-display text-sm font-semibold text-primary hover:underline"
          >
            ← All posts
          </Link>
        </div>
      </header>

      <main className="shell max-w-4xl py-10 md:py-16">
        <Link
          to="/blog"
          className="font-display inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" /> Back to the blog
        </Link>

        <p className="mt-10 font-display text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          {post.tag}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight tracking-[-0.035em] md:text-6xl">
          {post.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {post.excerpt}
        </p>
        <p className="mt-5 text-sm text-muted-foreground">
          {post.date} · {post.readingTime}
        </p>

        <figure className="mt-9 overflow-hidden rounded-[1.75rem] bg-blush shadow-soft md:mt-12">
          <img
            src={post.image}
            alt={post.imageAlt}
            width={2048}
            height={1152}
            fetchPriority="high"
            className="aspect-[16/8] w-full object-cover"
          />
        </figure>

        <article className="mx-auto mt-10 max-w-2xl md:mt-14">
          <h2 className="text-2xl tracking-tight md:text-3xl">{post.contentHeading}</h2>
          <div className="mt-6 space-y-6 text-base leading-[1.85] text-foreground/85 md:text-lg">
            {post.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 border-t border-border pt-7">
            <p className="font-display text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Topics in this guide
            </p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Topics covered">
              {post.keywords.map((keyword) => (
                <li
                  key={keyword}
                  className="rounded-full bg-blush px-3 py-1.5 text-xs text-foreground/75"
                >
                  {keyword}
                </li>
              ))}
            </ul>
          </div>
        </article>

        {featuredProducts.length > 0 && (
          <section className="mx-auto mt-14 max-w-5xl border-t border-border pt-10">
            <p className="font-display text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              From the guide
            </p>
            <h2 className="mt-2 text-2xl tracking-tight md:text-3xl">Shop the featured products</h2>
            <div className="mt-7 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <div className="mx-auto mt-12 flex max-w-2xl items-center justify-between border-t border-border pt-8">
          <Link
            to="/blog"
            className="font-display inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" /> More stories
          </Link>
          <Link
            to="/shop/$category"
            params={{ category: post.categorySlug }}
            className="font-display text-sm font-semibold text-foreground hover:text-primary"
          >
            Browse {post.categoryLabel} →
          </Link>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}
