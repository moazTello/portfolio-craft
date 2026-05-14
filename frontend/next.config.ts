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
              "(?!localhost|portfolio-craft-swain\\.vercel\\.app|www\\.portfolio-craft\\.com|portfolio-craft\\.com)(?<domain>.*\\..+)",
          },
        ],
        destination: "/custom-domain/:path*",
      },
    ];
  },
};

export default nextConfig;
