// import { notFound } from "next/navigation";

// async function getPortfolio(username: string) {
//   try {
//     const res = await fetch(
//       `http://localhost:3001/v1/portfolios/public/${username}`,
//       { cache: "no-store" },
//     );
//     if (!res.ok) return null;
//     return res.json();
//   } catch {
//     return null;
//   }
// }

// export default async function PrintPage({
//   params,
// }: {
//   params: Promise<{ username: string }>;
// }) {
//   const { username } = await params;
//   const portfolio = await getPortfolio(username);
//   if (!portfolio) notFound();

//   return (
//     <main
//       style={{
//         fontFamily: "sans-serif",
//         maxWidth: "800px",
//         margin: "0 auto",
//         padding: "20px",
//         color: "#111",
//       }}
//     >
//       {/* Header */}
//       <div
//         style={{
//           textAlign: "center",
//           marginBottom: "24px",
//           paddingBottom: "16px",
//           borderBottom: "2px solid #e5e7eb",
//         }}
//       >
//         {portfolio.user?.avatarUrl && (
//           <img
//             src={portfolio.user.avatarUrl}
//             alt={portfolio.heroTitle}
//             style={{
//               width: "80px",
//               height: "80px",
//               borderRadius: "50%",
//               objectFit: "cover",
//               margin: "0 auto 12px",
//             }}
//           />
//         )}
//         <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 4px" }}>
//           {portfolio.heroTitle}
//         </h1>
//         <p
//           style={{
//             fontSize: "16px",
//             color: "#4f46e5",
//             margin: "0 0 8px",
//             fontWeight: "500",
//           }}
//         >
//           {portfolio.heroSubtitle}
//         </p>
//         {portfolio.aboutText && (
//           <p
//             style={{
//               fontSize: "13px",
//               color: "#6b7280",
//               maxWidth: "600px",
//               margin: "0 auto",
//             }}
//           >
//             {portfolio.aboutText}
//           </p>
//         )}
//         <div
//           style={{
//             marginTop: "10px",
//             fontSize: "12px",
//             color: "#6b7280",
//             display: "flex",
//             gap: "16px",
//             justifyContent: "center",
//             flexWrap: "wrap",
//           }}
//         >
//           {portfolio.email && <span>✉ {portfolio.email}</span>}
//           {portfolio.phone && <span>📞 {portfolio.phone}</span>}
//           {portfolio.location && <span>📍 {portfolio.location}</span>}
//           {portfolio.github && <span>GitHub: {portfolio.github}</span>}
//           {portfolio.linkedin && <span>LinkedIn: {portfolio.linkedin}</span>}
//         </div>
//       </div>

