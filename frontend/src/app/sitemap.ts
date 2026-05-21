import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.portfolio-craft.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // جيب كل البورتفوليوات المنشورة
  let portfolios: { username: string; updatedAt: string }[] = []
  try {
    const res = await fetch(`${API_URL}/portfolios/public/all`, { cache: 'no-store' })
    if (res.ok) portfolios = await res.json()
  } catch {}

  const portfolioUrls = portfolios.map(p => ({
    url: `${SITE_URL}/${p.username}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: SITE_URL, lastModified: new Date(), priority: 1 },
    { url: `${SITE_URL}/login`, priority: 0.8 },
    { url: `${SITE_URL}/register`, priority: 0.8 },
    { url: `${SITE_URL}/privacy`, priority: 0.5 },
    { url: `${SITE_URL}/terms`, priority: 0.5 },
    ...portfolioUrls,
  ]
}