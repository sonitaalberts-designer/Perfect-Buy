import { Link } from "@tanstack/react-router";
import { getCategory, type Product } from "@/lib/catalog";
import { responsiveImage } from "@/lib/responsive-image";

export function ProductCard({
  product,
  categoryLabel,
}: {
  product: Product;
  categoryLabel?: string;
}) {
  const formattedPrice =
    product.price === undefined ? null : new Intl.NumberFormat("en-ZA").format(product.price);

  return (
    <article className="product-card flex h-full min-w-0 flex-col">
      <div className="overflow-hidden rounded-lg border border-border bg-white shadow-soft">
        {product.images.length ? (
          <Link
            to="/products/$productId"
            params={{ productId: product.id }}
            className="group block w-full focus-visible:outline-2 focus-visible:outline-primary"
            aria-label={`View ${product.name}`}
          >
            <img
              {...responsiveImage(
                product.images[0]!,
                "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
              )}
              alt={product.name}
              width={640}
              height={640}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>
        ) : (
          <div className="flex aspect-square items-center justify-center bg-blush p-8 text-center">
            <div>
              <p className="font-display font-semibold">{product.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">Product photo coming soon</p>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {categoryLabel ?? getCategory(product.category)?.name}
      </p>
      <h3 className="mt-1 line-clamp-2 min-h-10 font-display text-base leading-5 font-semibold">
        <Link
          to="/products/$productId"
          params={{ productId: product.id }}
          className="hover:text-primary hover:underline"
        >
          {product.name}
        </Link>
      </h3>

      <div className="mt-auto">
        <p className="mt-3 font-display text-lg font-bold text-primary">
          {formattedPrice ? `R${formattedPrice}` : "Price on request"}
        </p>
        <Link
          to="/products/$productId"
          params={{ productId: product.id }}
          className="btn-base btn-pink mt-3 w-full"
          aria-label={`View ${product.name}`}
        >
          View product
        </Link>
      </div>
    </article>
  );
}
