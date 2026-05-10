"use client";

import { useEffect, useState } from "react";

export function ServerStatus() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    // Listen for custom offline event
    const handler = () => setOffline(true);
    const onlineHandler = () => setOffline(false);

    window.addEventListener("server-offline", handler);
    window.addEventListener("server-online", onlineHandler);
    return () => {
      window.removeEventListener("server-offline", handler);
      window.removeEventListener("server-online", onlineHandler);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm">
      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      <span>Server is unreachable. Please check your connection.</span>
      <button
        onClick={() => setOffline(false)}
        className="text-red-400 hover:text-red-600 ml-2"
      >
        ✕
      </button>
    </div>
  );
}
