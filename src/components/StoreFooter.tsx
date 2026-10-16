import { Link } from "@tanstack/react-router";
import { desktopCategories, fashionCollections } from "@/lib/catalog";
import { supportPhone, supportPhoneInternational, supportWhatsApp } from "@/lib/site";

const linkClass = "text-sm text-muted-foreground transition-colors hover:text-primary";

export function StoreFooter() {
  return (
    <footer className="border-t border-border bg-background py-10 lg:py-12">
      <div className="shell grid items-start gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-[minmax(320px,1.5fr)_repeat(3,minmax(150px,1fr))] lg:gap-x-12">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" aria-label="Perfect Buy home">
            <img
              src="/perfect-buy-logo-wide.webp"
              alt="Perfect Buy"
              className="h-auto w-72 max-w-full"
              width={1920}
              height={437}
              loading="lazy"
              decoding="async"
            />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            Shop Smart, Choose Perfect. A South African online store for curated fashion, playful
            gifts, wellness products and useful everyday finds.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Customer help:{" "}
            <a
              className="font-semibold text-primary hover:underline"
              href={`tel:${supportPhoneInternational}`}
            >
              {supportPhone}
            </a>
          </p>
          <a
            href={supportWhatsApp}
            className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Chat with Perfect Buy on WhatsApp
          </a>
        </div>

        <div>
          <h2 className="text-sm tracking-[0.12em] uppercase">Shop</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link to="/shop" className={linkClass}>
                Shop All
              </Link>
            </li>
            {[...fashionCollections, ...desktopCategories].map((category) => (
              <li key={category.slug}>
                <Link
                  to="/shop/$category"
                  params={{ category: category.slug }}
                  className={linkClass}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm tracking-[0.12em] uppercase">Help</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link to="/delivery-returns" className={linkClass}>
                Delivery & Returns
              </Link>
            </li>
            <li>
              <Link to="/size-guide" className={linkClass}>
                Size Guide
              </Link>
            </li>
            <li>
              <Link to="/faq" className={linkClass}>
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className={linkClass}>
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm tracking-[0.12em] uppercase">Perfect Buy</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link to="/about" className={linkClass}>
                About
              </Link>
            </li>
            <li>
              <Link to="/blog" className={linkClass}>
                Blog
              </Link>
            </li>
            <li>
              <Link to="/privacy" className={linkClass}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className={linkClass}>
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="shell mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Perfect Buy. Prices shown in ZAR (R).</p>
        <p>Secure online checkout powered by Yoco.</p>
      </div>
    </footer>
  );
}
