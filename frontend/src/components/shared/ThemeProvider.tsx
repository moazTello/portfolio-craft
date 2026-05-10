// 'use client'

// import { useEffect } from 'react'
// // import type { Theme } from '../portfolio/themes'
// // import type { Theme } from '@/components/portfolio/themes'
// // import type { Theme } from '../portfolio/themes'
// // import type { Theme } from './themes'
// import type { Theme } from '@/components/portfolio/themes'
// interface ThemeProviderProps {
//   theme: Theme
//   children: React.ReactNode
// }

// export function ThemeProvider({ theme, children }: ThemeProviderProps) {
//   useEffect(() => {
//       if (!theme?.colors) return  // ← أضف هذا
//     const root = document.documentElement
//     console.log(theme)
//     const c = theme?.colors
//     root.style.setProperty('--p-primary', c.primary)
//     root.style.setProperty('--p-accent', c.accent)
//     root.style.setProperty('--p-bg', c.background)
//     root.style.setProperty('--p-surface', c.surface)
//     root.style.setProperty('--p-text', c.text)
//     root.style.setProperty('--p-text-muted', c.textMuted)
//     root.style.setProperty('--p-border', c.border)
//     root.style.setProperty('--p-hero-from', c.heroFrom)
//     root.style.setProperty('--p-hero-to', c.heroTo)
//     root.style.setProperty('--p-section-bg', c.sectionBg)
//     root.style.setProperty('--p-card-bg', c.cardBg)
//     root.style.setProperty('--p-card-border', c.cardBorder)
//     root.style.setProperty('--p-btn-bg', c.buttonBg)
//     root.style.setProperty('--p-btn-text', c.buttonText)
//     root.style.setProperty('--p-tag-bg', c.tagBg)
//     root.style.setProperty('--p-tag-text', c.tagText)

//     // Load Google Fonts
//     const fonts = [theme.fonts.heading, theme.fonts.body].filter(Boolean)
//     const params = fonts.map(f => `family=${encodeURIComponent(f)}:wght@400;500;600;700`).join('&')
//     const link = document.createElement('link')
//     link.rel = 'stylesheet'
//     link.href = `https://fonts.googleapis.com/css2?${params}&display=swap`
//     document.head.appendChild(link)

//     document.body.style.background = c.background
//     document.body.style.color = c.text

//     return () => {
//       link.remove()
//       document.body.style.background = ''
//       document.body.style.color = ''
//     }
//   }, [theme])

//   return <>{children}</>
// }
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}