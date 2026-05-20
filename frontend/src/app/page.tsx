// import Link from 'next/link'
// import { cookies } from 'next/headers'
// import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'

// type Locale = 'en' | 'ar' | 'de'

// async function getMessages(locale: Locale) {
//   return (await import(`../../messages/${locale}.json`)).default
// }

// function t(messages: any, key: string): string {
//   const keys = key.split('.')
//   let val: any = messages
//   for (const k of keys) val = val?.[k]
//   return val ?? key
// }

// export async function generateMetadata() {
//   const cookieStore = await cookies()
//   const locale = (cookieStore.get('locale')?.value ?? 'en') as Locale
//   const messages = await getMessages(locale)

//   return {
//     title: 'PortfolioCraft — ' + t(messages, 'hero.badge'),
//     description: t(messages, 'hero.subtitle'),
//     openGraph: {
//       title: 'PortfolioCraft — Build your professional portfolio',
//       description: t(messages, 'hero.subtitle'),
//       url: 'https://www.portfolio-craft.com',
//       siteName: 'PortfolioCraft',
//       images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PortfolioCraft' }],
//       locale: locale === 'ar' ? 'ar_AR' : locale === 'de' ? 'de_DE' : 'en_US',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: 'PortfolioCraft — Build your professional portfolio',
//       description: t(messages, 'hero.subtitle'),
//       images: ['/og-image.png'],
//     },
//   }
// }

// export default async function LandingPage() {
//   const cookieStore = await cookies()
//   const locale = (cookieStore.get('locale')?.value ?? 'en') as Locale
//   const messages = await getMessages(locale)
//   const isRtl = locale === 'ar'

//   return (
//     <div className="font-sans text-gray-900 bg-white" dir={isRtl ? 'rtl' : 'ltr'}>

//       {/* Nav */}
//       <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-100">
//         <div className="font-serif text-xl">
//           Portfolio<span className="text-indigo-600">Craft</span>
//         </div>
//         <div className="hidden md:flex gap-7">
//           {(['features', 'examples', 'pricing', 'faq'] as const).map(s => (
//             <a key={s} href={`#${s}`} className="text-sm text-gray-500 hover:text-gray-900 transition">
//               {t(messages, `nav.${s}`)}
//             </a>
//           ))}
//         </div>
//         <div className="flex items-center gap-3">
//           <LanguageSwitcher current={locale} />
//           <Link href="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
//             {t(messages, 'nav.getStarted')}
//           </Link>
//         </div>
//       </nav>

//       {/* Hero */}
//       <section className="px-6 md:px-10 py-20 text-center bg-linear-to-b from-indigo-50 to-white border-b border-gray-100">
//         <div className="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
//           {t(messages, 'hero.badge')}
//         </div>
//         <h1 className="font-serif text-4xl md:text-6xl leading-tight text-gray-950 max-w-2xl mx-auto mb-5">
//           {t(messages, 'hero.title')}{' '}
//           <em className="italic text-indigo-600">{t(messages, 'hero.titleEm')}</em>{' '}
//           {t(messages, 'hero.titleEnd')}
//         </h1>
//         <p className="text-base md:text-lg text-gray-500 max-w-md mx-auto mb-9 font-light leading-relaxed">
//           {t(messages, 'hero.subtitle')}
//         </p>
//         <div className="flex flex-col sm:flex-row gap-3 justify-center">
//           <Link href="/register" className="bg-indigo-600 text-white px-7 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
//             {t(messages, 'hero.startFree')}
//           </Link>
//           <a href="#examples" className="bg-white text-gray-700 px-7 py-3 rounded-xl text-sm border border-gray-200 hover:bg-gray-50 transition">
//             {t(messages, 'hero.seeExamples')}
//           </a>
//         </div>
//         <div className="flex flex-wrap justify-center gap-10 mt-12 pt-8 border-t border-gray-100">
//           {[
//             ['1,200+', t(messages, 'hero.stat1')],
//             ['12', t(messages, 'hero.stat2')],
//             ['5 min', t(messages, 'hero.stat3')],
//           ].map(([num, label]) => (
//             <div key={label}>
//               <span className="font-serif text-3xl text-gray-950 block">{num}</span>
//               <span className="text-xs text-gray-400">{label}</span>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Features */}
//       <section id="features" className="px-6 md:px-10 py-16">
//         <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-2">{t(messages, 'features.label')}</p>
//         <h2 className="font-serif text-3xl md:text-4xl text-gray-950 mb-3">{t(messages, 'features.title')}</h2>
//         <p className="text-gray-400 text-sm mb-10 font-light">{t(messages, 'features.subtitle')}</p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {(['themes', 'domain', 'booking', 'pdf', 'analytics', 'blog'] as const).map(key => (
//             <div key={key} className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
//               <div className="text-2xl mb-3">
//                 {key === 'themes' ? '🎨' : key === 'domain' ? '🌐' : key === 'booking' ? '📅' : key === 'pdf' ? '📄' : key === 'analytics' ? '📊' : '✍️'}
//               </div>
//               <h3 className="text-sm font-medium text-gray-900 mb-2">{t(messages, `features.${key}.title`)}</h3>
//               <p className="text-xs text-gray-400 leading-relaxed font-light">{t(messages, `features.${key}.desc`)}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       <hr className="border-gray-100" />

