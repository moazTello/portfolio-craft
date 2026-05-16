"use client";

import { useEffect, useState } from "react";
import { usePortfolioGuard } from "@/hooks/usePortfolioGuard";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";
import { api } from "@/lib/api";
// import { toast } from "sonner";

// function getToken() {
//   return localStorage.getItem("token") ?? "";
// }

function SimpleChart({ data }: { data: { date: string; views: number }[] }) {
  const max = Math.max(...data.map(d => d.views), 1)

  return (
    <div className="relative">
      <div className="flex items-end gap-1" style={{ height: '160px' }}>
        {data.map(day => (
          <div
            key={day.date}
            className="flex-1 flex flex-col items-center justify-end group relative"
            style={{ height: '100%' }}
          >
            {/* Bar */}
            <div
              className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-sm transition-all cursor-pointer"
              style={{
                height: day.views > 0 ? `${Math.max((day.views / max) * 100, 2)}%` : '2px',
                opacity: day.views > 0 ? 1 : 0.15,
                minHeight: day.views > 0 ? '4px' : '2px',
              }}
            />
            {/* Tooltip */}
            {day.views > 0 && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none">
                {day.date}: {day.views} views
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Max label */}
      <div className="absolute top-0 left-0 text-xs text-gray-400">{max}</div>
    </div>
  )
}
export default function AnalyticsPage() {
  const ready = usePortfolioGuard();
  // if (!ready) return <LoadingSkeleton rows={4} />;
  const [summary, setSummary] = useState<any>(null);
  const [timeseries, setTimeseries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!ready) return

  Promise.all([
    api.get('/analytics/mine/summary').then(res => res.json()),
    api.get('/analytics/mine/timeseries').then(res => res.json()),
  ]).then(([summaryData, timeseriesData]) => {
    setSummary(summaryData)
    setTimeseries(Array.isArray(timeseriesData) ? timeseriesData : [])
    setLoading(false)
    console.log('Timeseries:', timeseriesData) // ← أضف هذا
  })
}, [ready])
  // if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;
  if (!ready) return <LoadingSkeleton rows={3} />;
  if (loading) return <LoadingSkeleton rows={3} />;
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your portfolio performance
        </p>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Total Views</p>
          <p className="text-3xl font-semibold text-gray-900">
            {summary?.totalViews ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">All time</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Last 30 Days</p>
          <p className="text-3xl font-semibold text-gray-900">
            {summary?.recentViews ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">Page views</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Contact Clicks</p>
          <p className="text-3xl font-semibold text-gray-900">
            {summary?.totalClicks ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">All time</p>
        </div>
      </div>
      {/* Chart */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-base font-medium text-gray-900">
            Views — Last 30 Days
          </h2>
          <span className="text-xs text-gray-400">Hover for details</span>
        </div>
        {timeseries.length > 0 ? (
          <>
            <SimpleChart data={timeseries} />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-400 hidden sm:inline">
                {timeseries[0]?.date}
              </span>
              <span className="text-xs text-gray-400 hidden sm:inline">
                {timeseries[timeseries.length - 1]?.date}
              </span>
            </div>
          </>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <p className="text-gray-400 text-sm">No data yet</p>
          </div>
        )}
      </div>
      {/* Top Sections */}
      {summary?.topSections?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            Top Sections
          </h2>
          <div className="space-y-3">
            {summary.topSections.map((section: any) => (
              <div
                key={section.section}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-700 capitalize">
                  {section.section}
                </span>
                <span className="text-sm min-h-20 font-medium text-indigo-600">
                  {section._count.section} views
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Empty state */}
      {summary?.totalViews === 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mt-6">
          <h3 className="text-sm font-medium text-indigo-900 mb-1">
            No visits yet
          </h3>
          <p className="text-xs text-indigo-600">
            Share your portfolio link to start getting views tracked
            automatically.
          </p>
        </div>
      )}
    </div>
  );
}
