import sharp from "sharp";

// Longest side kept in storage. The largest slot on the site is the product
// gallery at ~640 CSS px, so this covers 2x/retina screens; next/image
// derives the smaller per-device sizes from it on demand.
const MAX_DIMENSION = 1600;
// Visually indistinguishable from the source for photos; lossless WebP would
// often be larger than the original JPEG.
const WEBP_QUALITY = 85;

// Normalizes any uploaded image to a WebP that is at most MAX_DIMENSION on
// its longest side: applies EXIF rotation, never upscales, and strips
// metadata (including GPS location from phone photos).
export async function toOptimizedWebp(input: ArrayBuffer | Buffer): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toBuffer();
}