//       {/* Examples */}
//       <section id="examples" className="px-6 md:px-10 py-16">
//         <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-2">{t(messages, 'examples.label')}</p>
//         <h2 className="font-serif text-3xl md:text-4xl text-gray-950 mb-3">{t(messages, 'examples.title')}</h2>
//         <p className="text-gray-400 text-sm mb-10 font-light">{t(messages, 'examples.subtitle')}</p>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {[
//             { bg: '#0f172a', accent: '#7C3AED', label: 'Creative Dev', name: 'Moaz T.', role: 'React Developer', href: 'https://www.eng-moaz-tello.com' },
//             { bg: '#f8f4ef', accent: '#1a1a1a', label: 'Designer', name: 'Coming Soon', role: 'UI/UX Designer', href: null },
//             { bg: '#EEF2FF', accent: '#4338CA', label: 'Consultant', name: 'Coming Soon', role: 'Business Consultant', href: null },
//           ].map(({ bg, accent, label, name, role, href }) => (
//             <div key={name} className="border border-gray-100 rounded-2xl overflow-hidden">
//               <div className="h-36 flex items-center justify-center" style={{ background: bg }}>
//                 <span className="font-serif text-lg italic" style={{ color: accent }}>{label}</span>
//               </div>
//               <div className="p-4 flex justify-between items-center">
//                 <div>
//                   <div className="text-sm font-medium text-gray-900">{name}</div>
//                   <div className="text-xs text-gray-400">{role}</div>
//                 </div>
//                 {href ? (
//                   <Link href={href} target="_blank" className="text-xs text-indigo-500 hover:underline">View →</Link>
//                 ) : (
//                   <span className="text-xs text-gray-300">{t(messages, 'examples.soon')}</span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <hr className="border-gray-100" />

//       {/* Pricing */}
//       <section id="pricing" className="px-6 md:px-10 py-16">
//         <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-2">{t(messages, 'pricing.label')}</p>
//         <h2 className="font-serif text-3xl md:text-4xl text-gray-950 mb-3">{t(messages, 'pricing.title')}</h2>
//         <p className="text-gray-400 text-sm mb-10 font-light">{t(messages, 'pricing.subtitle')}</p>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {(['free', 'pro', 'business'] as const).map(plan => (
//             <div key={plan} className={`relative rounded-2xl p-6 ${plan === 'pro' ? 'border-2 border-indigo-500' : 'border border-gray-100'}`}>
//               {plan === 'pro' && (
//                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
//                   {t(messages, 'pricing.mostPopular')}
//                 </div>
//               )}
//               <div className="text-xs font-medium text-gray-400 mb-1">{t(messages, `pricing.${plan}.name`)}</div>
//               <div className="font-serif text-4xl text-gray-950 mb-1">
//                 {t(messages, `pricing.${plan}.price`)}{' '}
//                 <span className="font-sans text-sm text-gray-400">/ {t(messages, `pricing.${plan}.period`)}</span>
//               </div>
//               {plan !== 'free' && (
//                 <div className="flex items-center gap-2 mb-4">
//                   <span className="text-xs text-gray-400">{t(messages, 'pricing.or')}</span>
//                   <span className="text-xs font-medium text-gray-900">{t(messages, `pricing.${plan}.annual`)}</span>
//                   <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{t(messages, `pricing.${plan}.saving`)}</span>
//                 </div>
//               )}
//               {plan === 'free' && <div className="mb-4 h-5" />}
//               <div className="text-xs text-gray-400 mb-5 font-light">{t(messages, `pricing.${plan}.desc`)}</div>
//               <ul className="space-y-2 mb-6">
//                 {(plan === 'free'
//                   ? ['1 theme', '6 gallery photos', 'portfoliocraft.com/you', 'Basic analytics']
//                   : plan === 'pro'
//                   ? ['6 premium themes', 'Custom domain', '30 gallery photos', 'Blog system']
//                   : ['All 12 themes', 'Booking system', 'PDF CV export', 'Unlimited gallery']
//                 ).map(f => (
//                   <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
//                     <span className="text-indigo-500 font-medium">✓</span> {f}
//                   </li>
//                 ))}
//               </ul>
//               <Link href="/register" className={`block w-full py-2.5 rounded-xl text-xs font-medium text-center transition ${plan === 'pro' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}>
//                 {t(messages, `pricing.${plan}.cta`)}
//               </Link>
//             </div>
//           ))}
//         </div>
//       </section>

