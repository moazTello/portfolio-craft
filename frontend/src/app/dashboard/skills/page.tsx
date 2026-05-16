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
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  proficiency: z.number().min(0).max(100),
});

type FormValues = z.infer<typeof schema>;

const categories = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Design",
  "Other",
];

// function getToken() {
//   return localStorage.getItem("token") ?? "";
// }

export default function SkillsPage() {
  const ready = usePortfolioGuard();
  // if (!ready) return <LoadingSkeleton rows={4} />;
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { proficiency: 80 },
  });

  const proficiency = watch("proficiency");
  async function fetchSkills() {
    // const res = await fetch("http://localhost:3001/v1/portfolios/mine/skills", {
    //   headers: { Authorization: `Bearer ${getToken()}` },
    // });
    try {
      const res = await api.get("/portfolios/mine/skills");
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  }
  useEffect(() => {
    fetchSkills();
  }, []);

  async function onSubmit(values: FormValues) {
    try {
      // const url = editingId
      //   ? `http://localhost:3001/v1/portfolios/mine/skills/${editingId}`
      //   : "http://localhost:3001/v1/portfolios/mine/skills";
      const url = editingId
        ? `/portfolios/mine/skills/${editingId}`
        : "/portfolios/mine/skills";
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

      toast.success(editingId ? "Skill updated!" : "Skill added!");
      reset({ proficiency: 80 });
      setShowForm(false);
      setEditingId(null);
      fetchSkills();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function deleteSkill(id: string) {
    if (!confirm("Delete this skill?")) return;
    // await fetch(`http://localhost:3001/v1/portfolios/mine/skills/${id}`, {
    //   method: "DELETE",
    //   headers: { Authorization: `Bearer ${getToken()}` },
    // });
    try {
      await api.delete(`/portfolios/mine/skills/${id}`);
      toast.success("Skill deleted");
      fetchSkills();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  function startEdit(skill: any) {
    setEditingId(skill.id);
    reset({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
    });
    setShowForm(true);
  }

  // Group skills by category
  const grouped = skills.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
  if (!ready) return <LoadingSkeleton rows={3} />;
  if (loading) return <LoadingSkeleton rows={3} />;
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Skills</h1>
          <p className="text-sm text-gray-500 mt-1">Highlight your expertise</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            reset({ proficiency: 80 });
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          + Add Skill
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            {editingId ? "Edit Skill" : "New Skill"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Form grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="skillName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Skill Name *
                </label>
                <input
                  id="skillName"
                  {...register("name")}
                  placeholder="e.g. React, Python, Figma"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="skillCategory"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category *
                </label>
                <select
                  id="skillCategory"
                  {...register("category")}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="proficiency"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Proficiency —{" "}
                <span className="text-indigo-600 font-semibold">
                  {proficiency}%
                </span>
              </label>
              <input
                id="proficiency"
                type="range"
                min={0}
                max={100}
                {...register("proficiency", { valueAsNumber: true })}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingId
                    ? "Update"
                    : "Add Skill"}
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

      {/* Skills List */}
      {loading ? (
        // <p className="text-gray-400 text-sm">Loading...</p>
        <LoadingSkeleton rows={3} />
      ) : skills.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">
            No skills yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]: any) => (
            <div
              key={category}
              className="bg-white border border-gray-100 rounded-xl p-6"
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                {category}
              </h3>
              <div className="space-y-3">
                {items.map((skill: any) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2 sm:gap-4"
                  >
                    <span className="text-sm text-gray-700 w-24 sm:w-32 shrink-0 truncate">
                      {skill.name}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right shrink-0">
                      {skill.proficiency}%
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(skill)}
                        className="text-xs text-gray-400 hover:text-indigo-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSkill(skill.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
