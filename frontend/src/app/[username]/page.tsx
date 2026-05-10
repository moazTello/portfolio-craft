// // 'use client'
// import type { Metadata } from "next";
// import { notFound } from "next/navigation";
// import {
//   FadeUp,
//   FadeIn,
//   SlideIn,
// } from "@/components/portfolio/AnimatedSection";
// import { SkillsBar } from "@/components/portfolio/SkillsBar";
// import { DarkModeToggle } from "@/components/shared/DarkModeToggle";
// import { JsonLd } from "@/components/portfolio/JsonLd";
// import { ContactForm } from "@/components/portfolio/ContactForm";
// import ExpandableText from "@/components/portfolio/EpandableCard";
// // import { ThemeProvider } from "@/components/shared/ThemeProvider";
// import { PortfolioThemeProvider } from '@/components/portfolio/ThemeProvider'
// import { getThemeById } from "@/components/portfolio/themes";
// async function getPortfolio(username: string) {
//   try {
//     const res = await fetch(
//       `http://localhost:3001/v1/portfolios/public/${username}`,
//       { next: { revalidate: 60 } },
//     );
//     if (!res.ok) return null;
//     return res.json();
//   } catch {
//     return null;
//   }
// }
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ username: string }>;
// }): Promise<Metadata> {
//   const { username } = await params;
//   const portfolio = await getPortfolio(username);
//   if (!portfolio) {
//     return {
//       title: "Portfolio Not Found",
//     };
//   }

//   return {
//     // title: portfolio.seoTitle ?? `${portfolio.heroTitle} | PortfolioCraft`,
//     // title: portfolio.seoTitle ?? `${portfolio.heroTitle} | PortfolioCraft`,
//     title: portfolio.seoTitle ?? portfolio.heroTitle,
//     description: portfolio.seoDescription ?? portfolio.aboutText?.slice(0, 160),
//     keywords: portfolio.skills?.map((s: any) => s.name).join(", "),
//     authors: [{ name: portfolio.heroTitle }],
//     openGraph: {
//       title: portfolio.seoTitle ?? portfolio.heroTitle,
//       description:
//         portfolio.seoDescription ?? portfolio.aboutText?.slice(0, 160),
//       type: "profile",
//       url: `https://${username}.portfoliocraft.com`,
//       images: portfolio.ogImage
//         ? [{ url: portfolio.ogImage, width: 1200, height: 630 }]
//         : [],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: portfolio.seoTitle ?? portfolio.heroTitle,
//       description:
//         portfolio.seoDescription ?? portfolio.aboutText?.slice(0, 160),
//       images: portfolio.ogImage ? [portfolio.ogImage] : [],
//     },
//     alternates: {
//       canonical: `https://${username}.portfoliocraft.com`,
//     },
//   };
// }

// export default async function PortfolioPage({
//   params,
// }: {
//   params: Promise<{ username: string }>;
// }) {
//   const { username } = await params;
//   const portfolio = await getPortfolio(username);
//   if (!portfolio) notFound();

//   // Track page view
//   await fetch("http://localhost:3001/v1/analytics/event", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       portfolioId: portfolio.id,
//       eventType: "page_view",
//       referrer: "",
//     }),
//   }).catch(() => {});
//   // const theme = getThemeById(portfolio.themePreset ?? "default");
//   const theme = getThemeById(
//     portfolio.themePreset ?? "default",
//   );
//   return (
//     <PortfolioThemeProvider theme={theme}>
//       {/* <main className="min-h-screen bg-white"> */}
//       <main
//         style={{
//           background: "var(--p-bg)",
//           color: "var(--p-text)",
//           minHeight: "100vh",
//         }}
//       >
//         <JsonLd portfolio={portfolio} username={username} />
//         <nav className="flex justify-end px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
//           <DarkModeToggle />
//         </nav>
//         {/* Hero */}
//         {/* <section className="bg-gradient-to-br from-indigo-50 to-white py-24 px-6">
//         <div className="max-w-3xl mx-auto text-center">
//           <h1 className="text-5xl font-bold text-gray-900 mb-4">
//             {portfolio.heroTitle ?? portfolio.username}
//           </h1>
//           {portfolio.heroSubtitle && (
//             <p className="text-xl text-indigo-600 font-medium mb-6">
//               {portfolio.heroSubtitle}
//             </p>
//           )}
//           {portfolio.aboutText && (
//             <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
//               {portfolio.aboutText}
//             </p>
//           )}
//           <div className="flex justify-center gap-4 mt-8">
//             {portfolio.github && (
//               <a
//                 href={portfolio.github}
//                 target="_blank"
//                 className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition"
//               >
//                 GitHub
//               </a>
//             )}
//             {portfolio.linkedin && (
//               <a
//                 href={portfolio.linkedin}
//                 target="_blank"
//                 className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition"
//               >
//                 LinkedIn
//               </a>
//             )}
//             {portfolio.email && (
//               <a
//                 href={`mailto:${portfolio.email}`}
//                 className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
//               >
//                 Contact Me
//               </a>
//             )}
//           </div>
//         </div>
//       </section> */}

