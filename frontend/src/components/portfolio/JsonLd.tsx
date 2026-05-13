export function JsonLd({
  portfolio,
  username,
}: {
  portfolio: any
  username: string
}) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio-craft-swain.vercel.app'
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: portfolio.heroTitle,
    jobTitle: portfolio.heroSubtitle,
    description: portfolio.aboutText,
    email: portfolio.email,
    telephone: portfolio.phone,
    url: `${SITE_URL}/${username}`,
    sameAs: [
      portfolio.linkedin,
      portfolio.github,
      portfolio.twitter,
      portfolio.website,
    ].filter(Boolean),
    knowsAbout: portfolio.skills?.map((s: any) => s.name) ?? [],
    worksFor: portfolio.experiences?.[0]
      ? {
          '@type': 'Organization',
          name: portfolio.experiences[0].company,
        }
      : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}