//       {/* Experience */}
//       {portfolio.experiences?.length > 0 && (
//         <div style={{ marginBottom: "20px" }}>
//           <h2
//             style={{
//               fontSize: "16px",
//               fontWeight: "700",
//               borderBottom: "1px solid #e5e7eb",
//               paddingBottom: "4px",
//               marginBottom: "10px",
//             }}
//           >
//             Experience
//           </h2>
//           {portfolio.experiences.map((exp: any) => (
//             <div key={exp.id} style={{ marginBottom: "10px" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "flex-start",
//                 }}
//               >
//                 <div>
//                   <p
//                     style={{ fontWeight: "600", fontSize: "14px", margin: "0" }}
//                   >
//                     {exp.role}
//                   </p>
//                   <p
//                     style={{
//                       color: "#4f46e5",
//                       fontSize: "13px",
//                       margin: "2px 0",
//                     }}
//                   >
//                     {exp.company}
//                   </p>
//                 </div>
//                 <p
//                   style={{
//                     fontSize: "12px",
//                     color: "#9ca3af",
//                     margin: "0",
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   {new Date(exp.startDate).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                   })}
//                   {" — "}
//                   {exp.current
//                     ? "Present"
//                     : new Date(exp.endDate).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "short",
//                       })}
//                 </p>
//               </div>
//               {exp.description && (
//                 <p
//                   style={{
//                     fontSize: "12px",
//                     color: "#6b7280",
//                     margin: "4px 0 0",
//                   }}
//                 >
//                   {exp.description}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Skills */}
//       {portfolio.skills?.length > 0 && (
//         <div style={{ marginBottom: "20px" }}>
//           <h2
//             style={{
//               fontSize: "16px",
//               fontWeight: "700",
//               borderBottom: "1px solid #e5e7eb",
//               paddingBottom: "4px",
//               marginBottom: "10px",
//             }}
//           >
//             Skills
//           </h2>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "6px",
//             }}
//           >
//             {portfolio.skills.map((skill: any) => (
//               <div
//                 key={skill.id}
//                 style={{ display: "flex", alignItems: "center", gap: "8px" }}
//               >
//                 <span
//                   style={{ fontSize: "13px", width: "100px", flexShrink: 0 }}
//                 >
//                   {skill.name}
//                 </span>
//                 <div
//                   style={{
//                     flex: 1,
//                     background: "#e5e7eb",
//                     borderRadius: "4px",
//                     height: "6px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: `${skill.proficiency}%`,
//                       background: "#4f46e5",
//                       borderRadius: "4px",
//                       height: "6px",
//                     }}
//                   />
//                 </div>
//                 <span
//                   style={{
//                     fontSize: "11px",
//                     color: "#9ca3af",
//                     width: "30px",
//                     textAlign: "right",
//                   }}
//                 >
//                   {skill.proficiency}%
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Projects */}
//       {portfolio.projects?.length > 0 && (
//         <div style={{ marginBottom: "20px" }}>
//           <h2
//             style={{
//               fontSize: "16px",
//               fontWeight: "700",
//               borderBottom: "1px solid #e5e7eb",
//               paddingBottom: "4px",
//               marginBottom: "10px",
//             }}
//           >
//             Projects
//           </h2>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "8px",
//             }}
//           >
//             {portfolio.projects.map((project: any) => (
//               <div
//                 key={project.id}
//                 style={{
//                   border: "1px solid #e5e7eb",
//                   borderRadius: "6px",
//                   padding: "10px",
//                 }}
//               >
//                 <p
//                   style={{
//                     fontWeight: "600",
//                     fontSize: "13px",
//                     margin: "0 0 4px",
//                   }}
//                 >
//                   {project.title}
//                 </p>
//                 {project.description && (
//                   <p
//                     style={{
//                       fontSize: "12px",
//                       color: "#6b7280",
//                       margin: "0 0 4px",
//                     }}
//                   >
//                     {project.description}
//                   </p>
//                 )}
//                 {project.tags?.length > 0 && (
//                   <div
//                     style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}
//                   >
//                     {project.tags.map((tag: string) => (
//                       <span
//                         key={tag}
//                         style={{
//                           fontSize: "10px",
//                           background: "#f3f4f6",
//                           padding: "2px 6px",
//                           borderRadius: "4px",
//                         }}
//                       >
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Certificates */}
//       {portfolio.certificates?.length > 0 && (
//         <div style={{ marginBottom: "20px" }}>
//           <h2
//             style={{
//               fontSize: "16px",
//               fontWeight: "700",
//               borderBottom: "1px solid #e5e7eb",
//               paddingBottom: "4px",
//               marginBottom: "10px",
//             }}
//           >
//             Certificates
//           </h2>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "8px",
//             }}
//           >
//             {portfolio.certificates.map((cert: any) => (
//               <div
//                 key={cert.id}
//                 style={{
//                   border: "1px solid #e5e7eb",
//                   borderRadius: "6px",
//                   padding: "10px",
//                 }}
//               >
//                 <p
//                   style={{
//                     fontWeight: "600",
//                     fontSize: "13px",
//                     margin: "0 0 2px",
//                   }}
//                 >
//                   {cert.title}
//                 </p>
//                 <p
//                   style={{
//                     fontSize: "12px",
//                     color: "#4f46e5",
//                     margin: "0 0 2px",
//                   }}
//                 >
//                   {cert.issuer}
//                 </p>
//                 <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0" }}>
//                   {new Date(cert.issueDate).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "short",
//                   })}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Testimonials */}
//       {portfolio.testimonials?.length > 0 && (
//         <div style={{ marginBottom: "20px" }}>
//           <h2
//             style={{
//               fontSize: "16px",
//               fontWeight: "700",
//               borderBottom: "1px solid #e5e7eb",
//               paddingBottom: "4px",
//               marginBottom: "10px",
//             }}
//           >
//             Testimonials
//           </h2>
//           {portfolio.testimonials.map((t: any) => (
//             <div
//               key={t.id}
//               style={{
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "6px",
//                 padding: "10px",
//                 marginBottom: "8px",
//               }}
//             >
//               <p
//                 style={{
//                   fontSize: "12px",
//                   color: "#374151",
//                   fontStyle: "italic",
//                   margin: "0 0 6px",
//                 }}
//               >
//                 "{t.content}"
//               </p>
//               <p style={{ fontSize: "12px", fontWeight: "600", margin: "0" }}>
//                 {t.authorName}
//               </p>
//               {t.authorTitle && (
//                 <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0" }}>
//                   {t.authorTitle} · {t.authorCompany}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }

