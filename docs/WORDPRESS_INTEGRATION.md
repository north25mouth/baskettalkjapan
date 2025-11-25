# WordPress統合ガイド

## 概要

記事をWordPressで管理し、コミュニティ機能はNext.jsで提供するハイブリッド構成

## 構成

```
┌─────────────────────────────────────┐
│   WordPress (有料サーバー)          │
│   - 記事管理                         │
│   - SEO最適化                        │
│   - コンテンツ管理                   │
└──────────────┬──────────────────────┘
               │ WordPress REST API
               ↓
┌─────────────────────────────────────┐
│   Next.js App (Vercel/有料サーバー) │
│   - コミュニティ機能                 │
│   - スレッド・投稿                   │
│   - 認証・ユーザー管理               │
│   - WordPress記事の表示              │
└─────────────────────────────────────┘
```

## メリット

### SEO面
- ✅ WordPressのSEOプラグイン（Yoast SEO、Rank Mathなど）が利用可能
- ✅ 記事の構造化データが自動生成
- ✅ サイトマップの自動生成
- ✅ メタタグの管理が容易

### 運用面
- ✅ 非技術者でも記事を管理可能
- ✅ リッチエディタ（Gutenberg）でコンテンツ作成
- ✅ メディアライブラリの管理
- ✅ カテゴリー・タグの管理

### 技術面
- ✅ WordPress REST APIで簡単に統合
- ✅ 記事のキャッシュが容易
- ✅ 既存のWordPressエコシステムを活用

## 実装方針

### 1. WordPress側の設定

#### 必要なプラグイン
- **WordPress REST API**（標準機能、有効化のみ）
- **JWT Authentication for WP REST API**（認証が必要な場合）
- **Yoast SEO** または **Rank Math**（SEO最適化）

#### パーマリンク設定
```
設定 > パーマリンク設定
推奨: /%postname%/
```

#### CORS設定（必要に応じて）
`.htaccess`またはプラグインで設定：

```apache
# .htaccess
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
</IfModule>
```

### 2. Next.js側の実装

#### WordPress REST APIクライアント

`lib/wordpress/api.ts`を作成：

```typescript
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';

export interface WordPressPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
  };
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

/**
 * 記事一覧を取得
 */
export async function getPosts(params?: {
  page?: number;
  per_page?: number;
  categories?: number[];
  tags?: number[];
  search?: string;
}): Promise<WordPressPost[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.categories) queryParams.append('categories', params.categories.join(','));
  if (params?.tags) queryParams.append('tags', params.tags.join(','));
  if (params?.search) queryParams.append('search', params.search);
  
  // _embedパラメータで関連データも取得
  queryParams.append('_embed', 'true');
  
  const response = await fetch(
    `${WORDPRESS_API_URL}/wp-json/wp/v2/posts?${queryParams.toString()}`
  );
  
  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`);
  }
  
  return response.json();
}

/**
 * 記事を取得（スラッグまたはID）
 */
export async function getPost(slugOrId: string | number): Promise<WordPressPost | null> {
  const endpoint = typeof slugOrId === 'number'
    ? `${WORDPRESS_API_URL}/wp-json/wp/v2/posts/${slugOrId}`
    : `${WORDPRESS_API_URL}/wp-json/wp/v2/posts?slug=${slugOrId}`;
  
  const response = await fetch(`${endpoint}&_embed=true`);
  
  if (!response.ok) {
    return null;
  }
  
  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}

/**
 * カテゴリー一覧を取得
 */
export async function getCategories(): Promise<WordPressCategory[]> {
  const response = await fetch(
    `${WORDPRESS_API_URL}/wp-json/wp/v2/categories?per_page=100`
  );
  
  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`);
  }
  
  return response.json();
}

/**
 * タグ一覧を取得
 */
export async function getTags(): Promise<WordPressTag[]> {
  const response = await fetch(
    `${WORDPRESS_API_URL}/wp-json/wp/v2/tags?per_page=100`
  );
  
  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`);
  }
  
  return response.json();
}
```

#### 記事一覧ページ

`app/articles/page.tsx`を作成：

```typescript
import { getPosts, getCategories } from '@/lib/wordpress/api';
import Link from 'next/link';

