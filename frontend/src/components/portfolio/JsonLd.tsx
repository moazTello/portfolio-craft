export function JsonLd({
  portfolio,
  username,
}: {
  portfolio: any;
  username: string;
}) {
  // const SITE_URL =
  //   process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.portfolio-craft.com";
  const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.portfolio-craft.com"
  ).replace(/\/$/, "");

  // const jsonLd = {
  //   "@context": "https://schema.org",
  //   "@type": "Person",
  //   name: portfolio.heroTitle,
  //   jobTitle: portfolio.heroSubtitle,
  //   description: portfolio.aboutText,
  //   email: portfolio.email,
  //   telephone: portfolio.phone,
  //   url: `${SITE_URL}/${username}`,
  //   image: portfolio.user?.avatarUrl, // ← أضف الصورة
  //   address: portfolio.location
  //     ? {
  //         // ← أضف الموقع
  //         "@type": "PostalAddress",
  //         addressLocality: portfolio.location,
  //       }
  //     : undefined,
  //   sameAs: [
  //     portfolio.linkedin,
  //     portfolio.github,
  //     portfolio.twitter,
  //     portfolio.website,
  //   ].filter(Boolean),
  //   knowsAbout: portfolio.skills?.map((s: any) => s.name) ?? [],
  //   worksFor: portfolio.experiences?.[0]
  //     ? {
  //         "@type": "Organization",
  //         name: portfolio.experiences[0].company,
  //       }
  //     : undefined,
  // };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",

    "@id": `${SITE_URL}/${username}#person`,

    name: portfolio.fullName || portfolio.user?.name || username,

    jobTitle: portfolio.heroSubtitle,

    hasOccupation: {
      "@type": "Occupation",
      name: portfolio.heroSubtitle,
    },

    description: portfolio.aboutText,

    image: portfolio.user?.avatarUrl,

    email: portfolio.email,

    telephone: portfolio.phone,

    url: `${SITE_URL}/${username}`,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${username}`,
    },

    address: portfolio.location
      ? {
          "@type": "PostalAddress",
          addressLocality: portfolio.location,
        }
      : undefined,

    sameAs: [
      portfolio.linkedin,
      portfolio.github,
      portfolio.twitter,
      portfolio.website,
    ].filter(Boolean),

    knowsAbout: portfolio.skills?.map((s: any) => s.name) ?? [],

    worksFor: portfolio.experiences?.[0]
      ? {
          "@type": "Organization",
          name: portfolio.experiences[0].company,
        }
      : undefined,

    subjectOf: {
      "@type": "CreativeWork",
      name: `${portfolio.heroSubtitle} Portfolio`,
      url: `${SITE_URL}/${username}`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
