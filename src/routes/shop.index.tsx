import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";
import { ProductCard } from "@/components/ProductCard";
import { desktopCategories, products } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";
import { responsiveImage } from "@/lib/responsive-image";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop All Departments — Perfect Buy" },
      {
        name: "description",
        content:
          "Browse Perfect Buy attire, beauty gifts, toys, sun care, wellness and accessories.",
      },
      { property: "og:title", content: "Shop All Departments — Perfect Buy" },
      {
        property: "og:description",
        content:
          "Every Perfect Buy department in one place — fashion, playful picks and everyday finds.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/shop") },
      { property: "og:image", content: absoluteUrl("/new-arrivals-hero.webp") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/shop") }],
  }),
  component: ShopIndex,
});

function ShopIndex() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Perfect Buy products",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: absoluteUrl(`/products/${product.id}`),
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <StoreHeader />
      <main className="shell py-12 md:py-16">
        <p className="eyebrow">Shop all</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Every department, neatly organised.</h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
          Browse attire, beauty gifts, toys, sun care and everyday wellness essentials. Prices in
          ZAR (R).
        </p>

        <div className="department-carousel mt-10" aria-label="Shop by department">
          <div className="marquee-track">
            {[...desktopCategories, ...desktopCategories].map((cat, index) => (
              <Link
                key={`${cat.slug}-${index}`}
                to="/shop/$category"
                params={{ category: cat.slug }}
                tabIndex={index >= desktopCategories.length ? -1 : 0}
                aria-hidden={index >= desktopCategories.length ? true : undefined}
                className="tile group w-[72vw] max-w-72 shrink-0 bg-white sm:w-64 lg:w-72"
              >
                <img
                  {...responsiveImage(cat.img, "(min-width: 640px) 288px, 72vw")}
                  alt={index < desktopCategories.length ? cat.name : ""}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/4] w-full object-cover"
                />
                <div className="absolute inset-x-3 bottom-3 rounded-md bg-background/95 px-4 py-3">
                  <p className="font-display text-base font-semibold">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.note}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <section className="mt-16">
          <h2 className="text-3xl">All Products</h2>
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <StoreFooter />
    </div>
  );
}
