// WordPress REST API統合

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
  if (!WORDPRESS_API_URL) {
    console.warn('[WordPress API] API URL is not configured');
    return [];
  }

  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.categories) queryParams.append('categories', params.categories.join(','));
  if (params?.tags) queryParams.append('tags', params.tags.join(','));
  if (params?.search) queryParams.append('search', params.search);
  
  // _embedパラメータで関連データも取得
  queryParams.append('_embed', 'true');
  
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/posts?${queryParams.toString()}`,
      {
        next: { revalidate: 1800 }, // 30分キャッシュ
      }
    );
    
    if (!response.ok) {
      console.error(`[WordPress API] Error: ${response.status} ${response.statusText}`);
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error('[WordPress API] Error fetching posts:', error);
    return [];
  }
}

/**
 * 記事を取得（スラッグまたはID）
 */
export async function getPost(slugOrId: string | number): Promise<WordPressPost | null> {
  if (!WORDPRESS_API_URL) {
    console.warn('[WordPress API] API URL is not configured');
    return null;
  }

  const endpoint = typeof slugOrId === 'number'
    ? `${WORDPRESS_API_URL}/wp-json/wp/v2/posts/${slugOrId}`
    : `${WORDPRESS_API_URL}/wp-json/wp/v2/posts?slug=${slugOrId}`;
  
  try {
    const response = await fetch(`${endpoint}&_embed=true`, {
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error('[WordPress API] Error fetching post:', error);
    return null;
  }
}

/**
 * カテゴリー一覧を取得
 */
export async function getCategories(): Promise<WordPressCategory[]> {
  if (!WORDPRESS_API_URL) {
    console.warn('[WordPress API] API URL is not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/categories?per_page=100`,
      {
        next: { revalidate: 3600 }, // 1時間キャッシュ
      }
    );
    
    if (!response.ok) {
      console.error(`[WordPress API] Error: ${response.status} ${response.statusText}`);
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error('[WordPress API] Error fetching categories:', error);
    return [];
  }
}

/**
 * タグ一覧を取得
 */
export async function getTags(): Promise<WordPressTag[]> {
  if (!WORDPRESS_API_URL) {
    console.warn('[WordPress API] API URL is not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/tags?per_page=100`,
      {
        next: { revalidate: 3600 }, // 1時間キャッシュ
      }
    );
    
    if (!response.ok) {
      console.error(`[WordPress API] Error: ${response.status} ${response.statusText}`);
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error('[WordPress API] Error fetching tags:', error);
    return [];
  }
}



