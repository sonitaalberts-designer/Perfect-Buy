import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import {
  desktopCategories,
  fashionCollections,
  getCategory,
  productsFor,
  type CategorySlug,
} from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

const categoryHeroes: Partial<Record<CategorySlug, { src: string; alt: string; label: string }>> = {
  "new-arrivals": {
    src: "/new-arrivals-hero.webp",
    alt: "Perfect Buy new arrivals including sneakers, a handbag, collagen, perfume and accessories",
    label: "New arrivals collection",
  },
  attire: {
    src: "/attire-hero.jpg",
    alt: "Perfect Buy attire collection featuring sneakers and women's pajama sets",
    label: "Attire collection",
  },
  "health-wellness": {
    src: "/health-wellness-hero.webp",
    alt: "Perfect Buy collagen, supplements, gummies and sun-care products",
    label: "Health and wellness collection",
  },
  accessories: {
    src: "/accessories-hero.webp",
    alt: "Perfect Buy handbag, chargers, jewellery and Christmas accessories",
    label: "Jewellery and accessories collection",
  },
  "gifts-toys": {
    src: "/gifts-toys-hero.webp",
    alt: "Perfect Buy toys, gifts, perfumes, lights and playful accessories",
    label: "Gifts and toys collection",
  },
};

const categoryGuides: Partial<Record<CategorySlug, { title: string; paragraphs: string[] }>> = {
  footwear: {
    title: "Find a sneaker style that fits your wardrobe",
    paragraphs: [
      "Explore women's sneakers with pink, white, butterfly and crystal-detail designs. The collection includes Air Max and Air Force styles; open each listing to see the photos and finish of that particular pair.",
      "All sneaker sizes use SA/UK sizing. Compare the size on the product page with the SA/UK label in a pair you already wear comfortably. EU and US numbers use different systems. Size options can differ between styles, so check the exact listing before adding your pair to the cart. Ask Perfect Buy for help if you are unsure about fit or product details.",
      "Choose a simple colour for everyday outfits or a decorated pair for a statement look. Prices are shown in South African rand, with R100 shipping per order added at checkout. Contact us to confirm availability and delivery timing before ordering.",
    ],
  },
  "womens-clothing": {
    title: "Compare White Timeless pajama sets",
    paragraphs: [
      "Browse White Timeless striped and cheeta-print pajama sets, with product photos showing the matching pieces and each design's details. Each listing gives the current set price and the sizes available to choose from.",
      "When shopping for women's pajamas online in South Africa, start with the size options for your chosen set. Compare the shape with sleepwear you already find comfortable, and ask for product-specific sizing information if you need it. We do not assume that one size fits the same across every style.",
      "A matching pajama set can be a relaxed addition to your own wardrobe or a thoughtful gift. Check the product description, confirm delivery arrangements and contact Perfect Buy with any questions before placing an order.",
    ],
  },
  "new-arrivals": {
    title: "Discover the latest Perfect Buy finds",
    paragraphs: [
      "New Arrivals brings the newest products together across footwear, clothing, gifts, toys, wellness and accessories. Use the individual product pages to compare pricing, available options and product-specific information before checkout.",
      "The collection changes as new items arrive and popular finds sell through, so product availability and options shown on each page are the most current guide.",
    ],
  },
  perfumes: {
    title: "Sweet scents and fragrance gift sets",
    paragraphs: [
      "Explore compact everyday perfumes, statement eau de parfum bottles and coordinated fragrance gift sets in one dedicated collection.",
      "Open an individual product page to confirm the bottle size, set contents and current price before adding it to your cart.",
    ],
  },
  attire: {
    title: "Women's sneakers and relaxed pajama sets",
    paragraphs: [
      "Browse statement sneakers, crystal details, bold colourways and lightweight pajama sets in one attire collection. Every product page shows the currently available sizes and images for that exact style.",
      "For fit help, compare the listed options with an item you already wear comfortably and use the Perfect Buy size guidance before ordering.",
    ],
  },
  "gifts-toys": {
    title: "Giftable toys, creative sets and playful surprises",
    paragraphs: [
      "Find squishy toys, sensory gifts, bath-time treats, creative pens, lights and seasonal countdown calendars for a range of gifting moments.",
      "Product pages explain what is included and link to related finds, making it easier to build a coordinated present without searching across unrelated collections.",
    ],
  },
  "health-wellness": {
    title: "Compare wellness products with clearer information",
    paragraphs: [
      "Explore collagen products, wellness gummies, facial care and sun-care items with pricing and key product details collected on individual pages.",
      "Always read the supplied label and serving guidance. Supplements and wellness products are not substitutes for medical advice, and an appropriate healthcare professional should be consulted when needed.",
    ],
  },
  accessories: {
    title: "Useful accessories for gifting and everyday life",
    paragraphs: [
      "Browse portable chargers, cables, bags, jewellery sets and seasonal accessories chosen for useful everyday moments and easy gifting.",
      "Check each product page for compatibility, colour options, included pieces and the latest available pricing before adding an item to the cart.",
    ],
  },
};

