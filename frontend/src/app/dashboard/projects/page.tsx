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
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  liveUrl: z.string().url("Must be valid URL").optional().or(z.literal("")),
  repoUrl: z.string().url("Must be valid URL").optional().or(z.literal("")),
  featured: z.boolean().optional(),
  // tags: z.array(z.string()).optional(),
  // tagsInput:z.string().optional(),
  tags: z.array(z.string()).optional(),
  tagsInput: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

// function getToken() {
//   return localStorage.getItem("token") ?? "";
// }

export default function ProjectsPage() {
  const ready = usePortfolioGuard();

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function fetchProjects() {
    try {
      const res = await api.get("/portfolios/mine/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  // async function onSubmit(values: FormValues) {
  //   try {
  //     const url = editingId
  //       ? `/portfolios/mine/projects/${editingId}`
  //       : "/portfolios/mine/projects";

  //     const res = await (editingId
  //       ? api.patch(url, values)
  //       : api.post(url, values));
  //     if (!res.ok) throw new Error("Failed to save");

  //     toast.success(editingId ? "Project updated!" : "Project created!");
  //     reset();
  //     setShowForm(false);
  //     setEditingId(null);
  //     fetchProjects();
  //   } catch (err: any) {
  //     toast.error(err.message);
  //   }
  // }

  async function onSubmit(values: any) {
    try {
      const tagsArray =
        values.tagsInput
          ?.split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean) || [];

      const payload = {
        ...values,
        tags: tagsArray,
      };

      delete payload.tagsInput;

      const url = editingId
        ? `/portfolios/mine/projects/${editingId}`
        : "/portfolios/mine/projects";

      const res = await (editingId
        ? api.patch(url, payload)
        : api.post(url, payload));

      if (!res.ok) throw new Error("Failed to save");

      toast.success(editingId ? "Project updated!" : "Project created!");
      reset();
      setShowForm(false);
      setEditingId(null);
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function deleteProject(id: string) {
    try {
      await api.delete(`/portfolios/mine/projects/${id}`);
      toast.success("Project deleted");
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  // async function fetchProjects() {
  //   const res = await fetch(
  //     "http://localhost:3001/v1/portfolios/mine/projects",
  //     {
  //       headers: { Authorization: `Bearer ${getToken()}` },
  //     },
  //   );
  //   const data = await res.json();
  //   setProjects(Array.isArray(data) ? data : []);
  //   setLoading(false);
  // }

  useEffect(() => {
    if (!ready) return;
    fetchProjects();
  }, [ready]);

  // async function onSubmit(values: FormValues) {
  //   try {
  //     const url = editingId
  //       ? `http://localhost:3001/v1/portfolios/mine/projects/${editingId}`
  //       : "http://localhost:3001/v1/portfolios/mine/projects";

  //     const res = await fetch(url, {
  //       method: editingId ? "PATCH" : "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //       body: JSON.stringify(values),
  //     });

  //     if (!res.ok) throw new Error();

  //     toast.success(editingId ? "Project updated!" : "Project created!");
  //     reset();
  //     setShowForm(false);
  //     setEditingId(null);
  //     fetchProjects();
  //   } catch {
  //     toast.error("Something went wrong");
  //   }
  // }

  // async function deleteProject(id: string) {
  //   if (!confirm("Delete this project?")) return;
  //   await fetch(`http://localhost:3001/v1/portfolios/mine/projects/${id}`, {
  //     method: "DELETE",
  //     headers: { Authorization: `Bearer ${getToken()}` },
  //   });
  //   toast.success("Project deleted");
  //   fetchProjects();
  // }

  // function startEdit(project: any) {
  //   setEditingId(project.id);
  //   reset({
  //     title: project.title,
  //     description: project.description ?? "",
  //     liveUrl: project.liveUrl ?? "",
  //     repoUrl: project.repoUrl ?? "",
  //     featured: project.featured,
  //   });
  //   setShowForm(true);
  // }
  function startEdit(project: any) {
    setEditingId(project.id);
    reset({
      title: project.title,
      description: project.description ?? "",
      liveUrl: project.liveUrl ?? "",
      repoUrl: project.repoUrl ?? "",
      featured: project.featured,
      tagsInput: project.tags?.join(", ") || "",
    });
    setShowForm(true);
  }
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Showcase your work</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            reset();
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          + Add Project
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            {editingId ? "Edit Project" : "New Project"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                {...register("title")}
                placeholder="My Awesome Project"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                placeholder="What does this project do?"
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                {...register("tagsInput")}
                placeholder="React, Next.js, Prisma"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Live URL
                </label>
                <input
                  {...register("liveUrl")}
                  placeholder="https://myproject.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.liveUrl && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.liveUrl.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repo URL
                </label>
                <input
                  {...register("repoUrl")}
                  placeholder="https://github.com/..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.repoUrl && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.repoUrl.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("featured")}
                id="featured"
                className="rounded"
              />
              <label htmlFor="featured" className="text-sm text-gray-700">
                Featured project
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : editingId ? "Update" : "Create"}
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

      {/* Projects List */}
      {loading ? (
        // <p className="text-gray-400 text-sm">Loading...</p>
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Projects
              </h1>
            </div>
          </div>
          <LoadingSkeleton rows={4} />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">
            No projects yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-100 rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900">{project.title}</h3>
                {project.featured && (
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              {project.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-9">
                  {project.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => startEdit(project)}
                  className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-xs border border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
