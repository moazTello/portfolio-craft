"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { usePortfolioGuard } from "@/hooks/usePortfolioGuard";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  websiteUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, 200, 200);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png", 0.9));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function ClientsPage() {
  const ready = usePortfolioGuard();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
    fetchClients();
  }, [ready]);

  async function fetchClients() {
    try {
      const res = await api.get("/portfolios/mine/clients");
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await compressImage(file);
    setLogoPreview(base64);
    setLogoBase64(base64);
  }

  async function onSubmit(values: FormValues) {
    try {
      const payload = {
        ...values,
        ...(logoBase64 && { logoUrl: logoBase64 }),
      };
      const res = await (editingId
        ? api.patch(`/portfolios/mine/clients/${editingId}`, payload)
        : api.post("/portfolios/mine/clients", payload));
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      toast.success(editingId ? "Client updated!" : "Client added!");
      reset();
      setLogoPreview(null);
      setLogoBase64(null);
      setShowForm(false);
      setEditingId(null);
      fetchClients();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  }

  async function deleteClient(id: string) {
    if (!confirm("Delete this client?")) return;
    try {
      await api.delete(`/portfolios/mine/clients/${id}`);
      toast.success("Client deleted");
      fetchClients();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  function startEdit(client: any) {
    setEditingId(client.id);
    setLogoPreview(client.logoUrl ?? null);
    setLogoBase64(null);
    reset({
      name: client.name,
      websiteUrl: client.websiteUrl ?? "",
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
            Clients
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Companies and clients you've worked with
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            reset();
            setLogoPreview(null);
            setLogoBase64(null);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          + Add Client
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            {editingId ? "Edit Client" : "New Client"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Logo
              </label>
              <div className="flex items-center gap-4">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-indigo-300 transition overflow-hidden"
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt=""
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-gray-300 text-2xl">+</span>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Upload logo
                  </button>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoPreview(null);
                        setLogoBase64(null);
                      }}
                      className="block text-xs text-red-400 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG — will be resized to 200×200
                  </p>
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name *
                </label>
                <input
                  {...register("name")}
                  placeholder="Acme Corp"
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website URL
                </label>
                <input
                  {...register("websiteUrl")}
                  placeholder="https://acme.com"
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
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
                    : "Add Client"}
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

      {/* Clients Grid */}
      {clients.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-12 text-center">
          <p className="text-4xl mb-4">🤝</p>
          <p className="text-gray-400 text-sm">
            No clients yet — add companies you've worked with
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 text-center group relative"
            >
              {/* Logo */}
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                {client.logoUrl ? (
                  <img
                    src={client.logoUrl}
                    alt={client.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-2xl font-bold text-gray-400">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                {client.name}
              </p>
              {client.websiteUrl && (
                <a
                  href={client.websiteUrl}
                  target="_blank"
                  className="text-xs text-indigo-500 hover:underline"
                >
                  Visit →
                </a>
              )}

              {/* Actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 rounded-xl transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => startEdit(client)}
                  className="bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg shadow text-center"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteClient(client.id)}
                  className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg shadow"
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Public section hint */}
      <p className="text-xs text-gray-400 mt-6 text-center">
        Clients logos will appear as a scrolling strip on your public portfolio
      </p>
    </div>
  );
}