export const Route = createFileRoute("/shop/$category")({
  loader: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();
    return { category, products: productsFor(category.slug as CategorySlug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Not found — Perfect Buy" }, { name: "robots", content: "noindex" }],
      };
    }
    const { category } = loaderData;
    const description =
      category.blurb.length > 125
        ? category.blurb
        : `${category.blurb} Available at Perfect Buy, South Africa.`;
    const canonicalUrl = absoluteUrl(`/shop/${category.slug}`);
    const hero = categoryHeroes[category.slug as CategorySlug];
    return {
      meta: [
        { title: `${category.name} South Africa | Perfect Buy` },
        { name: "description", content: description },
        { property: "og:title", content: `${category.name} | Perfect Buy South Africa` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonicalUrl },
        ...(hero ? [{ property: "og:image", content: absoluteUrl(hero.src) }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
  notFoundComponent: CategoryNotFound,
  component: CategoryPage,
});

function CategoryPage() {
  const { category, products } = Route.useLoaderData();
  const hero = categoryHeroes[category.slug as CategorySlug];
  const guide = categoryGuides[category.slug as CategorySlug];
  const categoryUrl = absoluteUrl(`/shop/${category.slug}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${categoryUrl}#collection`,
        name: category.name,
        description: category.blurb,
        url: categoryUrl,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: product.name,
            url: absoluteUrl(`/products/${product.id}`),
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
          { "@type": "ListItem", position: 3, name: category.name, item: categoryUrl },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <StoreHeader />

      {hero && (
        <section className="relative overflow-hidden bg-blush" aria-label={hero.label}>
          <img
            src={hero.src}
            alt={hero.alt}
            width={2172}
            height={724}
            fetchPriority="high"
            decoding="async"
            className="block h-auto w-full"
          />
          <div className="absolute inset-x-0 bottom-0 hidden bg-[linear-gradient(90deg,rgba(255,255,255,.96)_0%,rgba(255,255,255,.84)_38%,rgba(255,255,255,0)_62%)] py-4 md:block lg:py-5">
            <div className="w-full px-6 lg:px-10 xl:px-12">
              <div className="max-w-[34rem] border-l-4 border-primary pl-5">
                <p className="font-display text-[0.65rem] font-semibold tracking-[0.18em] text-primary uppercase lg:text-xs">
                  Shop the collection
                </p>
                <h1 className="mt-1 text-2xl leading-tight lg:text-3xl">{category.name}</h1>
                <p className="mt-2 max-w-[31rem] text-sm leading-relaxed text-foreground/75 lg:text-base">
                  {category.blurb}
                </p>
              </div>
            </div>
          </div>
          <div className="shell py-6 md:hidden">
            <p className="font-display text-[0.65rem] font-semibold tracking-[0.18em] text-primary uppercase">
              Shop the collection
            </p>
            <h1 className="mt-2 text-3xl leading-tight">{category.name}</h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {category.blurb}
            </p>
          </div>
        </section>
      )}

      {!hero && (
        <section className="bg-blush">
          <div className="shell py-12 md:py-16">
            <nav className="font-display text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
              <span className="px-2">/</span>
              <Link to="/shop" className="hover:text-primary">
                Shop
              </Link>
              <span className="px-2">/</span>
              <span className="text-foreground">{category.name}</span>
            </nav>
            <h1 className="mt-4 text-3xl sm:text-4xl">{category.name}</h1>
            <p className="mt-3 max-w-lg text-muted-foreground">{category.blurb}</p>
          </div>
        </section>
      )}

      <main className="shell py-12 md:py-16">
        <nav className="mb-5 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>
          <span className="px-2">/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>
        <p className="text-sm text-muted-foreground">
          {products.length} products · Prices in ZAR (R)
        </p>
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} categoryLabel={category.name} />
          ))}
        </div>

        {guide && (
          <section className="mt-16 max-w-3xl border-t border-border pt-10">
            <p className="font-display text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Shopping guide
            </p>
            <h2 className="mt-2 text-2xl tracking-tight md:text-3xl">{guide.title}</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-foreground/75 md:text-base">
              {guide.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 border-t border-border pt-10">
          <h2 className="text-xl">Keep browsing</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {[...fashionCollections, ...desktopCategories]
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/shop/$category"
                    params={{ category: c.slug }}
                    className="rounded-full bg-muted px-4 py-2 font-display text-sm font-semibold transition-colors hover:bg-blush"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}

function CategoryNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="shell py-20 text-center">
        <h1 className="text-3xl">We couldn't find that department.</h1>
        <p className="mt-3 text-muted-foreground">It may have moved or been renamed.</p>
        <Link to="/shop" className="btn-base btn-pink mt-8">
          Shop all departments
        </Link>
      </main>
    </div>
  );
}
