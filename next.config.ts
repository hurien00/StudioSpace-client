import type { NextConfig } from "next";

if (
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PUBLIC_API_URL
) {
  console.warn(
    "[StudioSpace] NEXT_PUBLIC_API_URL is not set. The production bundle " +
      "will fall back to http://localhost:8000. Set it in Vercel before deploying."
  );
}

const nextConfig: NextConfig = {
  // Studio photos are user-supplied and can come from any host (ImgBB,
  // Unsplash, Cloudinary, ...), so serve them as-is instead of maintaining a
  // `remotePatterns` allowlist that would break new listings. Swap this for
  // `remotePatterns` if you want Vercel's image optimizer and control hosts.
  images: {
    unoptimized: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
