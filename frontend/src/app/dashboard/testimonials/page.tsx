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
  authorName: z.string().min(1, "Name is required"),
  authorTitle: z.string().optional(),
  authorCompany: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  rating: z.number().min(1).max(5).optional(),
});

type FormValues = z.infer<typeof schema>;

function getToken() {
  return localStorage.getItem("token") ?? "";
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "text-amber-400" : "text-gray-200"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const ready = usePortfolioGuard();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(5);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5 },
  });

  async function fetchTestimonials() {
    try {
      const res = await api.get("/portfolios/mine/testimonials");
      const data = await res.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function onSubmit(values: FormValues) {
    try {
      const url = editingId
        ? `/portfolios/mine/testimonials/${editingId}`
        : "/portfolios/mine/testimonials";
      const res = await (editingId
        ? api.patch(url, values)
        : api.post(url, values));

      if (!res.ok) throw new Error();
      toast.success(editingId ? "Testimonial updated!" : "Testimonial added!");
      reset({ rating: 5 });
      setSelectedRating(5);
      setShowForm(false);
      setEditingId(null);
      fetchTestimonials();
    } catch (err: any) {
      toast.error(err.message || "Unauthorized Login Again");
    }
  }

  async function deleteTestimonial(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await api.delete(`/portfolios/mine/testimonials/${id}`);
      toast.success("Testimonial deleted");
      fetchTestimonials();
    } catch (err: any) {
      toast.error(err.message || "Unable to connect to server");
    }
  }
  // 10359
  function startEdit(testimonial: any) {
    setEditingId(testimonial.id);
    setSelectedRating(testimonial.rating ?? 5);
    reset({
      authorName: testimonial.authorName,
      authorTitle: testimonial.authorTitle ?? "",
      authorCompany: testimonial.authorCompany ?? "",
      content: testimonial.content,
      rating: testimonial.rating ?? 5,
    });
    setShowForm(true);
  }
  if (!ready) return <LoadingSkeleton rows={3} />;
  if (loading) return <LoadingSkeleton rows={3} />;
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">
            What clients say about you
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            reset({ rating: 5 });
            setSelectedRating(5);
          }}
          className="shrink-0 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          + Add Testimonial
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            {editingId ? "Edit Testimonial" : "New Testimonial"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  {...register("authorName")}
                  placeholder="John Smith"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.authorName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.authorName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  {...register("authorTitle")}
                  placeholder="CEO"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  {...register("authorCompany")}
                  placeholder="Acme Inc."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Testimonial *
              </label>
              <textarea
                {...register("content")}
                placeholder="What did they say about your work?"
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setSelectedRating(star);
                      setValue("rating", star);
                    }}
                    className={`text-2xl transition ${star <= selectedRating ? "text-amber-400" : "text-gray-200"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
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

      {/* Testimonials List */}
      {loading ? (
        // <p className="text-gray-400 text-sm">Loading...</p>
        <LoadingSkeleton rows={3} />
      ) : testimonials.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">
            No testimonials yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white border border-gray-100 rounded-xl p-6"
            >
              {testimonial.rating && <StarRating rating={testimonial.rating} />}
              <p className="text-sm text-gray-600 mt-3 mb-4 italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {testimonial.authorName}
                  </p>
                  {(testimonial.authorTitle || testimonial.authorCompany) && (
                    <p className="text-xs text-gray-400">
                      {[testimonial.authorTitle, testimonial.authorCompany]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(testimonial)}
                    className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTestimonial(testimonial.id)}
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
