"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    try {
      // const res = await fetch("http://localhost:3001/v1/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(values),
      // });
      const res = await api.post("/auth/register", values);

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // بدل localStorage وredirect
      toast.success("Account created! Please check your email to verify.");
      router.push("/login");
      // localStorage.setItem("token", data.accessToken);
      // document.cookie = `token=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
      // toast.success("Account created!");
      // router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">
        Create account
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Start building your portfolio
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            {...register("name")}
            placeholder="Jane Doe"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>
      {/* OAuth Buttons */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-400">
              or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/v1/auth/google`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/v1/auth/github`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
