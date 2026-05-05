"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  async function save(publish = false) {
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
      const res = await api.post("/blog", {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        published: publish,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      toast.success(publish ? "Post published!" : "Draft saved!");
      router.push("/dashboard/blog");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

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
            onClick={() => save(false)}
            disabled={saving}
            className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        {/* Title */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full text-2xl font-bold text-gray-900 dark:text-white bg-transparent focus:outline-none placeholder-gray-300"
          />
        </div>

        {/* Excerpt */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short excerpt (optional)..."
            className="w-full text-sm text-gray-500 bg-transparent focus:outline-none placeholder-gray-300"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post here... (Markdown supported)"
            rows={20}
            className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent focus:outline-none placeholder-gray-300 resize-none leading-relaxed font-mono"
          />
        </div>

        {/* Tags */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags: React, JavaScript, Web Dev (comma separated)"
            className="w-full text-sm text-gray-500 bg-transparent focus:outline-none placeholder-gray-300"
          />
        </div>
      </div>
    </div>
  );
}
