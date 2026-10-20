"use client";

import type { ImageLoaderProps } from "next/image";
import { BLOB_SERVE_PREFIX } from "./blob-access";
import { VARIANT_WIDTHS, variantPath } from "./image-variants";

// Replaces Vercel's image optimizer: uploads are resized to fixed widths when
// they are stored (see storeOptimizedImage in src/lib/blob.ts), so this only
// picks the smallest stored copy that covers the requested width. Anything
// else (images in /public, typed-in URLs) is served as is.
export default function imageLoader({ src, width }: ImageLoaderProps) {
  if (!src.startsWith(BLOB_SERVE_PREFIX) || !src.endsWith(".webp")) return src;
  const variant = VARIANT_WIDTHS.find((w) => w >= width);
  return variant ? variantPath(src, variant) : src;
}