//       <hr className="border-gray-100" />

//       {/* FAQ */}
//       <section id="faq" className="px-6 md:px-10 py-16">
//         <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-2">{t(messages, 'faq.label')}</p>
//         <h2 className="font-serif text-3xl md:text-4xl text-gray-950 mb-3">{t(messages, 'faq.title')}</h2>
//         <p className="text-gray-400 text-sm mb-10 font-light">{t(messages, 'faq.subtitle')}</p>
//         <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
//           {(['q1', 'q2', 'q3', 'q4', 'q5'] as const).map(q => (
//             <div key={q} className="bg-gray-50 px-5 py-4">
//               <p className="text-sm font-medium text-gray-900 mb-2">{t(messages, `faq.${q}.q`)}</p>
//               <p className="text-xs text-gray-500 leading-relaxed font-light">{t(messages, `faq.${q}.a`)}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="bg-gray-950 px-6 md:px-10 py-20 text-center">
//         <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">{t(messages, 'cta.title')}</h2>
//         <p className="text-gray-400 text-sm mb-8 font-light">{t(messages, 'cta.subtitle')}</p>
//         <Link href="/register" className="bg-indigo-600 text-white px-9 py-3.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition inline-block">
//           {t(messages, 'cta.button')}
//         </Link>
//       </section>

//       {/* Footer */}
//       <footer className="px-6 md:px-10 py-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
//         <div className="font-serif text-base">
//           Portfolio<span className="text-indigo-600">Craft</span>
//         </div>
//         <div className="flex flex-wrap justify-center gap-4 items-center">
//           <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition">{t(messages, 'footer.privacy')}</Link>
//           <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600 transition">{t(messages, 'footer.terms')}</Link>
//           <span className="text-xs text-gray-400">{t(messages, 'footer.copy')}</span>
//         </div>
//       </footer>

//     </div>
//   )
// }
import Link from "next/link";
import { cookies } from "next/headers";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

type Locale = "en" | "ar" | "de";

async function getMessages(locale: Locale) {
  return (await import(`../../messages/${locale}.json`)).default;
}

function t(messages: any, key: string): string {
  const keys = key.split(".");
  let val: any = messages;
  for (const k of keys) val = val?.[k];
  return val ?? key;
}

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value ?? "en") as Locale;
  const messages = await getMessages(locale);
  return {
    title: "PortfolioCraft — " + t(messages, "hero.badge"),
    description: t(messages, "hero.subtitle"),
    openGraph: {
      title: "PortfolioCraft — Build your professional portfolio",
      description: t(messages, "hero.subtitle"),
      url: "https://www.portfolio-craft.com",
      siteName: "PortfolioCraft",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "PortfolioCraft",
        },
      ],
      locale: locale === "ar" ? "ar_AR" : locale === "de" ? "de_DE" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "PortfolioCraft — Build your professional portfolio",
      description: t(messages, "hero.subtitle"),
      images: ["/og-image.png"],
    },
  };
}

