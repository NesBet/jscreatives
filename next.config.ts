import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
  transpilePackages: ["gsap"],
  turbopack: {
    resolveAlias: {
      "gsap/ScrollTrigger": "gsap/dist/ScrollTrigger.js",
      "gsap/ScrollToPlugin": "gsap/dist/ScrollToPlugin.js",
      "gsap/Observer": "gsap/dist/Observer.js",
      "gsap/Draggable": "gsap/dist/Draggable.js",
    },
  },
};

export default nextConfig;