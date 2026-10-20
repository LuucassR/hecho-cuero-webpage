import type { NextConfig } from "next";
import { MAX_DIMENSION, VARIANT_WIDTHS } from "./src/lib/image-variants";

const nextConfig: NextConfig = {
  images: {
    // No Vercel image optimization: uploads are stored pre-resized and the
    // loader just picks a stored copy (see src/lib/image-loader.ts).
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Limit srcset candidates to the widths that exist in Blob, so no two
    // candidates resolve to the same file.
    imageSizes: [VARIANT_WIDTHS[0]],
    deviceSizes: [...VARIANT_WIDTHS.slice(1), MAX_DIMENSION],
  },
};

export default nextConfig;
