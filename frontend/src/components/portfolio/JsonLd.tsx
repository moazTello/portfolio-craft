export function JsonLd({ portfolio, username }: { portfolio: any; username: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: portfolio.heroTitle,
    jobTitle: portfolio.heroSubtitle,
    description: portfolio.aboutText,
    email: portfolio.email,
    telephone: portfolio.phone,
    url: `https://${username}.portfoliocraft.com`,
    sameAs: [
      portfolio.linkedin,
      portfolio.github,
      portfolio.twitter,
      portfolio.website,
    ].filter(Boolean),
    knowsAbout: portfolio.skills?.map((s: any) => s.name) ?? [],
    worksFor: portfolio.experiences?.[0] ? {
      '@type': 'Organization',
      name: portfolio.experiences[0].company,
    } : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}