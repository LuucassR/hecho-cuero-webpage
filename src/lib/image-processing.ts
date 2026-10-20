import sharp from "sharp";
import { MAX_DIMENSION } from "./image-variants";

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

// Scales an already optimized WebP down to `width`. Never upscales: a small
// original yields a same-size copy, so every variant path always exists.
export async function toWebpVariant(webp: Buffer, width: number): Promise<Buffer> {
  return sharp(webp)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toBuffer();
}
