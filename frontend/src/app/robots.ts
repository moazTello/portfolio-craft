// import { MetadataRoute } from 'next'

// export default function robots(): MetadataRoute.Robots {
//   return {
//     rules: {
//       userAgent: '*',
//       allow: '/',
//       disallow: '/dashboard/',
//     },
//     sitemap: 'https://www.portfolio-craft.com/sitemap.xml',
//   }
// }

import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers()
  const host = headersList.get('host') ?? 'portfolio-craft.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/',
    },
    sitemap: `https://${host}/sitemap.xml`,
  }
}