export default async function ArticlesPage() {
  const [posts, categories] = await Promise.all([
    getPosts({ per_page: 10 }),
    getCategories(),
  ]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
          記事一覧
        </h1>

        {/* カテゴリーフィルター */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/articles?category=${category.id}`}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {category.name} ({category.count})
            </Link>
          ))}
        </div>

        {/* 記事一覧 */}
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                <Link href={`/articles/${post.slug}`}>
                  {post.title.rendered}
                </Link>
              </h2>
              
              <div
                className="mb-4 text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {post._embedded?.author?.[0]?.name || 'Unknown'} •{' '}
                  {new Date(post.date).toLocaleDateString('ja-JP')}
                </div>
                <Link
                  href={`/articles/${post.slug}`}
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-400"
                >
                  続きを読む →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### 記事詳細ページ

`app/articles/[slug]/page.tsx`を作成：

```typescript
import { getPost } from '@/lib/wordpress/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';

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

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* タイトル */}
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          {post.title.rendered}
        </h1>

        {/* メタ情報 */}
        <div className="mb-6 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {author && <span>著者: {author.name}</span>}
          <span>公開日: {new Date(post.date).toLocaleDateString('ja-JP')}</span>
          {post.modified !== post.date && (
            <span>更新日: {new Date(post.modified).toLocaleDateString('ja-JP')}</span>
          )}
        </div>

        {/* アイキャッチ画像 */}
        {featuredImage && (
          <div className="mb-8">
            <Image
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || post.title.rendered}
              width={1200}
              height={630}
              className="rounded-lg"
            />
          </div>
        )}

        {/* 本文 */}
        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </article>
    </div>
  );
}
```

### 3. 環境変数の設定

`.env.local`に追加：

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com
```

### 4. SEO最適化

#### メタデータの設定

`app/articles/[slug]/page.tsx`に追加：

```typescript
import type { Metadata } from 'next';

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

  return {
    title: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
    openGraph: {
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160),
      images: featuredImage ? [featuredImage.source_url] : [],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
    },
  };
}
```

## デプロイメント構成

### 推奨構成

```
WordPress (有料サーバー)
  ├─ ドメイン: articles.yourdomain.com
  └─ 記事管理・SEO最適化

Next.js App (Vercel/有料サーバー)
  ├─ ドメイン: yourdomain.com
  ├─ コミュニティ機能
  └─ WordPress記事の表示
```

### サブドメイン構成

- `yourdomain.com` → Next.js（コミュニティ）
- `articles.yourdomain.com` → WordPress（記事）

または

- `yourdomain.com` → Next.js（統合サイト）
- `yourdomain.com/articles` → WordPress記事（Next.js経由）

## キャッシュ戦略

### ISR (Incremental Static Regeneration)

```typescript
// app/articles/[slug]/page.tsx
export const revalidate = 3600; // 1時間ごとに再生成
```

### 記事一覧のキャッシュ

```typescript
// app/articles/page.tsx
export const revalidate = 1800; // 30分ごとに再生成
```

## メリット・デメリット

### メリット
- ✅ SEO最適化が容易（WordPressプラグイン）
- ✅ 非技術者でも記事管理可能
- ✅ リッチエディタでコンテンツ作成
- ✅ 既存のWordPressエコシステムを活用

### デメリット
- ❌ 2つのシステムを管理する必要がある
- ❌ WordPressとNext.jsのデプロイが別々
- ❌ データの同期が必要（REST API経由）

## まとめ

**WordPressで記事を管理するのは良い判断です。**

- SEO最適化が容易
- コンテンツ管理が簡単
- 既存のWordPressエコシステムを活用

Next.jsアプリからWordPress REST APIで記事を取得し、表示する構成が最適です。



