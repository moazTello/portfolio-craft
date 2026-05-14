import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value:
              "(?!localhost|portfolio-craft-swain\\.vercel\\.app|portfolio-craft\\.com|www\\.portfolio-craft\\.com|eng-moaz-tello\\.com|www\\.eng-moaz-tello\\.com)(?<domain>.*)",
          },
        ],
        destination: "/custom-domain/:path*",
      },
    ];
  },
};

export default nextConfig;
