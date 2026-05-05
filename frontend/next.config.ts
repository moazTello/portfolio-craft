import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "(?!localhost|portfoliocraft\\.com)(?<domain>.*)",
          },
        ],
        destination: "/custom-domain/:path*",
      },
    ];
  },
};

export default nextConfig;
