"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";
import { usePortfolioGuard } from "@/hooks/usePortfolioGuard";
import { api } from "@/lib/api";
import { ExportPdfButton } from "@/components/dashboard/ExportPdfButton";
import { themes, getThemesByPlan } from "@/components/portfolio/themes";
import { pdfTemplates } from "@/components/portfolio/pdf-templates";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const schema = z.object({
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  aboutText: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  github: z.string().url("Must be valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Must be valid URL").optional().or(z.literal("")),
  twitter: z.string().url("Must be valid URL").optional().or(z.literal("")),
  website: z.string().url("Must be valid URL").optional().or(z.literal("")),
  seoTitle: z.string().optional(),
  seoDescription: z.string().max(160).optional(),
  themePreset: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// function getToken() {
//   return localStorage.getItem("token") ?? "";
// }

export default function EditPortfolioPage() {
  const ready = usePortfolioGuard();
  // if (!ready) return <LoadingSkeleton rows={4} />;
  const [plan, setPlan] = useState("FREE");
  const [loading, setLoading] = useState(true);
  const [published, setPublished] = useState(false);
  const [username, setUsername] = useState("");
  const [userPlan, setUserPlan] = useState("FREE");
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [themeChanged, setThemeChanged] = useState(false);
  const [selectedPdfTemplate, setSelectedPdfTemplate] = useState("modern");
  const [pdfTemplateChanged, setPdfTemplateChanged] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!ready) return;
    // fetch("http://localhost:3001/v1/portfolios/mine", {
    //   headers: { Authorization: `Bearer ${getToken()}` },
    // })
    api
      .get("/portfolios/mine")
      .then((res) => res.json())
      .then((data) => {
        setPublished(data.published);
        setUsername(data.username);
        reset({
          heroTitle: data.heroTitle ?? "",
          heroSubtitle: data.heroSubtitle ?? "",
          aboutText: data.aboutText ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          location: data.location ?? "",
          github: data.github ?? "",
          linkedin: data.linkedin ?? "",
          twitter: data.twitter ?? "",
          website: data.website ?? "",
        });
        setSelectedTheme(data.themePreset ?? "default");
        setSelectedPdfTemplate(data.pdfTemplate ?? "modern");
        setLoading(false);
      });
    api
      .get("/auth/me")
      .then((res) => res.json())
      .then((data) => setPlan(data.plan ?? "FREE"));
    api
      .get("/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setUserPlan(d.plan ?? "FREE");
      });
  }, [ready]);

  async function onSubmit(values: FormValues) {
    try {
      // احذف الـ fields الفاضية
      const payload = Object.fromEntries(
        Object.entries({
          ...values,
          themePreset: selectedTheme,
          pdfTemplate: selectedPdfTemplate,
        }).filter(([_, v]) => v !== "" && v !== null && v !== undefined),
      );

      console.log("Sending:", JSON.stringify(payload));

      const res = await api.patch("/portfolios/mine", payload);
      if (!res.ok) throw new Error();
      setThemeChanged(false);
      setPdfTemplateChanged(false);
      toast.success("Portfolio updated!");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  // async function togglePublish() {
  //   try {
  //     const endpoint = published ? "unpublish" : "publish";
  //     // const res = await fetch(
  //     //   `http://localhost:3001/v1/portfolios/mine/${endpoint}`,
  //     //   {
  //     //     method: "POST",
  //     //     headers: { Authorization: `Bearer ${getToken()}` },
  //     //   },
  //     // );
  //     const res = await api.post(`/portfolios/mine/${endpoint}`);
  //     if (res.ok) {
  //       setPublished(!published);
  //       toast.success(
  //         published ? "Portfolio unpublished" : "Portfolio published!",
  //       );
  //     }
  //   } catch (err: any) {
  //     toast.error(err.message);
  //   }
  // }
  async function togglePublish() {
  const endpoint = published ? "unpublish" : "publish";
  try {
    const res = await api.post(`/portfolios/mine/${endpoint}`);
    console.log('Status:', res.status, 'OK:', res.ok)
    if (res.ok) {
      setPublished(!published);
      toast.success(published ? "Portfolio unpublished" : "Portfolio published!");
    } else {
      const data = await res.json()
      console.log('Error data:', data)
      toast.error('Failed to update')
    }
  } catch (err: any) {
    console.log('Catch error:', err)
    toast.error(err.message);
  }
}
  // if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;
  // if (loading)
  //   return (
  //     <div>
  //       <LoadingSkeleton rows={4} />
  //     </div>
  //   );
  if (!ready || loading) return <LoadingSkeleton rows={4} />;
  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Edit Portfolio
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Public URL:{" "}
            <a
              href={`${SITE_URL}/${username}`}
              target="_blank"
              className="text-indigo-600 hover:underline"
            >
              {SITE_URL}/{username}
            </a>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportPdfButton plan={plan} />
          <button
            onClick={togglePublish}
            className={`px-4 cursor-pointer py-2 rounded-lg text-sm font-medium transition ${
              published
                ? "bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-600 border border-green-200 hover:border-red-200"
                : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200"
            }`}
          >
            {published ? "● Published" : "○ Unpublished"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hero */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            Hero Section
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name / Title
              </label>
              <input
                {...register("heroTitle")}
                placeholder="Jane Doe"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle / Role
              </label>
              <input
                {...register("heroSubtitle")}
                placeholder="Full Stack Developer"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">About Me</h2>
          <textarea
            {...register("aboutText")}
            placeholder="Tell visitors about yourself..."
            rows={5}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Contact */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            Contact Info
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  {...register("email")}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  {...register("phone")}
                  placeholder="+1 234 567 890"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            Social Links
          </h2>
          <div className="space-y-4">
            {[
              {
                name: "github",
                label: "GitHub",
                placeholder: "https://github.com/username",
              },
              {
                name: "linkedin",
                label: "LinkedIn",
                placeholder: "https://linkedin.com/in/username",
              },
              {
                name: "twitter",
                label: "Twitter / X",
                placeholder: "https://twitter.com/username",
              },
              {
                name: "website",
                label: "Website",
                placeholder: "https://mywebsite.com",
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  {...register(field.name as keyof FormValues)}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors[field.name as keyof FormValues] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field.name as keyof FormValues]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-1">
            Theme
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Choose your portfolio style
          </p>
          <div className="grid grid-cols-5 gap-3">
            {themes.map((theme) => {
              const available =
                theme.plan === "FREE" ||
                (theme.plan === "PRO" &&
                  ["PRO", "BUSINESS"].includes(userPlan)) ||
                (theme.plan === "BUSINESS" && userPlan === "BUSINESS");
              return (
                <div key={theme.id} className="relative">
                  <button
                    type="button"
                    // onClick={() => available && setSelectedTheme(theme.id)}
                    onClick={() => {
                      if (available) {
                        setSelectedTheme(theme.id);
                        setThemeChanged(true);
                      }
                    }}
                    disabled={!available}
                    className={`w-full rounded-xl overflow-hidden border-2 transition ${
                      selectedTheme === theme.id
                        ? "border-indigo-500 scale-105"
                        : "border-transparent hover:border-gray-300"
                    } ${!available ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {/* Preview */}
                    <div
                      style={{ background: theme.preview, height: "60px" }}
                    />
                    <div className="bg-white dark:bg-gray-800 px-2 py-1.5">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        {theme.name}
                      </p>
                      <p
                        className={`text-xs ${
                          theme.plan === "BUSINESS"
                            ? "text-purple-500"
                            : theme.plan === "PRO"
                              ? "text-blue-500"
                              : "text-gray-400"
                        }`}
                      >
                        {theme.plan}
                      </p>
                    </div>
                  </button>
                  {!available && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs bg-gray-900/80 text-white px-2 py-0.5 rounded-full">
                        🔒
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 mb-1">
            SEO Settings
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            How your portfolio appears in search engines
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Title
              </label>
              <input
                {...register("seoTitle")}
                placeholder="Jane Doe — Full Stack Developer"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Description
              </label>
              <textarea
                {...register("seoDescription")}
                placeholder="Full Stack Developer specializing in React and Node.js..."
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Max 160 characters for best results
              </p>
            </div>
          </div>
        </div>

        {/* CV Template — Business only */}
        {userPlan === "BUSINESS" && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-base font-medium text-gray-900 dark:text-white mb-1">
              CV Template
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Choose your PDF export style — Business plan only
            </p>
            <div className="grid grid-cols-5 gap-3">
              {pdfTemplates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    setSelectedPdfTemplate(tmpl.id);
                    setPdfTemplateChanged(true);
                  }}
                  className={`rounded-xl overflow-hidden border-2 transition text-left ${
                    selectedPdfTemplate === tmpl.id
                      ? "border-indigo-500 scale-105 shadow-md"
                      : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {/* Preview gradient */}
                  <div style={{ background: tmpl.preview, height: "56px" }} />
                  {/* Info */}
                  <div className="bg-gray-50 dark:bg-gray-800 px-2 py-2">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {tmpl.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">
                      {tmpl.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Preview Links */}
            <div className="flex flex-wrap gap-3 mt-4">
              {pdfTemplates.map((tmpl) => (
                <a
                  key={tmpl.id}
                  href={`${SITE_URL}/${username}/print/${tmpl.id}`}
                  target="_blank"
                  className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                    selectedPdfTemplate === tmpl.id
                      ? "border-indigo-300 text-indigo-600 bg-indigo-50 dark:bg-indigo-950"
                      : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-indigo-200 hover:text-indigo-500"
                  }`}
                >
                  Preview {tmpl.name} →
                </a>
              ))}
            </div>
          </div>
        )}
        {/* Save Button */}
        <div className="flex gap-3 pb-8">
          <button
            type="submit"
            // disabled={isSubmitting || !isDirty}
            disabled={
              isSubmitting || (!isDirty && !themeChanged && !pdfTemplateChanged)
            }
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          {(isDirty || themeChanged || pdfTemplateChanged) && (
            <p className="text-xs text-amber-500 self-center">
              You have unsaved changes
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
