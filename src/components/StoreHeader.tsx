import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { categories, desktopCategories } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { count } = useCart();

  // Close the menu whenever the page changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-background shadow-header">
      <div className="flex w-full min-w-0 items-center gap-2 px-3 py-3 min-[360px]:gap-4 min-[360px]:px-5 sm:px-7 lg:gap-7 lg:px-10 lg:py-4">
        <Link to="/" className="relative z-10 shrink-0">
          <img
            src="/perfect-buy-logo-wide.webp"
            alt="Perfect Buy"
            className="h-9 w-auto min-[360px]:h-11 sm:h-12 lg:h-14"
            width={1920}
            height={437}
            decoding="async"
          />
        </Link>

        <nav className="hidden min-w-0 flex-1 lg:block" aria-label="Main navigation">
          <div className="flex items-center justify-center gap-5 xl:gap-7">
            <ul className="flex items-center gap-5 xl:gap-7">
              <li>
                <Link to="/shop" className="nav-link" activeProps={{ className: "text-primary" }}>
                  Shop All
                </Link>
              </li>
              {desktopCategories.slice(0, 2).map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/shop/$category"
                    params={{ category: c.slug }}
                    className="nav-link"
                    activeProps={{ className: "text-primary" }}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="relative hidden w-56 shrink-0 xl:block">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search Perfect Buy"
                className="h-10 w-full rounded-md border border-input bg-muted pr-4 pl-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-background"
              />
            </div>

            <ul className="flex items-center gap-5 xl:gap-7">
              {desktopCategories.slice(2).map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/shop/$category"
                    params={{ category: c.slug }}
                    className="nav-link"
                    activeProps={{ className: "text-primary" }}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <button
            aria-label="Account"
            className="hidden rounded-md p-2.5 transition-colors hover:bg-muted lg:inline-flex"
          >
            <User className="h-5 w-5" />
          </button>
          <button
            aria-label="Wishlist"
            className="hidden rounded-md p-2.5 transition-colors hover:bg-muted min-[360px]:inline-flex"
          >
            <Heart className="h-5 w-5" />
          </button>
          <Link
            to="/checkout"
            aria-label={`Cart${count ? ` with ${count} item${count === 1 ? "" : "s"}` : ""}`}
            className="relative rounded-md p-2 transition-colors hover:bg-muted min-[360px]:p-2.5"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-md p-2 transition-colors hover:bg-muted min-[360px]:p-2.5 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="shell pb-4 lg:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search Perfect Buy"
            className="h-11 w-full rounded-md border border-input bg-muted pr-4 pl-11 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-background"
          />
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Mobile menu" className="border-t border-border/60 bg-background lg:hidden">
          <ul className="shell flex flex-col py-2">
            <li>
              <Link
                to="/shop"
                className="block border-b border-border/50 py-3.5 font-display text-base font-semibold"
                activeProps={{ className: "text-primary" }}
              >
                Shop All
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/shop/$category"
                  params={{ category: c.slug }}
                  className="block border-b border-border/50 py-3.5 font-display text-base font-semibold"
                  activeProps={{ className: "text-primary" }}
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/blog"
                className="block border-b border-border/50 py-3.5 font-display text-base font-semibold"
                activeProps={{ className: "text-primary" }}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="block py-3.5 font-display text-base font-semibold"
                activeProps={{ className: "text-primary" }}
              >
                FAQ
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
