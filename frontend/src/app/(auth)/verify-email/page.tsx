"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    // fetch(`http://localhost:3001/v1/auth/verify-email?token=${token}`)
    api.get(`/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          document.cookie = `token=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
          setStatus("success");
          setTimeout(() => router.push("/dashboard"), 2000);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full max-w-md text-center">
      {status === "loading" && (
        <>
          <div className="w-10 h-10 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Verifying your email...
          </h1>
        </>
      )}
      {status === "success" && (
        <>
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Email verified!
          </h1>
          <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
        </>
      )}
      {status === "error" && (
        <>
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Invalid or expired link
          </h1>
          <p className="text-gray-500 text-sm mb-4">
            Please register again or contact support.
          </p>
          <a
            href="/register"
            className="text-indigo-600 hover:underline text-sm"
          >
            Go to Register
          </a>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
