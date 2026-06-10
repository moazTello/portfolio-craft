import { ImageResponse } from 'next/og'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/v1";

async function getPortfolio(username: string) {
  try {
    const res = await fetch(`${API_URL}/portfolios/public/${username}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ 
  params 
}: { 
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const portfolio = await getPortfolio(username)
  
  if (!portfolio) {
    return new ImageResponse(
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#4F46E5' }}>
        <h1 style={{ color: 'white', fontSize: 60 }}>PortfolioCraft</h1>
      </div>
    )
  }

  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#4F46E5', padding: 60 }}>
      <h1 style={{ color: 'white', fontSize: 64, margin: 0 }}>{portfolio.heroTitle}</h1>
      <p style={{ color: '#E0E7FF', fontSize: 32, marginTop: 16 }}>{portfolio.heroSubtitle}</p>
    </div>,
    { ...size }
  )
}