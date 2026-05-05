'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function getToken() {
  return localStorage.getItem('token') ?? ''
}

export function usePortfolioGuard() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const token = getToken()
    if (!token) { router.push('/login'); return }
    fetch('http://localhost:3001/v1/portfolios/mine', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      if (res.status === 404) {
        router.push('/dashboard')
      } else {
        setReady(true)
      }
    }).catch(() => router.push('/login'))
  }, [])
  return ready
}