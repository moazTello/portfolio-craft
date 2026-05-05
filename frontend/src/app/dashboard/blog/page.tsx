"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { usePortfolioGuard } from "@/hooks/usePortfolioGuard";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";

export default function BlogPage() {
  const ready = usePortfolioGuard();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    fetchPosts();
  }, [ready]);

  async function fetchPosts() {
    try {
      const res = await api.get("/blog");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/blog/${id}`);
      toast.success("Post deleted");
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function togglePublish(post: any) {
    try {
      await api.patch(`/blog/${post.id}`, { published: !post.published });
      toast.success(post.published ? "Post unpublished" : "Post published!");
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  if (!ready || loading) return <LoadingSkeleton rows={4} />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Blog
          </h1>
          <p className="text-sm text-gray-500 mt-1">{posts.length} posts</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/blog/new")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          + New Post
        </button>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-12 text-center">
          <p className="text-4xl mb-4">✍️</p>
          <p className="text-gray-400 text-sm">
            No posts yet — write your first article
          </p>
          <button
            onClick={() => router.push("/dashboard/blog/new")}
            className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            Write First Post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {post.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      post.published
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                {post.excerpt && (
                  <p className="text-sm text-gray-400 truncate">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">
                    {post.readTime} min read
                  </span>
                  {post.tags?.length > 0 && (
                    <div className="flex gap-1">
                      {post.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => togglePublish(post)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                    post.published
                      ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                      : "border-green-200 text-green-600 hover:bg-green-50"
                  }`}
                >
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => router.push(`/dashboard/blog/${post.id}`)}
                  className="text-xs border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post.id)}
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