//         {/* <section className="bg-linear-to-br from-indigo-50 to-white py-24 px-6"> */}
//         {/* <section className="bg-linear-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950 py-24 px-6">
//           <div className="max-w-3xl mx-auto text-center">
//             <FadeUp>
//               {portfolio.user?.avatarUrl && (
//                 <img
//                   src={portfolio.user.avatarUrl}
//                   alt={portfolio.heroTitle}
//                   className="w-36 h-36 rounded-full object-cover mx-auto mb-6 border-4 border-white dark:border-gray-800 shadow-md"
//                 />
//               )}
//               <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
//                 {portfolio.heroTitle ?? portfolio.username}
//               </h1>
//             </FadeUp>
//             <FadeUp delay={0.1}>
//               {portfolio.heroSubtitle && (
//                 <p className="text-xl text-indigo-600 font-medium mb-6">
//                   {portfolio.heroSubtitle}
//                 </p>
//               )}
//             </FadeUp>
//             <FadeUp delay={0.2}>
//               {portfolio.aboutText && (
//                 <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
//                   {portfolio.aboutText}
//                 </p>
//               )}
//             </FadeUp>
//             <FadeUp delay={0.3}>
//               <div className="flex justify-center gap-4 mt-8">
//                 {portfolio.github && (
//                   <a
//                     href={portfolio.github}
//                     target="_blank"
//                     className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition"
//                   >
//                     GitHub
//                   </a>
//                 )}
//                 {portfolio.linkedin && (
//                   <a
//                     href={portfolio.linkedin}
//                     target="_blank"
//                     className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition"
//                   >
//                     LinkedIn
//                   </a>
//                 )}
//                 {portfolio.email && (
//                   <a
//                     href={`mailto:${portfolio.email}`}
//                     className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
//                   >
//                     Contact Me
//                   </a>
//                 )}
//               </div>
//             </FadeUp>
//           </div>
//         </section> */}

//         {/* Hero */}
//         <section
//           style={{
//             background: `linear-gradient(135deg, var(--p-hero-from), var(--p-hero-to))`,
//           }}
//           className="py-24 px-6"
//         >
//           <div className="max-w-3xl mx-auto text-center">
//             <h1
//               style={{
//                 color: "var(--p-text)",
//                 fontFamily: theme.fonts.heading,
//               }}
//               className="text-5xl font-bold mb-4"
//             >
//               {portfolio.heroTitle}
//             </h1>
//             <p
//               style={{ color: "var(--p-primary)" }}
//               className="text-xl font-medium mb-6"
//             >
//               {portfolio.heroSubtitle}
//             </p>
//             <p
//               style={{ color: "var(--p-text-muted)" }}
//               className="text-lg leading-relaxed max-w-2xl mx-auto"
//             >
//               {portfolio.aboutText}
//             </p>
//             <div className="flex justify-center gap-4 mt-8">
//               {portfolio.github && (
//                 <a
//                   href={portfolio.github}
//                   target="_blank"
//                   style={{
//                     border: `1px solid var(--p-border)`,
//                     color: "var(--p-text-muted)",
//                   }}
//                   className="px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition"
//                 >
//                   GitHub
//                 </a>
//               )}
//               {portfolio.email && (
//                 <a
//                   href={`mailto:${portfolio.email}`}
//                   style={{
//                     background: "var(--p-btn-bg)",
//                     color: "var(--p-btn-text)",
//                   }}
//                   className="px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
//                 >
//                   Contact Me
//                 </a>
//               )}
//             </div>
//           </div>
//         </section>

//         {/* Projects */}
//         {portfolio.projects?.length > 0 && (
//           <section
//             style={{ background: "var(--p-section-bg)" }}
//             className="py-20 px-6"
//           >
//             <div className="max-w-5xl mx-auto">
//               <h2
//                 style={{
//                   color: "var(--p-text)",
//                   fontFamily: theme.fonts.heading,
//                 }}
//                 className="text-3xl font-bold mb-2"
//               >
//                 Projects
//               </h2>
//               <p style={{ color: "var(--p-text-muted)" }} className="mb-10">
//                 Things I've built
//               </p>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {portfolio.projects.map((project: any, index: number) => (
//                   <FadeUp key={project.id} delay={index * 0.1}>
//                     <div
//                       style={{
//                         background: "var(--p-card-bg)",
//                         border: `1px solid var(--p-card-border)`,
//                       }}
//                       className="rounded-xl p-6 hover:opacity-90 transition h-full"
//                     >
//                       <h3
//                         style={{ color: "var(--p-text)" }}
//                         className="font-semibold mb-2"
//                       >
//                         {project.title}
//                       </h3>
//                       {project.description && (
//                         <p
//                           style={{ color: "var(--p-text-muted)" }}
//                           className="text-sm mb-4 line-clamp-2"
//                         >
//                           {project.description}
//                         </p>
//                       )}
//                       {project.tags?.length > 0 && (
//                         <div className="flex flex-wrap gap-1.5 mb-4">
//                           {project.tags.map((tag: string) => (
//                             <span
//                               key={tag}
//                               style={{
//                                 background: "var(--p-tag-bg)",
//                                 color: "var(--p-tag-text)",
//                               }}
//                               className="text-xs px-2 py-0.5 rounded-md"
//                             >
//                               {tag}
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                       <div className="flex gap-3">
//                         {project.liveUrl && (
//                           <a
//                             href={project.liveUrl}
//                             target="_blank"
//                             style={{ color: "var(--p-primary)" }}
//                             className="text-xs hover:underline"
//                           >
//                             Live →
//                           </a>
//                         )}
//                         {project.repoUrl && (
//                           <a
//                             href={project.repoUrl}
//                             target="_blank"
//                             style={{ color: "var(--p-text-muted)" }}
//                             className="text-xs hover:underline"
//                           >
//                             Code →
//                           </a>
//                         )}
//                       </div>
//                     </div>
//                   </FadeUp>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Projects */}
//         {/* {portfolio.projects?.length > 0 && (
//         <section className="py-20 px-6 bg-gray-50">
//           <div className="max-w-5xl mx-auto">
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">Projects</h2>
//             <p className="text-gray-500 mb-10">Things I've built</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {portfolio.projects.map((project: any) => (
//                 <div
//                   key={project.id}
//                   className="bg-white rounded-xl border border-gray-100 p-6 hover:border-indigo-200 hover:shadow-sm transition"
//                 >
//                   <div className="flex items-start justify-between mb-3">
//                     <h3 className="font-semibold text-gray-900">
//                       {project.title}
//                     </h3>
//                     {project.featured && (
//                       <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full shrink-0 ml-2">
//                         Featured
//                       </span>
//                     )}
//                   </div>
//                   {project.description && (
//                     <p className="text-sm text-gray-500 mb-4 line-clamp-2">
//                       {project.description}
//                     </p>
//                   )}
//                   {project.tags?.length > 0 && (
//                     <div className="flex flex-wrap gap-1.5 mb-4">
//                       {project.tags.map((tag: string) => (
//                         <span
//                           key={tag}
//                           className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                   <div className="flex gap-3">
//                     {project.liveUrl && (
//                       <a
//                         href={project.liveUrl}
//                         target="_blank"
//                         className="text-xs text-indigo-600 hover:underline"
//                       >
//                         Live →
//                       </a>
//                     )}
//                     {project.repoUrl && (
//                       <a
//                         href={project.repoUrl}
//                         target="_blank"
//                         className="text-xs text-gray-400 hover:underline"
//                       >
//                         Code →
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )} */}

