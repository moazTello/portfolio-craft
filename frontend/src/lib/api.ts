import { toast } from "sonner";

// const API_URL = "http://localhost:3001/v1";
// const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1'
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TIMEOUT = 8000;

function getToken() {
  return localStorage.getItem("token") ?? "";
}

let isRefreshing = false;

async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        ...options.headers,
      },
    });
    clearTimeout(timeout);
    window.dispatchEvent(new Event("server-online"));
    if (res.status === 429) {
      toast.error("Too many requests. Please slow down!");
      throw new Error("Too many requests");
    }
    if (res.status === 401) {
      // حاول تجدد الـ token
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken && !isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem("token", data.accessToken);
            isRefreshing = false;
            // أعد المحاولة بالـ token الجديد
            return fetchWithTimeout(url, options);
          }
        } catch {
          isRefreshing = false;
        }
      }
      // فشل التجديد — سجّل خروج
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      document.cookie = "token=; path=/; max-age=0";
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
    return res;
  } catch (err: any) {
    clearTimeout(timeout);
    window.dispatchEvent(new Event("server-offline"));
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection.");
    }
    throw new Error("Unable to connect to server. Please try again.");
  }
}


export const api = {
  get: (path: string) => fetchWithTimeout(`${API_URL}${path}`),
  post: (path: string, body?: any) =>
    fetchWithTimeout(`${API_URL}${path}`, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: (path: string, body?: any) =>
    fetchWithTimeout(`${API_URL}${path}`, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: (path: string) =>
    fetchWithTimeout(`${API_URL}${path}`, { method: "DELETE" }),
};
