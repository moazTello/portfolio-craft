import { MetadataRoute } from 'next'

export default async function sitemap({
  params,
}: {
  params: { username: string }
}): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `https://${params.username}.portfoliocraft.com`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}