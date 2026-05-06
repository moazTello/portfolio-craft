import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { api } from '@/lib/api'
async function getPortfolioByDomain(domain: string) {
  try {
    // const res = await fetch(
    //   `http://localhost:3001/v1/portfolios/by-domain/${domain}`,
    //   { cache: 'no-store' }
    // )
    const res = await api.post(
      `/portfolios/by-domain/${domain}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export default async function CustomDomainPage() {
  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  const domain = host.replace('www.', '').split(':')[0]

  const portfolio = await getPortfolioByDomain(domain)
  if (!portfolio) return <div>Portfolio not found</div>

  redirect(`/${portfolio.username}`)
}