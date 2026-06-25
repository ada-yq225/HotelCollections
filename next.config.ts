import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.ffycdn.net" },
      { protocol: "https", hostname: "cdn-assets-eu.frontify.com" },
      { protocol: "https", hostname: "**.fourseasons.com" },
      { protocol: "https", hostname: "**.aman.com" },
      { protocol: "https", hostname: "**.rosewoodhotels.com" },
      { protocol: "https", hostname: "**.chevalblanc.com" },
      { protocol: "https", hostname: "**.mandarinoriental.com" },
    ],
  },
};

export default nextConfig;