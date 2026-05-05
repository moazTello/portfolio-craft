export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero skeleton */}
      <div className="py-24 px-6 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-3xl mx-auto text-center animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl w-64 mx-auto mb-4" />
          <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-lg w-48 mx-auto mb-6" />
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-96 mx-auto mb-2" />
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-80 mx-auto" />
          <div className="flex justify-center gap-4 mt-8">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-10 w-28 bg-indigo-200 dark:bg-indigo-900 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Projects skeleton */}
      <div className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-2" />
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-24 mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}