import { headers } from "next/headers";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/v1";

async function getPortfolioByDomain(domain: string) {
  try {
    const res = await fetch(`${API_URL}/portfolios/by-domain/${domain}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function CustomDomainPage() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const domain = host.replace("www.", "").split(":")[0];

  const domainData = await getPortfolioByDomain(domain);
  if (!domainData?.username) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <h1>Portfolio not found</h1>
        <p>No portfolio is associated with this domain.</p>
        <a href="https://www.portfolio-craft.com">Create yours →</a>
      </div>
    );
  }

  const { default: PortfolioPage } = await import("@/app/[username]/page");
  return (
    <PortfolioPage
      params={Promise.resolve({ username: domainData.username })}
    />
  );
}
