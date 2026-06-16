"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePortfolioGuard } from "@/hooks/usePortfolioGuard";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";
import { api } from "@/lib/api";
function getToken() {
  return localStorage.getItem("token") ?? "";
}
// const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.portfolio-craft.com"
).replace(/\/$/, "");
export default function DashboardPage() {
  // const ready = usePortfolioGuard();
  // if (!ready) return <LoadingSkeleton rows={4} />;
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [hasPortfolio, setHasPortfolio] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ views: 0, clicks: 0, projects: 0 });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    // fetch("http://localhost:3001/v1/auth/me", {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    api
      .get("/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((userData) => {
        setUser(userData);
        // Check if portfolio exists
        return api.get("/portfolios/mine");
      })
      .then((res) => {
        if (res.status === 404) {
          setHasPortfolio(false);
          return null;
        }
        return res.json();
      })
      .then((portfolioData) => {
        if (!portfolioData) return;
        setPortfolio(portfolioData);
        setHasPortfolio(true);

        // Fetch stats
        return Promise.all([
          // fetch("http://localhost:3001/v1/analytics/mine/summary", {
          //   headers: { Authorization: `Bearer ${getToken()}` },
          // }).then((r) => (r.ok ? r.json() : null)),
          api
            .get("/analytics/mine/summary")
            .then((r) => (r.ok ? r.json() : null)),
          api
            .get("/portfolios/mine/projects")
            .then((r) => (r.ok ? r.json() : [])),
        ]).then(([summaryData, projectsData]) => {
          setStats({
            views: summaryData?.totalViews ?? 0,
            clicks: summaryData?.totalClicks ?? 0,
            projects: Array.isArray(projectsData) ? projectsData.length : 0,
          });
        });
      })
      .catch(() => {
        router.push("/login");
      });
  }, []);

  async function createPortfolio() {
    setCreating(true);
    try {
      // const res = await fetch("http://localhost:3001/v1/portfolios", {
      //   method: "POST",
      //   headers: { Authorization: `Bearer ${getToken()}` },
      // });
      const res = await api.post("/portfolios");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPortfolio(data);
      setHasPortfolio(true);
    } catch {
      alert("Something went wrong");
    } finally {
      setCreating(false);
    }
  }

  if (!user || hasPortfolio === null) {
    return <LoadingSkeleton rows={3} />;
  }

  // No portfolio yet
  if (!hasPortfolio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-6xl mb-6">🚀</div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Welcome, {user.name}!
        </h1>
        <p className="text-gray-500 mb-8 max-w-md">
          You don't have a portfolio yet. Create one now and start showcasing
          your work!
        </p>
        <button
          onClick={createPortfolio}
          disabled={creating}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {creating ? "Creating..." : "✨ Create My Portfolio"}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome back, {user.name} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's what's happening with your portfolio
        </p>
      </div>

      {/* Portfolio URL */}
      {portfolio && (
        <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-indigo-500 mb-0.5">Your portfolio URL</p>
            <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              {SITE_URL}/{portfolio.username}
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={`${SITE_URL}/${portfolio.username}`}
              target="_blank"
              className="text-xs bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-700 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
            >
              View →
            </a>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <p className="text-xs text-gray-500 mb-1">Portfolio Views</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.views}
          </p>
          <p className="text-xs text-gray-400 mt-1">All time</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <p className="text-xs text-gray-500 mb-1">Contact Clicks</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.clicks}
          </p>
          <p className="text-xs text-gray-400 mt-1">All time</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <p className="text-xs text-gray-500 mb-1">Projects</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.projects}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {stats.projects === 0 ? "Add your first" : "Published"}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {portfolio?.published ? "🟢" : "🔴"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {portfolio?.published ? "Published" : "Unpublished"}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              label: "Edit Portfolio",
              href: "/dashboard/portfolio",
              desc: "Update your info",
            },
            {
              label: "Add Project",
              href: "/dashboard/projects",
              desc: "Showcase your work",
            },
            {
              label: "Add Skills",
              href: "/dashboard/skills",
              desc: "Highlight expertise",
            },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="border border-gray-100 dark:border-gray-800 rounded-lg p-4 hover:border-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors group"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600">
                {action.label}
              </p>
              <p className="text-xs text-gray-400 mt-1">{action.desc}</p>
            </a>
          ))}
        </div>
      </div>
      {/* Welcome Video */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-base font-medium text-gray-900 dark:text-white mb-1">
          🎬 Getting Started
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Watch this quick video to set up your portfolio in minutes
        </p>
        <div
          className="relative rounded-xl overflow-hidden"
          style={{ paddingBottom: "56.25%" }}
        >
          <iframe
            src="https://www.youtube.com/embed/H_fnXrvrxh0?start=26"
            title="PortfolioCraft Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
