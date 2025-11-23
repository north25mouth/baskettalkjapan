# API取得指示書

スレッド詳細ページで必要なデータの取得方法

## 1. スレッド情報の取得

### 関数
```typescript
import { getThread } from '@/lib/firebase/firestore';

const thread = await getThread(threadId);
```

### 戻り値
```typescript
Thread | null
```

### 使用例
```typescript
const thread = await getThread(threadId);
if (!thread) {
  // スレッドが存在しない場合の処理
  return notFound();
}
```

### エラーハンドリング
- スレッドが存在しない場合: `null` を返す
- エラーの場合: 例外をスロー

---

## 2. 投稿一覧の取得

### 関数
```typescript
import { getPostsByThread } from '@/lib/firebase/firestore';

const posts = await getPostsByThread(threadId);
```

### 戻り値
```typescript
Post[]
```

### 使用例
```typescript
const posts = await getPostsByThread(threadId);
// 投稿は時系列（古い順）で返される
```

### 注意事項
- 削除された投稿（`deleted_flag: true`）は除外される
- 投稿は `created_at` の昇順で返される

---

## 3. ユーザー情報の取得

### 関数
```typescript
import { getUser } from '@/lib/firebase/firestore';

const user = await getUser(userId);
```

### 戻り値
```typescript
User | null
```

### 使用例
```typescript
// 投稿の作成者情報を取得
const author = await getUser(post.author_id);
if (author) {
  // 作成者情報を使用
}
```

### パフォーマンス考慮
- 複数のユーザー情報を取得する場合、`Promise.all` を使用
```typescript
const userIds = posts.map(post => post.author_id);
const uniqueUserIds = [...new Set(userIds)];
const users = await Promise.all(
  uniqueUserIds.map(id => getUser(id))
);
```

---

## 4. いいね情報の取得

### 現在のユーザーがいいね済みか確認
```typescript
import { isLiked } from '@/lib/firebase/firestore';

const liked = await isLiked(currentUserId, postId);
```

### 戻り値
```typescript
boolean
```

### 使用例
```typescript
// 各投稿について、現在のユーザーがいいね済みか確認
const postLikes = await Promise.all(
  posts.map(post => isLiked(currentUserId, post.id))
);
```

### パフォーマンス考慮
- 複数の投稿について確認する場合、バッチ処理を検討
- クライアント側でキャッシュすることを推奨

---

## 5. 試合情報の取得（試合スレッドの場合）

### 関数
```typescript
import { getMatch } from '@/lib/firebase/firestore';

const match = await getMatch(thread.match_id!);
```

### 戻り値
```typescript
Match | null
```

### 使用例
```typescript
if (thread.type === 'match' && thread.match_id) {
  const match = await getMatch(thread.match_id);
  if (match) {
    // 試合情報を表示
  }
}
```

---

## 6. チーム情報の取得（チーム掲示板の場合）

### 関数
```typescript
import { getTeam } from '@/lib/firebase/firestore';

const team = await getTeam(thread.team_id!);
```

### 戻り値
```typescript
Team | null
```

### 使用例
```typescript
if (thread.type === 'team' && thread.team_id) {
  const team = await getTeam(thread.team_id);
  if (team) {
    // チーム情報を表示
  }
}
```

---

## 7. データ取得の最適化

### 複数のデータを並列取得
```typescript
// スレッド、投稿、試合情報を並列取得
const [thread, posts, match] = await Promise.all([
  getThread(threadId),
  getPostsByThread(threadId),
  thread?.match_id ? getMatch(thread.match_id) : Promise.resolve(null)
]);
```

### ユーザー情報のバッチ取得
```typescript
// 投稿の作成者IDを取得
const authorIds = [...new Set(posts.map(post => post.author_id))];

// 並列でユーザー情報を取得
const authors = await Promise.all(
  authorIds.map(id => getUser(id))
);

// ユーザーIDをキーにしたマップを作成
const authorMap = new Map(
  authors.filter(Boolean).map(user => [user.id, user])
);

// 投稿に作成者情報を追加
const postsWithAuthors = posts.map(post => ({
  ...post,
  author: authorMap.get(post.author_id)
}));
```

---

## 8. エラーハンドリング

### 基本的なエラーハンドリング
```typescript
try {
  const thread = await getThread(threadId);
  if (!thread) {
    return notFound(); // Next.jsのnotFound関数
  }
} catch (error) {
  console.error('スレッドの取得に失敗しました:', error);
  // エラーページを表示
  throw error;
}
```

### リトライ機能（オプション）
```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(fn, retries - 1);
    }
    throw error;
  }
}
```

---

## 9. キャッシュ戦略

### サーバーコンポーネントでのキャッシュ
```typescript
// Next.jsのキャッシュを使用
import { cache } from 'react';

export const getCachedThread = cache(async (threadId: string) => {
  return await getThread(threadId);
});
```

### クライアント側でのキャッシュ
```typescript
// React QueryやSWRを使用する場合
import useSWR from 'swr';

const { data: thread, error } = useSWR(
  threadId ? `thread-${threadId}` : null,
  () => getThread(threadId)
);
```

---

## 10. 実装例（完全版）

```typescript
import { getThread, getPostsByThread, getUser, getMatch, getTeam } from '@/lib/firebase/firestore';
import { notFound } from 'next/navigation';

export default async function ThreadDetailPage({ params }: { params: { id: string } }) {
  const threadId = params.id;

  try {
    // スレッドと投稿を並列取得
    const [thread, posts] = await Promise.all([
      getThread(threadId),
      getPostsByThread(threadId)
    ]);

    if (!thread) {
      return notFound();
    }

    // 作成者IDを取得
    const authorIds = new Set([
      thread.author_id,
      ...posts.map(post => post.author_id)
    ]);

    // ユーザー情報を並列取得
    const authors = await Promise.all(
      Array.from(authorIds).map(id => getUser(id))
    );

    // ユーザーマップを作成
    const authorMap = new Map(
      authors.filter(Boolean).map(user => [user!.id, user!])
    );

    // 試合情報またはチーム情報を取得
    let match = null;
    let team = null;

    if (thread.type === 'match' && thread.match_id) {
      match = await getMatch(thread.match_id);
    } else if (thread.type === 'team' && thread.team_id) {
      team = await getTeam(thread.team_id);
    }

    return (
      <ThreadDetailView
        thread={thread}
        posts={posts}
        authorMap={authorMap}
        match={match}
        team={team}
      />
    );
  } catch (error) {
    console.error('データの取得に失敗しました:', error);
    throw error;
  }
}
```

---

## 注意事項

1. **パフォーマンス**: 可能な限り並列取得（`Promise.all`）を使用
2. **エラーハンドリング**: 必ずエラーハンドリングを実装
3. **nullチェック**: データが存在しない場合の処理を忘れずに
4. **型安全性**: TypeScriptの型を正しく使用
5. **キャッシュ**: 適切なキャッシュ戦略を検討