//         {/* {portfolio.projects?.length > 0 && (
//           <section className="py-20 px-6 bg-gray-50">
//             <div className="max-w-5xl mx-auto">
//               <FadeUp>
//                 <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                   Projects
//                 </h2>
//                 <p className="text-gray-500 mb-10">Things I've built</p>
//               </FadeUp>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {portfolio.projects.map((project: any, index: number) => (
//                   <FadeUp key={project.id} delay={index * 0.1}>
//                     <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-indigo-200 hover:shadow-sm transition h-full">
//                       <div className="flex items-start justify-between mb-3">
//                         <h3 className="font-semibold text-gray-900">
//                           {project.title}
//                         </h3>
//                         {project.featured && (
//                           <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full shrink-0 ml-2">
//                             Featured
//                           </span>
//                         )}
//                       </div>
//                       <ExpandableText text={project.description} />
//                       {project.tags?.length > 0 && (
//                         <div className="flex flex-wrap gap-1.5 mb-4">
//                           {project.tags.map((tag: string) => (
//                             <span
//                               key={tag}
//                               className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
//                             >
//                               {tag}
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                       <div className="flex gap-3">
//                         {project.liveUrl && (
//                           <a
//                             href={project.liveUrl}
//                             target="_blank"
//                             className="text-xs text-indigo-600 hover:underline"
//                           >
//                             Live →
//                           </a>
//                         )}
//                         {project.repoUrl && (
//                           <a
//                             href={project.repoUrl}
//                             target="_blank"
//                             className="text-xs text-gray-400 hover:underline"
//                           >
//                             Code →
//                           </a>
//                         )}
//                       </div>
//                     </div>
//                   </FadeUp>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )} */}

//         {/* Skills */}
//         {/* {portfolio.skills?.length > 0 && (
//         <section className="py-20 px-6">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">Skills</h2>
//             <p className="text-gray-500 mb-10">Technologies I work with</p>
//             <div className="space-y-3">
//               {portfolio.skills.map((skill: any) => (
//                 <div key={skill.id} className="flex items-center gap-4">
//                   <span className="text-sm text-gray-700 w-32 shrink-0">
//                     {skill.name}
//                   </span>
//                   <div className="flex-1 bg-gray-100 rounded-full h-2">
//                     <div
//                       className="bg-indigo-500 h-2 rounded-full"
//                       style={{ width: `${skill.proficiency}%` }}
//                     />
//                   </div>
//                   <span className="text-xs text-gray-400 w-8 text-right">
//                     {skill.proficiency}%
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )} */}