export default async function LandingPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value ?? "en") as Locale;
  const messages = await getMessages(locale);
  const isRtl = locale === "ar";

  return (
    <div
      className="font-sans text-gray-900 bg-white"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <style>{`
    :root { color-scheme: light only; }
    * { color-scheme: light only; }
  `}</style>
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 md:px-10 py-4 border-b border-gray-100">
        <div className="font-serif text-lg md:text-xl">
          Portfolio<span className="text-indigo-600">Craft</span>
        </div>
        <div className="hidden md:flex gap-7">
          {(["features", "examples", "pricing", "faq"] as const).map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="text-sm text-gray-500 hover:text-gray-900 transition capitalize"
            >
              {t(messages, `nav.${s}`)}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher current={locale} />
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-3 py-1.5 md:px-5 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-indigo-700 transition"
          >
            {t(messages, "nav.getStarted")}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 md:px-10 py-16 md:py-20 text-center bg-linear-to-b from-indigo-50 to-white border-b border-gray-100">
        <div className="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-5 uppercase tracking-wide">
          {t(messages, "hero.badge")}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl leading-tight text-gray-950 max-w-2xl mx-auto mb-4">
          {t(messages, "hero.title")}{" "}
          <em className="italic text-indigo-600">
            {t(messages, "hero.titleEm")}
          </em>{" "}
          {t(messages, "hero.titleEnd")}
        </h1>
        <p className="text-sm md:text-lg text-gray-500 max-w-md mx-auto mb-8 font-light leading-relaxed">
          {t(messages, "hero.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-7 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
          >
            {t(messages, "hero.startFree")}
          </Link>
          <a
            href="#examples"
            className="bg-white text-gray-700 px-7 py-3 rounded-xl text-sm border border-gray-200 hover:bg-gray-50 transition"
          >
            {t(messages, "hero.seeExamples")}
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-10 pt-8 border-t border-gray-100">
          {[
            ["1,200+", t(messages, "hero.stat1")],
            ["12", t(messages, "hero.stat2")],
            ["5 min", t(messages, "hero.stat3")],
          ].map(([num, label]) => (
            <div key={label}>
              <span className="font-serif text-2xl md:text-3xl text-gray-950 block">
                {num}
              </span>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 md:px-10 py-14 md:py-16">
        <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-2">
          {t(messages, "features.label")}
        </p>
        <h2 className="font-serif text-2xl md:text-4xl text-gray-950 mb-3">
          {t(messages, "features.title")}
        </h2>
        <p className="text-gray-400 text-sm mb-8 font-light">
          {t(messages, "features.subtitle")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(
            ["themes", "domain", "booking", "pdf", "analytics", "blog"] as const
          ).map((key) => (
            <div
              key={key}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-5 md:p-6"
            >
              <div className="text-2xl mb-3">
                {key === "themes"
                  ? "🎨"
                  : key === "domain"
                    ? "🌐"
                    : key === "booking"
                      ? "📅"
                      : key === "pdf"
                        ? "📄"
                        : key === "analytics"
                          ? "📊"
                          : "✍️"}
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                {t(messages, `features.${key}.title`)}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                {t(messages, `features.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Examples */}
      <section id="examples" className="px-4 md:px-10 py-14 md:py-16">
        <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-2">
          {t(messages, "examples.label")}
        </p>
        <h2 className="font-serif text-2xl md:text-4xl text-gray-950 mb-3">
          {t(messages, "examples.title")}
        </h2>
        <p className="text-gray-400 text-sm mb-8 font-light">
          {t(messages, "examples.subtitle")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              bg: "#0f172a",
              accent: "#7C3AED",
              label: "Creative Dev",
              name: "Moaz T.",
              role: "React Developer",
              href: "https://www.eng-moaz-tello.com",
            },
            {
              bg: "#f8f4ef",
              accent: "#1a1a1a",
              label: "Designer",
              name: "Coming Soon",
              role: "UI/UX Designer",
              href: null,
            },
            {
              bg: "#EEF2FF",
              accent: "#4338CA",
              label: "Consultant",
              name: "Coming Soon",
              role: "Business Consultant",
              href: null,
            },
          ].map(({ bg, accent, label, name, role, href }) => (
            <div
              key={name}
              className="border border-gray-100 rounded-2xl overflow-hidden"
            >
              <div
                className="h-32 md:h-36 flex items-center justify-center"
                style={{ background: bg }}
              >
                <span
                  className="font-serif text-lg italic"
                  style={{ color: accent }}
                >
                  {label}
                </span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {name}
                  </div>
                  <div className="text-xs text-gray-400">{role}</div>
                </div>
                {href ? (
                  <Link
                    href={href}
                    target="_blank"
                    className="text-xs text-indigo-500 hover:underline"
                  >
                    View →
                  </Link>
                ) : (
                  <span className="text-xs text-gray-300">
                    {t(messages, "examples.soon")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Pricing */}
      <section id="pricing" className="px-4 md:px-10 py-14 md:py-16">
        <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-2">
          {t(messages, "pricing.label")}
        </p>
        <h2 className="font-serif text-2xl md:text-4xl text-gray-950 mb-3">
          {t(messages, "pricing.title")}
        </h2>
        <p className="text-gray-400 text-sm mb-8 font-light">
          {t(messages, "pricing.subtitle")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(["free", "pro", "business"] as const).map((plan) => (
            <div
              key={plan}
              className={`relative rounded-2xl p-5 md:p-6 ${plan === "pro" ? "border-2 border-indigo-500" : "border border-gray-100"}`}
            >
              {plan === "pro" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                  {t(messages, "pricing.mostPopular")}
                </div>
              )}
              <div className="text-xs font-medium text-gray-400 mb-1">
                {t(messages, `pricing.${plan}.name`)}
              </div>
              <div className="font-serif text-3xl md:text-4xl text-gray-950 mb-1">
                {t(messages, `pricing.${plan}.price`)}{" "}
                <span className="font-sans text-sm text-gray-400">
                  / {t(messages, `pricing.${plan}.period`)}
                </span>
              </div>
              {plan !== "free" && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs text-gray-400">
                    {t(messages, "pricing.or")}
                  </span>
                  <span className="text-xs font-medium text-gray-900">
                    {t(messages, `pricing.${plan}.annual`)}
                  </span>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                    {t(messages, `pricing.${plan}.saving`)}
                  </span>
                </div>
              )}
              {plan === "free" && <div className="mb-4 h-5" />}
              <div className="text-xs text-gray-400 mb-4 font-light">
                {t(messages, `pricing.${plan}.desc`)}
              </div>
              <ul className="space-y-2 mb-5">
                {(plan === "free"
                  ? [
                      "1 theme",
                      "6 gallery photos",
                      "portfoliocraft.com/you",
                      "Basic analytics",
                    ]
                  : plan === "pro"
                    ? [
                        "6 premium themes",
                        "Custom domain",
                        "30 gallery photos",
                        "Blog system",
                      ]
                    : [
                        "All 12 themes",
                        "Booking system",
                        "PDF CV export",
                        "Unlimited gallery",
                      ]
                ).map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <span className="text-indigo-500 font-medium">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`block w-full py-2.5 rounded-xl text-xs font-medium text-center transition ${plan === "pro" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
              >
                {t(messages, `pricing.${plan}.cta`)}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* FAQ */}
      <section id="faq" className="px-4 md:px-10 py-14 md:py-16">
        <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-2">
          {t(messages, "faq.label")}
        </p>
        <h2 className="font-serif text-2xl md:text-4xl text-gray-950 mb-3">
          {t(messages, "faq.title")}
        </h2>
        <p className="text-gray-400 text-sm mb-8 font-light">
          {t(messages, "faq.subtitle")}
        </p>
        <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
          {(["q1", "q2", "q3", "q4", "q5"] as const).map((q) => (
            <div key={q} className="bg-gray-50 px-4 md:px-5 py-4">
              <p className="text-sm font-medium text-gray-900 mb-2">
                {t(messages, `faq.${q}.q`)}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                {t(messages, `faq.${q}.a`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-950 px-4 md:px-10 py-16 md:py-20 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl text-white mb-4">
          {t(messages, "cta.title")}
        </h2>
        <p className="text-gray-400 text-sm mb-8 font-light max-w-md mx-auto">
          {t(messages, "cta.subtitle")}
        </p>
        <Link
          href="/register"
          className="bg-indigo-600 text-white px-7 md:px-9 py-3 md:py-3.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition inline-block"
        >
          {t(messages, "cta.button")}
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-10 py-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="font-serif text-base">
          Portfolio<span className="text-indigo-600">Craft</span>
        </div>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 items-center">
          <Link
            href="/privacy"
            className="text-xs text-gray-400 hover:text-gray-600 transition"
          >
            {t(messages, "footer.privacy")}
          </Link>
          <Link
            href="/terms"
            className="text-xs text-gray-400 hover:text-gray-600 transition"
          >
            {t(messages, "footer.terms")}
          </Link>
          <span className="text-xs text-gray-400">
            {t(messages, "footer.copy")}
          </span>
        </div>
      </footer>
    </div>
  );
}
