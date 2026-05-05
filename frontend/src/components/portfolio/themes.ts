export interface Theme {
  id: string
  name: string
  plan: 'FREE' | 'PRO' | 'BUSINESS'
  preview: string
  colors: {
    primary: string
    accent: string
    background: string
    surface: string
    text: string
    textMuted: string
    border: string
    heroFrom: string
    heroTo: string
    sectionBg: string
    cardBg: string
    cardBorder: string
    buttonBg: string
    buttonText: string
    tagBg: string
    tagText: string
  }
  fonts: {
    heading: string
    body: string
  }
}

export const themes: Theme[] = [
  // ─── FREE ───
  {
    id: 'default',
    name: 'Classic',
    plan: 'FREE',
    preview: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    colors: {
      primary: '#6366f1', accent: '#8b5cf6',
      background: '#ffffff', surface: '#f9fafb',
      text: '#111827', textMuted: '#6b7280', border: '#e5e7eb',
      heroFrom: '#eef2ff', heroTo: '#ffffff',
      sectionBg: '#f9fafb', cardBg: '#ffffff', cardBorder: '#e5e7eb',
      buttonBg: '#6366f1', buttonText: '#ffffff',
      tagBg: '#f3f4f6', tagText: '#374151',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
  },

  // ─── PRO ───
  {
    id: 'midnight',
    name: 'Midnight',
    plan: 'PRO',
    preview: 'linear-gradient(135deg, #0f172a, #1e293b)',
    colors: {
      primary: '#f59e0b', accent: '#fbbf24',
      background: '#0f172a', surface: '#1e293b',
      text: '#f1f5f9', textMuted: '#94a3b8', border: '#334155',
      heroFrom: '#0f172a', heroTo: '#1e293b',
      sectionBg: '#1e293b', cardBg: '#1e293b', cardBorder: '#334155',
      buttonBg: '#f59e0b', buttonText: '#0f172a',
      tagBg: '#334155', tagText: '#cbd5e1',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
  },
  {
    id: 'forest',
    name: 'Forest',
    plan: 'PRO',
    preview: 'linear-gradient(135deg, #14532d, #166534)',
    colors: {
      primary: '#16a34a', accent: '#4ade80',
      background: '#fafaf9', surface: '#f5f5f4',
      text: '#1c1917', textMuted: '#78716c', border: '#e7e5e4',
      heroFrom: '#f0fdf4', heroTo: '#fafaf9',
      sectionBg: '#f5f5f4', cardBg: '#ffffff', cardBorder: '#e7e5e4',
      buttonBg: '#16a34a', buttonText: '#ffffff',
      tagBg: '#dcfce7', tagText: '#166534',
    },
    fonts: { heading: 'Merriweather', body: 'Source Sans Pro' },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    plan: 'PRO',
    preview: 'linear-gradient(135deg, #0c4a6e, #0369a1)',
    colors: {
      primary: '#0ea5e9', accent: '#38bdf8',
      background: '#f0f9ff', surface: '#e0f2fe',
      text: '#0c4a6e', textMuted: '#0369a1', border: '#bae6fd',
      heroFrom: '#e0f2fe', heroTo: '#f0f9ff',
      sectionBg: '#e0f2fe', cardBg: '#ffffff', cardBorder: '#bae6fd',
      buttonBg: '#0ea5e9', buttonText: '#ffffff',
      tagBg: '#dbeafe', tagText: '#1e40af',
    },
    fonts: { heading: 'Nunito', body: 'Nunito' },
  },
  {
    id: 'rose',
    name: 'Rose',
    plan: 'PRO',
    preview: 'linear-gradient(135deg, #881337, #be123c)',
    colors: {
      primary: '#e11d48', accent: '#fb7185',
      background: '#fff1f2', surface: '#ffe4e6',
      text: '#1a1a1a', textMuted: '#6b7280', border: '#fecdd3',
      heroFrom: '#ffe4e6', heroTo: '#fff1f2',
      sectionBg: '#ffe4e6', cardBg: '#ffffff', cardBorder: '#fecdd3',
      buttonBg: '#e11d48', buttonText: '#ffffff',
      tagBg: '#fce7f3', tagText: '#9d174d',
    },
    fonts: { heading: 'Cormorant Garamond', body: 'Lato' },
  },
  {
    id: 'slate',
    name: 'Slate',
    plan: 'PRO',
    preview: 'linear-gradient(135deg, #1e293b, #475569)',
    colors: {
      primary: '#64748b', accent: '#94a3b8',
      background: '#f8fafc', surface: '#f1f5f9',
      text: '#0f172a', textMuted: '#64748b', border: '#e2e8f0',
      heroFrom: '#f1f5f9', heroTo: '#f8fafc',
      sectionBg: '#f1f5f9', cardBg: '#ffffff', cardBorder: '#e2e8f0',
      buttonBg: '#0f172a', buttonText: '#ffffff',
      tagBg: '#e2e8f0', tagText: '#334155',
    },
    fonts: { heading: 'IBM Plex Sans', body: 'IBM Plex Sans' },
  },

  // ─── BUSINESS ───
  {
    id: 'sunset',
    name: 'Sunset',
    plan: 'BUSINESS',
    preview: 'linear-gradient(135deg, #7c3aed, #db2777, #ea580c)',
    colors: {
      primary: '#db2777', accent: '#7c3aed',
      background: '#0c0a09', surface: '#1c1917',
      text: '#fafaf9', textMuted: '#a8a29e', border: '#292524',
      heroFrom: '#1c0a1f', heroTo: '#0c0a09',
      sectionBg: '#1c1917', cardBg: '#1c1917', cardBorder: '#292524',
      buttonBg: '#db2777', buttonText: '#ffffff',
      tagBg: '#292524', tagText: '#d6d3d1',
    },
    fonts: { heading: 'Syne', body: 'DM Sans' },
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    plan: 'BUSINESS',
    preview: 'linear-gradient(135deg, #000000, #0ea5e9)',
    colors: {
      primary: '#0ea5e9', accent: '#38bdf8',
      background: '#000000', surface: '#0a0a0a',
      text: '#ffffff', textMuted: '#71717a', border: '#18181b',
      heroFrom: '#000000', heroTo: '#0a0a0a',
      sectionBg: '#0a0a0a', cardBg: '#111111', cardBorder: '#1f1f1f',
      buttonBg: '#0ea5e9', buttonText: '#000000',
      tagBg: '#18181b', tagText: '#a1a1aa',
    },
    fonts: { heading: 'Space Grotesk', body: 'Inter' },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    plan: 'BUSINESS',
    preview: 'linear-gradient(135deg, #065f46, #0d9488, #7c3aed)',
    colors: {
      primary: '#0d9488', accent: '#7c3aed',
      background: '#022c22', surface: '#064e3b',
      text: '#f0fdf4', textMuted: '#6ee7b7', border: '#065f46',
      heroFrom: '#022c22', heroTo: '#064e3b',
      sectionBg: '#064e3b', cardBg: '#065f46', cardBorder: '#047857',
      buttonBg: '#0d9488', buttonText: '#ffffff',
      tagBg: '#065f46', tagText: '#6ee7b7',
    },
    fonts: { heading: 'Josefin Sans', body: 'Mulish' },
  },
  {
    id: 'luxury',
    name: 'Luxury',
    plan: 'BUSINESS',
    preview: 'linear-gradient(135deg, #1a1200, #b7960c)',
    colors: {
      primary: '#d4a017', accent: '#f0c040',
      background: '#0d0d0d', surface: '#1a1a1a',
      text: '#f5f0e8', textMuted: '#a89060', border: '#2a2a2a',
      heroFrom: '#1a1200', heroTo: '#0d0d0d',
      sectionBg: '#111111', cardBg: '#1a1a1a', cardBorder: '#2a2a2a',
      buttonBg: '#d4a017', buttonText: '#0d0d0d',
      tagBg: '#2a2a1a', tagText: '#d4a017',
    },
    fonts: { heading: 'Cinzel', body: 'Raleway' },
  },
  {
    id: 'neon',
    name: 'Neon',
    plan: 'BUSINESS',
    preview: 'linear-gradient(135deg, #0a0a0a, #39ff14, #ff00ff)',
    colors: {
      primary: '#39ff14', accent: '#ff00ff',
      background: '#050505', surface: '#0f0f0f',
      text: '#ffffff', textMuted: '#888888', border: '#1a1a1a',
      heroFrom: '#050505', heroTo: '#0f0f0f',
      sectionBg: '#0a0a0a', cardBg: '#0f0f0f', cardBorder: '#1a1a1a',
      buttonBg: '#39ff14', buttonText: '#000000',
      tagBg: '#0f1a0f', tagText: '#39ff14',
    },
    fonts: { heading: 'Orbitron', body: 'Share Tech Mono' },
  },
  {
    id: 'arctic',
    name: 'Arctic',
    plan: 'BUSINESS',
    preview: 'linear-gradient(135deg, #1e3a5f, #2196f3, #e0f7fa)',
    colors: {
      primary: '#2196f3', accent: '#00bcd4',
      background: '#f5f9ff', surface: '#e8f4fd',
      text: '#0d2137', textMuted: '#546e7a', border: '#b3d4f5',
      heroFrom: '#e3f2fd', heroTo: '#f5f9ff',
      sectionBg: '#e8f4fd', cardBg: '#ffffff', cardBorder: '#b3d4f5',
      buttonBg: '#1565c0', buttonText: '#ffffff',
      tagBg: '#e3f2fd', tagText: '#1565c0',
    },
    fonts: { heading: 'Exo 2', body: 'Open Sans' },
  },
]

export function getThemeById(id: string): Theme {
  return themes.find(t => t.id === id) ?? themes[0]
}

export function getThemesByPlan(plan: string): Theme[] {
  if (plan === 'BUSINESS') return themes
  if (plan === 'PRO') return themes.filter(t => t.plan !== 'BUSINESS')
  return themes.filter(t => t.plan === 'FREE')
}