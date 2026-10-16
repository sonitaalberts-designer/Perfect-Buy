import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ChevronRight, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import {
  categorySlugForProduct,
  getCategory,
  getProduct,
  productDescription,
  productsFor,
} from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { absoluteUrl } from "@/lib/site";
import { responsiveImage } from "@/lib/responsive-image";

export const Route = createFileRoute("/products/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    const categorySlug = categorySlugForProduct(product);
    const category = getCategory(categorySlug);
    return { product, category, categorySlug };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product not found | Perfect Buy" },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    const { product } = loaderData;
    const description = productDescription(product);
    const canonicalUrl = absoluteUrl(`/products/${product.id}`);
    const imageUrl = product.images[0] ? absoluteUrl(product.images[0]) : undefined;

    return {
      meta: [
        { title: `${product.name} | Perfect Buy` },
        { name: "description", content: description },
        { property: "og:title", content: `${product.name} | Perfect Buy` },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: canonicalUrl },
        ...(imageUrl ? [{ property: "og:image", content: imageUrl }] : []),
        ...(product.price !== undefined
          ? [
              { property: "product:price:amount", content: product.price.toFixed(2) },
              { property: "product:price:currency", content: "ZAR" },
            ]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, category, categorySlug } = Route.useLoaderData();
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? "");
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const description = productDescription(product);
  const formattedPrice =
    product.price === undefined ? null : new Intl.NumberFormat("en-ZA").format(product.price);
  const relatedProducts = productsFor(categorySlug)
    .filter((entry) => entry.id !== product.id)
    .slice(0, 4);
  const productUrl = absoluteUrl(`/products/${product.id}`);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        description,
        image: product.images.map(absoluteUrl),
        sku: product.id,
        category: category?.name,
        ...(product.colors ? { color: product.colors.join(", ") } : {}),
        ...(product.sizes ? { size: product.sizes } : {}),
        ...(product.price !== undefined
          ? {
              offers: {
                "@type": "Offer",
                url: productUrl,
                priceCurrency: "ZAR",
                price: product.price.toFixed(2),
                availability: "https://schema.org/InStock",
                itemCondition: "https://schema.org/NewCondition",
                seller: {
                  "@type": "Organization",
                  "@id": absoluteUrl("/#organization"),
                  name: "Perfect Buy",
                  url: absoluteUrl("/"),
                },
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
          {
            "@type": "ListItem",
            position: 3,
            name: category?.name ?? "Products",
            item: absoluteUrl(`/shop/${categorySlug}`),
          },
          { "@type": "ListItem", position: 4, name: product.name, item: productUrl },
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

      <main className="shell py-8 md:py-12">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="size-3" aria-hidden="true" />
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>
          <ChevronRight className="size-3" aria-hidden="true" />
          <Link
            to="/shop/$category"
            params={{ category: categorySlug }}
            className="hover:text-primary"
          >
            {category?.name ?? "Products"}
          </Link>
          <ChevronRight className="size-3" aria-hidden="true" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)] lg:gap-16">
          <section aria-label="Product images">
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
              {product.images[imageIndex] ? (
                <img
                  {...responsiveImage(
                    product.images[imageIndex],
                    "(min-width: 1024px) 55vw, 100vw",
                  )}
                  alt={`${product.name}${imageIndex ? ` — image ${imageIndex + 1}` : ""}`}
                  width={1200}
                  height={1200}
                  fetchPriority="high"
                  className="aspect-square w-full object-contain"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-blush">
                  Product image coming soon
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div
                className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6"
                aria-label="Product gallery"
              >
                {product.images.map((image, index) => (
                  <button
                    type="button"
                    key={image}
                    onClick={() => setImageIndex(index)}
                    aria-label={`Show image ${index + 1} of ${product.name}`}
                    aria-pressed={imageIndex === index}
                    className={`overflow-hidden rounded-lg border-2 bg-white ${
                      imageIndex === index ? "border-primary" : "border-border"
                    }`}
                  >
                    <img
                      {...responsiveImage(image, "(min-width: 640px) 100px, 25vw")}
                      alt=""
                      width={180}
                      height={180}
                      loading="lazy"
                      className="aspect-square w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="lg:pt-3">
            <p className="font-display text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              {category?.name ?? "Perfect Buy"}
            </p>
            <h1 className="mt-3 text-3xl leading-tight tracking-tight md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 font-display text-3xl font-bold text-primary">
              {formattedPrice ? `R${formattedPrice}` : "Price on request"}
            </p>
            <p className="mt-6 text-base leading-7 text-foreground/75 md:text-lg">{description}</p>

            {(product.sizes || product.colors) && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {product.sizes && (
                  <label className="block text-sm font-semibold">
                    Size
                    <select
                      value={selectedSize}
                      onChange={(event) => setSelectedSize(event.target.value)}
                      className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {product.sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {product.colors && (
                  <label className="block text-sm font-semibold">
                    Colour
                    <select
                      value={selectedColor}
                      onChange={(event) => setSelectedColor(event.target.value)}
                      className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {product.colors.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            )}

            {product.price !== undefined && (
              <button
                type="button"
                className="btn-base btn-pink mt-7 w-full py-4"
                onClick={() => {
                  addItem({
                    productId: product.id,
                    name: product.name,
                    price: product.price!,
                    ...(product.images[0] ? { image: product.images[0] } : {}),
                    ...(selectedSize ? { size: selectedSize } : {}),
                    ...(selectedColor ? { color: selectedColor } : {}),
                  });
                  setAdded(true);
                  window.setTimeout(() => setAdded(false), 1800);
                }}
              >
                <ShoppingBag className="size-5" />
                {added ? "Added to cart" : "Add to cart"}
              </button>
            )}

            <ul className="mt-8 space-y-3 border-y border-border py-6 text-sm text-foreground/75">
              <li className="flex gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                Secure checkout powered by Yoco
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                Prices shown in South African rand
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                Delivery available within South Africa
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              {product.sizes && (
                <Link to="/size-guide" className="text-primary hover:underline">
                  View size guidance
                </Link>
              )}
              <Link to="/delivery-returns" className="text-primary hover:underline">
                Delivery & returns
              </Link>
              <Link to="/contact" className="text-primary hover:underline">
                Product help
              </Link>
            </div>

            {categorySlug === "health-wellness" && (
              <p className="mt-6 rounded-lg bg-blush p-4 text-xs leading-5 text-foreground/70">
                Wellness products are not a substitute for medical advice. Read the supplied label
                and consult an appropriate healthcare professional when needed.
              </p>
            )}
          </section>
        </div>

        {relatedProducts.length > 0 && (
          <section
            className="mt-20 border-t border-border pt-12"
            aria-labelledby="related-products"
          >
            <p className="font-display text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Keep browsing
            </p>
            <h2 id="related-products" className="mt-2 text-3xl tracking-tight">
              You may also like
            </h2>
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((entry) => (
                <ProductCard key={entry.id} product={entry} />
              ))}
            </div>
          </section>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}
