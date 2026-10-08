/** Output of an `?responsive` import (vite-imagetools `as=picture`). */
export interface Picture {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
}

/** Local assets arrive as a Picture; legacy projects use plain URLs. */
export type ImageSource = Picture | string;

export const isPicture = (src: ImageSource): src is Picture => typeof src !== "string";

export const srcOf = (src: ImageSource) => (isPicture(src) ? src.img.src : src);

export const srcSetOf = (src: ImageSource) => (isPicture(src) ? (src.sources.webp ?? undefined) : undefined);

export const CARD_SIZES = "(min-width: 1200px) 540px, (min-width: 768px) 46vw, 92vw";
export const HERO_SIZES = "(min-width: 1200px) 1120px, 94vw";

/** Shared-element name: a project card image morphs into the case-study hero. */
export const mediaTransitionName = (id: number) => `project-media-${id}`;

/** Warms the cache with the candidate the browser would pick for `sizes`. */
export function preloadImage(src: ImageSource, sizes: string) {
  const img = new Image();
  img.decoding = "async";
  const srcSet = srcSetOf(src);
  if (srcSet) {
    img.sizes = sizes;
    img.srcset = srcSet;
  }
  img.src = srcOf(src);
  return img.decode().catch(() => undefined);
}
