import { getPost } from '@/lib/wordpress/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    return {
      title: '記事が見つかりません',
    };
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const excerpt = post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160);

  return {
    title: post.title.rendered,
    description: excerpt,
    openGraph: {
      title: post.title.rendered,
      description: excerpt,
      images: featuredImage ? [featuredImage.source_url] : [],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    return notFound();
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.author?.[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const tags = post._embedded?.['wp:term']?.[1] || [];

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ナビゲーション */}
        <div className="mb-4">
          <Link
            href="/articles"
            className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400"
          >
            ← 記事一覧に戻る
          </Link>
        </div>

        {/* タイトル */}
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          {post.title.rendered}
        </h1>

        {/* メタ情報 */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {author && <span>著者: {author.name}</span>}
          <span>公開日: {new Date(post.date).toLocaleDateString('ja-JP')}</span>
          {post.modified !== post.date && (
            <span>更新日: {new Date(post.modified).toLocaleDateString('ja-JP')}</span>
          )}
        </div>

        {/* カテゴリー・タグ */}
        {(categories.length > 0 || tags.length > 0) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/articles?category=${cat.id}`}
                className="rounded bg-orange-100 px-3 py-1 text-sm text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800"
              >
                {cat.name}
              </Link>
            ))}
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* アイキャッチ画像 */}
        {featuredImage && (
          <div className="mb-8">
            <Image
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || post.title.rendered}
              width={1200}
              height={630}
              className="rounded-lg"
              priority
            />
          </div>
        )}

        {/* 本文 */}
        <div
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-orange-600 dark:prose-a:text-orange-400"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </article>
    </div>
  );
}



