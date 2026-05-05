'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const refresh = searchParams.get('refresh')

    if (!token) {
      router.push('/login?error=oauth_failed')
      return
    }

    // احفظ في localStorage
    localStorage.setItem('token', token)
    if (refresh) localStorage.setItem('refreshToken', refresh)

    // احفظ في cookie عشان الـ middleware يشوفه
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`

    setTimeout(() => {
      router.push('/dashboard')
    }, 300)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Signing you in...</p>
      </div>
    </div>
  )
}