//         {/* {portfolio.skills?.length > 0 && (
//         <section className="py-20 px-6">
//           <div className="max-w-3xl mx-auto">
//             <FadeUp>
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">Skills</h2>
//               <p className="text-gray-500 mb-10">Technologies I work with</p>
//             </FadeUp>
//             <div className="space-y-3">
//               {portfolio.skills.map((skill: any, index: number) => (
//                 <SlideIn key={skill.id} delay={index * 0.05}>
//                   <div className="flex items-center gap-4">
//                     <span className="text-sm text-gray-700 w-32 shrink-0">
//                       {skill.name}
//                     </span>
//                     <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
//                       <motion.div
//                         className="bg-indigo-500 h-2 rounded-full"
//                         initial={{ width: 0 }}
//                         whileInView={{ width: `${skill.proficiency}%` }}
//                         viewport={{ once: true }}
//                         transition={{ duration: 0.8, delay: index * 0.05 }}
//                       />
//                     </div>
//                     <span className="text-xs text-gray-400 w-8 text-right">
//                       {skill.proficiency}%
//                     </span>
//                   </div>
//                 </SlideIn>
//               ))}
//             </div>
//           </div>
//         </section>
//       )} */}
//         {portfolio.skills?.length > 0 && (
//           <section className="py-20 px-6">
//             <div className="max-w-3xl mx-auto">
//               <FadeUp>
//                 <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                   Skills
//                 </h2>
//                 <p className="text-gray-500 mb-10">Technologies I work with</p>
//               </FadeUp>
//               <SkillsBar skills={portfolio.skills} />
//             </div>
//           </section>
//         )}
//         {/* Experience */}
//         {portfolio.experiences?.length > 0 && (
//           <section className="py-20 px-6 bg-gray-50">
//             <div className="max-w-3xl mx-auto">
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                 Experience
//               </h2>
//               <p className="text-gray-500 mb-10">Where I've worked</p>
//               <div className="space-y-6">
//                 {portfolio.experiences.map((exp: any) => (
//                   <div key={exp.id} className="flex gap-4">
//                     <div className="flex flex-col items-center">
//                       <div className="w-3 h-3 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
//                       <div className="w-0.5 bg-gray-200 flex-1 mt-2" />
//                     </div>
//                     <div className="pb-6">
//                       <h3 className="font-semibold text-gray-900">
//                         {exp.role}
//                       </h3>
//                       <p className="text-sm text-indigo-600">{exp.company}</p>
//                       <p className="text-xs text-gray-400 mt-0.5">
//                         {new Date(exp.startDate).toLocaleDateString("en-US", {
//                           year: "numeric",
//                           month: "short",
//                         })}
//                         {" — "}
//                         {exp.current
//                           ? "Present"
//                           : new Date(exp.endDate).toLocaleDateString("en-US", {
//                               year: "numeric",
//                               month: "short",
//                             })}
//                         {exp.location && ` · ${exp.location}`}
//                       </p>
//                       {exp.description && (
//                         <p className="text-sm text-gray-500 mt-2">
//                           {exp.description}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}
//         {/* Certificates */}
//         {portfolio.certificates?.length > 0 && (
//           <section className="py-20 px-6">
//             <div className="max-w-5xl mx-auto">
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                 Certificates
//               </h2>
//               <p className="text-gray-500 mb-10">My certifications</p>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {portfolio.certificates.map((cert: any) => (
//                   <div
//                     key={cert.id}
//                     className="bg-white border border-gray-100 rounded-xl p-6 hover:border-indigo-200 transition"
//                   >
//                     <div className="flex items-start justify-between mb-3">
//                       <div>
//                         <h3 className="font-semibold text-gray-900">
//                           {cert.title}
//                         </h3>
//                         <p className="text-sm text-indigo-600 mt-0.5">
//                           {cert.issuer}
//                         </p>
//                         <p className="text-xs text-gray-400 mt-1">
//                           {new Date(cert.issueDate).toLocaleDateString(
//                             "en-US",
//                             {
//                               year: "numeric",
//                               month: "short",
//                             },
//                           )}
//                           {cert.expiryDate &&
//                             ` — ${new Date(cert.expiryDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}`}
//                         </p>
//                       </div>
//                       <span className="text-2xl">🏆</span>
//                     </div>
//                     {cert.credentialUrl && (
//                       <a
//                         href={cert.credentialUrl}
//                         target="_blank"
//                         className="text-xs text-indigo-500 hover:underline mt-2 block"
//                       >
//                         View Credential →
//                       </a>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}
//         {/* Testimonials */}
//         {portfolio.testimonials?.length > 0 && (
//           <section className="py-20 px-6 bg-gray-50">
//             <div className="max-w-5xl mx-auto">
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                 Testimonials
//               </h2>
//               <p className="text-gray-500 mb-10">What clients say</p>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {portfolio.testimonials.map((testimonial: any) => (
//                   <div
//                     key={testimonial.id}
//                     className="bg-white rounded-xl border border-gray-100 p-6"
//                   >
//                     {testimonial.rating && (
//                       <div className="flex gap-0.5 mb-3">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <span
//                             key={star}
//                             className={
//                               star <= testimonial.rating
//                                 ? "text-amber-400"
//                                 : "text-gray-200"
//                             }
//                           >
//                             ★
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                     <p className="text-sm text-gray-600 italic mb-4">
//                       "{testimonial.content}"
//                     </p>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">
//                         {testimonial.authorName}
//                       </p>
//                       {(testimonial.authorTitle ||
//                         testimonial.authorCompany) && (
//                         <p className="text-xs text-gray-400 mt-0.5">
//                           {[testimonial.authorTitle, testimonial.authorCompany]
//                             .filter(Boolean)
//                             .join(" · ")}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         )}
//         {/* Contact */}
//         {/* {(portfolio.email || portfolio.phone || portfolio.location) && (
//         <section className="py-20 px-6 bg-gray-50">
//           <div className="max-w-3xl mx-auto text-center">
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">
//               Get In Touch
//             </h2>
//             <p className="text-gray-500 mb-10">Let's work together</p>
//             <div className="flex justify-center gap-8 flex-wrap">
//               {portfolio.email && (
//                 <div>
//                   <p className="text-xs text-gray-400 mb-1">Email</p>
//                   <a
//                     href={`mailto:${portfolio.email}`}
//                     className="text-indigo-600 hover:underline text-sm"
//                   >
//                     {portfolio.email}
//                   </a>
//                 </div>
//               )}
//               {portfolio.phone && (
//                 <div>
//                   <p className="text-xs text-gray-400 mb-1">Phone</p>
//                   <p className="text-gray-700 text-sm">{portfolio.phone}</p>
//                 </div>
//               )}
//               {portfolio.location && (
//                 <div>
//                   <p className="text-xs text-gray-400 mb-1">Location</p>
//                   <p className="text-gray-700 text-sm">{portfolio.location}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </section>
//       )} */}

