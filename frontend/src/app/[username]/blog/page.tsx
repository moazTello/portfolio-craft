import { notFound } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/v1";

async function getPosts(username: string) {
  try {
    const res = await fetch(`${API_URL}/public/blog/${username}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getPortfolioPlan(username: string) {
  try {
    const res = await fetch(`${API_URL}/portfolios/public/${username}`, {
      cache: "no-store",
    });
    if (!res.ok) return "FREE";
    const data = await res.json();
    return data.user?.plan ?? "FREE";
  } catch {
    return "FREE";
  }
}

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const plan = await getPortfolioPlan(username);
  const isPro = plan === "PRO" || plan === "BUSINESS";
  if (!isPro) notFound();

  const posts = await getPosts(username);

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="mb-10">
        <Link
          href={`/${username}`}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          ← Back to Portfolio
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-4">
          Blog
        </h1>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">✍️</p>
          <p className="text-gray-400 text-sm">No posts yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {posts.map((post: any) => (
            <article
              key={post.id}
              className="border-b border-gray-100 dark:border-gray-800 pb-10 last:border-0"
            >
              <Link
                href={`/${username}/blog/${post.slug}`}
                className="group block"
              >
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 md:h-56 object-cover rounded-2xl mb-5"
                  />
                )}
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 transition mb-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-gray-400">
                  {post.publishedAt && (
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  <span>·</span>
                  <span>{post.readTime} min read</span>
                  {post.tags?.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full"
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
