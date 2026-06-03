import { MetadataRoute } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.portfolio-craft.com"
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/login`,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/register`,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      priority: 0.5,
    },
  ];
}
