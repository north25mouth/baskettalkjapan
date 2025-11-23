# エラーハンドリングガイド

## 概要

このドキュメントでは、Next.js App RouterとFirebaseを使用したアプリケーションでのエラーハンドリングのベストプラクティスを説明します。

## サーバーコンポーネントでのエラーハンドリング

### 基本的なパターン

```typescript
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  try {
    const data = await fetchData(params.id);
    
    if (!data) {
      return notFound();
    }
    
    return <div>{/* コンテンツ */}</div>;
  } catch (error) {
    console.error('Error:', error);
    // エラーを再スローすると、error.tsxが表示される
    throw error;
  }
}
```

### エラーページコンポーネント

各ページディレクトリに`error.tsx`を作成：

```typescript
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div>
      <h2>エラーが発生しました</h2>
      <button onClick={reset}>再試行</button>
    </div>
  );
}
```

## Firebase関連のエラーハンドリング

### Firestoreクエリエラー

```typescript
import { getFirebaseDb } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function getTeamBySlug(slug: string) {
  try {
    const db = getFirebaseDb();
    const teamsSnapshot = await getDocs(
      query(
        collection(db, 'teams'),
        where('slug', '==', slug),
        limit(1)
      )
    );

    if (teamsSnapshot.empty) {
      return null;
    }

    return teamsSnapshot.docs[0].data();
  } catch (error) {
    console.error('[getTeamBySlug] Error:', error);
    // エラーの詳細をログに記録
    console.error('[getTeamBySlug] Error details:', {
      slug,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
```

### Firebase初期化エラー

```typescript
function getDb() {
  try {
    if (typeof window !== 'undefined') {
      // クライアント側
      const { db } = require('./config');
      if (!db) {
        throw new Error('Firebase db is not initialized on client side');
      }
      return db;
    } else {
      // サーバー側
      return getFirebaseDb();
    }
  } catch (error) {
    console.error('[getDb] Error:', error);
    throw error;
  }
}
```

## 型安全性とnullチェック

### データ取得時のnullチェック

```typescript
export async function getTeam(teamId: string): Promise<Team | null> {
  try {
    const db = getDb();
    const teamDoc = await getDoc(doc(db, 'teams', teamId));
    
    if (!teamDoc.exists()) {
      return null;
    }
    
    const data = teamDoc.data();
    
    // 必須フィールドのチェック
    if (!data.name || !data.abbreviation) {
      console.error('Invalid team data:', data);
      return null;
    }
    
    return {
      ...data,
      id: teamDoc.id,
      created_at: timestampToDate(data.created_at),
    } as Team;
  } catch (error) {
    console.error('[getTeam] Error:', error);
    throw error;
  }
}
```

### パラメータの検証

```typescript
export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // パラメータの検証
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    console.error('Invalid slug:', slug);
    return notFound();
  }

  // 処理を続行
}
```

## エラーログのベストプラクティス

### 構造化されたログ

```typescript
console.log('[FunctionName] Starting with params:', params);
console.log('[FunctionName] Data retrieved:', { id: data.id, name: data.name });
console.error('[FunctionName] Error:', {
  errorMessage: error instanceof Error ? error.message : String(error),
  errorStack: error instanceof Error ? error.stack : undefined,
  context: { /* 関連するコンテキスト情報 */ },
});
```

### エラーの分類

```typescript
enum ErrorType {
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
}

function handleError(error: unknown, type: ErrorType) {
  console.error(`[${type}]`, error);
  // エラータイプに応じた処理
}
```

## リトライ機能

### 基本的なリトライ

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(fn, retries - 1, delay);
    }
    throw error;
  }
}
```

### 指数バックオフ

```typescript
async function fetchWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let delay = 1000;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // 指数バックオフ
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

## エラーハンドリングのチェックリスト

- [ ] すべての非同期処理にtry-catchを実装
- [ ] nullチェックを実装
- [ ] パラメータの検証を実装
- [ ] エラーログを構造化
- [ ] エラーページコンポーネント（error.tsx）を作成
- [ ] ユーザーフレンドリーなエラーメッセージを表示
- [ ] 開発環境では詳細なエラー情報を表示
- [ ] 本番環境では機密情報を隠す

## 参考資料

- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Firebase Error Handling](https://firebase.google.com/docs/reference/js/firebase.firestore.FirestoreError)
- [TypeScript Error Handling](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#unknown-on-catch-clause-bindings)

