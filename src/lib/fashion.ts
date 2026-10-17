import type { Product } from "./catalog";

// Describe the listed design only; measurements and materials must be confirmed separately.
export const fashionDetails: Record<string, { title: string; highlights: string[] }> = {
  "swarovski-blinged-nike-air-max-27c-full-pink": {
    title: "Full Pink Crystal Air Max Sneakers",
    highlights: [
      "Full-pink colourway",
      "Sparkling crystal details",
      "Air Max statement silhouette",
    ],
  },
  "swarovski-blinged-nike-air-max-27c": {
    title: "White & Black Crystal Air Max Sneakers",
    highlights: [
      "Contrasting white and black design",
      "Sparkling crystal customisation",
      "Sculpted air-cushion profile",
    ],
  },
  "nike-air-max-no-bling": {
    title: "Pink Air Max Sneakers — No Bling",
    highlights: [
      "Pink Air Max style",
      "No crystal embellishments",
      "Streamlined everyday statement look",
    ],
  },
  "ice-blue-bling-air-force-1": {
    title: "Ice Blue Bling Air Force Sneakers",
    highlights: ["White low-top Air Force style", "Ice-blue laces", "Blue crystal accents"],
  },
  "new-bling-womens-air-max-27c-swarovski": {
    title: "Women's Crystal Air Max 27C Sneakers",
    highlights: ["Monochrome upper", "Visible cushioning", "Swarovski crystal detailing"],
  },
  "rose-gold-air-max-27c-swarovski": {
    title: "Rose Gold Crystal Air Max 27C Sneakers",
    highlights: [
      "Rose-gold colourway",
      "Swarovski crystal finish",
      "Crystal details on the checks and Air features",
    ],
  },
  "butterfly-af1": {
    title: "Blue Butterfly AF1 Sneakers",
    highlights: [
      "White low-top AF1 style",
      "Blue butterfly accents",
      "Decorative crystal detailing",
    ],
  },
  "pearl-crystal-af1": {
    title: "White Pearl & Crystal AF1 Sneakers",
    highlights: [
      "White low-top AF1 style",
      "Pearl accents",
      "Crystal details for a statement finish",
    ],
  },
  "cheeta-pajamas": {
    title: "White Timeless Cheetah Print Pajama Set",
    highlights: [
      "White and grey cheetah print",
      "Short-sleeve button-up pajama set",
      "Dark piping around the edges",
    ],
  },
  "striped-pajamas": {
    title: "White Timeless Striped Pajama Set",
    highlights: ["Subtle white stripes", "Short-sleeve button-up top", "Relaxed matching shorts"],
  },
};

export function fashionSearchDescription(product: Product): string | undefined {
  const details = fashionDetails[product.id];
  if (!details) return undefined;
  const sizes = product.sizes?.join(", ");
  const sizeText = sizes
    ? ` Sizes ${sizes}${product.category === "footwear" ? " (SA/UK)" : ""}.`
    : "";
  const price = product.price === undefined ? "" : ` R${product.price.toFixed(2)}.`;
  return `${details.title} at Perfect Buy South Africa.${price}${sizeText} View photos and product details.`;
}
