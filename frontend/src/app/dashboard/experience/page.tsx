"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";
import { usePortfolioGuard } from "@/hooks/usePortfolioGuard";
import { api } from "@/lib/api";

const schema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function getToken() {
  return localStorage.getItem("token") ?? "";
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export default function ExperiencePage() {
  const ready = usePortfolioGuard();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { current: false },
  });

  const isCurrent = watch("current");
  async function fetchExperiences() {
    try {
      // const res = await fetch(
      //   "http://localhost:3001/v1/portfolios/mine/experiences",
      //   {
      //     headers: { Authorization: `Bearer ${getToken()}` },
      //   },
      // );
      const res = await api.get("/portfolios/mine/experiences");
      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  }
  useEffect(() => {
    fetchExperiences();
  }, []);

  async function onSubmit(values: FormValues) {
    try {
      // const url = editingId
      //   ? `http://localhost:3001/v1/portfolios/mine/experiences/${editingId}`
      //   : "http://localhost:3001/v1/portfolios/mine/experiences";
      const url = editingId
        ? `/portfolios/mine/experiences/${editingId}`
        : "/portfolios/mine/experiences";

      // const res = await fetch(url, {
      //   method: editingId ? "PATCH" : "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${getToken()}`,
      //   },
      //   body: JSON.stringify(values),
      // });
      const res = await (editingId
        ? api.patch(url, values)
        : api.post(url, values));
      if (!res.ok) throw new Error();
      toast.success(editingId ? "Experience updated!" : "Experience added!");
      reset();
      setShowForm(false);
      setEditingId(null);
      fetchExperiences();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function deleteExperience(id: string) {
    if (!confirm("Delete this experience?")) return;
    // await fetch(`http://localhost:3001/v1/portfolios/mine/experiences/${id}`, {
    //   method: "DELETE",
    //   headers: { Authorization: `Bearer ${getToken()}` },
    // });
    // toast.success("Experience deleted");
    // fetchExperiences();
    try {
      //      await fetch(`http://localhost:3001/v1/portfolios/mine/experiences/${id}`, {
      //   method: "DELETE",
      //   headers: { Authorization: `Bearer ${getToken()}` },
      // });
      await api.delete(`/portfolios/mine/experiences/${id}`);
      toast.success("Experience deleted");
      fetchExperiences();
    } catch (err: any) {
      toast.error(err.messgae);
    }
  }

  function startEdit(exp: any) {
    setEditingId(exp.id);
    reset({
      company: exp.company,
      role: exp.role,
      location: exp.location ?? "",
      startDate: exp.startDate ? exp.startDate.split("T")[0] : "",
      endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
      current: exp.current,
      description: exp.description ?? "",
    });
    setShowForm(true);
  }
  // if (!ready) return;
  if (!ready) return <LoadingSkeleton rows={3} />;
  if (loading) return <LoadingSkeleton rows={3} />;
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Experience</h1>
          <p className="text-sm text-gray-500 mt-1">Your work history</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            reset({ current: false });
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          + Add Experience
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            {editingId ? "Edit Experience" : "New Experience"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  {...register("company")}
                  placeholder="Google"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.company && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.company.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <input
                  {...register("role")}
                  placeholder="Senior Developer"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                {...register("location")}
                placeholder="San Francisco, CA"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  {...register("startDate")}
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  {...register("endDate")}
                  type="date"
                  disabled={isCurrent}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("current")}
                id="current"
                className="rounded"
              />
              <label htmlFor="current" className="text-sm text-gray-700">
                I currently work here
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                placeholder="What did you do in this role?"
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : editingId ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  reset();
                }}
                className="border border-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Experience List */}
      {loading ? (
        // <p className="text-gray-400 text-sm">Loading...</p>
        <LoadingSkeleton rows={3} />
      ) : experiences.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">
            No experience yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white border border-gray-100 rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                  <p className="text-sm text-indigo-600 mt-0.5">
                    {exp.company}
                  </p>
                  {exp.location && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {exp.location}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(exp.startDate)} —{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {exp.current && (
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                  <button
                    onClick={() => startEdit(exp)}
                    className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExperience(exp.id)}
                    className="text-xs border border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {exp.description && (
                <p className="text-sm text-gray-500 mt-3 border-t border-gray-50 pt-3">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
