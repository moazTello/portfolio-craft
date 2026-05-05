"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { usePortfolioGuard } from "@/hooks/usePortfolioGuard";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";

export default function MessagesPage() {
  const ready = usePortfolioGuard();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    if (!ready) return;
    fetchMessages();
  }, [ready]);

  async function fetchMessages() {
    try {
      const res = await api.get("/messages/mine");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function openMessage(msg: any) {
    setSelected(msg);
    if (!msg.read) {
      await api.patch(`/messages/mine/${msg.id}/read`);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)),
      );
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    try {
      await api.delete(`/messages/mine/${id}`);
      toast.success("Message deleted");
      if (selected?.id === id) setSelected(null);
      fetchMessages();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  if (!ready || loading) return <LoadingSkeleton rows={4} />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Messages
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {messages.filter((m) => !m.read).length} unread
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-12 text-center">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-400 text-sm">No messages yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Messages List */}
          <div className="md:col-span-1 space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`bg-white dark:bg-gray-900 border rounded-xl p-4 cursor-pointer transition ${
                  selected?.id === msg.id
                    ? "border-indigo-300 dark:border-indigo-700"
                    : "border-gray-100 dark:border-gray-800 hover:border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!msg.read && (
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      )}
                      <p
                        className={`text-sm truncate ${!msg.read ? "font-semibold text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                      >
                        {msg.senderName}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {msg.subject || msg.content.slice(0, 40)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Detail */}
          <div className="md:col-span-2">
            {selected ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selected.subject || "No subject"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      From:{" "}
                      <span className="text-gray-700 dark:text-gray-300">
                        {selected.senderName}
                      </span>
                      {" · "}
                      <a
                        href={`mailto:${selected.senderEmail}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {selected.senderEmail}
                      </a>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(selected.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMessage(selected.id)}
                    className="text-xs border border-red-100 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selected.content}
                  </p>
                </div>
                <div className="mt-6">
                  <a
                    href={`mailto:${selected.senderEmail}?subject=Re: ${selected.subject || ""}`}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                  >
                    Reply via Email →
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-12 text-center">
                <p className="text-gray-400 text-sm">
                  Select a message to read
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
