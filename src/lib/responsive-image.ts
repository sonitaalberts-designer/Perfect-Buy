import variants from "./image-variants.json";

// New catalog images still work before responsive variants have been generated.
export function responsiveImage(source: string, sizes: string) {
  const images = (variants as Record<string, { src: string; width: number }[]>)[source];
  if (!images) return { src: source };
  return {
    src: images.find((image) => image.width >= 640)?.src ?? images.at(-1)!.src,
    srcSet: images.map((image) => `${image.src} ${image.width}w`).join(", "),
    sizes,
  };
}
