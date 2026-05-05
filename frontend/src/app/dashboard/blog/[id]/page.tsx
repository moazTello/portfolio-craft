"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  useEffect(() => {
    api
      .get(`/blog/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.title ?? "");
        setContent(data.content ?? "");
        setExcerpt(data.excerpt ?? "");
        setTags(data.tags?.join(", ") ?? "");
        setPublished(data.published ?? false);
      })
      .catch(() => toast.error("Post not found"))
      .finally(() => setLoading(false));
  }, [id]);
  async function save(publish?: boolean) {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }
    setSaving(true);
    try {
      const res = await api.patch(`/blog/${id}`, {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        published: publish ?? published,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      toast.success("Post updated!");
      router.push("/dashboard/blog");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }
  if (loading) return <LoadingSkeleton rows={4} />;
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/dashboard/blog")}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
        >
          ← Back
        </button>
        <div className="flex gap-2">
          <span className="text-xs text-gray-400 self-center">
            {wordCount} words · {readTime} min read
          </span>
          <button
            onClick={() => save()}
            disabled={saving}
            className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {!published && (
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Publish
            </button>
          )}
          {published && (
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition disabled:opacity-50"
            >
              Unpublish
            </button>
          )}
        </div>
      </div>
      {/* Status */}
      <div
        className={`text-xs px-3 py-1.5 rounded-lg mb-4 inline-block ${
          published
            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
            : "bg-gray-100 text-gray-500 dark:bg-gray-800"
        }`}
      >
        {published ? "● Published" : "○ Draft"}
      </div>
      {/* Editor */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full text-2xl font-bold text-gray-900 dark:text-white bg-transparent focus:outline-none placeholder-gray-300"
          />
        </div>
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short excerpt (optional)..."
            className="w-full text-sm text-gray-500 bg-transparent focus:outline-none placeholder-gray-300"
          />
        </div>
        <div className="p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post here... (Markdown supported)"
            rows={20}
            className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent focus:outline-none placeholder-gray-300 resize-none leading-relaxed font-mono"
          />
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags: React, JavaScript (comma separated)"
            className="w-full text-sm text-gray-500 bg-transparent focus:outline-none placeholder-gray-300"
          />
        </div>
      </div>
    </div>
  );
}
