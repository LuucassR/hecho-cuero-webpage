// Shared by the upload pipeline, the image loader and next.config.ts, so it
// must not import sharp or anything server-only.

// Longest side kept for the stored original. The largest slot on the site is
// the product gallery at ~640 CSS px, so this covers 2x/retina screens.
export const MAX_DIMENSION = 1600;

// Smaller copies stored next to every uploaded original, by width. Together
// with the original they are the only widths next/image asks for (see
// next.config.ts), so each srcset candidate maps to a real file.
export const VARIANT_WIDTHS = [256, 640, 1080];

// products/bolso-AbC123.webp -> products/bolso-AbC123.w640.webp
// Works on Blob pathnames and on the served paths that wrap them.
export function variantPath(path: string, width: number) {
  return path.replace(/\.webp$/, `.w${width}.webp`);
}

// Variants are never referenced from the database; this tells them apart
// from originals when listing the store.
export function isVariantPath(path: string) {
  return /\.w\d+\.webp$/.test(path);
}
