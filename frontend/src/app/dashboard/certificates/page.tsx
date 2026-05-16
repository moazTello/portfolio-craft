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
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialUrl: z
    .string()
    .url("Must be valid URL")
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

// function getToken() {
//   return localStorage.getItem("token") ?? "";
// }

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export default function CertificatesPage() {
  const ready = usePortfolioGuard();
  // if (!ready) return <LoadingSkeleton rows={4} />;
  const [certificates, setCertificates] = useState<any[]>([]);
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

  async function fetchCertificates() {
    try {
      const res = await api.get("/portfolios/mine/certificates");
      const data = await res.json();
      setCertificates(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchCertificates();
  }, []);

  async function onSubmit(values: FormValues) {
    try {
      // const url = editingId
      //   ? `http://localhost:3001/v1/portfolios/mine/certificates/${editingId}`
      //   : "http://localhost:3001/v1/portfolios/mine/certificates";
      const url = editingId
        ? `/portfolios/mine/certificates/${editingId}`
        : "/portfolios/mine/certificates";
      // const res = await fetch(url, {
      //   method: editingId ? "PATCH" : "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${getToken()}`,
      //   },
      //   body: JSON.stringify(values),
      // });
      // const res = editingId ?await api.patch(url,values): await api.post(url,values);
      const res = await (editingId
        ? api.patch(url, values)
        : api.post(url, values));
      if (!res.ok) throw new Error();
      toast.success(editingId ? "Certificate updated!" : "Certificate added!");
      reset();
      setShowForm(false);
      setEditingId(null);
      fetchCertificates();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCertificate(id: string) {
    try {
      if (!confirm("Delete this certificate?")) return;
      // await fetch(`http://localhost:3001/v1/portfolios/mine/certificates/${id}`, {
      //   method: "DELETE",
      //   headers: { Authorization: `Bearer ${getToken()}` },
      // });
      await api.delete(`/portfolios/mine/certificates/${id}`);
      toast.success("Certificate deleted");
      fetchCertificates();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(cert: any) {
    setEditingId(cert.id);
    reset({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate ? cert.issueDate.split("T")[0] : "",
      expiryDate: cert.expiryDate ? cert.expiryDate.split("T")[0] : "",
      credentialUrl: cert.credentialUrl ?? "",
    });
    setShowForm(true);
  }
  if (!ready) return <LoadingSkeleton rows={3} />;
  if (loading) return <LoadingSkeleton rows={3} />;
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Certificates</h1>
          <p className="text-sm text-gray-500 mt-1">
            Your certifications and achievements
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            reset();
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          + Add Certificate
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            {editingId ? "Edit Certificate" : "New Certificate"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="certTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title *
                </label>
                <input
                  id="certTitle"
                  {...register("title")}
                  placeholder="AWS Solutions Architect"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="certIssuer"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Issuer *
                </label>
                <input
                  id="certIssuer"
                  {...register("issuer")}
                  placeholder="Amazon Web Services"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.issuer && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.issuer.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="issueDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Issue Date
                </label>
                <input
                  id="issueDate"
                  {...register("issueDate")}
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Expiry Date
                </label>
                <input
                  id="expiryDate"
                  {...register("expiryDate")}
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="credentialUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Credential URL
              </label>
              <input
                id="credentialUrl"
                {...register("credentialUrl")}
                placeholder="https://www.credential.net/..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.credentialUrl && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.credentialUrl.message}
                </p>
              )}
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

      {/* Certificates List */}
      {loading ? (
        // <p className="text-gray-400 text-sm">Loading...</p>
        <LoadingSkeleton rows={3} />
      ) : certificates.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">
            No certificates yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white border border-gray-100 rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{cert.title}</h3>
                  <p className="text-sm text-indigo-600 mt-0.5">
                    {cert.issuer}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(cert.issueDate)}
                    {cert.expiryDate && ` — ${formatDate(cert.expiryDate)}`}
                  </p>
                </div>
                <span className="text-lg">🏆</span>
              </div>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  className="text-xs text-indigo-500 hover:underline mt-2 block"
                >
                  View Credential →
                </a>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => startEdit(cert)}
                  className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCertificate(cert.id)}
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
