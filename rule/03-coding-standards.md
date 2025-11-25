# コーディング規約

このドキュメントでは、BasketTalk Japanプロジェクトにおけるコーディング規約を定義します。

## 基本原則

1. **可読性を最優先**: 他の開発者が理解しやすいコードを書く
2. **一貫性を保つ**: プロジェクト全体で統一されたスタイルを維持
3. **型安全性**: TypeScriptの型を適切に使用する
4. **エラーハンドリング**: エラーを適切に処理する

## TypeScript

### 型定義

- **必須**: すべての関数、変数に型を明示
- **禁止**: `any` 型の使用（やむを得ない場合のみ、コメントで理由を記載）

```typescript
// ✅ 良い例
function getUser(userId: string): Promise<User | null> {
  // ...
}

// ❌ 悪い例
function getUser(userId: any): any {
  // ...
}
```

### インターフェースと型エイリアス

- インターフェースは `PascalCase`
- 型エイリアスも `PascalCase`

```typescript
// ✅ 良い例
interface User {
  id: string;
  display_name: string;
}

type ThreadType = 'match' | 'team' | 'free';
```

## ファイル命名規則

### コンポーネント

- **PascalCase**: `UserProfileView.tsx`, `ThreadCard.tsx`
- ファイル名とコンポーネント名は一致させる

### ユーティリティ関数

- **camelCase**: `utils.ts`, `firestore.ts`
- 複数単語はハイフンなし

### ページファイル

- Next.jsの規約に従う: `page.tsx`, `layout.tsx`, `error.tsx`

## インポート順序

1. React関連
2. Next.js関連
3. 外部ライブラリ
4. 内部モジュール（`@/` から始まる）
5. 型定義
6. 相対パス

```typescript
// ✅ 良い例
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/config';
import { User } from '@/types';
import './styles.css';
```

## コンポーネント構造

### 関数コンポーネント

```typescript
// ✅ 良い例
export default function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // ...
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### 命名規則

- コンポーネント名: `PascalCase`
- 変数・関数名: `camelCase`
- 定数: `UPPER_SNAKE_CASE`（真の定数のみ）

```typescript
// ✅ 良い例
const MAX_FAVORITE_TEAMS = 3;
const API_BASE_URL = 'https://api.example.com';

function getUserData() {
  const userName = 'John';
  // ...
}
```

## コメント

### 関数の説明

```typescript
/**
 * ユーザー情報を取得
 * @param userId - ユーザーID
 * @returns ユーザー情報、存在しない場合はnull
 */
export async function getUser(userId: string): Promise<User | null> {
  // ...
}
```

### 複雑なロジック

```typescript
// インデックスエラーを回避するため、whereとorderByを分離
// まず、whereのみでフィルタリング
const threadsSnapshot = await getDocs(
  query(collection(db, 'threads'), ...whereConstraints)
);
```

## エラーハンドリング

### try-catchの使用

```typescript
// ✅ 良い例
try {
  const user = await getUser(userId);
  if (!user) {
    console.warn('[getUser] User not found:', userId);
    return null;
  }
  return user;
} catch (error) {
  console.error('[getUser] Error occurred:', error);
  return null;
}
```

### エラーログ

- エラー発生時は必ずログを出力
- ログには関数名とエラー詳細を含める

```typescript
console.error('[関数名] Error occurred:', {
  errorMessage: error instanceof Error ? error.message : String(error),
  errorStack: error instanceof Error ? error.stack : undefined,
});
```

## 非同期処理

### async/awaitの使用

```typescript
// ✅ 良い例
export async function getThreads(): Promise<Thread[]> {
  const db = getDb();
  const snapshot = await getDocs(collection(db, 'threads'));
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

// ❌ 悪い例（Promiseチェーン）
export function getThreads(): Promise<Thread[]> {
  return getDocs(collection(db, 'threads')).then(snapshot => {
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  });
}
```

## JSX/TSX

### 属性の記述

```tsx
// ✅ 良い例
<button
  onClick={handleClick}
  disabled={isLoading}
  className="rounded-lg bg-orange-600 px-4 py-2"
>
  送信
</button>

// ❌ 悪い例（1行に詰め込みすぎ）
<button onClick={handleClick} disabled={isLoading} className="rounded-lg bg-orange-600 px-4 py-2">送信</button>
```

### 条件付きレンダリング

```tsx
// ✅ 良い例
{user ? (
  <UserProfile user={user} />
) : (
  <LoginForm />
)}

// または
{user && <UserProfile user={user} />}
```

## Tailwind CSS

### クラス名の順序

1. レイアウト（`flex`, `grid`, `block`）
2. サイズ（`w-`, `h-`, `p-`, `m-`）
3. 色（`bg-`, `text-`, `border-`）
4. その他（`rounded`, `shadow`, `hover:`）

```tsx
// ✅ 良い例
<div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md">
```

### 長いクラス名の改行

```tsx
// ✅ 良い例（80文字以上の場合）
<button
  className="
    flex items-center gap-2
    rounded-lg border border-gray-200
    bg-white px-4 py-2
    hover:bg-gray-50
  "
>
```

## ファイル構造

### コンポーネントファイル

```typescript
// 1. インポート
import { useState } from 'react';
import Link from 'next/link';

// 2. 型定義
interface Props {
  userId: string;
}

// 3. コンポーネント
export default function Component({ userId }: Props) {
  // 4. フック
  const [state, setState] = useState();

  // 5. 関数
  const handleClick = () => {
    // ...
  };

  // 6. レンダリング
  return (
    // JSX
  );
}
```

## 禁止事項

### ❌ やってはいけないこと

1. **`console.log`を本番コードに残さない**
   - デバッグ用のログは削除するか、`console.debug`を使用

2. **コメントアウトしたコードを残さない**
   - 不要なコードは削除（Git履歴に残る）

3. **マジックナンバーを使用しない**
   ```typescript
   // ❌ 悪い例
   if (teams.length > 3) { ... }
   
   // ✅ 良い例
   const MAX_FAVORITE_TEAMS = 3;
   if (teams.length > MAX_FAVORITE_TEAMS) { ... }
   ```

4. **長すぎる関数を作らない**
   - 50行を超える場合は分割を検討

5. **ネストが深すぎるコードを書かない**
   - 3階層以上は避ける

## コードレビューチェックリスト

コードを提出する前に、以下を確認：

- [ ] TypeScriptの型エラーがない
- [ ] ESLintのエラーがない
- [ ] コメントが適切に記述されている
- [ ] エラーハンドリングが実装されている
- [ ] 不要なコードやコメントアウトがない
- [ ] ファイル名が命名規則に従っている
- [ ] インポート順序が正しい

## 参考

- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [React公式ドキュメント](https://react.dev/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)

