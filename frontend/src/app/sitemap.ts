import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://portfolio-craft-swain.vercel.app',
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: 'https://portfolio-craft-swain.vercel.app/login',
      priority: 0.8,
    },
    {
      url: 'https://portfolio-craft-swain.vercel.app/register',
      priority: 0.8,
    },
    {
      url: 'https://portfolio-craft-swain.vercel.app/privacy',
      priority: 0.5,
    },
    {
      url: 'https://portfolio-craft-swain.vercel.app/terms',
      priority: 0.5,
    },
  ]
}