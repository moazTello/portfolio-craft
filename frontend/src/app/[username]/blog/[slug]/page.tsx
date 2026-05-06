import { notFound } from "next/navigation";
import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1'
async function getPost(username: string, slug: string) {
  try {
    // const res = await fetch(
    //   `http://localhost:3001/v1/public/blog/${username}/${slug}`,
    //  { next: { revalidate: 60 } },
    // );
    const res = await fetch(
      `${API_URL}/public/blog/${username}/${slug}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const post = await getPost(username, slug);
  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link
          href={`/${username}/blog`}
          className="text-sm text-gray-400 hover:text-gray-600 transition"
        >
          ← Back to Blog
        </Link>
      </div>

      <article>
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 object-cover rounded-xl mb-8"
          />
        )}

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
          {post.publishedAt && (
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
          <span>{post.readTime} min read</span>
          {post.tags?.map((tag: string) => (
            <span
              key={tag}
              className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 leading-relaxed">
            {post.content}
          </pre>
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
        <Link
          href={`/${username}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </main>
  );
}
