import { notFound } from "next/navigation";
import Link from "next/link";

async function getPosts(username: string) {
  try {
    const res = await fetch(
      `http://localhost:3001/v1/public/blog/${username}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const posts = await getPosts(username);

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <Link
          href={`/${username}`}
          className="text-sm text-gray-400 hover:text-gray-600 transition"
        >
          ← Back to Portfolio
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
          Blog
        </h1>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-400">No posts yet.</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post: any) => (
            <article key={post.id}>
              <Link href={`/${username}/blog/${post.slug}`} className="group">
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 transition mb-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-500 text-sm mb-3">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-400">
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
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
