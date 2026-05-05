'use client'

import { useState } from 'react'
import { toast } from 'sonner'

function getToken() {
  return localStorage.getItem('token') ?? ''
}

export function ExportPdfButton({ plan }: { plan: string }) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    if (plan !== 'BUSINESS') {
      toast.error('PDF export is available on Business plan only. Upgrade to Business!')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:3001/v1/export/pdf', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
      }

      // Download the PDF
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'portfolio.pdf'
      a.click()
      URL.revokeObjectURL(url)

      toast.success('PDF exported successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
        plan === 'BUSINESS'
          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
      } disabled:opacity-50`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Generating...
        </>
      ) : (
        <>
          📄 Export PDF
          {plan !== 'BUSINESS' && (
            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
              Business
            </span>
          )}
        </>
      )}
    </button>
  )
}