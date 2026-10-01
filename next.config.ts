import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Uploaded images are served from /api/blob/file and never change (each
    // upload gets a new random pathname), so keep optimized variants for 31
    // days instead of the 4h default to avoid paying to re-transform them.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
