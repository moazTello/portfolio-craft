'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="cursor-pointer p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-300"
      title="Toggle dark mode"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}