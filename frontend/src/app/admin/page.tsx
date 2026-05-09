"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
function getToken() {
  return localStorage.getItem("token") ?? "";
}

const PLANS = ["FREE", "PRO", "BUSINESS"];
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [planModal, setPlanModal] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState("PRO");
  const [selectedMonths, setSelectedMonths] = useState(1);

  useEffect(() => {
    // Check if admin
    // fetch("http://localhost:3001/v1/auth/me", {
    //   headers: { Authorization: `Bearer ${getToken()}` },
    // })
    api
      .get("/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.role !== "ADMIN") {
          toast.error("Access denied");
          router.push("/dashboard");
        }
      });

    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  async function fetchStats() {
    // const res = await fetch("http://localhost:3001/v1/admin/stats", {
    //   headers: { Authorization: `Bearer ${getToken()}` },
    // });
    const res = await api.get("/admin/stats");
    const data = await res.json();
    setStats(data);
  }

  async function fetchUsers() {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "15",
      ...(search && { search }),
    });
    // const res = await fetch(`http://localhost:3001/v1/admin/users?${params}`, {
    //   headers: { Authorization: `Bearer ${getToken()}` },
    // });
    const res = await api.get(`/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }

  async function updatePlan() {
    if (!planModal) return;
    setUpdatingId(planModal.id);
    try {
      // const res = await fetch(
      //   `http://localhost:3001/v1/admin/users/${planModal.id}/plan`,
      //   {
      //     method: "PATCH",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${getToken()}`,
      //     },
      //     body: JSON.stringify({ plan: selectedPlan, months: selectedMonths }),
      //   },
      // );
      const res = await api.patch(`/admin/users/${planModal.id}/plan`, {
        plan: selectedPlan,
        months: selectedMonths,
      });
      if (!res.ok) throw new Error();
      toast.success(
        `Plan updated to ${selectedPlan} for ${selectedMonths} month(s)`,
      );
      setPlanModal(null);
      fetchUsers();
      fetchStats();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  }

  async function verifyUser(id: string, name: string) {
    setUpdatingId(id);
    try {
      // await fetch(`http://localhost:3001/v1/admin/users/${id}/verify`, {
      //   method: "PATCH",
      //   headers: { Authorization: `Bearer ${getToken()}` },
      // });
      await api.patch(`/admin/users/${id}/verify`);
      toast.success(`${name} verified!`);
      fetchUsers();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  }

  async function suspendUser(id: string, name: string) {
    if (!confirm(`Suspend ${name}?`)) return;
    setUpdatingId(id);
    try {
      // await fetch(`http://localhost:3001/v1/admin/users/${id}/suspend`, {
      //   method: "PATCH",
      //   headers: { Authorization: `Bearer ${getToken()}` },
      // });
      await api.patch(`/admin/users/${id}/suspend`);
      toast.success(`${name} suspended`);
      fetchUsers();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteUser(id: string, name: string) {
    if (!confirm(`Delete ${name} permanently? This cannot be undone!`)) return;
    setUpdatingId(id);
    try {
      // await fetch(`http://localhost:3001/v1/admin/users/${id}`, {
      //   method: "DELETE",
      //   headers: { Authorization: `Bearer ${getToken()}` },
      // });
      await api.delete(`/admin/users/${id}`);
      toast.success(`${name} deleted`);
      fetchUsers();
      fetchStats();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  }

  const planColor = (plan: string) => {
    if (plan === "BUSINESS")
      return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
    if (plan === "PRO")
      return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
    return "bg-gray-500/20 text-gray-400 border border-gray-600";
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: stats.totalUsers },
            { label: "Portfolios", value: stats.totalPortfolios },
            { label: "Published", value: stats.publishedPortfolios },
            { label: "Messages", value: stats.totalMessages },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Plan Breakdown */}
      {stats?.planBreakdown && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-medium text-gray-400 mb-3">
            Plan Breakdown
          </h2>
          <div className="flex gap-6">
            {stats.planBreakdown.map((p: any) => (
              <div key={p.plan} className="text-center">
                <p className="text-2xl font-bold text-white">{p._count.plan}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${planColor(p.plan)}`}
                >
                  {p.plan}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between gap-4">
          <h2 className="text-white font-semibold">Users ({total})</h2>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {[
                  "User",
                  "Email",
                  "Plan",
                  "Portfolio",
                  "Status",
                  "Joined",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs text-gray-500 font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition"
                  >
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{user.name}</p>
                      {user.role === "ADMIN" && (
                        <span className="text-xs text-red-400">Admin</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${planColor(user.plan)}`}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.portfolio ? (
                        <a
                          href={`http://${SITE_URL}/${user.portfolio.username}`}
                          target="_blank"
                          className="text-indigo-400 hover:underline text-xs"
                        >
                          {user.portfolio.username}
                          {user.portfolio.published ? " 🟢" : " 🔴"}
                        </a>
                      ) : (
                        <span className="text-gray-600 text-xs">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          user.emailVerified
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setPlanModal(user);
                            setSelectedPlan(user.plan);
                            setSelectedMonths(1);
                          }}
                          disabled={updatingId === user.id}
                          className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition"
                        >
                          Plan
                        </button>
                        {!user.emailVerified && (
                          <button
                            onClick={() => verifyUser(user.id, user.name)}
                            disabled={updatingId === user.id}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => suspendUser(user.id, user.name)}
                          disabled={
                            updatingId === user.id || user.role === "ADMIN"
                          }
                          className="text-xs bg-amber-600 text-white px-2 py-1 rounded hover:bg-amber-700 transition disabled:opacity-40"
                        >
                          Suspend
                        </button>
                        <button
                          onClick={() => deleteUser(user.id, user.name)}
                          disabled={
                            updatingId === user.id || user.role === "ADMIN"
                          }
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing {Math.min((page - 1) * 15 + 1, total)}–
            {Math.min(page * 15, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded hover:bg-gray-700 transition disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * 15 >= total}
              className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded hover:bg-gray-700 transition disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Plan Modal */}
      {planModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-white font-semibold text-lg mb-1">
              Update Plan
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              {planModal.name} ·{" "}
              <span className="text-gray-500">{planModal.email}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Select Plan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PLANS.map((plan) => (
                    <button
                      key={plan}
                      onClick={() => setSelectedPlan(plan)}
                      className={`py-2.5 rounded-lg text-sm font-medium border transition ${
                        selectedPlan === plan
                          ? "bg-indigo-600 border-indigo-500 text-white"
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>

              {selectedPlan !== "FREE" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Duration
                  </label>
                  <select
                    value={selectedMonths}
                    onChange={(e) => setSelectedMonths(+e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                  >
                    {[1, 2, 3, 6, 12, 24].map((m) => (
                      <option key={m} value={m}>
                        {m} month{m > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="bg-gray-800 rounded-lg p-3 text-xs text-gray-400">
                {selectedPlan === "FREE"
                  ? "⚠️ This will downgrade the user to Free plan immediately"
                  : `✅ Grant ${selectedPlan} plan for ${selectedMonths} month(s)`}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={updatePlan}
                disabled={updatingId === planModal.id}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {updatingId === planModal.id ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setPlanModal(null)}
                className="flex-1 bg-gray-800 text-gray-300 py-2.5 rounded-lg text-sm hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
