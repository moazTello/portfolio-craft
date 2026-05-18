"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { usePortfolioGuard } from "@/hooks/usePortfolioGuard";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
const ICONS = ["🏆", "🥇", "🎖️", "🌟", "🎯", "🚀", "💡", "🔥", "⭐", "🏅"];
export default function AchievementsPage() {
  const ready = usePortfolioGuard();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState("🏆");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    if (!ready) return;
    fetchAchievements();
  }, [ready]);
  async function fetchAchievements() {
    try {
      const res = await api.get("/portfolios/mine/achievements");
      const data = await res.json();
      setAchievements(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }
  async function onSubmit(values: FormValues) {
    try {
      const payload = {
        title: values.title,
        description: values.description || undefined,
        date: values.date || undefined,
        imageUrl: selectedIcon, // ← دايماً من الـ state
      };

      const res = await (editingId
        ? api.patch(`/portfolios/mine/achievements/${editingId}`, payload)
        : api.post("/portfolios/mine/achievements", payload));

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      toast.success(editingId ? "Achievement updated!" : "Achievement added!");
      reset();
      setSelectedIcon("🏆");
      setShowForm(false);
      setEditingId(null);
      fetchAchievements();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  }
  // async function onSubmit(values: FormValues) {
  //   try {
  //     const payload = Object.fromEntries(
  //       Object.entries({ ...values, imageUrl: selectedIcon }).filter(
  //         ([_, v]) => v !== "" && v !== null && v !== undefined,
  //       ),
  //     );
  //     const res = await (editingId
  //       ? api.patch(`/portfolios/mine/achievements/${editingId}`, payload)
  //       : api.post("/portfolios/mine/achievements", payload));
  //     if (!res.ok) {
  //       const data = await res.json();
  //       throw new Error(data.message);
  //     }
  //     toast.success(editingId ? "Achievement updated!" : "Achievement added!");
  //     reset();
  //     setSelectedIcon("🏆");
  //     setShowForm(false);
  //     setEditingId(null);
  //     fetchAchievements();
  //   } catch (err: any) {
  //     toast.error(err.message || "Something went wrong");
  //   }
  // }
  async function deleteAchievement(id: string) {
    if (!confirm("Delete this achievement?")) return;
    try {
      await api.delete(`/portfolios/mine/achievements/${id}`);
      toast.success("Achievement deleted");
      fetchAchievements();
    } catch (err: any) {
      toast.error(err.message);
    }
  }
  function startEdit(achievement: any) {
    setEditingId(achievement.id);
    setSelectedIcon(achievement.imageUrl ?? "🏆"); // ← تأكد
    reset({
      title: achievement.title,
      description: achievement.description ?? "",
      date: achievement.date ? achievement.date.split("T")[0] : "",
    });
    setShowForm(true);
  }
  if (!ready || loading) return <LoadingSkeleton rows={3} />;
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Achievements
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Awards, honors and milestones
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            reset();
            setSelectedIcon("🏆");
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          + Add Achievement
        </button>
      </div>
      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            {editingId ? "Edit Achievement" : "New Achievement"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Icon Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedIcon(icon)}
                    className={`w-10 h-10 text-xl rounded-lg border-2 transition ${
                      selectedIcon === icon
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  {...register("title")}
                  placeholder="Best Developer Award"
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  {...register("date")}
                  type="date"
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Describe this achievement..."
                className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingId
                    ? "Update"
                    : "Add Achievement"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  reset();
                }}
                className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Achievements List */}
      {achievements.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-12 text-center">
          <p className="text-4xl mb-4">🏆</p>
          <p className="text-gray-400 text-sm">
            No achievements yet — add your awards and milestones
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 flex gap-4"
            >
              <div className="text-3xl shrink-0">
                {achievement.imageUrl ?? "🏆"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {achievement.title}
                  </h3>
                  {achievement.date && (
                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(achievement.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </span>
                  )}
                </div>
                {achievement.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {achievement.description}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEdit(achievement)}
                    className="text-xs border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAchievement(achievement.id)}
                    className="text-xs border border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