import { notFound } from "next/navigation";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/v1";
async function getPortfolio(username: string) {
  try {
    // const res = await fetch(
    //   `http://localhost:3001/v1/portfolios/public/${username}`,
    //   { cache: 'no-store' }
    // )
    const res = await fetch(`${API_URL}/portfolios/public/${username}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function PrintPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);
  if (!portfolio) notFound();

  const githubUsername = portfolio.github?.replace("https://github.com/", "");
  const linkedinUsername = portfolio.linkedin
    ?.replace("https://www.linkedin.com/in/", "")
    .replace("https://linkedin.com/in/", "")
    .replace(/\/$/, "");

  return (
    <main
      style={{
        fontFamily: "Georgia, serif",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "32px 40px",
        color: "#1a1a1a",
        fontSize: "13px",
        lineHeight: "1.5",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "20px",
          paddingBottom: "16px",
          // , borderBottom: '3px solid #1a1a1a'
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "900",
              margin: "0 0 4px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {portfolio.heroTitle}
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#4f46e5",
              fontWeight: "700",
              margin: "0 0 12px",
            }}
          >
            {portfolio.heroSubtitle}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "12px",
              color: "#444",
            }}
          >
            {portfolio.phone && <span>📞 {portfolio.phone}</span>}
            {portfolio.email && <span>✉ {portfolio.email}</span>}
            {portfolio.location && <span>📍 {portfolio.location}</span>}
          </div>
        </div>
        {portfolio.user?.avatarUrl && (
          <img
            src={portfolio.user.avatarUrl}
            alt={portfolio.heroTitle}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              objectFit: "cover",
              marginLeft: "20px",
              border: "3px solid #e5e7eb",
            }}
          />
        )}
      </div>

      {/* Two Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "32px",
        }}
      >
        {/* LEFT COLUMN */}
        <div>
          {/* Summary */}
          {portfolio.aboutText && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "14px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  borderBottom: "2px solid #1a1a1a",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Summary
              </h2>
              <p style={{ margin: 0, color: "#333", lineHeight: "1.6" }}>
                {portfolio.aboutText}
              </p>
            </div>
          )}

          {/* Experience */}
          {portfolio.experiences?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "14px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  borderBottom: "2px solid #1a1a1a",
                  paddingBottom: "4px",
                  marginBottom: "12px",
                }}
              >
                Experience
              </h2>
              {portfolio.experiences.map((exp: any) => (
                <div key={exp.id} style={{ marginBottom: "14px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontWeight: "700",
                          fontSize: "14px",
                          margin: "0",
                        }}
                      >
                        {exp.role}
                      </p>
                      <p
                        style={{
                          color: "#4f46e5",
                          fontWeight: "600",
                          fontSize: "13px",
                          margin: "2px 0",
                        }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#777",
                        margin: "0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(exp.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                      {" — "}
                      {exp.current
                        ? "Present"
                        : new Date(exp.endDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}
                    </p>
                  </div>
                  {exp.description && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        margin: "6px 0 0",
                        lineHeight: "1.6",
                      }}
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {portfolio.projects?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "14px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  borderBottom: "2px solid #1a1a1a",
                  paddingBottom: "4px",
                  marginBottom: "12px",
                }}
              >
                Projects
              </h2>
              {portfolio.projects.map((project: any) => (
                <div key={project.id} style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "700",
                        fontSize: "13px",
                        margin: "0",
                      }}
                    >
                      {project.title}
                    </p>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        style={{ fontSize: "11px", color: "#4f46e5" }}
                      >
                        {project.liveUrl}
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        margin: "4px 0",
                        lineHeight: "1.5",
                      }}
                    >
                      {project.description}
                    </p>
                  )}
                  {project.tags?.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "4px",
                        marginTop: "4px",
                      }}
                    >
                      {project.tags.map((tag: string) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: "10px",
                            background: "#f3f4f6",
                            border: "1px solid #e5e7eb",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            color: "#555",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Testimonials */}
          {portfolio.testimonials?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "14px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  borderBottom: "2px solid #1a1a1a",
                  paddingBottom: "4px",
                  marginBottom: "12px",
                }}
              >
                Testimonials
              </h2>
              {portfolio.testimonials.map((t: any) => (
                <div
                  key={t.id}
                  style={{
                    marginBottom: "10px",
                    paddingLeft: "10px",
                    borderLeft: "3px solid #4f46e5",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#444",
                      fontStyle: "italic",
                      margin: "0 0 4px",
                      lineHeight: "1.5",
                    }}
                  >
                    "{t.content}"
                  </p>
                  <p
                    style={{ fontSize: "11px", fontWeight: "700", margin: "0" }}
                  >
                    {t.authorName}
                  </p>
                  {(t.authorTitle || t.authorCompany) && (
                    <p style={{ fontSize: "11px", color: "#777", margin: "0" }}>
                      {[t.authorTitle, t.authorCompany]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Online */}
          {(portfolio.github || portfolio.linkedin || portfolio.website) && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "14px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  borderBottom: "2px solid #1a1a1a",
                  paddingBottom: "4px",
                  marginBottom: "12px",
                }}
              >
                Find Me Online
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {portfolio.linkedin && (
                  <div>
                    <p
                      style={{
                        fontWeight: "700",
                        fontSize: "12px",
                        margin: "0",
                      }}
                    >
                      LinkedIn
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#4f46e5",
                        margin: "0",
                      }}
                    >
                      {linkedinUsername}
                    </p>
                  </div>
                )}
                {portfolio.github && (
                  <div>
                    <p
                      style={{
                        fontWeight: "700",
                        fontSize: "12px",
                        margin: "0",
                      }}
                    >
                      GitHub
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#4f46e5",
                        margin: "0",
                      }}
                    >
                      {githubUsername}
                    </p>
                  </div>
                )}
                {portfolio.website && (
                  <div>
                    <p
                      style={{
                        fontWeight: "700",
                        fontSize: "12px",
                        margin: "0",
                      }}
                    >
                      Website
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#4f46e5",
                        margin: "0",
                      }}
                    >
                      {portfolio.website}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {portfolio.skills?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "14px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  borderBottom: "2px solid #1a1a1a",
                  paddingBottom: "4px",
                  marginBottom: "12px",
                }}
              >
                Skills
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {portfolio.skills.map((skill: any) => (
                  <span
                    key={skill.id}
                    style={{
                      fontSize: "12px",
                      background: "#f3f4f6",
                      border: "1px solid #e5e7eb",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontWeight: "500",
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {portfolio.certificates?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "14px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  borderBottom: "2px solid #1a1a1a",
                  paddingBottom: "4px",
                  marginBottom: "12px",
                }}
              >
                Certificates
              </h2>
              {portfolio.certificates.map((cert: any) => (
                <div key={cert.id} style={{ marginBottom: "10px" }}>
                  <p
                    style={{ fontWeight: "700", fontSize: "12px", margin: "0" }}
                  >
                    {cert.title}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#4f46e5",
                      margin: "2px 0",
                    }}
                  >
                    {cert.issuer}
                  </p>
                  <p style={{ fontSize: "11px", color: "#777", margin: "0" }}>
                    {new Date(cert.issueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "20px",
          paddingTop: "10px",
          borderTop: "1px solid #e5e7eb",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "10px", color: "#aaa", margin: 0 }}>
          Generated by PortfolioCraft · portfoliocraft.com/{username}
        </p>
      </div>
    </main>
  );
}
