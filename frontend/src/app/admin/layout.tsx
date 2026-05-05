import { redirect } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Admin Topbar */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-red-500 text-sm font-bold bg-red-500/10 px-2 py-0.5 rounded">ADMIN</span>
          <span className="text-white font-semibold">PortfolioCraft</span>
        </div>
        <a href="/dashboard" className="text-gray-400 hover:text-white text-sm transition">
          ← Back to Dashboard
        </a>
      </div>
      <main className="p-6">{children}</main>
    </div>
  )
}