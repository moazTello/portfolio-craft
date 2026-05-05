export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3" />
    </div>
  )
}

export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
}