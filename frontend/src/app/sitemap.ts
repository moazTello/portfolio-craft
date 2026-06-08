import { MetadataRoute } from 'next'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.portfolio-craft.com').replace(/\/$/, '')
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1').replace(/\/$/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    { url: `${SITE_URL}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${SITE_URL}/login`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/register`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly' as const, priority: 0.3 },
    ...portfolioUrls,
  ]
}