import { getPosts, getCategories } from '@/lib/wordpress/api';
import Link from 'next/link';
import { Suspense } from 'react';

async function ArticlesList({ categoryId }: { categoryId?: number }) {
  const [posts, categories] = await Promise.all([
    getPosts({ 
      per_page: 10,
      categories: categoryId ? [categoryId] : undefined,
    }),
    getCategories(),
  ]);

  return (
    <>
      {/* カテゴリーフィルター */}
      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/articles"
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              !categoryId
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            すべて
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/articles?category=${category.id}`}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                categoryId === category.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {category.name} ({category.count})
            </Link>
          ))}
        </div>
      )}

      {/* 記事一覧 */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => {
            const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
            const author = post._embedded?.author?.[0];
            const categories = post._embedded?.['wp:term']?.[0] || [];
            const tags = post._embedded?.['wp:term']?.[1] || [];

            return (
              <article
                key={post.id}
                className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                {featuredImage && (
                  <div className="mb-4">
                    <img
                      src={featuredImage.source_url}
                      alt={featuredImage.alt_text || post.title.rendered}
                      className="h-64 w-full rounded-lg object-cover"
                    />
                  </div>
                )}

                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  <Link href={`/articles/${post.slug}`}>
                    {post.title.rendered}
                  </Link>
                </h2>

                <div
                  className="mb-4 text-gray-700 dark:text-gray-300"
                  dangerouslySetInnerHTML={{
                    __html: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 200) + '...',
                  }}
                />

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {author && <span>著者: {author.name}</span>}
                  <span>{new Date(post.date).toLocaleDateString('ja-JP')}</span>
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="rounded bg-orange-100 px-2 py-0.5 text-xs text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <Link
                    href={`/articles/${post.slug}`}
                    className="text-orange-600 hover:text-orange-700 dark:text-orange-400"
                  >
                    続きを読む →
                  </Link>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-400">
              記事がありません。
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const categoryId = params.category ? parseInt(params.category, 10) : undefined;

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
          記事一覧
        </h1>

        <Suspense fallback={<div>読み込み中...</div>}>
          <ArticlesList categoryId={categoryId} />
        </Suspense>
      </div>
    </div>
  );
}



