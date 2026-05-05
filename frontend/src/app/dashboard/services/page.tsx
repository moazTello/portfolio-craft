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
  price: z.string().optional(),
  iconUrl: z.string().optional(),
  featured: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

const ICONS = [
  "💻",
  "🎨",
  "📱",
  "🔧",
  "📊",
  "✍️",
  "🎯",
  "🚀",
  "💡",
  "🔐",
  "📸",
  "🎬",
  "📢",
  "🤝",
  "⚡",
];

export default function ServicesPage() {
  const ready = usePortfolioGuard();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState("💻");
  const [userPlan, setUserPlan] = useState("FREE"); // ← أضفناه

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { featured: false },
  });

  useEffect(() => {
    if (!ready) return;
    fetchServices();
    // جيب الـ plan
    api
      .get("/auth/me")
      .then((r) => r.json())
      .then((d) => setUserPlan(d.plan ?? "FREE"));
  }, [ready]);

  async function fetchServices() {
    try {
      const res = await api.get("/portfolios/mine/services");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(values: FormValues) {
    try {
      const payload = { ...values, iconUrl: selectedIcon };
      const res = await (editingId
        ? api.patch(`/portfolios/mine/services/${editingId}`, payload)
        : api.post("/portfolios/mine/services", payload));
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      toast.success(editingId ? "Service updated!" : "Service added!");
      reset();
      setSelectedIcon("💻");
      setShowForm(false);
      setEditingId(null);
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  }

  async function deleteService(id: string) {
    if (!confirm("Delete this service?")) return;
    try {
      await api.delete(`/portfolios/mine/services/${id}`);
      toast.success("Service deleted");
      fetchServices();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  function startEdit(service: any) {
    setEditingId(service.id);
    setSelectedIcon(service.iconUrl ?? "💻");
    reset({
      title: service.title,
      description: service.description ?? "",
      price: service.price ?? "",
      featured: service.featured ?? false,
    });
    setShowForm(true);
  }

  if (!ready || loading) return <LoadingSkeleton rows={3} />;

  // Free plan lock
  if (userPlan === "FREE") {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-12 text-center">
        <p className="text-4xl mb-4">🔒</p>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Services are a Pro feature
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Upgrade to Pro to add up to 5 services, or Business for unlimited.
        </p>
        <a
          href="/dashboard/settings/billing"
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          Upgrade Now →
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Services
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            What you offer to clients
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            reset();
            setSelectedIcon("💻");
          }}
          disabled={userPlan === "PRO" && services.length >= 5}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          + Add Service
        </button>
      </div>

      {/* Counter — Pro only */}
      {userPlan === "PRO" && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400">
              {services.length}/5 services used
            </p>
            {services.length >= 5 && (
              <a
                href="/dashboard/settings/billing"
                className="text-xs text-indigo-500 hover:underline"
              >
                Upgrade to Business for unlimited →
              </a>
            )}
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all"
              style={{
                width: `${Math.min((services.length / 5) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            {editingId ? "Edit Service" : "New Service"}
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
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  {...register("title")}
                  placeholder="Web Development"
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Price — Business only */}
              {userPlan === "BUSINESS" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price
                  </label>
                  <input
                    {...register("price")}
                    placeholder="From $500 / $50/hr"
                    className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-2.5">
                  <span className="text-amber-600 dark:text-amber-400 text-xs">
                    🔒 Price display is Business only
                  </span>
                  <a
                    href="/dashboard/settings/billing"
                    className="text-xs text-indigo-500 hover:underline ml-auto"
                  >
                    Upgrade →
                  </a>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Describe what you offer..."
                className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Featured — Business only */}
            {userPlan === "BUSINESS" && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  {...register("featured")}
                  className="rounded"
                />
                <label
                  htmlFor="featured"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Featured service
                </label>
              </div>
            )}

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
                    : "Add Service"}
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

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-12 text-center">
          <p className="text-4xl mb-4">🛠️</p>
          <p className="text-gray-400 text-sm">
            No services yet — add what you offer to clients
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className={`bg-white dark:bg-gray-900 border rounded-xl p-6 relative ${
                service.featured
                  ? "border-indigo-300 dark:border-indigo-700"
                  : "border-gray-100 dark:border-gray-800"
              }`}
            >
              {service.featured && (
                <span className="absolute top-3 right-3 text-xs bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                  Featured
                </span>
              )}
              <div className="text-3xl mb-3">{service.iconUrl ?? "💻"}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {service.title}
              </h3>
              {service.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {service.description}
                </p>
              )}
              {service.price && (
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4">
                  {service.price}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(service)}
                  className="text-xs border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteService(service.id)}
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
