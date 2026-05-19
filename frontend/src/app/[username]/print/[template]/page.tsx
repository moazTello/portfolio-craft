import { notFound } from "next/navigation";
import { getPdfTemplateById } from "@/components/portfolio/pdf-templates";
import { PrintButton } from "@/components/portfolio/PrintButton";
import type { ReactElement } from "react";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/v1";

async function getPortfolio(username: string) {
  try {
    // const res = await fetch(
    //   `http://localhost:3001/v1/portfolios/public/${username}`,
    //   { cache: "no-store" },
    // );
    const res = await fetch(`${API_URL}/portfolios/public/${username}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────
// SHARED TYPES
// ─────────────────────────────────────────────────────────
interface TemplateProps {
  portfolio: any;
  username: string;
  accent: string;
  githubUsername?: string;
  linkedinUsername?: string;
}

function fmt(date: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString(
    "en-US",
    opts ?? { year: "numeric", month: "short" },
  );
}

// ─────────────────────────────────────────────────────────
// 6. ARTISTIC — Yellow/gold left accent bar, two-column
// Left: name+title in bold yellow header, experience list
// Right: summary, skills, certs
// ─────────────────────────────────────────────────────────
export function ArtisticTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#e6b800";
  return (
    <main
      style={{
        fontFamily: "Georgia, serif",
        display: "flex",
        minHeight: "100vh",
        fontSize: "11px",
        color: "#1a1a1a",
        background: "#fff",
      }}
    >
      {/* Left column */}
      <aside
        style={{
          width: "220px",
          flexShrink: 0,
          borderRight: `4px solid ${accentColor}`,
        }}
      >
        <div style={{ background: accentColor, padding: "20px 16px 16px" }}>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "900",
              margin: "0 0 2px",
              color: "#000",
            }}
          >
            {portfolio.heroTitle}
          </h1>
          <p
            style={{
              fontSize: "11px",
              margin: "0",
              color: "#333",
              fontStyle: "italic",
            }}
          >
            {portfolio.heroSubtitle}
          </p>
        </div>
        <div style={{ padding: "16px" }}>
          {/* Contact */}
          <div style={{ marginBottom: "14px" }}>
            {portfolio.phone && (
              <p style={{ margin: "3px 0", fontSize: "10px" }}>
                📞 {portfolio.phone}
              </p>
            )}
            {portfolio.email && (
              <p style={{ margin: "3px 0", fontSize: "10px" }}>
                ✉ {portfolio.email}
              </p>
            )}
            {portfolio.location && (
              <p style={{ margin: "3px 0", fontSize: "10px" }}>
                📍 {portfolio.location}
              </p>
            )}
            {linkedinUsername && (
              <p style={{ margin: "3px 0", fontSize: "10px" }}>
                in/{linkedinUsername}
              </p>
            )}
          </div>
          {/* Experience */}
          {portfolio.experiences?.length > 0 && (
            <div style={{ marginBottom: "14px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "3px",
                  marginBottom: "8px",
                }}
              >
                Experience
              </h2>
              {portfolio.experiences.map((exp: any) => (
                <div key={exp.id} style={{ marginBottom: "10px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "11px" }}
                  >
                    {exp.role}
                  </p>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0",
                      fontSize: "10px",
                      fontWeight: "600",
                    }}
                  >
                    {exp.company}
                  </p>
                  <p
                    style={{ fontSize: "9px", color: "#666", margin: "1px 0" }}
                  >
                    {fmt(exp.startDate)} —{" "}
                    {exp.current ? "Present" : fmt(exp.endDate)}
                  </p>
                  {exp.description && (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#444",
                        margin: "3px 0 0",
                        lineHeight: "1.4",
                      }}
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Education */}
          {portfolio.education?.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "3px",
                  marginBottom: "8px",
                }}
              >
                Education
              </h2>
              {portfolio.education.map((ed: any) => (
                <div key={ed.id} style={{ marginBottom: "8px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "11px" }}
                  >
                    {ed.degree}
                  </p>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0",
                      fontSize: "10px",
                    }}
                  >
                    {ed.school}
                  </p>
                  <p style={{ fontSize: "9px", color: "#666", margin: "0" }}>
                    {ed.startYear} – {ed.endYear} · {ed.location}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
      {/* Right column */}
      <div style={{ flex: 1, padding: "24px 24px 24px 20px" }}>
        {portfolio.aboutText && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Summary
            </h2>
            <p
              style={{
                color: "#555",
                lineHeight: "1.6",
                margin: 0,
                fontSize: "11px",
              }}
            >
              {portfolio.aboutText}
            </p>
          </section>
        )}
        {portfolio.skills?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Skills
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {portfolio.skills.map((skill: any) => (
                <span
                  key={skill.id}
                  style={{
                    fontSize: "10px",
                    background: "#f5f5f5",
                    border: `1px solid ${accentColor}`,
                    padding: "2px 7px",
                    borderRadius: "2px",
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
        {portfolio.certificates?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Certifications
            </h2>
            {portfolio.certificates.map((cert: any) => (
              <div key={cert.id} style={{ marginBottom: "6px" }}>
                <p style={{ margin: "0", fontSize: "11px", fontWeight: "600" }}>
                  {cert.title}
                </p>
                <p
                  style={{ margin: "1px 0 0", fontSize: "10px", color: "#666" }}
                >
                  {cert.issuer} · {fmt(cert.issueDate)}
                </p>
              </div>
            ))}
          </section>
        )}
        {portfolio.achievements?.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Achievements
            </h2>
            {portfolio.achievements.map((a: any) => (
              <div key={a.id} style={{ marginBottom: "6px" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "11px" }}>
                  {a.title}
                </p>
                {a.description && (
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#555",
                      margin: "2px 0 0",
                    }}
                  >
                    {a.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
        <footer
          style={{
            marginTop: "20px",
            paddingTop: "8px",
            borderTop: "1px solid #eee",
          }}
        >
          <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
            portfoliocraft.com/{username}
          </p>
        </footer>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 7. BLOOM — Dark background header with avatar circle, white body
// ─────────────────────────────────────────────────────────
export function BloomTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#e05a9c";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        fontSize: "11px",
        color: "#222",
        background: "#fff",
        maxWidth: "820px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#1a1a2e",
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {portfolio.user?.avatarUrl && (
          <img
            src={portfolio.user.avatarUrl}
            alt=""
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `3px solid ${accentColor}`,
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "800",
              margin: "0 0 3px",
              color: "#fff",
            }}
          >
            {portfolio.heroTitle}
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: accentColor,
              margin: "0 0 10px",
              fontWeight: "600",
            }}
          >
            {portfolio.heroSubtitle}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "10px",
              color: "#94a3b8",
            }}
          >
            {portfolio.phone && <span>📞 {portfolio.phone}</span>}
            {portfolio.email && <span>✉ {portfolio.email}</span>}
            {portfolio.location && <span>📍 {portfolio.location}</span>}
            {githubUsername && <span>/{githubUsername}</span>}
            {linkedinUsername && <span>linkedin/{linkedinUsername}</span>}
          </div>
        </div>
      </header>
      <div
        style={{
          padding: "24px 32px",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "28px",
        }}
      >
        <div>
          {portfolio.aboutText && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "8px",
                }}
              >
                Summary
              </h2>
              <p style={{ color: "#555", lineHeight: "1.6", margin: 0 }}>
                {portfolio.aboutText}
              </p>
            </section>
          )}
          {portfolio.experiences?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "10px",
                }}
              >
                Experience
              </h2>
              {portfolio.experiences.map((exp: any) => (
                <div key={exp.id} style={{ marginBottom: "12px" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <p
                        style={{
                          fontWeight: "700",
                          margin: "0",
                          fontSize: "12px",
                        }}
                      >
                        {exp.role}
                      </p>
                      <p
                        style={{
                          color: accentColor,
                          margin: "1px 0 3px",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        {exp.company}
                        {exp.location ? ` · ${exp.location}` : ""}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#777",
                        whiteSpace: "nowrap",
                        margin: "0",
                      }}
                    >
                      {fmt(exp.startDate)} —{" "}
                      {exp.current ? "Present" : fmt(exp.endDate)}
                    </p>
                  </div>
                  {exp.description && (
                    <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                      {exp.description
                        .split("\n")
                        .filter(Boolean)
                        .slice(0, 4)
                        .map((line: string, i: number) => (
                          <li
                            key={i}
                            style={{
                              fontSize: "10px",
                              color: "#555",
                              marginBottom: "2px",
                              lineHeight: "1.4",
                            }}
                          >
                            {line.replace(/^[-•]\s*/, "")}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
          {portfolio.education?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "10px",
                }}
              >
                Education
              </h2>
              {portfolio.education.map((ed: any) => (
                <div key={ed.id} style={{ marginBottom: "8px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}
                  >
                    {ed.degree}
                  </p>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0",
                      fontSize: "11px",
                    }}
                  >
                    {ed.school}
                  </p>
                  <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                    {ed.startYear} – {ed.endYear} · {ed.location}
                  </p>
                </div>
              ))}
            </section>
          )}
          {portfolio.certificates?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "10px",
                }}
              >
                Certifications
              </h2>
              {portfolio.certificates.map((cert: any) => (
                <p key={cert.id} style={{ margin: "3px 0", fontSize: "10px" }}>
                  • {cert.title} —{" "}
                  <span style={{ color: accentColor }}>{cert.issuer}</span>,{" "}
                  {fmt(cert.issueDate)}
                </p>
              ))}
            </section>
          )}
        </div>
        <div>
          {portfolio.skills?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "10px",
                }}
              >
                Skills
              </h2>
              {portfolio.skills.map((skill: any) => (
                <div key={skill.id} style={{ marginBottom: "6px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ fontSize: "11px" }}>{skill.name}</span>
                    <span style={{ fontSize: "10px", color: "#999" }}>
                      {skill.proficiency >= 80
                        ? "Expert"
                        : skill.proficiency >= 60
                          ? "Advanced"
                          : skill.proficiency >= 40
                            ? "Proficient"
                            : "Beginner"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background:
                            i <= Math.round(skill.proficiency / 20)
                              ? accentColor
                              : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
          {portfolio.achievements?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "10px",
                }}
              >
                Achievements
              </h2>
              {portfolio.achievements.map((a: any) => (
                <div key={a.id} style={{ marginBottom: "6px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "11px" }}
                  >
                    – {a.title}
                  </p>
                  {a.description && (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#555",
                        margin: "1px 0 0",
                        paddingLeft: "10px",
                      }}
                    >
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
      <footer
        style={{
          padding: "8px 32px",
          borderTop: "1px solid #eee",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
          portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 8. TIMELESS — Clean two column, no sidebar, section headers with thin lines
// ─────────────────────────────────────────────────────────
export function TimelessTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#2563eb";
  return (
    <main
      style={{
        fontFamily: "'Times New Roman', serif",
        fontSize: "11px",
        color: "#1a1a1a",
        background: "#fff",
        maxWidth: "860px",
        margin: "0 auto",
        padding: "32px 36px",
      }}
    >
      <header
        style={{
          marginBottom: "20px",
          paddingBottom: "14px",
          borderBottom: "2px solid #222",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "700",
            margin: "0 0 3px",
            letterSpacing: "0.5px",
          }}
        >
          {portfolio.heroTitle}
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: accentColor,
            margin: "0 0 10px",
            fontWeight: "600",
          }}
        >
          {portfolio.heroSubtitle}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: "10px",
            color: "#555",
          }}
        >
          {portfolio.phone && <span>📞 {portfolio.phone}</span>}
          {portfolio.email && <span>✉ {portfolio.email}</span>}
          {portfolio.location && <span>📍 {portfolio.location}</span>}
          {githubUsername && <span>github/{githubUsername}</span>}
          {linkedinUsername && <span>linkedin/{linkedinUsername}</span>}
        </div>
      </header>
      {portfolio.aboutText && (
        <section style={{ marginBottom: "18px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              borderBottom: "1px solid #ccc",
              paddingBottom: "4px",
              marginBottom: "8px",
            }}
          >
            Summary
          </h2>
          <p
            style={{
              color: "#444",
              lineHeight: "1.65",
              margin: 0,
              fontSize: "11px",
            }}
          >
            {portfolio.aboutText}
          </p>
        </section>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "28px",
        }}
      >
        <div>
          {portfolio.experiences?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Experience
              </h2>
              {portfolio.experiences.map((exp: any) => (
                <div key={exp.id} style={{ marginBottom: "12px" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "12px",
                      }}
                    >
                      {exp.role}
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#777",
                        margin: "0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmt(exp.startDate)} —{" "}
                      {exp.current ? "Present" : fmt(exp.endDate)}
                    </p>
                  </div>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0 3px",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.description && (
                    <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                      {exp.description
                        .split("\n")
                        .filter(Boolean)
                        .slice(0, 5)
                        .map((line: string, i: number) => (
                          <li
                            key={i}
                            style={{
                              fontSize: "10px",
                              color: "#555",
                              marginBottom: "2px",
                              lineHeight: "1.4",
                            }}
                          >
                            {line.replace(/^[-•]\s*/, "")}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
          {portfolio.education?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Education
              </h2>
              {portfolio.education.map((ed: any) => (
                <div key={ed.id} style={{ marginBottom: "8px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}
                  >
                    {ed.degree}
                  </p>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0",
                      fontSize: "11px",
                    }}
                  >
                    {ed.school}
                  </p>
                  <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                    {ed.startYear} – {ed.endYear} · {ed.location}
                  </p>
                </div>
              ))}
            </section>
          )}
          {portfolio.certificates?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Certifications
              </h2>
              {portfolio.certificates.map((cert: any) => (
                <div key={cert.id} style={{ marginBottom: "5px" }}>
                  <p
                    style={{ margin: "0", fontSize: "11px", fontWeight: "600" }}
                  >
                    {cert.title}
                  </p>
                  <p
                    style={{
                      margin: "1px 0 0",
                      fontSize: "10px",
                      color: "#666",
                    }}
                  >
                    {cert.issuer} · {fmt(cert.issueDate)}
                  </p>
                </div>
              ))}
            </section>
          )}
        </div>
        <div>
          {portfolio.skills?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Skills
              </h2>
              {portfolio.skills.map((skill: any) => (
                <div key={skill.id} style={{ marginBottom: "7px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ fontSize: "11px" }}>{skill.name}</span>
                    <span style={{ fontSize: "10px", color: "#777" }}>
                      {skill.proficiency >= 80
                        ? "Expert"
                        : skill.proficiency >= 60
                          ? "Advanced"
                          : skill.proficiency >= 40
                            ? "Proficient"
                            : "Beginner"}
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#e5e7eb",
                      borderRadius: "1px",
                      height: "3px",
                    }}
                  >
                    <div
                      style={{
                        background: "#555",
                        width: `${skill.proficiency}%`,
                        height: "3px",
                        borderRadius: "1px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </section>
          )}
          {portfolio.achievements?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Achievements
              </h2>
              {portfolio.achievements.map((a: any) => (
                <div key={a.id} style={{ marginBottom: "6px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "11px" }}
                  >
                    – {a.title}
                  </p>
                  {a.description && (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#555",
                        margin: "2px 0 0",
                      }}
                    >
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
      <footer
        style={{
          marginTop: "20px",
          paddingTop: "8px",
          borderTop: "1px solid #e5e7eb",
          textAlign: "right",
        }}
      >
        <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
          portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 9. IMPACT — Dark left sidebar (contact+skills), white right
// ─────────────────────────────────────────────────────────
export function ImpactTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#e85d26";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        minHeight: "100vh",
        fontSize: "11px",
        color: "#1a1a1a",
      }}
    >
      {/* Dark sidebar */}
      <aside
        style={{
          width: "200px",
          flexShrink: 0,
          background: "#1a1a2e",
          color: "#fff",
          padding: "24px 16px",
        }}
      >
        <div style={{ marginBottom: "18px" }}>
          <p
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#94a3b8",
              marginBottom: "8px",
              fontWeight: "700",
            }}
          >
            Contact Info
          </p>
          {portfolio.phone && (
            <p style={{ margin: "4px 0", fontSize: "10px", color: "#ccc" }}>
              📞 {portfolio.phone}
            </p>
          )}
          {portfolio.email && (
            <p style={{ margin: "4px 0", fontSize: "10px", color: "#ccc" }}>
              ✉ {portfolio.email}
            </p>
          )}
          {portfolio.location && (
            <p style={{ margin: "4px 0", fontSize: "10px", color: "#ccc" }}>
              📍 {portfolio.location}
            </p>
          )}
          {linkedinUsername && (
            <p style={{ margin: "4px 0", fontSize: "10px", color: "#ccc" }}>
              linkedin/{linkedinUsername}
            </p>
          )}
          {githubUsername && (
            <p style={{ margin: "4px 0", fontSize: "10px", color: "#ccc" }}>
              github/{githubUsername}
            </p>
          )}
        </div>
        {portfolio.skills?.length > 0 && (
          <div style={{ marginBottom: "18px" }}>
            <p
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#94a3b8",
                marginBottom: "8px",
                fontWeight: "700",
              }}
            >
              Skills
            </p>
            {portfolio.skills.map((skill: any) => (
              <div key={skill.id} style={{ marginBottom: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontSize: "10px", color: "#e2e8f0" }}>
                    {skill.name}
                  </span>
                  <span style={{ fontSize: "9px", color: "#94a3b8" }}>
                    {skill.proficiency >= 80
                      ? "Expert"
                      : skill.proficiency >= 60
                        ? "Advanced"
                        : "Proficient"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background:
                          i <= Math.round(skill.proficiency / 20)
                            ? accentColor
                            : "#334155",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {portfolio.languages?.length > 0 && (
          <div style={{ marginBottom: "18px" }}>
            <p
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#94a3b8",
                marginBottom: "8px",
                fontWeight: "700",
              }}
            >
              Languages
            </p>
            {portfolio.languages.map((lang: any) => (
              <div key={lang.id} style={{ marginBottom: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontSize: "10px", color: "#e2e8f0" }}>
                    {lang.name}
                  </span>
                  <span style={{ fontSize: "9px", color: "#94a3b8" }}>
                    {lang.level}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background:
                          i <=
                          (lang.level === "Native"
                            ? 5
                            : lang.level === "Fluent"
                              ? 4
                              : lang.level === "Advanced"
                                ? 3
                                : 2)
                            ? accentColor
                            : "#334155",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {portfolio.achievements?.length > 0 && (
          <div>
            <p
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#94a3b8",
                marginBottom: "8px",
                fontWeight: "700",
              }}
            >
              Achievements
            </p>
            {portfolio.achievements.map((a: any) => (
              <div key={a.id} style={{ marginBottom: "7px" }}>
                <p
                  style={{
                    fontWeight: "700",
                    margin: "0",
                    fontSize: "10px",
                    color: "#f1f5f9",
                  }}
                >
                  – {a.title}
                </p>
                {a.description && (
                  <p
                    style={{
                      fontSize: "9px",
                      color: "#94a3b8",
                      margin: "2px 0 0",
                    }}
                  >
                    {a.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </aside>
      {/* Right */}
      <div style={{ flex: 1, padding: "24px 24px 24px 20px" }}>
        <header style={{ marginBottom: "18px" }}>
          <h1
            style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 2px" }}
          >
            {portfolio.heroTitle}
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: accentColor,
              margin: "0",
              fontWeight: "700",
            }}
          >
            {portfolio.heroSubtitle}
          </p>
        </header>
        {portfolio.aboutText && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                marginBottom: "6px",
              }}
            >
              Summary
            </h2>
            <p
              style={{
                color: "#555",
                lineHeight: "1.6",
                margin: 0,
                fontSize: "11px",
              }}
            >
              {portfolio.aboutText}
            </p>
          </section>
        )}
        {portfolio.experiences?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                marginBottom: "10px",
              }}
            >
              Experience
            </h2>
            {portfolio.experiences.map((exp: any) => (
              <div key={exp.id} style={{ marginBottom: "12px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}
                  >
                    {exp.role}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#777",
                      margin: "0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmt(exp.startDate)} —{" "}
                    {exp.current ? "Present" : fmt(exp.endDate)}
                  </p>
                </div>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0 3px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.description && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                    {exp.description
                      .split("\n")
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((line: string, i: number) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "10px",
                            color: "#555",
                            marginBottom: "2px",
                            lineHeight: "1.4",
                          }}
                        >
                          {line.replace(/^[-•]\s*/, "")}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}
        {portfolio.education?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                marginBottom: "10px",
              }}
            >
              Education
            </h2>
            {portfolio.education.map((ed: any) => (
              <div key={ed.id} style={{ marginBottom: "8px" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}>
                  {ed.degree}
                </p>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0",
                    fontSize: "11px",
                  }}
                >
                  {ed.school}
                </p>
                <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                  {ed.startYear} – {ed.endYear} · {ed.location}
                </p>
              </div>
            ))}
          </section>
        )}
        {portfolio.certificates?.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                marginBottom: "10px",
              }}
            >
              Certifications
            </h2>
            {portfolio.certificates.map((cert: any) => (
              <p key={cert.id} style={{ margin: "3px 0", fontSize: "10px" }}>
                • {cert.title} — {cert.issuer}, {fmt(cert.issueDate)}
              </p>
            ))}
          </section>
        )}
        <footer
          style={{
            marginTop: "20px",
            paddingTop: "8px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
            portfoliocraft.com/{username}
          </p>
        </footer>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 10. EXPERT — Teal left sidebar, clean professional
// ─────────────────────────────────────────────────────────
export function ExpertTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#0d7377";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        minHeight: "100vh",
        fontSize: "11px",
      }}
    >
      <aside
        style={{
          width: "210px",
          flexShrink: 0,
          background: accentColor,
          color: "#fff",
          padding: "28px 18px",
        }}
      >
        {portfolio.user?.avatarUrl && (
          <img
            src={portfolio.user.avatarUrl}
            alt=""
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(255,255,255,0.3)",
              display: "block",
              margin: "0 auto 14px",
            }}
          />
        )}
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <h1
            style={{ fontSize: "16px", fontWeight: "800", margin: "0 0 3px" }}
          >
            {portfolio.heroTitle}
          </h1>
          <p style={{ fontSize: "10px", opacity: 0.85, margin: 0 }}>
            {portfolio.heroSubtitle}
          </p>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.3)",
            paddingTop: "14px",
            marginBottom: "14px",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              opacity: 0.7,
              marginBottom: "6px",
              fontWeight: "700",
            }}
          >
            Contact
          </p>
          {portfolio.phone && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              📞 {portfolio.phone}
            </p>
          )}
          {portfolio.email && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              ✉ {portfolio.email}
            </p>
          )}
          {portfolio.location && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              📍 {portfolio.location}
            </p>
          )}
          {linkedinUsername && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              linkedin/{linkedinUsername}
            </p>
          )}
          {githubUsername && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              github/{githubUsername}
            </p>
          )}
        </div>
        {portfolio.skills?.length > 0 && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.3)",
              paddingTop: "14px",
              marginBottom: "14px",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                opacity: 0.7,
                marginBottom: "6px",
                fontWeight: "700",
              }}
            >
              Skills
            </p>
            {portfolio.skills.map((skill: any) => (
              <div key={skill.id} style={{ marginBottom: "5px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    background: "rgba(255,255,255,0.15)",
                    padding: "2px 8px",
                    borderRadius: "2px",
                    display: "inline-block",
                  }}
                >
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        )}
        {portfolio.languages?.length > 0 && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.3)",
              paddingTop: "14px",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                opacity: 0.7,
                marginBottom: "6px",
                fontWeight: "700",
              }}
            >
              Languages
            </p>
            {portfolio.languages.map((lang: any) => (
              <div key={lang.id} style={{ marginBottom: "7px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontSize: "10px" }}>{lang.name}</span>
                  <span style={{ fontSize: "9px", opacity: 0.75 }}>
                    {lang.level}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background:
                          i <=
                          (lang.level === "Native"
                            ? 5
                            : lang.level === "Fluent"
                              ? 4
                              : lang.level === "Advanced"
                                ? 3
                                : 2)
                            ? "#fff"
                            : "rgba(255,255,255,0.2)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
      <div
        style={{
          flex: 1,
          padding: "28px 24px",
          background: "#fff",
          color: "#1a1a1a",
        }}
      >
        {portfolio.aboutText && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Summary
            </h2>
            <p
              style={{
                color: "#555",
                lineHeight: "1.6",
                margin: 0,
                fontSize: "11px",
              }}
            >
              {portfolio.aboutText}
            </p>
          </section>
        )}
        {portfolio.experiences?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "10px",
              }}
            >
              Experience
            </h2>
            {portfolio.experiences.map((exp: any) => (
              <div key={exp.id} style={{ marginBottom: "12px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}
                  >
                    {exp.role}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#777",
                      margin: "0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmt(exp.startDate)} —{" "}
                    {exp.current ? "Present" : fmt(exp.endDate)}
                  </p>
                </div>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0 3px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.description && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                    {exp.description
                      .split("\n")
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((line: string, i: number) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "10px",
                            color: "#555",
                            marginBottom: "2px",
                            lineHeight: "1.4",
                          }}
                        >
                          {line.replace(/^[-•]\s*/, "")}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}
        {portfolio.education?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "10px",
              }}
            >
              Education
            </h2>
            {portfolio.education.map((ed: any) => (
              <div key={ed.id} style={{ marginBottom: "8px" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}>
                  {ed.degree}
                </p>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0",
                    fontSize: "11px",
                  }}
                >
                  {ed.school}
                </p>
                <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                  {ed.startYear} – {ed.endYear} · {ed.location}
                </p>
              </div>
            ))}
          </section>
        )}
        {portfolio.achievements?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Achievements
            </h2>
            {portfolio.achievements.map((a: any) => (
              <div key={a.id} style={{ marginBottom: "6px" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "11px" }}>
                  – {a.title}
                </p>
                {a.description && (
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#555",
                      margin: "2px 0 0",
                    }}
                  >
                    {a.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
        {portfolio.certificates?.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Certifications
            </h2>
            {portfolio.certificates.map((cert: any) => (
              <p key={cert.id} style={{ margin: "3px 0", fontSize: "10px" }}>
                • {cert.title} — {cert.issuer}, {fmt(cert.issueDate)}
              </p>
            ))}
          </section>
        )}
        <footer
          style={{
            marginTop: "20px",
            paddingTop: "8px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
            portfoliocraft.com/{username}
          </p>
        </footer>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 11. ELITE — Dark hero image banner, white body, clean typeset
// ─────────────────────────────────────────────────────────
export function EliteTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#1a6b4a";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        fontSize: "11px",
        color: "#1a1a1a",
        background: "#fff",
        maxWidth: "820px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
          padding: "28px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          {portfolio.user?.avatarUrl && (
            <img
              src={portfolio.user.avatarUrl}
              alt=""
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "6px",
                objectFit: "cover",
                border: `2px solid ${accentColor}`,
                flexShrink: 0,
              }}
            />
          )}
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: "900",
                margin: "0 0 2px",
                color: "#fff",
              }}
            >
              {portfolio.heroTitle}
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: accentColor,
                margin: "0 0 10px",
                fontWeight: "600",
              }}
            >
              {portfolio.heroSubtitle}
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                fontSize: "10px",
                color: "#94a3b8",
              }}
            >
              {portfolio.phone && <span>📞 {portfolio.phone}</span>}
              {portfolio.email && <span>✉ {portfolio.email}</span>}
              {portfolio.location && <span>📍 {portfolio.location}</span>}
              {linkedinUsername && <span>linkedin/{linkedinUsername}</span>}
            </div>
          </div>
        </div>
      </header>
      <div style={{ padding: "24px 32px" }}>
        {portfolio.aboutText && (
          <section style={{ marginBottom: "18px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: accentColor,
                marginBottom: "8px",
              }}
            >
              Summary
            </h2>
            <p
              style={{
                color: "#555",
                lineHeight: "1.6",
                margin: 0,
                fontSize: "11px",
              }}
            >
              {portfolio.aboutText}
            </p>
          </section>
        )}
        {portfolio.experiences?.length > 0 && (
          <section style={{ marginBottom: "18px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: accentColor,
                marginBottom: "10px",
              }}
            >
              Experience
            </h2>
            {portfolio.experiences.map((exp: any) => (
              <div key={exp.id} style={{ marginBottom: "12px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}
                  >
                    {exp.role}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#777",
                      margin: "0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmt(exp.startDate)} —{" "}
                    {exp.current ? "Present" : fmt(exp.endDate)}
                  </p>
                </div>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0 3px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.description && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                    {exp.description
                      .split("\n")
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((line: string, i: number) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "10px",
                            color: "#555",
                            marginBottom: "2px",
                            lineHeight: "1.4",
                          }}
                        >
                          {line.replace(/^[-•]\s*/, "")}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}
        {portfolio.education?.length > 0 && (
          <section style={{ marginBottom: "18px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: accentColor,
                marginBottom: "10px",
              }}
            >
              Education
            </h2>
            {portfolio.education.map((ed: any) => (
              <div key={ed.id} style={{ marginBottom: "8px" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}>
                  {ed.degree}
                </p>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0",
                    fontSize: "11px",
                  }}
                >
                  {ed.school} — {ed.fieldOfStudy}
                </p>
                <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                  {ed.startYear} – {ed.endYear} · {ed.location}
                </p>
              </div>
            ))}
          </section>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {portfolio.skills?.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "10px",
                }}
              >
                Skills
              </h2>
              {portfolio.skills.map((skill: any) => (
                <div key={skill.id} style={{ marginBottom: "6px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ fontSize: "11px" }}>{skill.name}</span>
                    <span style={{ fontSize: "10px", color: "#777" }}>
                      {skill.proficiency >= 80
                        ? "Expert"
                        : skill.proficiency >= 60
                          ? "Advanced"
                          : "Proficient"}
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#e5e7eb",
                      borderRadius: "2px",
                      height: "3px",
                    }}
                  >
                    <div
                      style={{
                        background: accentColor,
                        width: `${skill.proficiency}%`,
                        height: "3px",
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div>
            {portfolio.achievements?.length > 0 && (
              <div style={{ marginBottom: "14px" }}>
                <h2
                  style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: accentColor,
                    marginBottom: "10px",
                  }}
                >
                  Achievements
                </h2>
                {portfolio.achievements.map((a: any) => (
                  <div key={a.id} style={{ marginBottom: "6px" }}>
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "11px",
                      }}
                    >
                      – {a.title}
                    </p>
                    {a.description && (
                      <p
                        style={{
                          fontSize: "10px",
                          color: "#555",
                          margin: "2px 0 0",
                        }}
                      >
                        {a.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {portfolio.certificates?.length > 0 && (
              <div>
                <h2
                  style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: accentColor,
                    marginBottom: "10px",
                  }}
                >
                  Certifications
                </h2>
                {portfolio.certificates.map((cert: any) => (
                  <p
                    key={cert.id}
                    style={{ margin: "3px 0", fontSize: "10px" }}
                  >
                    • {cert.title}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <footer
        style={{
          padding: "8px 32px",
          borderTop: "1px solid #eee",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
          portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 12. ELEVATE — Warm neutral, dot-skill ratings, two columns
// ─────────────────────────────────────────────────────────
export function ElevateTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#c45c26";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        fontSize: "11px",
        color: "#1a1a1a",
        background: "#fff",
        maxWidth: "860px",
        margin: "0 auto",
        padding: "32px 36px",
      }}
    >
      <header style={{ marginBottom: "22px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 2px" }}>
          {portfolio.heroTitle}
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: accentColor,
            margin: "0 0 10px",
            fontWeight: "600",
          }}
        >
          {portfolio.heroSubtitle}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            fontSize: "10px",
            color: "#666",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "12px",
          }}
        >
          {portfolio.phone && <span>📞 {portfolio.phone}</span>}
          {portfolio.email && <span>✉ {portfolio.email}</span>}
          {portfolio.location && <span>📍 {portfolio.location}</span>}
          {linkedinUsername && <span>linkedin/{linkedinUsername}</span>}
          {githubUsername && <span>github/{githubUsername}</span>}
        </div>
      </header>
      {portfolio.aboutText && (
        <section style={{ marginBottom: "18px" }}>
          <h2
            style={{
              fontSize: "10px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: accentColor,
              marginBottom: "8px",
            }}
          >
            Summary
          </h2>
          <p
            style={{
              color: "#555",
              lineHeight: "1.65",
              margin: 0,
              fontSize: "11px",
            }}
          >
            {portfolio.aboutText}
          </p>
        </section>
      )}
      {portfolio.experiences?.length > 0 && (
        <section style={{ marginBottom: "18px" }}>
          <h2
            style={{
              fontSize: "10px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: accentColor,
              marginBottom: "10px",
            }}
          >
            Experience
          </h2>
          {portfolio.experiences.map((exp: any) => (
            <div key={exp.id} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}>
                  {exp.role}
                </p>
                <p
                  style={{
                    fontSize: "10px",
                    color: "#777",
                    margin: "0",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fmt(exp.startDate)} —{" "}
                  {exp.current ? "Present" : fmt(exp.endDate)}
                </p>
              </div>
              <p
                style={{
                  color: accentColor,
                  margin: "1px 0 3px",
                  fontSize: "11px",
                  fontWeight: "600",
                }}
              >
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </p>
              {exp.description && (
                <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                  {exp.description
                    .split("\n")
                    .filter(Boolean)
                    .slice(0, 4)
                    .map((line: string, i: number) => (
                      <li
                        key={i}
                        style={{
                          fontSize: "10px",
                          color: "#555",
                          marginBottom: "2px",
                          lineHeight: "1.4",
                        }}
                      >
                        {line.replace(/^[-•]\s*/, "")}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}
      {portfolio.education?.length > 0 && (
        <section style={{ marginBottom: "18px" }}>
          <h2
            style={{
              fontSize: "10px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: accentColor,
              marginBottom: "10px",
            }}
          >
            Education
          </h2>
          {portfolio.education.map((ed: any) => (
            <div key={ed.id} style={{ marginBottom: "7px" }}>
              <p style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}>
                {ed.degree}
              </p>
              <p
                style={{
                  color: accentColor,
                  margin: "1px 0",
                  fontSize: "11px",
                }}
              >
                {ed.school}
              </p>
              <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                {ed.startYear} – {ed.endYear} · {ed.location}
              </p>
            </div>
          ))}
        </section>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "18px",
        }}
      >
        {portfolio.skills?.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: accentColor,
                marginBottom: "10px",
              }}
            >
              Skills
            </h2>
            {portfolio.skills.map((skill: any) => (
              <div
                key={skill.id}
                style={{
                  marginBottom: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "11px", width: "120px" }}>
                  {skill.name}
                </span>
                <div style={{ display: "flex", gap: "3px" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background:
                          i <= Math.round(skill.proficiency / 20)
                            ? accentColor
                            : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: "10px", color: "#999" }}>
                  {skill.proficiency >= 80
                    ? "Expert"
                    : skill.proficiency >= 60
                      ? "Advanced"
                      : "Proficient"}
                </span>
              </div>
            ))}
          </div>
        )}
        <div>
          {portfolio.certificates?.length > 0 && (
            <div style={{ marginBottom: "14px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "10px",
                }}
              >
                Certifications
              </h2>
              {portfolio.certificates.map((cert: any) => (
                <p key={cert.id} style={{ margin: "3px 0", fontSize: "10px" }}>
                  • {cert.title} — {cert.issuer}, {fmt(cert.issueDate)}
                </p>
              ))}
            </div>
          )}
          {portfolio.achievements?.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "10px",
                }}
              >
                Achievements
              </h2>
              {portfolio.achievements.map((a: any) => (
                <div key={a.id} style={{ marginBottom: "5px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "11px" }}
                  >
                    – {a.title}
                  </p>
                  {a.description && (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#555",
                        margin: "1px 0 0",
                      }}
                    >
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <footer style={{ paddingTop: "8px", borderTop: "1px solid #e5e7eb" }}>
        <p
          style={{
            fontSize: "9px",
            color: "#aaa",
            margin: 0,
            textAlign: "right",
          }}
        >
          portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 13. MODULAR — Right dark sidebar, left main content
// ─────────────────────────────────────────────────────────
export function ModularTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#7c3aed";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        minHeight: "100vh",
        fontSize: "11px",
      }}
    >
      {/* Left main */}
      <div
        style={{
          flex: 1,
          padding: "28px 24px",
          background: "#fff",
          color: "#1a1a1a",
        }}
      >
        <header style={{ marginBottom: "18px" }}>
          <h1
            style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 2px" }}
          >
            {portfolio.heroTitle}
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: accentColor,
              margin: "0",
              fontWeight: "700",
            }}
          >
            {portfolio.heroSubtitle}
          </p>
        </header>
        {portfolio.aboutText && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Summary
            </h2>
            <p
              style={{
                color: "#555",
                lineHeight: "1.6",
                margin: 0,
                fontSize: "11px",
              }}
            >
              {portfolio.aboutText}
            </p>
          </section>
        )}
        {portfolio.experiences?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "10px",
              }}
            >
              Experience
            </h2>
            {portfolio.experiences.map((exp: any) => (
              <div key={exp.id} style={{ marginBottom: "12px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}
                  >
                    {exp.role}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#777",
                      margin: "0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmt(exp.startDate)} —{" "}
                    {exp.current ? "Present" : fmt(exp.endDate)}
                  </p>
                </div>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0 3px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.description && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                    {exp.description
                      .split("\n")
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((line: string, i: number) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "10px",
                            color: "#555",
                            marginBottom: "2px",
                            lineHeight: "1.4",
                          }}
                        >
                          {line.replace(/^[-•]\s*/, "")}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}
        {portfolio.education?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "10px",
              }}
            >
              Education
            </h2>
            {portfolio.education.map((ed: any) => (
              <div key={ed.id} style={{ marginBottom: "8px" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}>
                  {ed.degree}
                </p>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0",
                    fontSize: "11px",
                  }}
                >
                  {ed.school}
                </p>
                <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                  {ed.startYear} – {ed.endYear} · {ed.location}
                </p>
              </div>
            ))}
          </section>
        )}
        {portfolio.achievements?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "10px",
              }}
            >
              ACHIEVEMENTS
            </h2>
            {portfolio.achievements.map((ach: any) => (
              <div key={ach.id} style={{ marginBottom: "8px" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}>
                  {ach.title}
                </p>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0",
                    fontSize: "11px",
                  }}
                >
                  {ach.organization}
                </p>
                <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                  {ach.startYear} – {ach.endYear} · {ach.location}
                </p>
              </div>
            ))}
          </section>
        )}
        <footer
          style={{
            marginTop: "20px",
            paddingTop: "8px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
            portfoliocraft.com/{username}
          </p>
        </footer>
      </div>
      {/* Right dark sidebar */}
      <aside
        style={{
          width: "200px",
          flexShrink: 0,
          background: "#1a1a2e",
          color: "#fff",
          padding: "28px 16px",
        }}
      >
        {portfolio.user?.avatarUrl && (
          <img
            src={portfolio.user.avatarUrl}
            alt=""
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${accentColor}`,
              display: "block",
              margin: "0 auto 14px",
            }}
          />
        )}
        <div
          style={{
            marginBottom: "16px",
            borderBottom: "1px solid #334155",
            paddingBottom: "14px",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#64748b",
              marginBottom: "6px",
              fontWeight: "700",
            }}
          >
            Contact
          </p>
          {portfolio.phone && (
            <p style={{ margin: "3px 0", fontSize: "10px", color: "#cbd5e1" }}>
              📞 {portfolio.phone}
            </p>
          )}
          {portfolio.email && (
            <p style={{ margin: "3px 0", fontSize: "10px", color: "#cbd5e1" }}>
              ✉ {portfolio.email}
            </p>
          )}
          {portfolio.location && (
            <p style={{ margin: "3px 0", fontSize: "10px", color: "#cbd5e1" }}>
              📍 {portfolio.location}
            </p>
          )}
          {linkedinUsername && (
            <p style={{ margin: "3px 0", fontSize: "10px", color: "#cbd5e1" }}>
              linkedin/{linkedinUsername}
            </p>
          )}
          {githubUsername && (
            <p style={{ margin: "3px 0", fontSize: "10px", color: "#cbd5e1" }}>
              github/{githubUsername}
            </p>
          )}
        </div>
        {portfolio.skills?.length > 0 && (
          <div
            style={{
              marginBottom: "16px",
              borderBottom: "1px solid #334155",
              paddingBottom: "14px",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#64748b",
                marginBottom: "6px",
                fontWeight: "700",
              }}
            >
              Skills
            </p>
            {portfolio.skills.map((skill: any) => (
              <div
                key={skill.id}
                style={{
                  marginBottom: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "10px", color: "#e2e8f0" }}>
                  {skill.name}
                </span>
                <span style={{ fontSize: "9px", color: accentColor }}>
                  {skill.proficiency >= 80
                    ? "Expert"
                    : skill.proficiency >= 60
                      ? "Advanced"
                      : "Proficient"}
                </span>
              </div>
            ))}
          </div>
        )}
        {portfolio.languages?.length > 0 && (
          <div
            style={{
              marginBottom: "16px",
              borderBottom: "1px solid #334155",
              paddingBottom: "14px",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#64748b",
                marginBottom: "6px",
                fontWeight: "700",
              }}
            >
              Languages
            </p>
            {portfolio.languages.map((lang: any) => (
              <div key={lang.id} style={{ marginBottom: "7px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontSize: "10px", color: "#e2e8f0" }}>
                    {lang.name}
                  </span>
                  <span style={{ fontSize: "9px", color: "#94a3b8" }}>
                    {lang.level}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "11px",
                        height: "11px",
                        borderRadius: "50%",
                        background:
                          i <=
                          (lang.level === "Native"
                            ? 5
                            : lang.level === "Fluent"
                              ? 4
                              : lang.level === "Advanced"
                                ? 3
                                : 2)
                            ? accentColor
                            : "#334155",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {portfolio.certificates?.length > 0 && (
          <div>
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#64748b",
                marginBottom: "6px",
                fontWeight: "700",
              }}
            >
              Certifications
            </p>
            {portfolio.certificates.map((cert: any) => (
              <p
                key={cert.id}
                style={{ margin: "3px 0", fontSize: "10px", color: "#cbd5e1" }}
              >
                • {cert.title}
              </p>
            ))}
          </div>
        )}
      </aside>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 14. CLASSIC — Traditional two-col, thin serif dividers
// ─────────────────────────────────────────────────────────
export function ClassicTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#1d4ed8";
  return (
    <main
      style={{
        fontFamily: "Georgia, serif",
        fontSize: "11px",
        color: "#1a1a1a",
        background: "#fff",
        maxWidth: "860px",
        margin: "0 auto",
        padding: "32px 36px",
      }}
    >
      <header
        style={{
          marginBottom: "20px",
          paddingBottom: "12px",
          borderBottom: "2px solid #222",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 2px" }}>
          {portfolio.heroTitle}
        </h1>
        <p style={{ fontSize: "12px", color: accentColor, margin: "0 0 8px" }}>
          {portfolio.heroSubtitle}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            fontSize: "10px",
            color: "#666",
          }}
        >
          {portfolio.phone && <span>📞 {portfolio.phone}</span>}
          {portfolio.email && <span>✉ {portfolio.email}</span>}
          {portfolio.location && <span>📍 {portfolio.location}</span>}
          {linkedinUsername && <span>linkedin/{linkedinUsername}</span>}
          {githubUsername && <span>github/{githubUsername}</span>}
        </div>
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "28px",
        }}
      >
        <div>
          {portfolio.experiences?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Experience
              </h2>
              {portfolio.experiences.map((exp: any) => (
                <div key={exp.id} style={{ marginBottom: "12px" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "12px",
                      }}
                    >
                      {exp.role}
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#777",
                        margin: "0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmt(exp.startDate)} —{" "}
                      {exp.current ? "Present" : fmt(exp.endDate)}
                    </p>
                  </div>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0 3px",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.description && (
                    <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                      {exp.description
                        .split("\n")
                        .filter(Boolean)
                        .slice(0, 4)
                        .map((line: string, i: number) => (
                          <li
                            key={i}
                            style={{
                              fontSize: "10px",
                              color: "#555",
                              marginBottom: "2px",
                              lineHeight: "1.4",
                            }}
                          >
                            {line.replace(/^[-•]\s*/, "")}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
          {portfolio.education?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Education
              </h2>
              {portfolio.education.map((ed: any) => (
                <div key={ed.id} style={{ marginBottom: "8px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}
                  >
                    {ed.degree}
                  </p>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0",
                      fontSize: "11px",
                    }}
                  >
                    {ed.school}
                  </p>
                  <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                    {ed.startYear} – {ed.endYear} · {ed.location}
                  </p>
                </div>
              ))}
            </section>
          )}
          {portfolio.certificates?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Certifications
              </h2>
              {portfolio.certificates.map((cert: any) => (
                <p key={cert.id} style={{ margin: "3px 0", fontSize: "10px" }}>
                  • {cert.title} — {cert.issuer}, {fmt(cert.issueDate)}
                </p>
              ))}
            </section>
          )}
        </div>
        <div>
          {portfolio.aboutText && (
            <section style={{ marginBottom: "16px" }}>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "4px",
                  marginBottom: "8px",
                }}
              >
                Summary
              </h2>
              <p
                style={{
                  color: "#555",
                  lineHeight: "1.6",
                  margin: 0,
                  fontSize: "11px",
                }}
              >
                {portfolio.aboutText}
              </p>
            </section>
          )}
          {portfolio.skills?.length > 0 && (
            <section style={{ marginBottom: "16px" }}>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Skills
              </h2>
              {portfolio.skills.map((skill: any) => (
                <div key={skill.id} style={{ marginBottom: "6px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ fontSize: "11px" }}>{skill.name}</span>
                    <span style={{ fontSize: "10px", color: "#777" }}>
                      {skill.proficiency >= 80
                        ? "Expert"
                        : skill.proficiency >= 60
                          ? "Advanced"
                          : "Proficient"}
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#e5e7eb",
                      borderRadius: "1px",
                      height: "3px",
                    }}
                  >
                    <div
                      style={{
                        background: accentColor,
                        width: `${skill.proficiency}%`,
                        height: "3px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </section>
          )}
          {portfolio.achievements?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Achievements
              </h2>
              {portfolio.achievements.map((a: any) => (
                <div key={a.id} style={{ marginBottom: "6px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "11px" }}
                  >
                    – {a.title}
                  </p>
                  {a.description && (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#555",
                        margin: "2px 0 0",
                      }}
                    >
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
      <footer
        style={{
          marginTop: "20px",
          paddingTop: "8px",
          borderTop: "1px solid #e5e7eb",
          textAlign: "right",
        }}
      >
        <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
          portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 15. LUXE — Large photo left, colored section headers, avatar circle with city photo bg
// ─────────────────────────────────────────────────────────
export function LuxeTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#9f1239";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        fontSize: "11px",
        color: "#1a1a1a",
        background: "#fff",
        maxWidth: "860px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          background: `linear-gradient(160deg, #0f172a, #1e293b)`,
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {portfolio.user?.avatarUrl && (
          <img
            src={portfolio.user.avatarUrl}
            alt=""
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `3px solid ${accentColor}`,
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "900",
              margin: "0 0 2px",
              color: "#fff",
            }}
          >
            {portfolio.heroTitle}
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: accentColor,
              margin: "0 0 10px",
              fontWeight: "600",
            }}
          >
            {portfolio.heroSubtitle}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "10px",
              color: "#94a3b8",
            }}
          >
            {portfolio.phone && <span>📞 {portfolio.phone}</span>}
            {portfolio.email && <span>✉ {portfolio.email}</span>}
            {portfolio.location && <span>📍 {portfolio.location}</span>}
            {linkedinUsername && <span>linkedin/{linkedinUsername}</span>}
            {githubUsername && <span>github/{githubUsername}</span>}
          </div>
        </div>
      </header>
      <div
        style={{
          padding: "24px 32px",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "28px",
        }}
      >
        <div>
          {portfolio.aboutText && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "3px",
                  marginBottom: "8px",
                }}
              >
                Summary
              </h2>
              <p
                style={{
                  color: "#555",
                  lineHeight: "1.65",
                  margin: 0,
                  fontSize: "11px",
                }}
              >
                {portfolio.aboutText}
              </p>
            </section>
          )}
          {portfolio.experiences?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "3px",
                  marginBottom: "10px",
                }}
              >
                Experience
              </h2>
              {portfolio.experiences.map((exp: any) => (
                <div key={exp.id} style={{ marginBottom: "12px" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "12px",
                      }}
                    >
                      {exp.role}
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#777",
                        margin: "0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmt(exp.startDate)} —{" "}
                      {exp.current ? "Present" : fmt(exp.endDate)}
                    </p>
                  </div>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0 3px",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.description && (
                    <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                      {exp.description
                        .split("\n")
                        .filter(Boolean)
                        .slice(0, 4)
                        .map((line: string, i: number) => (
                          <li
                            key={i}
                            style={{
                              fontSize: "10px",
                              color: "#555",
                              marginBottom: "2px",
                              lineHeight: "1.4",
                            }}
                          >
                            {line.replace(/^[-•]\s*/, "")}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
          {portfolio.education?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "3px",
                  marginBottom: "10px",
                }}
              >
                Education
              </h2>
              {portfolio.education.map((ed: any) => (
                <div key={ed.id} style={{ marginBottom: "8px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}
                  >
                    {ed.degree}
                  </p>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0",
                      fontSize: "11px",
                    }}
                  >
                    {ed.school}
                  </p>
                  <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                    {ed.startYear} – {ed.endYear} · {ed.location}
                  </p>
                </div>
              ))}
            </section>
          )}
        </div>
        <div>
          {portfolio.skills?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "3px",
                  marginBottom: "10px",
                }}
              >
                Skills
              </h2>
              {portfolio.skills.map((skill: any) => (
                <div key={skill.id} style={{ marginBottom: "7px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ fontSize: "11px" }}>{skill.name}</span>
                    <span style={{ fontSize: "10px", color: "#777" }}>
                      {skill.proficiency >= 80
                        ? "Expert"
                        : skill.proficiency >= 60
                          ? "Advanced"
                          : "Proficient"}
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#e5e7eb",
                      borderRadius: "2px",
                      height: "3px",
                    }}
                  >
                    <div
                      style={{
                        background: accentColor,
                        width: `${skill.proficiency}%`,
                        height: "3px",
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </section>
          )}
          {portfolio.languages?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "3px",
                  marginBottom: "10px",
                }}
              >
                Languages
              </h2>
              {portfolio.languages.map((lang: any) => (
                <div key={lang.id} style={{ marginBottom: "7px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ fontSize: "11px" }}>{lang.name}</span>
                    <span style={{ fontSize: "10px", color: "#777" }}>
                      {lang.level}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: "13px",
                          height: "13px",
                          borderRadius: "50%",
                          background:
                            i <=
                            (lang.level === "Native"
                              ? 5
                              : lang.level === "Fluent"
                                ? 4
                                : lang.level === "Advanced"
                                  ? 3
                                  : 2)
                              ? accentColor
                              : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
          {portfolio.certificates?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "3px",
                  marginBottom: "10px",
                }}
              >
                Certifications
              </h2>
              {portfolio.certificates.map((cert: any) => (
                <p key={cert.id} style={{ margin: "3px 0", fontSize: "10px" }}>
                  • {cert.title} — {cert.issuer}
                </p>
              ))}
            </section>
          )}
          {portfolio.achievements?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accentColor,
                  borderBottom: `2px solid ${accentColor}`,
                  paddingBottom: "3px",
                  marginBottom: "10px",
                }}
              >
                Achievements
              </h2>
              {portfolio.achievements.map((a: any) => (
                <div key={a.id} style={{ marginBottom: "5px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "11px" }}
                  >
                    – {a.title}
                  </p>
                  {a.description && (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#555",
                        margin: "1px 0 0",
                      }}
                    >
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
      <footer
        style={{
          padding: "8px 32px",
          borderTop: "1px solid #eee",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
          portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 16. CONTEMPORARY — Dot skill ratings right column, clean left
// ─────────────────────────────────────────────────────────
export function ContemporaryTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#0891b2";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        fontSize: "11px",
        color: "#1a1a1a",
        background: "#fff",
        maxWidth: "860px",
        margin: "0 auto",
        padding: "32px 36px",
      }}
    >
      <header
        style={{
          marginBottom: "20px",
          paddingBottom: "14px",
          borderBottom: `3px solid ${accentColor}`,
        }}
      >
        <h1 style={{ fontSize: "26px", fontWeight: "800", margin: "0 0 2px" }}>
          {portfolio.heroTitle}
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: accentColor,
            margin: "0 0 10px",
            fontWeight: "600",
          }}
        >
          {portfolio.heroSubtitle}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            fontSize: "10px",
            color: "#666",
          }}
        >
          {portfolio.phone && <span>📞 {portfolio.phone}</span>}
          {portfolio.email && <span>✉ {portfolio.email}</span>}
          {portfolio.location && <span>📍 {portfolio.location}</span>}
          {linkedinUsername && <span>linkedin/{linkedinUsername}</span>}
          {githubUsername && <span>github/{githubUsername}</span>}
        </div>
      </header>
      {portfolio.aboutText && (
        <section style={{ marginBottom: "18px" }}>
          <h2
            style={{
              fontSize: "10px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: accentColor,
              marginBottom: "8px",
            }}
          >
            Summary
          </h2>
          <p
            style={{
              color: "#555",
              lineHeight: "1.65",
              margin: 0,
              fontSize: "11px",
            }}
          >
            {portfolio.aboutText}
          </p>
        </section>
      )}
      {portfolio.experiences?.length > 0 && (
        <section style={{ marginBottom: "18px" }}>
          <h2
            style={{
              fontSize: "10px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: accentColor,
              marginBottom: "10px",
            }}
          >
            Experience
          </h2>
          {portfolio.experiences.map((exp: any) => (
            <div key={exp.id} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}>
                  {exp.role}
                </p>
                <p
                  style={{
                    fontSize: "10px",
                    color: "#777",
                    margin: "0",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fmt(exp.startDate)} —{" "}
                  {exp.current ? "Present" : fmt(exp.endDate)}
                </p>
              </div>
              <p
                style={{
                  color: accentColor,
                  margin: "1px 0 3px",
                  fontSize: "11px",
                  fontWeight: "600",
                }}
              >
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </p>
              {exp.description && (
                <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                  {exp.description
                    .split("\n")
                    .filter(Boolean)
                    .slice(0, 4)
                    .map((line: string, i: number) => (
                      <li
                        key={i}
                        style={{
                          fontSize: "10px",
                          color: "#555",
                          marginBottom: "2px",
                          lineHeight: "1.4",
                        }}
                      >
                        {line.replace(/^[-•]\s*/, "")}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}
      {portfolio.education?.length > 0 && (
        <section style={{ marginBottom: "18px" }}>
          <h2
            style={{
              fontSize: "10px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: accentColor,
              marginBottom: "10px",
            }}
          >
            Education
          </h2>
          {portfolio.education.map((ed: any) => (
            <div key={ed.id} style={{ marginBottom: "7px" }}>
              <p style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}>
                {ed.degree}
              </p>
              <p
                style={{
                  color: accentColor,
                  margin: "1px 0",
                  fontSize: "11px",
                }}
              >
                {ed.school}
              </p>
              <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                {ed.startYear} – {ed.endYear} · {ed.location}
              </p>
            </div>
          ))}
        </section>
      )}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
      >
        {portfolio.skills?.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: accentColor,
                marginBottom: "10px",
              }}
            >
              Skills
            </h2>
            {portfolio.skills.map((skill: any) => (
              <div
                key={skill.id}
                style={{
                  marginBottom: "7px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "11px", minWidth: "110px" }}>
                  {skill.name}
                </span>
                <div style={{ display: "flex", gap: "3px" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "13px",
                        height: "13px",
                        borderRadius: "50%",
                        background:
                          i <= Math.round(skill.proficiency / 20)
                            ? accentColor
                            : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: "10px", color: "#999" }}>
                  {skill.proficiency >= 80
                    ? "Expert"
                    : skill.proficiency >= 60
                      ? "Advanced"
                      : "Proficient"}
                </span>
              </div>
            ))}
          </div>
        )}
        <div>
          {portfolio.certificates?.length > 0 && (
            <div style={{ marginBottom: "14px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "10px",
                }}
              >
                Certifications
              </h2>
              {portfolio.certificates.map((cert: any) => (
                <p key={cert.id} style={{ margin: "3px 0", fontSize: "10px" }}>
                  • {cert.title} — {cert.issuer}, {fmt(cert.issueDate)}
                </p>
              ))}
            </div>
          )}
          {portfolio.achievements?.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "10px",
                }}
              >
                Achievements
              </h2>
              {portfolio.achievements.map((a: any) => (
                <div key={a.id} style={{ marginBottom: "5px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "11px" }}
                  >
                    – {a.title}
                  </p>
                  {a.description && (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#555",
                        margin: "1px 0 0",
                      }}
                    >
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <footer
        style={{
          marginTop: "20px",
          paddingTop: "8px",
          borderTop: "1px solid #e5e7eb",
          textAlign: "right",
        }}
      >
        <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
          portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 17. FUNCTIONAL — Sidebar with avatar + contact, dot skills
// ─────────────────────────────────────────────────────────
export function FunctionalTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#dc2626";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        minHeight: "100vh",
        fontSize: "11px",
      }}
    >
      {/* Right sidebar */}
      <aside
        style={{
          width: "200px",
          flexShrink: 0,
          background: "#f8fafc",
          borderLeft: `3px solid ${accentColor}`,
          padding: "24px 16px",
          order: 2,
        }}
      >
        {portfolio.user?.avatarUrl && (
          <img
            src={portfolio.user.avatarUrl}
            alt=""
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${accentColor}`,
              display: "block",
              margin: "0 auto 14px",
            }}
          />
        )}
        <div style={{ marginBottom: "14px" }}>
          <p
            style={{
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#94a3b8",
              marginBottom: "6px",
              fontWeight: "700",
            }}
          >
            Contact
          </p>
          {portfolio.phone && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              📞 {portfolio.phone}
            </p>
          )}
          {portfolio.email && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              ✉ {portfolio.email}
            </p>
          )}
          {portfolio.location && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              📍 {portfolio.location}
            </p>
          )}
          {linkedinUsername && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              linkedin/{linkedinUsername}
            </p>
          )}
          {githubUsername && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              github/{githubUsername}
            </p>
          )}
        </div>
        {portfolio.skills?.length > 0 && (
          <div style={{ marginBottom: "14px" }}>
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#94a3b8",
                marginBottom: "6px",
                fontWeight: "700",
              }}
            >
              Skills
            </p>
            {portfolio.skills.map((skill: any) => (
              <div key={skill.id} style={{ marginBottom: "7px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontSize: "10px" }}>{skill.name}</span>
                  <span style={{ fontSize: "9px", color: "#94a3b8" }}>
                    {skill.proficiency >= 80
                      ? "Expert"
                      : skill.proficiency >= 60
                        ? "Advanced"
                        : "Proficient"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background:
                          i <= Math.round(skill.proficiency / 20)
                            ? accentColor
                            : "#e2e8f0",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {portfolio.languages?.length > 0 && (
          <div>
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#94a3b8",
                marginBottom: "6px",
                fontWeight: "700",
              }}
            >
              Languages
            </p>
            {portfolio.languages.map((lang: any) => (
              <div key={lang.id} style={{ marginBottom: "7px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontSize: "10px" }}>{lang.name}</span>
                  <span style={{ fontSize: "9px", color: "#94a3b8" }}>
                    {lang.level}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background:
                          i <=
                          (lang.level === "Native"
                            ? 5
                            : lang.level === "Fluent"
                              ? 4
                              : lang.level === "Advanced"
                                ? 3
                                : 2)
                            ? accentColor
                            : "#e2e8f0",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
      {/* Left main */}
      <div style={{ flex: 1, padding: "24px 24px 24px 28px", order: 1 }}>
        <header style={{ marginBottom: "18px" }}>
          <h1
            style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 2px" }}
          >
            {portfolio.heroTitle}
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: accentColor,
              margin: "0",
              fontWeight: "700",
            }}
          >
            {portfolio.heroSubtitle}
          </p>
        </header>
        {portfolio.aboutText && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `1px solid #e5e7eb`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Summary
            </h2>
            <p
              style={{
                color: "#555",
                lineHeight: "1.6",
                margin: 0,
                fontSize: "11px",
              }}
            >
              {portfolio.aboutText}
            </p>
          </section>
        )}
        {portfolio.experiences?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `1px solid #e5e7eb`,
                paddingBottom: "3px",
                marginBottom: "10px",
              }}
            >
              Experience
            </h2>
            {portfolio.experiences.map((exp: any) => (
              <div key={exp.id} style={{ marginBottom: "12px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}
                  >
                    {exp.role}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#777",
                      margin: "0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmt(exp.startDate)} —{" "}
                    {exp.current ? "Present" : fmt(exp.endDate)}
                  </p>
                </div>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0 3px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.description && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                    {exp.description
                      .split("\n")
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((line: string, i: number) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "10px",
                            color: "#555",
                            marginBottom: "2px",
                            lineHeight: "1.4",
                          }}
                        >
                          {line.replace(/^[-•]\s*/, "")}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}
        {portfolio.education?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `1px solid #e5e7eb`,
                paddingBottom: "3px",
                marginBottom: "10px",
              }}
            >
              Education
            </h2>
            {portfolio.education.map((ed: any) => (
              <div key={ed.id} style={{ marginBottom: "8px" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}>
                  {ed.degree}
                </p>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0",
                    fontSize: "11px",
                  }}
                >
                  {ed.school}
                </p>
                <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                  {ed.startYear} – {ed.endYear} · {ed.location}
                </p>
              </div>
            ))}
          </section>
        )}
        {portfolio.certificates?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `1px solid #e5e7eb`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Certifications
            </h2>
            {portfolio.certificates.map((cert: any) => (
              <p key={cert.id} style={{ margin: "3px 0", fontSize: "10px" }}>
                • {cert.title} — {cert.issuer}, {fmt(cert.issueDate)}
              </p>
            ))}
          </section>
        )}
        {portfolio.achievements?.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `1px solid #e5e7eb`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Achievements
            </h2>
            {portfolio.achievements.map((a: any) => (
              <div key={a.id} style={{ marginBottom: "6px" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "11px" }}>
                  – {a.title}
                </p>
                {a.description && (
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#555",
                      margin: "2px 0 0",
                    }}
                  >
                    {a.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
        <footer
          style={{
            marginTop: "20px",
            paddingTop: "8px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
            portfoliocraft.com/{username}
          </p>
        </footer>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 18. ENTERPRISE — Blue left sidebar, white right, corporate
// ─────────────────────────────────────────────────────────
export function EnterpriseTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#1e40af";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        minHeight: "100vh",
        fontSize: "11px",
      }}
    >
      <aside
        style={{
          width: "210px",
          flexShrink: 0,
          background: accentColor,
          color: "#fff",
          padding: "28px 18px",
        }}
      >
        {portfolio.user?.avatarUrl && (
          <img
            src={portfolio.user.avatarUrl}
            alt=""
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(255,255,255,0.4)",
              display: "block",
              margin: "0 auto 12px",
            }}
          />
        )}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <h1
            style={{ fontSize: "15px", fontWeight: "800", margin: "0 0 3px" }}
          >
            {portfolio.heroTitle}
          </h1>
          <p style={{ fontSize: "10px", opacity: 0.8, margin: 0 }}>
            {portfolio.heroSubtitle}
          </p>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.3)",
            paddingTop: "14px",
            marginBottom: "14px",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              opacity: 0.7,
              marginBottom: "6px",
              fontWeight: "700",
            }}
          >
            Contact
          </p>
          {portfolio.phone && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              📞 {portfolio.phone}
            </p>
          )}
          {portfolio.email && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              ✉ {portfolio.email}
            </p>
          )}
          {portfolio.location && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              📍 {portfolio.location}
            </p>
          )}
          {linkedinUsername && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              linkedin/{linkedinUsername}
            </p>
          )}
        </div>
        {portfolio.skills?.length > 0 && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.3)",
              paddingTop: "14px",
              marginBottom: "14px",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                opacity: 0.7,
                marginBottom: "6px",
                fontWeight: "700",
              }}
            >
              Skills
            </p>
            {portfolio.skills.map((skill: any) => (
              <div key={skill.id} style={{ marginBottom: "5px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontSize: "10px" }}>{skill.name}</span>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "2px",
                    height: "3px",
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      width: `${skill.proficiency}%`,
                      height: "3px",
                      borderRadius: "2px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {portfolio.achievements?.length > 0 && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.3)",
              paddingTop: "14px",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                opacity: 0.7,
                marginBottom: "6px",
                fontWeight: "700",
              }}
            >
              Achievements
            </p>
            {portfolio.achievements.map((a: any) => (
              <div key={a.id} style={{ marginBottom: "6px" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "10px" }}>
                  – {a.title}
                </p>
                {a.description && (
                  <p
                    style={{ fontSize: "9px", opacity: 0.8, margin: "2px 0 0" }}
                  >
                    {a.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </aside>
      <div
        style={{
          flex: 1,
          padding: "28px 24px",
          background: "#fff",
          color: "#1a1a1a",
        }}
      >
        {portfolio.aboutText && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Summary
            </h2>
            <p
              style={{
                color: "#555",
                lineHeight: "1.6",
                margin: 0,
                fontSize: "11px",
              }}
            >
              {portfolio.aboutText}
            </p>
          </section>
        )}
        {portfolio.experiences?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "10px",
              }}
            >
              Experience
            </h2>
            {portfolio.experiences.map((exp: any) => (
              <div key={exp.id} style={{ marginBottom: "12px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}
                  >
                    {exp.role}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#777",
                      margin: "0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmt(exp.startDate)} —{" "}
                    {exp.current ? "Present" : fmt(exp.endDate)}
                  </p>
                </div>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0 3px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.description && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                    {exp.description
                      .split("\n")
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((line: string, i: number) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "10px",
                            color: "#555",
                            marginBottom: "2px",
                            lineHeight: "1.4",
                          }}
                        >
                          {line.replace(/^[-•]\s*/, "")}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}
        {portfolio.education?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "10px",
              }}
            >
              Education
            </h2>
            {portfolio.education.map((ed: any) => (
              <div key={ed.id} style={{ marginBottom: "8px" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}>
                  {ed.degree}
                </p>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0",
                    fontSize: "11px",
                  }}
                >
                  {ed.school}
                </p>
                <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                  {ed.startYear} – {ed.endYear} · {ed.location}
                </p>
              </div>
            ))}
          </section>
        )}
        {portfolio.certificates?.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accentColor,
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Certifications
            </h2>
            {portfolio.certificates.map((cert: any) => (
              <p key={cert.id} style={{ margin: "3px 0", fontSize: "10px" }}>
                • {cert.title} — {cert.issuer}, {fmt(cert.issueDate)}
              </p>
            ))}
          </section>
        )}
        <footer
          style={{
            marginTop: "20px",
            paddingTop: "8px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
            portfoliocraft.com/{username}
          </p>
        </footer>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 19. ENGAGE — Teal/green left sidebar with bar skills, white right
// ─────────────────────────────────────────────────────────
export function EngageTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#059669";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        fontSize: "11px",
        color: "#1a1a1a",
        background: "#fff",
        maxWidth: "860px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          background: accentColor,
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {portfolio.user?.avatarUrl && (
          <img
            src={portfolio.user.avatarUrl}
            alt=""
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(255,255,255,0.4)",
              flexShrink: 0,
            }}
          />
        )}
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "900",
              margin: "0 0 2px",
              color: "#fff",
            }}
          >
            {portfolio.heroTitle}
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.85)",
              margin: "0 0 10px",
            }}
          >
            {portfolio.heroSubtitle}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "10px",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {portfolio.phone && <span>📞 {portfolio.phone}</span>}
            {portfolio.email && <span>✉ {portfolio.email}</span>}
            {portfolio.location && <span>📍 {portfolio.location}</span>}
            {linkedinUsername && <span>linkedin/{linkedinUsername}</span>}
          </div>
        </div>
      </header>
      <div style={{ padding: "24px 32px" }}>
        {portfolio.aboutText && (
          <section
            style={{
              marginBottom: "18px",
              background: "#f0fdf4",
              padding: "14px 16px",
              borderRadius: "6px",
              borderLeft: `4px solid ${accentColor}`,
            }}
          >
            <p
              style={{
                color: "#555",
                lineHeight: "1.65",
                margin: 0,
                fontSize: "11px",
              }}
            >
              {portfolio.aboutText}
            </p>
          </section>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "28px",
          }}
        >
          <div>
            {portfolio.experiences?.length > 0 && (
              <section style={{ marginBottom: "18px" }}>
                <h2
                  style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: accentColor,
                    marginBottom: "10px",
                  }}
                >
                  Experience
                </h2>
                {portfolio.experiences.map((exp: any) => (
                  <div key={exp.id} style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: "700",
                          margin: "0",
                          fontSize: "12px",
                        }}
                      >
                        {exp.role}
                      </p>
                      <p
                        style={{
                          fontSize: "10px",
                          color: "#777",
                          margin: "0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fmt(exp.startDate)} —{" "}
                        {exp.current ? "Present" : fmt(exp.endDate)}
                      </p>
                    </div>
                    <p
                      style={{
                        color: accentColor,
                        margin: "1px 0 3px",
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      {exp.company}
                      {exp.location ? ` · ${exp.location}` : ""}
                    </p>
                    {exp.description && (
                      <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                        {exp.description
                          .split("\n")
                          .filter(Boolean)
                          .slice(0, 4)
                          .map((line: string, i: number) => (
                            <li
                              key={i}
                              style={{
                                fontSize: "10px",
                                color: "#555",
                                marginBottom: "2px",
                                lineHeight: "1.4",
                              }}
                            >
                              {line.replace(/^[-•]\s*/, "")}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            )}
            {portfolio.education?.length > 0 && (
              <section>
                <h2
                  style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: accentColor,
                    marginBottom: "10px",
                  }}
                >
                  Education
                </h2>
                {portfolio.education.map((ed: any) => (
                  <div key={ed.id} style={{ marginBottom: "7px" }}>
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "12px",
                      }}
                    >
                      {ed.degree}
                    </p>
                    <p
                      style={{
                        color: accentColor,
                        margin: "1px 0",
                        fontSize: "11px",
                      }}
                    >
                      {ed.school}
                    </p>
                    <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                      {ed.startYear} – {ed.endYear} · {ed.location}
                    </p>
                  </div>
                ))}
              </section>
            )}
          </div>
          <div>
            {portfolio.skills?.length > 0 && (
              <section style={{ marginBottom: "18px" }}>
                <h2
                  style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: accentColor,
                    marginBottom: "10px",
                  }}
                >
                  Skills
                </h2>
                {portfolio.skills.map((skill: any) => (
                  <div key={skill.id} style={{ marginBottom: "7px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "2px",
                      }}
                    >
                      <span style={{ fontSize: "11px" }}>{skill.name}</span>
                      <span style={{ fontSize: "10px", color: "#777" }}>
                        {skill.proficiency >= 80
                          ? "Expert"
                          : skill.proficiency >= 60
                            ? "Advanced"
                            : "Proficient"}
                      </span>
                    </div>
                    <div
                      style={{
                        background: "#e5e7eb",
                        borderRadius: "2px",
                        height: "4px",
                      }}
                    >
                      <div
                        style={{
                          background: accentColor,
                          width: `${skill.proficiency}%`,
                          height: "4px",
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </section>
            )}
            {portfolio.languages?.length > 0 && (
              <section style={{ marginBottom: "18px" }}>
                <h2
                  style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: accentColor,
                    marginBottom: "10px",
                  }}
                >
                  Languages
                </h2>
                {portfolio.languages.map((lang: any) => (
                  <div key={lang.id} style={{ marginBottom: "7px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "2px",
                      }}
                    >
                      <span style={{ fontSize: "11px" }}>{lang.name}</span>
                      <span style={{ fontSize: "10px", color: "#777" }}>
                        {lang.level}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "3px" }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          style={{
                            width: "13px",
                            height: "13px",
                            borderRadius: "50%",
                            background:
                              i <=
                              (lang.level === "Native"
                                ? 5
                                : lang.level === "Fluent"
                                  ? 4
                                  : lang.level === "Advanced"
                                    ? 3
                                    : 2)
                                ? accentColor
                                : "#e5e7eb",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}
            {portfolio.achievements?.length > 0 && (
              <section style={{ marginBottom: "18px" }}>
                <h2
                  style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: accentColor,
                    marginBottom: "10px",
                  }}
                >
                  Achievements
                </h2>
                {portfolio.achievements.map((a: any) => (
                  <div key={a.id} style={{ marginBottom: "5px" }}>
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "11px",
                      }}
                    >
                      – {a.title}
                    </p>
                    {a.description && (
                      <p
                        style={{
                          fontSize: "10px",
                          color: "#555",
                          margin: "1px 0 0",
                        }}
                      >
                        {a.description}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            )}
            {portfolio.certificates?.length > 0 && (
              <section>
                <h2
                  style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: accentColor,
                    marginBottom: "10px",
                  }}
                >
                  Certifications
                </h2>
                {portfolio.certificates.map((cert: any) => (
                  <p
                    key={cert.id}
                    style={{ margin: "3px 0", fontSize: "10px" }}
                  >
                    • {cert.title}
                  </p>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
      <footer
        style={{
          padding: "8px 32px",
          borderTop: "1px solid #eee",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
          portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 20. PROFESSIONAL — Two columns, dot skill bars, neutral
// ─────────────────────────────────────────────────────────
export function ProfessionalTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#374151";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        fontSize: "11px",
        color: "#1a1a1a",
        background: "#fff",
        maxWidth: "860px",
        margin: "0 auto",
        padding: "32px 36px",
      }}
    >
      <header
        style={{
          marginBottom: "20px",
          paddingBottom: "14px",
          borderBottom: "2px solid #111",
        }}
      >
        <h1 style={{ fontSize: "26px", fontWeight: "800", margin: "0 0 2px" }}>
          {portfolio.heroTitle}
        </h1>
        <p style={{ fontSize: "13px", color: accentColor, margin: "0 0 10px" }}>
          {portfolio.heroSubtitle}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            fontSize: "10px",
            color: "#666",
          }}
        >
          {portfolio.phone && <span>📞 {portfolio.phone}</span>}
          {portfolio.email && <span>✉ {portfolio.email}</span>}
          {portfolio.location && <span>📍 {portfolio.location}</span>}
          {linkedinUsername && <span>linkedin/{linkedinUsername}</span>}
          {githubUsername && <span>github/{githubUsername}</span>}
        </div>
      </header>
      {portfolio.aboutText && (
        <section style={{ marginBottom: "18px" }}>
          <p
            style={{
              color: "#555",
              lineHeight: "1.65",
              margin: 0,
              fontSize: "11px",
            }}
          >
            {portfolio.aboutText}
          </p>
        </section>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "28px",
        }}
      >
        <div>
          {portfolio.experiences?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Experience
              </h2>
              {portfolio.experiences.map((exp: any) => (
                <div key={exp.id} style={{ marginBottom: "12px" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "12px",
                      }}
                    >
                      {exp.role}
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#777",
                        margin: "0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmt(exp.startDate)} —{" "}
                      {exp.current ? "Present" : fmt(exp.endDate)}
                    </p>
                  </div>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0 3px",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.description && (
                    <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                      {exp.description
                        .split("\n")
                        .filter(Boolean)
                        .slice(0, 4)
                        .map((line: string, i: number) => (
                          <li
                            key={i}
                            style={{
                              fontSize: "10px",
                              color: "#555",
                              marginBottom: "2px",
                              lineHeight: "1.4",
                            }}
                          >
                            {line.replace(/^[-•]\s*/, "")}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
          {portfolio.education?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Education
              </h2>
              {portfolio.education.map((ed: any) => (
                <div key={ed.id} style={{ marginBottom: "7px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}
                  >
                    {ed.degree}
                  </p>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0",
                      fontSize: "11px",
                    }}
                  >
                    {ed.school}
                  </p>
                  <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                    {ed.startYear} – {ed.endYear} · {ed.location}
                  </p>
                </div>
              ))}
            </section>
          )}
          {portfolio.achievements?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Achievements
              </h2>
              {portfolio.achievements.map((a: any) => (
                <div key={a.id} style={{ marginBottom: "6px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "11px" }}
                  >
                    – {a.title}
                  </p>
                  {a.description && (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#555",
                        margin: "2px 0 0",
                      }}
                    >
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
        <div>
          {portfolio.skills?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Skills
              </h2>
              {portfolio.skills.map((skill: any) => (
                <div
                  key={skill.id}
                  style={{
                    marginBottom: "7px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "11px", minWidth: "100px" }}>
                    {skill.name}
                  </span>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background:
                            i <= Math.round(skill.proficiency / 20)
                              ? accentColor
                              : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "10px", color: "#999" }}>
                    {skill.proficiency >= 80
                      ? "Expert"
                      : skill.proficiency >= 60
                        ? "Advanced"
                        : "Proficient"}
                  </span>
                </div>
              ))}
            </section>
          )}
          {portfolio.languages?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Languages
              </h2>
              {portfolio.languages.map((lang: any) => (
                <div
                  key={lang.id}
                  style={{
                    marginBottom: "7px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "11px", minWidth: "80px" }}>
                    {lang.name}
                  </span>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background:
                            i <=
                            (lang.level === "Native"
                              ? 5
                              : lang.level === "Fluent"
                                ? 4
                                : lang.level === "Advanced"
                                  ? 3
                                  : 2)
                              ? accentColor
                              : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "10px", color: "#999" }}>
                    {lang.level}
                  </span>
                </div>
              ))}
            </section>
          )}
          {portfolio.certificates?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Certifications
              </h2>
              {portfolio.certificates.map((cert: any) => (
                <p key={cert.id} style={{ margin: "3px 0", fontSize: "10px" }}>
                  • {cert.title} — {cert.issuer}
                </p>
              ))}
            </section>
          )}
        </div>
      </div>
      <footer
        style={{
          marginTop: "20px",
          paddingTop: "8px",
          borderTop: "1px solid #e5e7eb",
          textAlign: "right",
        }}
      >
        <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
          portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 21. STREAMLINE — Crimson right sidebar, white left
// ─────────────────────────────────────────────────────────
export function StreamlineTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#9b1c31";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        minHeight: "100vh",
        fontSize: "11px",
      }}
    >
      {/* Left main */}
      <div
        style={{
          flex: 1,
          padding: "24px 24px 24px 28px",
          background: "#fff",
          color: "#1a1a1a",
        }}
      >
        <header style={{ marginBottom: "18px" }}>
          <h1
            style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 2px" }}
          >
            {portfolio.heroTitle}
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: accentColor,
              margin: "0",
              fontWeight: "700",
            }}
          >
            {portfolio.heroSubtitle}
          </p>
        </header>
        {portfolio.aboutText && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Summary
            </h2>
            <p
              style={{
                color: "#555",
                lineHeight: "1.6",
                margin: 0,
                fontSize: "11px",
              }}
            >
              {portfolio.aboutText}
            </p>
          </section>
        )}
        {portfolio.experiences?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "10px",
              }}
            >
              Experience
            </h2>
            {portfolio.experiences.map((exp: any) => (
              <div key={exp.id} style={{ marginBottom: "12px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}
                  >
                    {exp.role}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#777",
                      margin: "0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmt(exp.startDate)} —{" "}
                    {exp.current ? "Present" : fmt(exp.endDate)}
                  </p>
                </div>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0 3px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.description && (
                  <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                    {exp.description
                      .split("\n")
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((line: string, i: number) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "10px",
                            color: "#555",
                            marginBottom: "2px",
                            lineHeight: "1.4",
                          }}
                        >
                          {line.replace(/^[-•]\s*/, "")}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}
        {portfolio.education?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "10px",
              }}
            >
              Education
            </h2>
            {portfolio.education.map((ed: any) => (
              <div key={ed.id} style={{ marginBottom: "8px" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}>
                  {ed.degree}
                </p>
                <p
                  style={{
                    color: accentColor,
                    margin: "1px 0",
                    fontSize: "11px",
                  }}
                >
                  {ed.school}
                </p>
                <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                  {ed.startYear} – {ed.endYear} · {ed.location}
                </p>
              </div>
            ))}
          </section>
        )}
        {portfolio.certificates?.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Certifications
            </h2>
            {portfolio.certificates.map((cert: any) => (
              <p key={cert.id} style={{ margin: "3px 0", fontSize: "10px" }}>
                • {cert.title} — {cert.issuer}, {fmt(cert.issueDate)}
              </p>
            ))}
          </section>
        )}
        {portfolio.achievements?.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: `2px solid ${accentColor}`,
                paddingBottom: "3px",
                marginBottom: "8px",
              }}
            >
              Achievements
            </h2>
            {portfolio.achievements.map((a: any) => (
              <div key={a.id} style={{ marginBottom: "6px" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "11px" }}>
                  – {a.title}
                </p>
                {a.description && (
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#555",
                      margin: "2px 0 0",
                    }}
                  >
                    {a.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
        <footer
          style={{
            marginTop: "20px",
            paddingTop: "8px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
            portfoliocraft.com/{username}
          </p>
        </footer>
      </div>
      {/* Right crimson sidebar */}
      <aside
        style={{
          width: "210px",
          flexShrink: 0,
          background: accentColor,
          color: "#fff",
          padding: "28px 18px",
        }}
      >
        {portfolio.user?.avatarUrl && (
          <img
            src={portfolio.user.avatarUrl}
            alt=""
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(255,255,255,0.4)",
              display: "block",
              margin: "0 auto 14px",
            }}
          />
        )}
        <div style={{ marginBottom: "14px" }}>
          <p
            style={{
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              opacity: 0.7,
              marginBottom: "6px",
              fontWeight: "700",
            }}
          >
            Contact
          </p>
          {portfolio.phone && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              📞 {portfolio.phone}
            </p>
          )}
          {portfolio.email && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              ✉ {portfolio.email}
            </p>
          )}
          {portfolio.location && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              📍 {portfolio.location}
            </p>
          )}
          {linkedinUsername && (
            <p style={{ margin: "3px 0", fontSize: "10px" }}>
              linkedin/{linkedinUsername}
            </p>
          )}
        </div>
        {portfolio.skills?.length > 0 && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.3)",
              paddingTop: "14px",
              marginBottom: "14px",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                opacity: 0.7,
                marginBottom: "6px",
                fontWeight: "700",
              }}
            >
              Skills
            </p>
            {portfolio.skills.map((skill: any) => (
              <div key={skill.id} style={{ marginBottom: "7px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontSize: "10px" }}>{skill.name}</span>
                  <span style={{ fontSize: "9px", opacity: 0.75 }}>
                    {skill.proficiency >= 80
                      ? "Expert"
                      : skill.proficiency >= 60
                        ? "Advanced"
                        : "Proficient"}
                  </span>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "2px",
                    height: "3px",
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      width: `${skill.proficiency}%`,
                      height: "3px",
                      borderRadius: "2px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {portfolio.languages?.length > 0 && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.3)",
              paddingTop: "14px",
              marginBottom: "14px",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                opacity: 0.7,
                marginBottom: "6px",
                fontWeight: "700",
              }}
            >
              Languages
            </p>
            {portfolio.languages.map((lang: any) => (
              <div key={lang.id} style={{ marginBottom: "7px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontSize: "10px" }}>{lang.name}</span>
                  <span style={{ fontSize: "9px", opacity: 0.75 }}>
                    {lang.level}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "11px",
                        height: "11px",
                        borderRadius: "50%",
                        background:
                          i <=
                          (lang.level === "Native"
                            ? 5
                            : lang.level === "Fluent"
                              ? 4
                              : lang.level === "Advanced"
                                ? 3
                                : 2)
                            ? "#fff"
                            : "rgba(255,255,255,0.2)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {portfolio.achievements?.length > 0 && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.3)",
              paddingTop: "14px",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                opacity: 0.7,
                marginBottom: "6px",
                fontWeight: "700",
              }}
            >
              Achievements
            </p>
            {portfolio.achievements.slice(0, 3).map((a: any) => (
              <div key={a.id} style={{ marginBottom: "6px" }}>
                <p style={{ fontWeight: "700", margin: "0", fontSize: "10px" }}>
                  – {a.title}
                </p>
                {a.description && (
                  <p
                    style={{ fontSize: "9px", opacity: 0.8, margin: "2px 0 0" }}
                  >
                    {a.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </aside>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 22. CONFIDENT — Full dark background resume
// ─────────────────────────────────────────────────────────
export function ConfidentTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#f59e0b";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        background: "#0f172a",
        color: "#f1f5f9",
        minHeight: "100vh",
        fontSize: "11px",
        padding: "32px 36px",
      }}
    >
      <header
        style={{
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: `2px solid ${accentColor}`,
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "900",
            margin: "0 0 3px",
            color: "#fff",
          }}
        >
          {portfolio.heroTitle}
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: accentColor,
            margin: "0 0 12px",
            fontWeight: "700",
          }}
        >
          {portfolio.heroSubtitle}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            fontSize: "10px",
            color: "#94a3b8",
          }}
        >
          {portfolio.phone && <span>📞 {portfolio.phone}</span>}
          {portfolio.email && <span>✉ {portfolio.email}</span>}
          {portfolio.location && <span>📍 {portfolio.location}</span>}
          {linkedinUsername && <span>linkedin/{linkedinUsername}</span>}
          {githubUsername && <span>github/{githubUsername}</span>}
        </div>
      </header>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "32px",
        }}
      >
        <div>
          {portfolio.experiences?.length > 0 && (
            <section style={{ marginBottom: "22px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accentColor,
                  marginBottom: "12px",
                }}
              >
                Experience
              </h2>
              {portfolio.experiences.map((exp: any) => (
                <div
                  key={exp.id}
                  style={{
                    marginBottom: "14px",
                    paddingLeft: "10px",
                    borderLeft: `2px solid ${accentColor}`,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "12px",
                        color: "#f1f5f9",
                      }}
                    >
                      {exp.role}
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#64748b",
                        margin: "0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmt(exp.startDate)} —{" "}
                      {exp.current ? "Present" : fmt(exp.endDate)}
                    </p>
                  </div>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0 4px",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.description && (
                    <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                      {exp.description
                        .split("\n")
                        .filter(Boolean)
                        .slice(0, 4)
                        .map((line: string, i: number) => (
                          <li
                            key={i}
                            style={{
                              fontSize: "10px",
                              color: "#94a3b8",
                              marginBottom: "2px",
                              lineHeight: "1.4",
                            }}
                          >
                            {line.replace(/^[-•]\s*/, "")}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
          {portfolio.education?.length > 0 && (
            <section style={{ marginBottom: "22px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accentColor,
                  marginBottom: "12px",
                }}
              >
                Education
              </h2>
              {portfolio.education.map((ed: any) => (
                <div key={ed.id} style={{ marginBottom: "8px" }}>
                  <p
                    style={{
                      fontWeight: "700",
                      margin: "0",
                      fontSize: "12px",
                      color: "#f1f5f9",
                    }}
                  >
                    {ed.degree}
                  </p>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0",
                      fontSize: "11px",
                    }}
                  >
                    {ed.school}
                  </p>
                  <p
                    style={{ fontSize: "10px", color: "#64748b", margin: "0" }}
                  >
                    {ed.startYear} – {ed.endYear} · {ed.location}
                  </p>
                </div>
              ))}
            </section>
          )}
          {portfolio.certificates?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accentColor,
                  marginBottom: "12px",
                }}
              >
                Certifications
              </h2>
              {portfolio.certificates.map((cert: any) => (
                <p
                  key={cert.id}
                  style={{
                    margin: "3px 0",
                    fontSize: "10px",
                    color: "#94a3b8",
                  }}
                >
                  • {cert.title} — {cert.issuer}, {fmt(cert.issueDate)}
                </p>
              ))}
            </section>
          )}
        </div>
        <div>
          {portfolio.aboutText && (
            <section
              style={{
                marginBottom: "18px",
                background: "#1e293b",
                borderRadius: "8px",
                padding: "14px",
                borderLeft: `3px solid ${accentColor}`,
              }}
            >
              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: "1.65",
                  margin: 0,
                  fontSize: "11px",
                }}
              >
                {portfolio.aboutText}
              </p>
            </section>
          )}
          {portfolio.skills?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accentColor,
                  marginBottom: "12px",
                }}
              >
                Skills
              </h2>
              {portfolio.skills.map((skill: any) => (
                <div key={skill.id} style={{ marginBottom: "7px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#e2e8f0" }}>
                      {skill.name}
                    </span>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>
                      {skill.proficiency >= 80
                        ? "Expert"
                        : skill.proficiency >= 60
                          ? "Advanced"
                          : "Proficient"}
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#1e293b",
                      borderRadius: "2px",
                      height: "4px",
                    }}
                  >
                    <div
                      style={{
                        background: accentColor,
                        width: `${skill.proficiency}%`,
                        height: "4px",
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </section>
          )}
          {portfolio.languages?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accentColor,
                  marginBottom: "12px",
                }}
              >
                Languages
              </h2>
              {portfolio.languages.map((lang: any) => (
                <div key={lang.id} style={{ marginBottom: "7px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#e2e8f0" }}>
                      {lang.name}
                    </span>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>
                      {lang.level}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: "13px",
                          height: "13px",
                          borderRadius: "50%",
                          background:
                            i <=
                            (lang.level === "Native"
                              ? 5
                              : lang.level === "Fluent"
                                ? 4
                                : lang.level === "Advanced"
                                  ? 3
                                  : 2)
                              ? accentColor
                              : "#1e293b",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
          {portfolio.achievements?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accentColor,
                  marginBottom: "12px",
                }}
              >
                Achievements
              </h2>
              {portfolio.achievements.map((a: any) => (
                <div key={a.id} style={{ marginBottom: "6px" }}>
                  <p
                    style={{
                      fontWeight: "700",
                      margin: "0",
                      fontSize: "11px",
                      color: "#f1f5f9",
                    }}
                  >
                    – {a.title}
                  </p>
                  {a.description && (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#94a3b8",
                        margin: "2px 0 0",
                      }}
                    >
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
      <footer
        style={{
          marginTop: "24px",
          paddingTop: "10px",
          borderTop: `1px solid #1e293b`,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "9px", color: "#334155", margin: 0 }}>
          portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// 23. PRESTIGE — White, two panel, dot skills right sidebar
// ─────────────────────────────────────────────────────────
export function PrestigeTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  const accentColor = accent || "#2563eb";
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        fontSize: "11px",
        color: "#1a1a1a",
        background: "#fff",
        maxWidth: "880px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          padding: "28px 32px",
          borderBottom: "2px solid #111",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <h1
            style={{ fontSize: "26px", fontWeight: "800", margin: "0 0 2px" }}
          >
            {portfolio.heroTitle}
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: accentColor,
              margin: "0 0 10px",
              fontWeight: "700",
            }}
          >
            {portfolio.heroSubtitle}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
              fontSize: "10px",
              color: "#666",
            }}
          >
            {portfolio.phone && <span>📞 {portfolio.phone}</span>}
            {portfolio.email && <span>✉ {portfolio.email}</span>}
            {portfolio.location && <span>📍 {portfolio.location}</span>}
            {githubUsername && <span>github/{githubUsername}</span>}
          </div>
        </div>
        {portfolio.user?.avatarUrl && (
          <img
            src={portfolio.user.avatarUrl}
            alt=""
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${accentColor}`,
            }}
          />
        )}
      </header>
      <div
        style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "0" }}
      >
        {/* Left main */}
        <div style={{ padding: "24px 28px", borderRight: "1px solid #e5e7eb" }}>
          {portfolio.aboutText && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "8px",
                }}
              >
                Summary
              </h2>
              <p
                style={{
                  color: "#555",
                  lineHeight: "1.65",
                  margin: 0,
                  fontSize: "11px",
                }}
              >
                {portfolio.aboutText}
              </p>
            </section>
          )}
          {portfolio.experiences?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "10px",
                }}
              >
                Experience
              </h2>
              {portfolio.experiences.map((exp: any) => (
                <div key={exp.id} style={{ marginBottom: "12px" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "12px",
                      }}
                    >
                      {exp.role}
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#777",
                        margin: "0",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmt(exp.startDate)} —{" "}
                      {exp.current ? "Present" : fmt(exp.endDate)}
                    </p>
                  </div>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0 3px",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.description && (
                    <ul style={{ margin: "4px 0 0", paddingLeft: "14px" }}>
                      {exp.description
                        .split("\n")
                        .filter(Boolean)
                        .slice(0, 4)
                        .map((line: string, i: number) => (
                          <li
                            key={i}
                            style={{
                              fontSize: "10px",
                              color: "#555",
                              marginBottom: "2px",
                              lineHeight: "1.4",
                            }}
                          >
                            {line.replace(/^[-•]\s*/, "")}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
          {portfolio.education?.length > 0 && (
            <section style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "10px",
                }}
              >
                Education
              </h2>
              {portfolio.education.map((ed: any) => (
                <div key={ed.id} style={{ marginBottom: "7px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "12px" }}
                  >
                    {ed.degree}
                  </p>
                  <p
                    style={{
                      color: accentColor,
                      margin: "1px 0",
                      fontSize: "11px",
                    }}
                  >
                    {ed.school}
                  </p>
                  <p style={{ fontSize: "10px", color: "#777", margin: "0" }}>
                    {ed.startYear} – {ed.endYear} · {ed.location}
                  </p>
                </div>
              ))}
            </section>
          )}
          {portfolio.achievements?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: accentColor,
                  marginBottom: "10px",
                }}
              >
                Achievements
              </h2>
              {portfolio.achievements.map((a: any) => (
                <div key={a.id} style={{ marginBottom: "6px" }}>
                  <p
                    style={{ fontWeight: "700", margin: "0", fontSize: "11px" }}
                  >
                    – {a.title}
                  </p>
                  {a.description && (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#555",
                        margin: "2px 0 0",
                      }}
                    >
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
        {/* Right sidebar */}
        <div style={{ padding: "24px 24px" }}>
          <div style={{ marginBottom: "18px" }}>
            <p
              style={{
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#94a3b8",
                marginBottom: "8px",
                fontWeight: "700",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "4px",
              }}
            >
              Contact Info
            </p>
            {portfolio.phone && (
              <p style={{ margin: "3px 0", fontSize: "10px", color: "#555" }}>
                📞 {portfolio.phone}
              </p>
            )}
            {portfolio.email && (
              <p style={{ margin: "3px 0", fontSize: "10px", color: "#555" }}>
                ✉ {portfolio.email}
              </p>
            )}
            {portfolio.location && (
              <p style={{ margin: "3px 0", fontSize: "10px", color: "#555" }}>
                📍 {portfolio.location}
              </p>
            )}
            {linkedinUsername && (
              <p style={{ margin: "3px 0", fontSize: "10px", color: "#555" }}>
                linkedin/{linkedinUsername}
              </p>
            )}
            {githubUsername && (
              <p style={{ margin: "3px 0", fontSize: "10px", color: "#555" }}>
                github/{githubUsername}
              </p>
            )}
          </div>
          {portfolio.skills?.length > 0 && (
            <div style={{ marginBottom: "18px" }}>
              <p
                style={{
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#94a3b8",
                  marginBottom: "8px",
                  fontWeight: "700",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "4px",
                }}
              >
                Skills
              </p>
              {portfolio.skills.map((skill: any) => (
                <div
                  key={skill.id}
                  style={{
                    marginBottom: "7px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "11px" }}>{skill.name}</span>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background:
                            i <= Math.round(skill.proficiency / 20)
                              ? accentColor
                              : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      minWidth: "55px",
                      textAlign: "right",
                    }}
                  >
                    {skill.proficiency >= 80
                      ? "Expert"
                      : skill.proficiency >= 60
                        ? "Advanced"
                        : "Proficient"}
                  </span>
                </div>
              ))}
            </div>
          )}
          {portfolio.languages?.length > 0 && (
            <div style={{ marginBottom: "18px" }}>
              <p
                style={{
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#94a3b8",
                  marginBottom: "8px",
                  fontWeight: "700",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "4px",
                }}
              >
                Languages
              </p>
              {portfolio.languages.map((lang: any) => (
                <div
                  key={lang.id}
                  style={{
                    marginBottom: "7px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "11px" }}>{lang.name}</span>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background:
                            i <=
                            (lang.level === "Native"
                              ? 5
                              : lang.level === "Fluent"
                                ? 4
                                : lang.level === "Advanced"
                                  ? 3
                                  : 2)
                              ? accentColor
                              : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      minWidth: "45px",
                      textAlign: "right",
                    }}
                  >
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          )}
          {portfolio.certificates?.length > 0 && (
            <div>
              <p
                style={{
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#94a3b8",
                  marginBottom: "8px",
                  fontWeight: "700",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "4px",
                }}
              >
                Certifications
              </p>
              {portfolio.certificates.map((cert: any) => (
                <p
                  key={cert.id}
                  style={{ margin: "3px 0", fontSize: "10px", color: "#555" }}
                >
                  • {cert.title} — {cert.issuer}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      <footer
        style={{
          padding: "8px 32px",
          borderTop: "1px solid #e5e7eb",
          textAlign: "right",
        }}
      >
        <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
          portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}
function ModernTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  return (
    <main
      style={{
        fontFamily: "Inter, sans-serif",
        display: "flex",
        minHeight: "100vh",
        color: "#1a1a1a",
        fontSize: "12px",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          background: accent,
          color: "#fff",
          padding: "32px 20px",
          flexShrink: 0,
        }}
      >
        {portfolio.user?.avatarUrl && (
          <img
            src={portfolio.user.avatarUrl}
            alt=""
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              margin: "0 auto 16px",
              display: "block",
              border: "3px solid rgba(255,255,255,0.3)",
            }}
          />
        )}
        <h1
          style={{
            fontSize: "18px",
            fontWeight: "800",
            margin: "0 0 4px",
            textAlign: "center",
          }}
        >
          {portfolio.heroTitle}
        </h1>
        <p
          style={{
            fontSize: "12px",
            opacity: 0.85,
            textAlign: "center",
            margin: "0 0 24px",
          }}
        >
          {portfolio.heroSubtitle}
        </p>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.3)",
            paddingTop: "16px",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              opacity: 0.7,
              marginBottom: "8px",
              fontWeight: "700",
            }}
          >
            Contact
          </p>
          {portfolio.email && (
            <p style={{ margin: "4px 0", fontSize: "11px" }}>
              ✉ {portfolio.email}
            </p>
          )}
          {portfolio.phone && (
            <p style={{ margin: "4px 0", fontSize: "11px" }}>
              📞 {portfolio.phone}
            </p>
          )}
          {portfolio.location && (
            <p style={{ margin: "4px 0", fontSize: "11px" }}>
              📍 {portfolio.location}
            </p>
          )}
        </div>
        {(githubUsername || linkedinUsername || portfolio.website) && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.3)",
              paddingTop: "16px",
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                opacity: 0.7,
                marginBottom: "8px",
                fontWeight: "700",
              }}
            >
              Links
            </p>
            {githubUsername && (
              <p style={{ margin: "4px 0", fontSize: "11px", opacity: 0.9 }}>
                GitHub: {githubUsername}
              </p>
            )}
            {linkedinUsername && (
              <p style={{ margin: "4px 0", fontSize: "11px", opacity: 0.9 }}>
                LinkedIn: {linkedinUsername}
              </p>
            )}
            {portfolio.website && (
              <p style={{ margin: "4px 0", fontSize: "11px", opacity: 0.9 }}>
                {portfolio.website}
              </p>
            )}
          </div>
        )}
        {portfolio.skills?.length > 0 && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.3)",
              paddingTop: "16px",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                opacity: 0.7,
                marginBottom: "8px",
                fontWeight: "700",
              }}
            >
              Skills
            </p>
            {portfolio.skills.map((skill: any) => (
              <div key={skill.id} style={{ marginBottom: "6px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontSize: "11px" }}>{skill.name}</span>
                  <span style={{ fontSize: "10px", opacity: 0.7 }}>
                    {skill.proficiency}%
                  </span>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "2px",
                    height: "3px",
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      width: `${skill.proficiency}%`,
                      height: "3px",
                      borderRadius: "2px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
      {/* Main Content */}
      <div style={{ flex: 1, padding: "32px 28px" }}>
        {portfolio.aboutText && (
          <section style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accent,
                borderBottom: `2px solid ${accent}`,
                paddingBottom: "4px",
                marginBottom: "8px",
              }}
            >
              Summary
            </h2>
            <p style={{ color: "#666", lineHeight: "1.6", margin: 0 }}>
              {portfolio.aboutText}
            </p>
          </section>
        )}
        {portfolio.experiences?.length > 0 && (
          <section style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accent,
                borderBottom: `2px solid ${accent}`,
                paddingBottom: "4px",
                marginBottom: "10px",
              }}
            >
              Experience
            </h2>
            {portfolio.experiences.map((exp: any) => (
              <div key={exp.id} style={{ marginBottom: "12px" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "13px",
                        color: "#999",
                      }}
                    >
                      {exp.role}
                    </p>
                    <p
                      style={{
                        color: accent,
                        margin: "2px 0",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {exp.company}
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#777",
                      whiteSpace: "nowrap",
                      margin: 0,
                    }}
                  >
                    {new Date(exp.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}{" "}
                    —{" "}
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
                      fontSize: "11px",
                      color: "#555",
                      margin: "4px 0 0",
                      lineHeight: "1.5",
                    }}
                  >
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
        {/* Services — left column */}
        {portfolio.services?.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accent,
                borderBottom: `2px solid ${accent}`,
                paddingBottom: "4px",
                marginBottom: "10px",
              }}
            >
              Services
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
              }}
            >
              {portfolio.services.map((service: any) => (
                <div
                  key={service.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "6px",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>
                    {service.iconUrl ?? "💻"}
                  </span>
                  <div>
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "11px",
                      }}
                    >
                      {service.title}
                    </p>
                    {service.price && (
                      <p
                        style={{
                          fontSize: "10px",
                          color: accent,
                          margin: "1px 0 0",
                        }}
                      >
                        {service.price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Clients — right column */}
        {portfolio.clients?.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accent,
                borderBottom: `2px solid ${accent}`,
                paddingBottom: "4px",
                marginBottom: "10px",
              }}
            >
              Clients
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {portfolio.clients.map((client: any) => (
                <span
                  key={client.id}
                  style={{
                    fontSize: "11px",
                    border: `1px solid ${accent}`,
                    color: "#444",
                    padding: "3px 8px",
                    borderRadius: "3px",
                  }}
                >
                  {client.name}
                </span>
              ))}
            </div>
          </div>
        )}
        {portfolio.projects?.length > 0 && (
          <section style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accent,
                borderBottom: `2px solid ${accent}`,
                paddingBottom: "4px",
                marginBottom: "10px",
              }}
            >
              Projects
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
              }}
            >
              {portfolio.projects.map((project: any) => (
                <div
                  key={project.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    padding: "10px",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "700",
                      margin: "0 0 4px",
                      fontSize: "12px",
                      color: "#999",
                    }}
                  >
                    {project.title}
                  </p>
                  {project.description && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#666",
                        margin: "0 0 4px",
                        lineHeight: "1.4",
                      }}
                    >
                      {project.description}
                    </p>
                  )}
                  {project.tags?.length > 0 && (
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}
                    >
                      {project.tags.map((tag: string) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: "9px",
                            background: "#f3f4f6",
                            padding: "2px 5px",
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
          </section>
        )}

        {portfolio.certificates?.length > 0 && (
          <section style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accent,
                borderBottom: `2px solid ${accent}`,
                paddingBottom: "4px",
                marginBottom: "10px",
              }}
            >
              Certificates
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
              }}
            >
              {portfolio.certificates.map((cert: any) => (
                <div
                  key={cert.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "700",
                      margin: "0",
                      fontSize: "11px",
                      color: "#999",
                    }}
                  >
                    {cert.title}
                  </p>
                  <p
                    style={{ color: accent, margin: "2px 0", fontSize: "10px" }}
                  >
                    {cert.issuer}
                  </p>
                  <p style={{ color: "#777", margin: "0", fontSize: "10px" }}>
                    {new Date(cert.issueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
        {portfolio.achievements?.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accent,
                borderBottom: `2px solid ${accent}`,
                paddingBottom: "4px",
                marginBottom: "10px",
              }}
            >
              Achievements
            </h2>
            {portfolio.achievements.map((a: any) => (
              <div
                key={a.id}
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: "16px" }}>{a.imageUrl ?? "🏆"}</span>
                <div>
                  <p
                    style={{
                      fontWeight: "700",
                      margin: "0",
                      fontSize: "12px",
                      color: "#999",
                    }}
                  >
                    {a.title}
                  </p>
                  {a.date && (
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#777",
                        margin: "1px 0",
                      }}
                    >
                      {new Date(a.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </p>
                  )}
                  {a.description && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#555",
                        margin: "2px 0 0",
                      }}
                    >
                      {a.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {portfolio.gallery?.length > 0 && (
          <div style={{ marginBottom: "10px" }}>
            <p
              style={{
                fontWeight: "700",
                fontSize: "12px",
                margin: "0 0 4px",
                color: "#999",
              }}
            >
              Portfolio Gallery
            </p>
            <a
              href={`https://www.portfolio-craft.com/${username}#gallery`}
              style={{ fontSize: "11px", color: accent }}
            >
              portfoliocraft.com/{username}#gallery
            </a>
            <p style={{ fontSize: "10px", color: "#777", margin: "2px 0 0" }}>
              {portfolio.gallery.length} photos available online
            </p>
          </div>
        )}
        <footer
          style={{
            marginTop: "20px",
            paddingTop: "10px",
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "9px", color: "#aaa", margin: 0 }}>
            Generated by PortfolioCraft · portfoliocraft.com/{username}
          </p>
        </footer>
      </div>
    </main>
  );
}
// ─────────────────────────────────────────────────────────
// 2. EXECUTIVE — Dark header with gold accents
// ─────────────────────────────────────────────────────────
function ExecutiveTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  return (
    <main
      style={{
        fontFamily: "Georgia, serif",
        maxWidth: "900px",
        margin: "0 auto",
        color: "#1a1a1a",
        fontSize: "12px",
      }}
    >
      {/* Dark Header */}
      <header
        style={{
          background: "#1a1a2e",
          color: "#fff",
          padding: "32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "900",
              margin: "0 0 4px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: accent,
            }}
          >
            {portfolio.heroTitle}
          </h1>
          <p style={{ fontSize: "14px", color: "#ccc", margin: "0 0 12px" }}>
            {portfolio.heroSubtitle}
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              fontSize: "11px",
              color: "#aaa",
            }}
          >
            {portfolio.email && <span>✉ {portfolio.email}</span>}
            {portfolio.phone && <span>📞 {portfolio.phone}</span>}
            {portfolio.location && <span>📍 {portfolio.location}</span>}
            {githubUsername && <span>GitHub: {githubUsername}</span>}
            {linkedinUsername && <span>LinkedIn: {linkedinUsername}</span>}
          </div>
        </div>
        {portfolio.user?.avatarUrl && (
          <img
            src={portfolio.user.avatarUrl}
            alt=""
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `3px solid ${accent}`,
            }}
          />
        )}
      </header>
      <div style={{ padding: "28px 40px" }}>
        {portfolio.aboutText && (
          <section
            style={{
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: `1px solid ${accent}`,
            }}
          >
            <p
              style={{
                color: "#777",
                lineHeight: "1.7",
                margin: 0,
                fontStyle: "italic",
                fontSize: "13px",
              }}
            >
              {portfolio.aboutText}
            </p>
          </section>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "32px",
          }}
        >
          <div>
            {portfolio.experiences?.length > 0 && (
              <section style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontSize: "13px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: accent,
                    marginBottom: "12px",
                  }}
                >
                  Experience
                </h2>
                {portfolio.experiences.map((exp: any) => (
                  <div
                    key={exp.id}
                    style={{
                      marginBottom: "14px",
                      paddingLeft: "12px",
                      borderLeft: `3px solid ${accent}`,
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "13px",
                        color: "#777",
                      }}
                    >
                      {exp.role}
                    </p>
                    <p
                      style={{
                        color: accent,
                        margin: "2px 0",
                        fontSize: "12px",
                      }}
                    >
                      {exp.company}
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#777",
                        margin: "2px 0",
                      }}
                    >
                      {new Date(exp.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}{" "}
                      —{" "}
                      {exp.current
                        ? "Present"
                        : new Date(exp.endDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}
                    </p>
                    {exp.description && (
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#555",
                          margin: "4px 0 0",
                          lineHeight: "1.5",
                        }}
                      >
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            )}
            {/* Services — left column */}
            {portfolio.services?.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontSize: "13px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: accent,
                    borderBottom: `2px solid ${accent}`,
                    paddingBottom: "4px",
                    marginBottom: "10px",
                  }}
                >
                  Services
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                  }}
                >
                  {portfolio.services.map((service: any) => (
                    <div
                      key={service.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "6px",
                      }}
                    >
                      <span style={{ fontSize: "14px" }}>
                        {service.iconUrl ?? "💻"}
                      </span>
                      <div>
                        <p
                          style={{
                            fontWeight: "700",
                            margin: "0",
                            fontSize: "11px",
                          }}
                        >
                          {service.title}
                        </p>
                        {service.price && (
                          <p
                            style={{
                              fontSize: "10px",
                              color: accent,
                              margin: "1px 0 0",
                            }}
                          >
                            {service.price}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clients — right column */}
            {portfolio.clients?.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontSize: "13px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: accent,
                    borderBottom: `2px solid ${accent}`,
                    paddingBottom: "4px",
                    marginBottom: "10px",
                  }}
                >
                  Clients
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {portfolio.clients.map((client: any) => (
                    <span
                      key={client.id}
                      style={{
                        fontSize: "11px",
                        border: `1px solid ${accent}`,
                        color: "#444",
                        padding: "3px 8px",
                        borderRadius: "3px",
                      }}
                    >
                      {client.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {portfolio.projects?.length > 0 && (
              <section>
                <h2
                  style={{
                    fontSize: "13px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: accent,
                    marginBottom: "12px",
                  }}
                >
                  Projects
                </h2>
                {portfolio.projects.map((project: any) => (
                  <div key={project.id} style={{ marginBottom: "10px" }}>
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0 0 2px",
                        fontSize: "12px",
                        color: "#888",
                      }}
                    >
                      {project.title}
                    </p>
                    {project.description && (
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#666",
                          margin: "0 0 4px",
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
                          gap: "3px",
                        }}
                      >
                        {project.tags.map((tag: string) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: "9px",
                              background: "#1a1a2e",
                              color: accent,
                              padding: "2px 6px",
                              borderRadius: "3px",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}
          </div>
          <div>
            {portfolio.skills?.length > 0 && (
              <section style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontSize: "13px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: accent,
                    marginBottom: "12px",
                  }}
                >
                  Skills
                </h2>
                {portfolio.skills.map((skill: any) => (
                  <div key={skill.id} style={{ marginBottom: "8px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "3px",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "#999" }}>
                        {skill.name}
                      </span>
                      <span style={{ fontSize: "10px", color: "#777" }}>
                        {skill.proficiency}%
                      </span>
                    </div>
                    <div
                      style={{
                        background: "#e5e7eb",
                        borderRadius: "2px",
                        height: "4px",
                      }}
                    >
                      <div
                        style={{
                          background: accent,
                          width: `${skill.proficiency}%`,
                          height: "4px",
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </section>
            )}
            {portfolio.certificates?.length > 0 && (
              <section style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontSize: "13px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: accent,
                    marginBottom: "12px",
                  }}
                >
                  Certificates
                </h2>
                {portfolio.certificates.map((cert: any) => (
                  <div key={cert.id} style={{ marginBottom: "8px" }}>
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "11px",
                        color: "#999",
                      }}
                    >
                      {cert.title}
                    </p>
                    <p
                      style={{
                        color: accent,
                        margin: "1px 0",
                        fontSize: "10px",
                      }}
                    >
                      {cert.issuer}
                    </p>
                  </div>
                ))}
              </section>
            )}
            {portfolio.achievements?.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    fontSize: "13px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: accent,
                    borderBottom: `2px solid ${accent}`,
                    paddingBottom: "4px",
                    marginBottom: "10px",
                  }}
                >
                  Achievements
                </h2>
                {portfolio.achievements.map((a: any) => (
                  <div
                    key={a.id}
                    style={{
                      marginBottom: "8px",
                      display: "flex",
                      gap: "8px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>
                      {a.imageUrl ?? "🏆"}
                    </span>
                    <div>
                      <p
                        style={{
                          fontWeight: "700",
                          margin: "0",
                          fontSize: "12px",
                          color: "#999",
                        }}
                      >
                        {a.title}
                      </p>
                      {a.date && (
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#777",
                            margin: "1px 0",
                          }}
                        >
                          {new Date(a.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}
                        </p>
                      )}
                      {a.description && (
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#555",
                            margin: "2px 0 0",
                          }}
                        >
                          {a.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {portfolio.gallery?.length > 0 && (
              <div style={{ marginBottom: "10px" }}>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "12px",
                    margin: "0 0 4px",
                    color: "#999",
                  }}
                >
                  Portfolio Gallery
                </p>
                <a
                  href={`https://www.portfolio-craft.com/${username}#gallery`}
                  style={{ fontSize: "11px", color: accent }}
                >
                  portfoliocraft.com/{username}#gallery
                </a>
                <p
                  style={{ fontSize: "10px", color: "#777", margin: "2px 0 0" }}
                >
                  {portfolio.gallery.length} photos available online
                </p>
              </div>
            )}
            {portfolio.testimonials?.length > 0 && (
              <section>
                <h2
                  style={{
                    fontSize: "13px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: accent,
                    marginBottom: "12px",
                  }}
                >
                  Testimonials
                </h2>
                {portfolio.testimonials.slice(0, 2).map((t: any) => (
                  <div
                    key={t.id}
                    style={{
                      marginBottom: "10px",
                      padding: "8px",
                      background: "#f9f9f9",
                      borderRadius: "4px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        fontStyle: "italic",
                        color: "#444",
                        margin: "0 0 4px",
                      }}
                    >
                      "{t.content}"
                    </p>
                    <p
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        margin: "0",
                        color: accent,
                      }}
                    >
                      {t.authorName}
                    </p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
      <footer
        style={{
          background: "#1a1a2e",
          padding: "12px 40px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "9px", color: "#666", margin: 0 }}>
          Generated by PortfolioCraft · portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}
// ─────────────────────────────────────────────────────────
// 3. MINIMAL — Ultra clean typography
// ─────────────────────────────────────────────────────────
function MinimalTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "48px 40px",
        color: "#1a1a1a",
        fontSize: "12px",
        lineHeight: "1.6",
      }}
    >
      <header style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "12px",
          }}
        >
          {portfolio.user?.avatarUrl && (
            <img
              src={portfolio.user.avatarUrl}
              alt=""
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "300",
                margin: "0",
                letterSpacing: "-0.5px",
                color: "#999",
              }}
            >
              {portfolio.heroTitle}
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: accent,
                margin: "2px 0 0",
                fontWeight: "500",
              }}
            >
              {portfolio.heroSubtitle}
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            fontSize: "11px",
            color: "#666",
            borderTop: "1px solid #eee",
            paddingTop: "12px",
          }}
        >
          {portfolio.email && <span>{portfolio.email}</span>}
          {portfolio.phone && <span>{portfolio.phone}</span>}
          {portfolio.location && <span>{portfolio.location}</span>}
          {githubUsername && <span>github.com/{githubUsername}</span>}
          {linkedinUsername && <span>linkedin.com/in/{linkedinUsername}</span>}
        </div>
      </header>
      {portfolio.aboutText && (
        <section style={{ marginBottom: "28px" }}>
          <p
            style={{
              color: "#777",
              lineHeight: "1.7",
              margin: 0,
              fontSize: "13px",
            }}
          >
            {portfolio.aboutText}
          </p>
        </section>
      )}
      {portfolio.experiences?.length > 0 && (
        <section style={{ marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "10px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#999",
              marginBottom: "16px",
            }}
          >
            Work Experience
          </h2>
          {portfolio.experiences.map((exp: any) => (
            <div
              key={exp.id}
              style={{ marginBottom: "16px", display: "flex", gap: "16px" }}
            >
              <div
                style={{
                  width: "100px",
                  flexShrink: 0,
                  fontSize: "10px",
                  color: "#999",
                  paddingTop: "2px",
                }}
              >
                {new Date(exp.startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
                <br />
                {exp.current
                  ? "Present"
                  : new Date(exp.endDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontWeight: "600",
                    margin: "0",
                    fontSize: "13px",
                    color: "#999",
                  }}
                >
                  {exp.role}
                </p>
                <p style={{ color: accent, margin: "2px 0", fontSize: "12px" }}>
                  {exp.company}
                  {exp.location && ` · ${exp.location}`}
                </p>
                {exp.description && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#666",
                      margin: "4px 0 0",
                    }}
                  >
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}
      >
        {portfolio.skills?.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: "#999",
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
                    fontSize: "11px",
                    border: `1px solid ${accent}`,
                    color: accent,
                    padding: "3px 8px",
                    borderRadius: "3px",
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
        {/* Services — left column */}
        {portfolio.services?.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accent,
                borderBottom: `2px solid ${accent}`,
                paddingBottom: "4px",
                marginBottom: "10px",
              }}
            >
              Services
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
              }}
            >
              {portfolio.services.map((service: any) => (
                <div
                  key={service.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "6px",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>
                    {service.iconUrl ?? "💻"}
                  </span>
                  <div>
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "11px",
                      }}
                    >
                      {service.title}
                    </p>
                    {service.price && (
                      <p
                        style={{
                          fontSize: "10px",
                          color: accent,
                          margin: "1px 0 0",
                        }}
                      >
                        {service.price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clients — right column */}
        {portfolio.clients?.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: accent,
                borderBottom: `2px solid ${accent}`,
                paddingBottom: "4px",
                marginBottom: "10px",
              }}
            >
              Clients
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {portfolio.clients.map((client: any) => (
                <span
                  key={client.id}
                  style={{
                    fontSize: "11px",
                    border: `1px solid ${accent}`,
                    color: "#444",
                    padding: "3px 8px",
                    borderRadius: "3px",
                  }}
                >
                  {client.name}
                </span>
              ))}
            </div>
          </div>
        )}
        {portfolio.projects?.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "10px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: "#999",
                marginBottom: "12px",
              }}
            >
              Projects
            </h2>
            {portfolio.projects.slice(0, 3).map((project: any) => (
              <div key={project.id} style={{ marginBottom: "8px" }}>
                <p
                  style={{
                    fontWeight: "600",
                    margin: "0",
                    fontSize: "12px",
                    color: "#ccc",
                  }}
                >
                  {project.title}
                </p>
                {project.description && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#777",
                      margin: "2px 0 0",
                    }}
                  >
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
      {portfolio.certificates?.length > 0 && (
        <section style={{ marginTop: "24px", marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "10px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#999",
              marginBottom: "12px",
            }}
          >
            Certificates
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            {portfolio.certificates.map((cert: any) => (
              <div
                key={cert.id}
                style={{
                  borderLeft: `2px solid ${accent}`,
                  paddingLeft: "8px",
                }}
              >
                <p
                  style={{
                    fontWeight: "600",
                    margin: "0",
                    fontSize: "12px",
                    color: "#999",
                  }}
                >
                  {cert.title}
                </p>
                <p style={{ color: accent, margin: "2px 0", fontSize: "11px" }}>
                  {cert.issuer}
                </p>
                <p style={{ fontSize: "10px", color: "#aaa", margin: "0" }}>
                  {new Date(cert.issueDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
      {portfolio.achievements?.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: accent,
              borderBottom: `2px solid ${accent}`,
              paddingBottom: "4px",
              marginBottom: "10px",
            }}
          >
            Achievements
          </h2>
          {portfolio.achievements.map((a: any) => (
            <div
              key={a.id}
              style={{
                marginBottom: "8px",
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: "16px" }}>{a.imageUrl ?? "🏆"}</span>
              <div>
                <p
                  style={{
                    fontWeight: "700",
                    margin: "0",
                    fontSize: "12px",
                    color: "#999",
                  }}
                >
                  {a.title}
                </p>
                {a.date && (
                  <p
                    style={{ fontSize: "10px", color: "#777", margin: "1px 0" }}
                  >
                    {new Date(a.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </p>
                )}
                {a.description && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#555",
                      margin: "2px 0 0",
                    }}
                  >
                    {a.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {portfolio.gallery?.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h2
            style={{
              fontSize: "10px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#999",
              marginBottom: "8px",
            }}
          >
            Gallery
          </h2>
          <a
            href={`https://www.portfolio-craft.com/${username}#gallery`}
            style={{ fontSize: "11px", color: accent, display: "block" }}
          >
            portfoliocraft.com/{username}#gallery
          </a>
          <p style={{ fontSize: "10px", color: "#aaa", margin: "2px 0 0" }}>
            {portfolio.gallery.length} photos online
          </p>
        </div>
      )}
      <footer
        style={{
          marginTop: "32px",
          paddingTop: "12px",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <p
          style={{
            fontSize: "9px",
            color: "#ccc",
            margin: 0,
            textAlign: "right",
          }}
        >
          portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}
// ─────────────────────────────────────────────────────────
// 4. CREATIVE — Bold dark with colored accents
// ─────────────────────────────────────────────────────────
function CreativeTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  return (
    <main
      style={{
        fontFamily: "Inter, sans-serif",
        background: "#0f172a",
        color: "#f1f5f9",
        minHeight: "100vh",
        fontSize: "12px",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "40px",
          borderBottom: `3px solid ${accent}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "900",
              margin: "0 0 4px",
              background: `linear-gradient(135deg, #fff, ${accent})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {portfolio.heroTitle}
          </h1>
          <p style={{ color: "#94a3b8", margin: "0 0 12px", fontSize: "14px" }}>
            {portfolio.heroSubtitle}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "11px",
              color: "#64748b",
            }}
          >
            {portfolio.email && <span>✉ {portfolio.email}</span>}
            {portfolio.phone && <span>{portfolio.phone}</span>}
            {portfolio.location && <span>{portfolio.location}</span>}
            {githubUsername && <span>/{githubUsername}</span>}
          </div>
        </div>
        {portfolio.user?.avatarUrl && (
          <img
            src={portfolio.user.avatarUrl}
            alt=""
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "12px",
              objectFit: "cover",
              border: `2px solid ${accent}`,
            }}
          />
        )}
      </header>
      <div
        style={{
          padding: "32px 40px",
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "32px",
        }}
      >
        {/* Left */}
        <div>
          {portfolio.aboutText && (
            <section style={{ marginBottom: "24px" }}>
              <div
                style={{
                  background: "#1e293b",
                  borderRadius: "8px",
                  padding: "16px",
                  borderLeft: `4px solid ${accent}`,
                }}
              >
                <p style={{ color: "#cbd5e1", lineHeight: "1.7", margin: 0 }}>
                  {portfolio.aboutText}
                </p>
              </div>
            </section>
          )}
          {portfolio.experiences?.length > 0 && (
            <section style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accent,
                  marginBottom: "14px",
                }}
              >
                Experience
              </h2>
              {portfolio.experiences.map((exp: any) => (
                <div
                  key={exp.id}
                  style={{
                    marginBottom: "14px",
                    background: "#1e293b",
                    borderRadius: "6px",
                    padding: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        color: "#f1f5f9",
                      }}
                    >
                      {exp.role}
                    </p>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>
                      {new Date(exp.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}{" "}
                      —{" "}
                      {exp.current
                        ? "Present"
                        : new Date(exp.endDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}
                    </span>
                  </div>
                  <p
                    style={{
                      color: accent,
                      margin: "0 0 4px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {exp.company}
                  </p>
                  {exp.description && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        margin: "4px 0 0",
                      }}
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
          {/* Services — left column */}
          {portfolio.services?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: accent,
                  borderBottom: `2px solid ${accent}`,
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Services
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px",
                }}
              >
                {portfolio.services.map((service: any) => (
                  <div
                    key={service.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "6px",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>
                      {service.iconUrl ?? "💻"}
                    </span>
                    <div>
                      <p
                        style={{
                          fontWeight: "700",
                          margin: "0",
                          fontSize: "11px",
                        }}
                      >
                        {service.title}
                      </p>
                      {service.price && (
                        <p
                          style={{
                            fontSize: "10px",
                            color: accent,
                            margin: "1px 0 0",
                          }}
                        >
                          {service.price}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clients — right column */}
          {portfolio.clients?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: accent,
                  borderBottom: `2px solid ${accent}`,
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Clients
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {portfolio.clients.map((client: any) => (
                  <span
                    key={client.id}
                    style={{
                      fontSize: "11px",
                      border: `1px solid ${accent}`,
                      color: "#ccc",
                      padding: "3px 8px",
                      borderRadius: "3px",
                    }}
                  >
                    {client.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {portfolio.projects?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accent,
                  marginBottom: "14px",
                }}
              >
                Projects
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                {portfolio.projects.map((project: any) => (
                  <div
                    key={project.id}
                    style={{
                      background: "#1e293b",
                      borderRadius: "6px",
                      padding: "12px",
                      border: "1px solid #334155",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0 0 4px",
                        color: "#f1f5f9",
                        fontSize: "12px",
                      }}
                    >
                      {project.title}
                    </p>
                    {project.description && (
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          margin: "0 0 6px",
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
                          gap: "3px",
                        }}
                      >
                        {project.tags.map((tag: string) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: "9px",
                              background: `${accent}20`,
                              color: accent,
                              padding: "2px 6px",
                              borderRadius: "3px",
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
            </section>
          )}
        </div>
        {/* Right */}
        <div>
          {portfolio.skills?.length > 0 && (
            <section style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accent,
                  marginBottom: "14px",
                }}
              >
                Skills
              </h2>
              {portfolio.skills.map((skill: any) => (
                <div key={skill.id} style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontSize: "12px", color: "#cbd5e1" }}>
                      {skill.name}
                    </span>
                    <span style={{ fontSize: "10px", color: "#ccc" }}>
                      {skill.proficiency}%
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#1e293b",
                      borderRadius: "2px",
                      height: "4px",
                    }}
                  >
                    <div
                      style={{
                        background: accent,
                        width: `${skill.proficiency}%`,
                        height: "4px",
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </section>
          )}
          {portfolio.certificates?.length > 0 && (
            <section style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accent,
                  marginBottom: "14px",
                }}
              >
                Certificates
              </h2>
              {portfolio.certificates.map((cert: any) => (
                <div
                  key={cert.id}
                  style={{
                    marginBottom: "10px",
                    background: "#1e293b",
                    borderRadius: "6px",
                    padding: "10px",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "700",
                      margin: "0",
                      fontSize: "11px",
                      color: "#f1f5f9",
                    }}
                  >
                    {cert.title}
                  </p>
                  <p
                    style={{ color: accent, margin: "2px 0", fontSize: "10px" }}
                  >
                    {cert.issuer}
                  </p>
                </div>
              ))}
            </section>
          )}
          {portfolio.achievements?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: accent,
                  borderBottom: `2px solid ${accent}`,
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Achievements
              </h2>
              {portfolio.achievements.map((a: any) => (
                <div
                  key={a.id}
                  style={{
                    marginBottom: "8px",
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{a.imageUrl ?? "🏆"}</span>
                  <div>
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "12px",
                      }}
                    >
                      {a.title}
                    </p>
                    {a.date && (
                      <p
                        style={{
                          fontSize: "10px",
                          color: "#999",
                          margin: "1px 0",
                        }}
                      >
                        {new Date(a.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                      </p>
                    )}
                    {a.description && (
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#ccc",
                          margin: "2px 0 0",
                        }}
                      >
                        {a.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {portfolio.gallery?.length > 0 && (
            <div style={{ marginBottom: "10px" }}>
              <p
                style={{
                  fontWeight: "700",
                  fontSize: "12px",
                  margin: "0 0 4px",
                }}
              >
                Portfolio Gallery
              </p>
              <a
                href={`https://www.portfolio-craft.com/${username}#gallery`}
                style={{ fontSize: "11px", color: accent }}
              >
                portfoliocraft.com/{username}#gallery
              </a>
              <p style={{ fontSize: "10px", color: "#777", margin: "2px 0 0" }}>
                {portfolio.gallery.length} photos available online
              </p>
            </div>
          )}
          {portfolio.testimonials?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: accent,
                  marginBottom: "14px",
                }}
              >
                Testimonials
              </h2>
              {portfolio.testimonials.slice(0, 2).map((t: any) => (
                <div
                  key={t.id}
                  style={{
                    marginBottom: "10px",
                    background: "#1e293b",
                    borderRadius: "6px",
                    padding: "10px",
                    borderLeft: `3px solid ${accent}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      fontStyle: "italic",
                      color: "#94a3b8",
                      margin: "0 0 4px",
                    }}
                  >
                    "{t.content}"
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      margin: "0",
                      color: accent,
                    }}
                  >
                    {t.authorName}
                  </p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
      <footer
        style={{
          padding: "12px 40px",
          borderTop: "1px solid #1e293b",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "9px", color: "#334155", margin: 0 }}>
          Generated by PortfolioCraft · portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}
// ─────────────────────────────────────────────────────────
// 5. ELEGANT — Serif with classic styling
// ─────────────────────────────────────────────────────────
function ElegantTemplate({
  portfolio,
  username,
  accent,
  githubUsername,
  linkedinUsername,
}: TemplateProps) {
  return (
    <main
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        maxWidth: "850px",
        margin: "0 auto",
        padding: "40px",
        color: "#2c2c2c",
        fontSize: "12px",
        lineHeight: "1.6",
      }}
    >
      {/* Header */}
      <header
        style={{
          textAlign: "center",
          marginBottom: "32px",
          paddingBottom: "24px",
          borderBottom: `1px solid ${accent}`,
        }}
      >
        {portfolio.user?.avatarUrl && (
          <img
            src={portfolio.user.avatarUrl}
            alt=""
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              margin: "0 auto 16px",
              display: "block",
              border: `3px solid ${accent}`,
            }}
          />
        )}
        <h1
          style={{
            fontSize: "30px",
            fontWeight: "400",
            margin: "0 0 6px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#999",
          }}
        >
          {portfolio.heroTitle}
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: accent,
            margin: "0 0 16px",
            fontStyle: "italic",
            fontWeight: "400",
          }}
        >
          {portfolio.heroSubtitle}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            fontSize: "11px",
            color: "#999",
          }}
        >
          {portfolio.email && <span>{portfolio.email}</span>}
          {portfolio.phone && <span>{portfolio.phone}</span>}
          {portfolio.location && <span>{portfolio.location}</span>}
          {githubUsername && <span>github.com/{githubUsername}</span>}
          {linkedinUsername && <span>linkedin.com/in/{linkedinUsername}</span>}
        </div>
      </header>
      {portfolio.aboutText && (
        <section style={{ marginBottom: "28px", textAlign: "center" }}>
          <p
            style={{
              color: "#999",
              lineHeight: "1.8",
              margin: "0 auto",
              maxWidth: "600px",
              fontStyle: "italic",
              fontSize: "13px",
            }}
          >
            {portfolio.aboutText}
          </p>
        </section>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "40px",
        }}
      >
        <div>
          {portfolio.experiences?.length > 0 && (
            <section style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "400",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: accent,
                  borderBottom: `1px solid ${accent}`,
                  paddingBottom: "6px",
                  marginBottom: "16px",
                }}
              >
                Professional Experience
              </h2>
              {portfolio.experiences.map((exp: any) => (
                <div key={exp.id} style={{ marginBottom: "16px" }}>
                  <p
                    style={{
                      fontWeight: "700",
                      margin: "0",
                      fontSize: "13px",
                      color: "#999",
                    }}
                  >
                    {exp.role}
                  </p>
                  <p
                    style={{
                      color: accent,
                      margin: "2px 0 4px",
                      fontSize: "12px",
                      fontStyle: "italic",
                    }}
                  >
                    {exp.company}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#999",
                      margin: "0 0 4px",
                    }}
                  >
                    {new Date(exp.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}{" "}
                    —{" "}
                    {exp.current
                      ? "Present"
                      : new Date(exp.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                  </p>
                  {exp.description && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#ccc",
                        margin: "4px 0 0",
                        lineHeight: "1.6",
                      }}
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
          {/* Services — left column */}
          {portfolio.services?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "13px",
                  // fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: accent,
                  borderBottom: `1px solid ${accent}`,
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Services
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px",
                }}
              >
                {portfolio.services.map((service: any) => (
                  <div
                    key={service.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "6px",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>
                      {service.iconUrl ?? "💻"}
                    </span>
                    <div>
                      <p
                        style={{
                          fontWeight: "700",
                          margin: "0",
                          fontSize: "11px",
                        }}
                      >
                        {service.title}
                      </p>
                      {service.price && (
                        <p
                          style={{
                            fontSize: "10px",
                            color: accent,
                            margin: "1px 0 0",
                          }}
                        >
                          {service.price}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clients — right column */}
          {portfolio.clients?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "13px",
                  // fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: accent,
                  borderBottom: `1px solid ${accent}`,
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Clients
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {portfolio.clients.map((client: any) => (
                  <span
                    key={client.id}
                    style={{
                      fontSize: "11px",
                      border: `1px solid ${accent}`,
                      color: "#444",
                      padding: "3px 8px",
                      borderRadius: "3px",
                    }}
                  >
                    {client.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {portfolio.projects?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "400",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: accent,
                  borderBottom: `1px solid ${accent}`,
                  paddingBottom: "6px",
                  marginBottom: "16px",
                }}
              >
                Selected Works
              </h2>
              {portfolio.projects.map((project: any) => (
                <div key={project.id} style={{ marginBottom: "12px" }}>
                  <p
                    style={{
                      fontWeight: "700",
                      margin: "0 0 2px",
                      fontSize: "12px",
                      color: "#ddd",
                    }}
                  >
                    {project.title}
                  </p>
                  {project.description && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#999",
                        margin: "0",
                        lineHeight: "1.5",
                      }}
                    >
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
        <div>
          {portfolio.skills?.length > 0 && (
            <section style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "400",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: accent,
                  borderBottom: `1px solid ${accent}`,
                  paddingBottom: "6px",
                  marginBottom: "16px",
                }}
              >
                Expertise
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {portfolio.skills.map((skill: any) => (
                  <span
                    key={skill.id}
                    style={{
                      fontSize: "11px",
                      border: `1px solid ${accent}`,
                      color: "#777",
                      padding: "3px 10px",
                      borderRadius: "2px",
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {portfolio.certificates?.length > 0 && (
            <section style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "400",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: accent,
                  borderBottom: `1px solid ${accent}`,
                  paddingBottom: "6px",
                  marginBottom: "16px",
                }}
              >
                Certifications
              </h2>
              {portfolio.certificates.map((cert: any) => (
                <div key={cert.id} style={{ marginBottom: "10px" }}>
                  <p
                    style={{
                      fontWeight: "700",
                      margin: "0",
                      fontSize: "12px",
                      color: "#999",
                    }}
                  >
                    {cert.title}
                  </p>
                  <p
                    style={{
                      color: accent,
                      margin: "2px 0",
                      fontSize: "11px",
                      fontStyle: "italic",
                    }}
                  >
                    {cert.issuer}
                  </p>
                </div>
              ))}
            </section>
          )}
          {portfolio.achievements?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "13px",
                  // fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: accent,
                  borderBottom: `1px solid ${accent}`,
                  paddingBottom: "4px",
                  marginBottom: "10px",
                }}
              >
                Achievements
              </h2>
              {portfolio.achievements.map((a: any) => (
                <div
                  key={a.id}
                  style={{
                    marginBottom: "8px",
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{a.imageUrl ?? "🏆"}</span>
                  <div>
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0",
                        fontSize: "12px",
                        color: "#ddd",
                      }}
                    >
                      {a.title}
                    </p>
                    {a.date && (
                      <p
                        style={{
                          fontSize: "10px",
                          color: "#666",
                          margin: "1px 0",
                        }}
                      >
                        {new Date(a.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                      </p>
                    )}
                    {a.description && (
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#999",
                          margin: "2px 0 0",
                        }}
                      >
                        {a.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {portfolio.gallery?.length > 0 && (
            <div style={{ marginBottom: "10px" }}>
              <p
                style={{
                  fontWeight: "700",
                  fontSize: "12px",
                  margin: "0 0 4px",
                  color: "#999",
                }}
              >
                Portfolio Gallery
              </p>
              <a
                href={`https://www.portfolio-craft.com/${username}#gallery`}
                style={{ fontSize: "11px", color: accent }}
              >
                portfoliocraft.com/{username}#gallery
              </a>
              <p style={{ fontSize: "10px", color: "#777", margin: "2px 0 0" }}>
                {portfolio.gallery.length} photos available online
              </p>
            </div>
          )}
          {portfolio.testimonials?.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: "400",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  color: accent,
                  borderBottom: `1px solid ${accent}`,
                  paddingBottom: "6px",
                  marginBottom: "16px",
                }}
              >
                Testimonials
              </h2>
              {portfolio.testimonials.slice(0, 2).map((t: any) => (
                <div key={t.id} style={{ marginBottom: "12px" }}>
                  <p
                    style={{
                      fontSize: "11px",
                      fontStyle: "italic",
                      color: "#999",
                      margin: "0 0 4px",
                      lineHeight: "1.6",
                    }}
                  >
                    "{t.content}"
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: accent,
                      margin: "0",
                      fontWeight: "700",
                    }}
                  >
                    — {t.authorName}
                    {t.authorCompany && `, ${t.authorCompany}`}
                  </p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
      <footer
        style={{
          marginTop: "32px",
          paddingTop: "16px",
          borderTop: `1px solid ${accent}`,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "9px",
            color: "#ccc",
            margin: 0,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          portfoliocraft.com/{username}
        </p>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────────────────────────
// UPDATED PAGE COMPONENT — supports all 23 templates
// ─────────────────────────────────────────────────────────
export default async function PrintTemplatePage({
  params,
}: {
  params: Promise<{ username: string; template: string }>;
}) {
  const { username, template } = await params;
  const portfolio = await getPortfolio(username);
  if (!portfolio) notFound();

  const tmpl = getPdfTemplateById(template);

  const githubUsername = portfolio.github?.replace("https://github.com/", "");
  const linkedinUsername = portfolio.linkedin
    ?.replace("https://www.linkedin.com/in/", "")
    .replace("https://linkedin.com/in/", "")
    .replace(/\/$/, "");

  const templateProps = {
    portfolio,
    username,
    accent: tmpl.accentColor,
    githubUsername,
    linkedinUsername,
  };

  const templateMap: Record<string, ReactElement> = {
    modern: <ModernTemplate {...templateProps} />,
    executive: <ExecutiveTemplate {...templateProps} />,
    minimal: <MinimalTemplate {...templateProps} />,
    creative: <CreativeTemplate {...templateProps} />,
    elegant: <ElegantTemplate {...templateProps} />,
    artistic: <ArtisticTemplate {...templateProps} />,
    bloom: <BloomTemplate {...templateProps} />,
    timeless: <TimelessTemplate {...templateProps} />,
    impact: <ImpactTemplate {...templateProps} />,
    expert: <ExpertTemplate {...templateProps} />,
    elite: <EliteTemplate {...templateProps} />,
    elevate: <ElevateTemplate {...templateProps} />,
    modular: <ModularTemplate {...templateProps} />,
    classic: <ClassicTemplate {...templateProps} />,
    luxe: <LuxeTemplate {...templateProps} />,
    contemporary: <ContemporaryTemplate {...templateProps} />,
    functional: <FunctionalTemplate {...templateProps} />,
    enterprise: <EnterpriseTemplate {...templateProps} />,
    engage: <EngageTemplate {...templateProps} />,
    professional: <ProfessionalTemplate {...templateProps} />,
    streamline: <StreamlineTemplate {...templateProps} />,
    confident: <ConfidentTemplate {...templateProps} />,
    prestige: <PrestigeTemplate {...templateProps} />,
  };

  return (
    <>
      <PrintButton />
      {templateMap[template] ?? <ModernTemplate {...templateProps} />}
    </>
  );
}