//         {/* Contact */}
//         {(portfolio.email || portfolio.phone || portfolio.location) && (
//           <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
//             <div className="max-w-3xl mx-auto">
//               <FadeUp>
//                 <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//                   Get In Touch
//                 </h2>
//                 <p className="text-gray-500 mb-10">Let's work together</p>
//               </FadeUp>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//                 {/* Contact Info */}
//                 <FadeUp delay={0.1}>
//                   <div className="space-y-4">
//                     {portfolio.email && (
//                       <div>
//                         <p className="text-xs text-gray-400 mb-1">Email</p>
//                         <a
//                           href={`mailto:${portfolio.email}`}
//                           className="text-indigo-600 hover:underline text-sm"
//                         >
//                           {portfolio.email}
//                         </a>
//                       </div>
//                     )}
//                     {portfolio.phone && (
//                       <div>
//                         <p className="text-xs text-gray-400 mb-1">Phone</p>
//                         <p className="text-gray-700 dark:text-gray-300 text-sm">
//                           {portfolio.phone}
//                         </p>
//                       </div>
//                     )}
//                     {portfolio.location && (
//                       <div>
//                         <p className="text-xs text-gray-400 mb-1">Location</p>
//                         <p className="text-gray-700 dark:text-gray-300 text-sm">
//                           {portfolio.location}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </FadeUp>
//                 {/* Contact Form */}
//                 <FadeUp delay={0.2}>
//                   <ContactForm portfolioId={portfolio.id} />
//                 </FadeUp>
//               </div>
//             </div>
//           </section>
//         )}
//         {/* Footer */}
//         {/* <footer className="py-8 px-6 border-t border-gray-100 text-center"> */}
//         <footer className="py-8 px-6 border-t border-gray-100 dark:border-gray-800 text-center bg-white dark:bg-gray-950">
//           <p className="text-xs text-gray-400">
//             Built with <span className="text-indigo-500">PortfolioCraft</span>
//           </p>
//         </footer>
//       </main>
//     </PortfolioThemeProvider>
//   );
// }

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FadeUp, SlideIn } from "@/components/portfolio/AnimatedSection";
import { SkillsBar } from "@/components/portfolio/SkillsBar";
import { DarkModeToggle } from "@/components/shared/DarkModeToggle";
import { JsonLd } from "@/components/portfolio/JsonLd";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { PortfolioThemeProvider } from "@/components/portfolio/ThemeProvider";
import { getThemeById } from "@/components/portfolio/themes";
import Link from "next/link";
import { BookingWidget } from "@/components/portfolio/BookingWidget";
import { api } from "@/lib/api";
export const dynamic = 'force-dynamic'
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1'
async function getPortfolio(username: string) {
  try {
    // const res = await fetch(
    //   `http://localhost:3001/v1/portfolios/public/${username}`,
    //   { next: { revalidate: 60 } },
    // );
     const res = await fetch(
      `${API_URL}/portfolios/public/${username}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  if (!portfolio) return { title: "Portfolio Not Found" };

  return {
    title: portfolio.seoTitle ?? portfolio.heroTitle,
    description: portfolio.seoDescription ?? portfolio.aboutText?.slice(0, 160),
    keywords: portfolio.skills?.map((s: any) => s.name).join(", "),
    authors: [{ name: portfolio.heroTitle }],
    openGraph: {
      title: portfolio.seoTitle ?? portfolio.heroTitle,
      description:
        portfolio.seoDescription ?? portfolio.aboutText?.slice(0, 160),
      type: "profile",
      url: `https://${username}.portfoliocraft.com`,
      images: portfolio.ogImage
        ? [{ url: portfolio.ogImage, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: portfolio.seoTitle ?? portfolio.heroTitle,
      description:
        portfolio.seoDescription ?? portfolio.aboutText?.slice(0, 160),
      images: portfolio.ogImage ? [portfolio.ogImage] : [],
    },
    alternates: { canonical: `https://${username}.portfoliocraft.com` },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  if (!portfolio) notFound();

  // Track page view
  // await fetch("http://localhost:3001/v1/analytics/event", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     portfolioId: portfolio.id,
  //     eventType: "page_view",
  //     referrer: "",
  //   }),
  // }).catch(() => {});

  await api
    .post("/analytics/event", {
      portfolioId: portfolio.id,
      eventType: "page_view",
      referrer: "",
    })
    .catch(() => {});
  const theme = getThemeById(portfolio.themePreset ?? "default");

  return (
    <PortfolioThemeProvider theme={theme}>
      <main
        style={{
          background: "var(--p-bg)",
          color: "var(--p-text)",
          minHeight: "100vh",
        }}
      >
        <JsonLd portfolio={portfolio} username={username} />
        {/* Nav */}
        <nav
          style={{
            borderBottom: "1px solid var(--p-border)",
            background: "var(--p-bg)",
          }}
          className="flex justify-end px-6 py-4"
        >
          <DarkModeToggle />
        </nav>
        {/* Hero */}
        <section
          style={{
            background: `linear-gradient(135deg, var(--p-hero-from), var(--p-hero-to))`,
          }}
          className="py-24 px-6"
        >
          <div className="max-w-3xl mx-auto text-center">
            {/* Avatar */}
            {portfolio.user?.avatarUrl && (
              <FadeUp>
                <img
                  src={portfolio.user.avatarUrl}
                  alt={portfolio.heroTitle}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-6 border-4 shadow-md"
                  style={{ borderColor: "var(--p-border)" }}
                />
              </FadeUp>
            )}
            <FadeUp>
              <h1
                style={{
                  color: "var(--p-text)",
                  fontFamily: theme.fonts.heading,
                }}
                className="text-5xl font-bold mb-4"
              >
                {portfolio.heroTitle ?? portfolio.username}
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              {portfolio.heroSubtitle && (
                <p
                  style={{ color: "var(--p-primary)" }}
                  className="text-xl font-medium mb-6"
                >
                  {portfolio.heroSubtitle}
                </p>
              )}
            </FadeUp>
            <FadeUp delay={0.2}>
              {portfolio.aboutText && (
                <p
                  style={{ color: "var(--p-text-muted)" }}
                  className="text-lg leading-relaxed max-w-2xl mx-auto"
                >
                  {portfolio.aboutText}
                </p>
              )}
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="flex justify-center gap-4 mt-8 flex-wrap">
                {portfolio.github && (
                  <a
                    href={portfolio.github}
                    target="_blank"
                    style={{
                      border: "1px solid var(--p-border)",
                      color: "var(--p-text-muted)",
                    }}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition"
                  >
                    GitHub
                  </a>
                )}
                {portfolio.linkedin && (
                  <a
                    href={portfolio.linkedin}
                    target="_blank"
                    style={{
                      border: "1px solid var(--p-border)",
                      color: "var(--p-text-muted)",
                    }}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition"
                  >
                    LinkedIn
                  </a>
                )}
                {portfolio.email && (
                  <a
                    href={`mailto:${portfolio.email}`}
                    style={{
                      background: "var(--p-btn-bg)",
                      color: "var(--p-btn-text)",
                    }}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
                  >
                    Contact Me
                  </a>
                )}
              </div>
            </FadeUp>
          </div>
        </section>
        {/* Projects */}
        {portfolio.projects?.length > 0 && (
          <section
            style={{ background: "var(--p-section-bg)" }}
            className="py-20 px-6"
          >
            <div className="max-w-5xl mx-auto">
              <FadeUp>
                <h2
                  style={{
                    color: "var(--p-text)",
                    fontFamily: theme.fonts.heading,
                  }}
                  className="text-3xl font-bold mb-2"
                >
                  Projects
                </h2>
                <p style={{ color: "var(--p-text-muted)" }} className="mb-10">
                  Things I've built
                </p>
              </FadeUp>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.projects.map((project: any, index: number) => (
                  <FadeUp key={project.id} delay={index * 0.1}>
                    <div
                      style={{
                        background: "var(--p-card-bg)",
                        border: "1px solid var(--p-card-border)",
                      }}
                      className="rounded-xl p-6 hover:opacity-90 transition h-full"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3
                          style={{ color: "var(--p-text)" }}
                          className="font-semibold"
                        >
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span
                            style={{
                              background: "var(--p-tag-bg)",
                              color: "var(--p-primary)",
                            }}
                            className="text-xs px-2 py-0.5 rounded-full shrink-0 ml-2"
                          >
                            Featured
                          </span>
                        )}
                      </div>
                      {project.description && (
                        <p
                          style={{ color: "var(--p-text-muted)" }}
                          className="text-sm mb-4 line-clamp-2"
                        >
                          {project.description}
                        </p>
                      )}
                      {project.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tags.map((tag: string) => (
                            <span
                              key={tag}
                              style={{
                                background: "var(--p-tag-bg)",
                                color: "var(--p-tag-text)",
                              }}
                              className="text-xs px-2 py-0.5 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            style={{ color: "var(--p-primary)" }}
                            className="text-xs hover:underline"
                          >
                            Live →
                          </a>
                        )}
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            style={{ color: "var(--p-text-muted)" }}
                            className="text-xs hover:underline"
                          >
                            Code →
                          </a>
                        )}
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>
        )}
        {portfolio.gallery?.length > 0 && (
          <section
            id="gallery"
            style={{ background: "var(--p-section-bg)" }}
            className="py-20 px-6"
          >
            <div className="max-w-5xl mx-auto">
              <FadeUp>
                <h2
                  style={{
                    color: "var(--p-text)",
                    fontFamily: theme.fonts.heading,
                  }}
                  className="text-3xl font-bold mb-2"
                >
                  Gallery
                </h2>
                <p style={{ color: "var(--p-text-muted)" }} className="mb-10">
                  My work in photos
                </p>
              </FadeUp>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolio.gallery.map((img: any, index: number) => (
                  <FadeUp key={img.id} delay={index * 0.05}>
                    <div className="relative aspect-square rounded-xl overflow-hidden group">
                      <img
                        src={img.imageUrl}
                        alt={img.caption ?? ""}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {img.caption && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex items-end p-3 opacity-0 group-hover:opacity-100">
                          <p className="text-white text-xs font-medium">
                            {img.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* Skills */}
        {portfolio.skills?.length > 0 && (
          <section style={{ background: "var(--p-bg)" }} className="py-20 px-6">
            <div className="max-w-3xl mx-auto">
              <FadeUp>
                <h2
                  style={{
                    color: "var(--p-text)",
                    fontFamily: theme.fonts.heading,
                  }}
                  className="text-3xl font-bold mb-2"
                >
                  Skills
                </h2>
                <p style={{ color: "var(--p-text-muted)" }} className="mb-10">
                  Technologies I work with
                </p>
              </FadeUp>
              <SkillsBar
                skills={portfolio.skills}
                primaryColor={theme.colors.primary}
              />
            </div>
          </section>
        )}
        {/* Experience */}
        {portfolio.experiences?.length > 0 && (
          <section
            style={{ background: "var(--p-section-bg)" }}
            className="py-20 px-6"
          >
            <div className="max-w-3xl mx-auto">
              <FadeUp>
                <h2
                  style={{
                    color: "var(--p-text)",
                    fontFamily: theme.fonts.heading,
                  }}
                  className="text-3xl font-bold mb-2"
                >
                  Experience
                </h2>
                <p style={{ color: "var(--p-text-muted)" }} className="mb-10">
                  Where I've worked
                </p>
              </FadeUp>
              <div className="space-y-6">
                {portfolio.experiences.map((exp: any) => (
                  <SlideIn key={exp.id}>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          style={{ background: "var(--p-primary)" }}
                          className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                        />
                        <div
                          style={{ background: "var(--p-border)" }}
                          className="w-0.5 flex-1 mt-2"
                        />
                      </div>
                      <div className="pb-6">
                        <h3
                          style={{ color: "var(--p-text)" }}
                          className="font-semibold"
                        >
                          {exp.role}
                        </h3>
                        <p
                          style={{ color: "var(--p-primary)" }}
                          className="text-sm"
                        >
                          {exp.company}
                        </p>
                        <p
                          style={{ color: "var(--p-text-muted)" }}
                          className="text-xs mt-0.5"
                        >
                          {new Date(exp.startDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}
                          {" — "}
                          {exp.current
                            ? "Present"
                            : new Date(exp.endDate).toLocaleDateString(
                                "en-US",
                                { year: "numeric", month: "short" },
                              )}
                          {exp.location && ` · ${exp.location}`}
                        </p>
                        {exp.description && (
                          <p
                            style={{ color: "var(--p-text-muted)" }}
                            className="text-sm mt-2"
                          >
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </SlideIn>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* Certificates */}
        {portfolio.certificates?.length > 0 && (
          <section style={{ background: "var(--p-bg)" }} className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <FadeUp>
                <h2
                  style={{
                    color: "var(--p-text)",
                    fontFamily: theme.fonts.heading,
                  }}
                  className="text-3xl font-bold mb-2"
                >
                  Certificates
                </h2>
                <p style={{ color: "var(--p-text-muted)" }} className="mb-10">
                  My certifications
                </p>
              </FadeUp>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.certificates.map((cert: any) => (
                  <FadeUp key={cert.id}>
                    <div
                      style={{
                        background: "var(--p-card-bg)",
                        border: "1px solid var(--p-card-border)",
                      }}
                      className="rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3
                            style={{ color: "var(--p-text)" }}
                            className="font-semibold"
                          >
                            {cert.title}
                          </h3>
                          <p
                            style={{ color: "var(--p-primary)" }}
                            className="text-sm mt-0.5"
                          >
                            {cert.issuer}
                          </p>
                          <p
                            style={{ color: "var(--p-text-muted)" }}
                            className="text-xs mt-1"
                          >
                            {new Date(cert.issueDate).toLocaleDateString(
                              "en-US",
                              { year: "numeric", month: "short" },
                            )}
                            {cert.expiryDate &&
                              ` — ${new Date(cert.expiryDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}`}
                          </p>
                        </div>
                        <span className="text-2xl">🏆</span>
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          style={{ color: "var(--p-primary)" }}
                          className="text-xs hover:underline mt-2 block"
                        >
                          View Credential →
                        </a>
                      )}
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>
        )}
        {portfolio.achievements?.length > 0 && (
          <section
            style={{ background: "var(--p-section-bg)" }}
            className="py-20 px-6"
          >
            <div className="max-w-5xl mx-auto">
              <FadeUp>
                <h2
                  style={{
                    color: "var(--p-text)",
                    fontFamily: theme.fonts.heading,
                  }}
                  className="text-3xl font-bold mb-2"
                >
                  Achievements
                </h2>
                <p style={{ color: "var(--p-text-muted)" }} className="mb-10">
                  Awards & milestones
                </p>
              </FadeUp>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.achievements.map(
                  (achievement: any, index: number) => (
                    <FadeUp key={achievement.id} delay={index * 0.1}>
                      <div
                        style={{
                          background: "var(--p-card-bg)",
                          border: "1px solid var(--p-card-border)",
                        }}
                        className="rounded-xl p-6 flex gap-4"
                      >
                        <div className="text-3xl shrink-0">
                          {achievement.imageUrl ?? "🏆"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              style={{ color: "var(--p-text)" }}
                              className="font-semibold"
                            >
                              {achievement.title}
                            </h3>
                            {achievement.date && (
                              <span
                                style={{ color: "var(--p-text-muted)" }}
                                className="text-xs"
                              >
                                {new Date(achievement.date).toLocaleDateString(
                                  "en-US",
                                  { year: "numeric", month: "short" },
                                )}
                              </span>
                            )}
                          </div>
                          {achievement.description && (
                            <p
                              style={{ color: "var(--p-text-muted)" }}
                              className="text-sm"
                            >
                              {achievement.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </FadeUp>
                  ),
                )}
              </div>
            </div>
          </section>
        )}
        {portfolio.services?.length > 0 && (
          <section style={{ background: "var(--p-bg)" }} className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <FadeUp>
                <h2
                  style={{
                    color: "var(--p-text)",
                    fontFamily: theme.fonts.heading,
                  }}
                  className="text-3xl font-bold mb-2"
                >
                  Services
                </h2>
                <p style={{ color: "var(--p-text-muted)" }} className="mb-10">
                  What I offer
                </p>
              </FadeUp>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.services.map((service: any, index: number) => (
                  <FadeUp key={service.id} delay={index * 0.1}>
                    <div
                      style={{
                        background: "var(--p-card-bg)",
                        border: `1px solid ${service.featured ? "var(--p-primary)" : "var(--p-card-border)"}`,
                      }}
                      className="rounded-xl p-6 h-full relative"
                    >
                      {service.featured && (
                        <span
                          style={{
                            background: "var(--p-primary)",
                            color: "var(--p-btn-text)",
                          }}
                          className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full"
                        >
                          Featured
                        </span>
                      )}
                      <div className="text-3xl mb-4">
                        {service.iconUrl ?? "💻"}
                      </div>
                      <h3
                        style={{ color: "var(--p-text)" }}
                        className="font-semibold text-lg mb-2"
                      >
                        {service.title}
                      </h3>
                      {service.description && (
                        <p
                          style={{ color: "var(--p-text-muted)" }}
                          className="text-sm mb-4 leading-relaxed"
                        >
                          {service.description}
                        </p>
                      )}
                      {service.price && (
                        <p
                          style={{ color: "var(--p-primary)" }}
                          className="text-sm font-semibold"
                        >
                          {service.price}
                        </p>
                      )}
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>
        )}
        {portfolio.clients?.length > 0 && (
          <section
            style={{ background: "var(--p-section-bg)" }}
            className="py-12 px-6"
          >
            <div className="max-w-5xl mx-auto">
              <FadeUp>
                <p
                  style={{ color: "var(--p-text-muted)" }}
                  className="text-center text-sm mb-8 uppercase tracking-widest"
                >
                  Trusted by
                </p>
              </FadeUp>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {portfolio.clients.map((client: any) => (
                  <FadeUp key={client.id}>
                    {client.websiteUrl ? (
                      <a
                        href={client.websiteUrl}
                        target="_blank"
                        className="opacity-60 hover:opacity-100 transition"
                      >
                        {client.logoUrl ? (
                          <img
                            src={client.logoUrl}
                            alt={client.name}
                            className="h-28 object-contain grayscale hover:grayscale-0 transition"
                          />
                        ) : (
                          <span
                            style={{ color: "var(--p-text-muted)" }}
                            className="text-sm font-semibold"
                          >
                            {client.name}
                          </span>
                        )}
                      </a>
                    ) : (
                      <div className="opacity-60">
                        {client.logoUrl ? (
                          <img
                            src={client.logoUrl}
                            alt={client.name}
                            className="h-28 object-contain grayscale hover:grayscale-0"
                          />
                        ) : (
                          <span
                            style={{ color: "var(--p-text-muted)" }}
                            className="text-sm font-semibold"
                          >
                            {client.name}
                          </span>
                        )}
                      </div>
                    )}
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* Testimonials */}
        {portfolio.testimonials?.length > 0 && (
          <section
            style={{ background: "var(--p-section-bg)" }}
            className="py-20 px-6"
          >
            <div className="max-w-5xl mx-auto">
              <FadeUp>
                <h2
                  style={{
                    color: "var(--p-text)",
                    fontFamily: theme.fonts.heading,
                  }}
                  className="text-3xl font-bold mb-2"
                >
                  Testimonials
                </h2>
                <p style={{ color: "var(--p-text-muted)" }} className="mb-10">
                  What clients say
                </p>
              </FadeUp>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.testimonials.map((testimonial: any) => (
                  <FadeUp key={testimonial.id}>
                    <div
                      style={{
                        background: "var(--p-card-bg)",
                        border: "1px solid var(--p-card-border)",
                      }}
                      className="rounded-xl p-6"
                    >
                      {testimonial.rating && (
                        <div className="flex gap-0.5 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              style={{
                                color:
                                  star <= testimonial.rating
                                    ? "#f59e0b"
                                    : "var(--p-border)",
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                      <p
                        style={{ color: "var(--p-text-muted)" }}
                        className="text-sm italic mb-4"
                      >
                        "{testimonial.content}"
                      </p>
                      <div>
                        <p
                          style={{ color: "var(--p-text)" }}
                          className="text-sm font-medium"
                        >
                          {testimonial.authorName}
                        </p>
                        {(testimonial.authorTitle ||
                          testimonial.authorCompany) && (
                          <p
                            style={{ color: "var(--p-text-muted)" }}
                            className="text-xs mt-0.5"
                          >
                            {[
                              testimonial.authorTitle,
                              testimonial.authorCompany,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>
        )}

        {portfolio.bookingEnabled && (
          <section
            style={{ background: "var(--p-section-bg)" }}
            className="py-20 px-6"
          >
            <div className="max-w-3xl mx-auto">
              <FadeUp>
                <h2
                  style={{
                    color: "var(--p-text)",
                    fontFamily: theme.fonts.heading,
                  }}
                  className="text-3xl font-bold mb-2 text-center"
                >
                  Book an Appointment
                </h2>
                <p
                  style={{ color: "var(--p-text-muted)" }}
                  className="text-center mb-10"
                >
                  Schedule a meeting directly
                </p>
              </FadeUp>
              <FadeUp delay={0.1}>
                <BookingWidget username={username} />
              </FadeUp>
            </div>
          </section>
        )}
        {/* Contact */}
        {(portfolio.email || portfolio.phone || portfolio.location) && (
          <section style={{ background: "var(--p-bg)" }} className="py-20 px-6">
            <div className="max-w-3xl mx-auto">
              <FadeUp>
                <h2
                  style={{
                    color: "var(--p-text)",
                    fontFamily: theme.fonts.heading,
                  }}
                  className="text-3xl font-bold mb-2"
                >
                  Get In Touch
                </h2>
                <p style={{ color: "var(--p-text-muted)" }} className="mb-10">
                  Let's work together
                </p>
              </FadeUp>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <FadeUp delay={0.1}>
                  <div className="space-y-4">
                    {portfolio.email && (
                      <div>
                        <p
                          style={{ color: "var(--p-text-muted)" }}
                          className="text-xs mb-1"
                        >
                          Email
                        </p>
                        <a
                          href={`mailto:${portfolio.email}`}
                          style={{ color: "var(--p-primary)" }}
                          className="hover:underline text-sm"
                        >
                          {portfolio.email}
                        </a>
                      </div>
                    )}
                    {portfolio.phone && (
                      <div>
                        <p
                          style={{ color: "var(--p-text-muted)" }}
                          className="text-xs mb-1"
                        >
                          Phone
                        </p>
                        <p
                          style={{ color: "var(--p-text)" }}
                          className="text-sm"
                        >
                          {portfolio.phone}
                        </p>
                      </div>
                    )}
                    {portfolio.location && (
                      <div>
                        <p
                          style={{ color: "var(--p-text-muted)" }}
                          className="text-xs mb-1"
                        >
                          Location
                        </p>
                        <p
                          style={{ color: "var(--p-text)" }}
                          className="text-sm"
                        >
                          {portfolio.location}
                        </p>
                      </div>
                    )}
                  </div>
                </FadeUp>
                <FadeUp delay={0.2}>
                  <ContactForm portfolioId={portfolio.id} />
                </FadeUp>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid var(--p-border)",
            background: "var(--p-bg)",
          }}
          className="py-8 px-6 text-center"
        >
          <p style={{ color: "var(--p-text-muted)" }} className="text-xs">
            Built with{" "}
            <span style={{ color: "var(--p-primary)" }}>PortfolioCraft</span>
          </p>
          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <Link
              href={`/${username}/blog`}
              style={{ color: "var(--p-primary)" }}
              className="text-sm hover:underline"
            >
              Read my blog →
            </Link>
          </div>
        </footer>
      </main>
    </PortfolioThemeProvider>
  );
}
