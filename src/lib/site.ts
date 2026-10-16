const configuredSiteUrl = import.meta.env["VITE_SITE_URL"] as string | undefined;

export const SITE_URL = (configuredSiteUrl || "https://perfectbuy.co.za").replace(/\/$/, "");

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const siteName = "Perfect Buy";
export const supportPhone = "071 463 2853";
export const supportPhoneInternational = "+27714632853";
export const supportWhatsApp = "https://wa.me/27714632853";
export const defaultDescription =
  "Perfect Buy is a South African online store for curated fashion, gifts, wellness products and useful everyday finds.";

export function pageHead(title: string, description: string, path: string) {
  const canonicalUrl = absoluteUrl(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl },
      { property: "og:image", content: absoluteUrl("/new-arrivals-hero.webp") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
  };
}
