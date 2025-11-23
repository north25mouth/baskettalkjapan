# 500 Internal Server Error デバッグガイド

## 症状

- ブラウザのコンソールに「Failed to load resource: the server responded with a status of 500 (Internal Server Error)」のみ表示
- 詳細なエラーメッセージが表示されない

## 原因の特定方法

### 1. 開発サーバーのコンソールを確認

開発サーバーを起動しているターミナルで、以下のようなログを確認してください：

```
[TeamPage] Fetching team with slug: golden-state-warriors
[getTeamBySlug] Starting with slug: golden-state-warriors
[getTeamBySlug] Database initialized
[getTeamBySlug] Query completed, found: 1 teams
```

エラーが発生している場合は、以下のようなログが表示されます：

```
[TeamPage] Error occurred: ...
[getTeamBySlug] Error occurred: ...
```

### 2. エラーページを確認

ブラウザでエラーページが表示されている場合、エラーメッセージとスタックトレースが表示されます。

### 3. Firebase設定の確認

以下のコマンドでFirebase設定を確認：

```bash
npm run check:firebase
```

### 4. 環境変数の確認

`.env.local`ファイルが存在し、すべての環境変数が設定されているか確認：

```bash
cat .env.local
```

必要な環境変数：
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## よくある原因と解決方法

### 1. Next.js 16での`params`の扱い

Next.js 16では、`params`がPromiseとして渡される場合があります。

**解決方法:**
```typescript
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ...
}
```

または、現在の実装のように直接アクセス：
```typescript
export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  // ...
}
```

### 2. Firebase初期化エラー

サーバー側でFirebaseが正しく初期化されていない可能性があります。

**確認方法:**
```bash
npm run check:firebase
```

**解決方法:**
- `.env.local`ファイルを確認
- 開発サーバーを再起動
- `.next`ディレクトリを削除して再ビルド

### 3. Firestoreクエリエラー

インデックスが必要なクエリを実行している可能性があります。

**解決方法:**
- エラーメッセージに表示されたリンクからインデックスを作成
- `docs/FIRESTORE_INDEX_SETUP.md`を参照

### 4. データ型の不一致

Firestoreから取得したデータの型が期待と異なる可能性があります。

**確認方法:**
- Firestore Consoleでデータ構造を確認
- `types/index.ts`の型定義を確認

## デバッグ手順

### ステップ1: 開発サーバーのログを確認

1. 開発サーバーを起動しているターミナルを確認
2. エラーが発生した際のログを確認
3. `[TeamPage]`や`[getTeamBySlug]`で始まるログを探す

### ステップ2: エラーページを確認

1. ブラウザでエラーページが表示されているか確認
2. エラーメッセージとスタックトレースを確認
3. 開発環境では詳細な情報が表示されます

### ステップ3: Firebase設定を確認

```bash
npm run check:firebase
```

### ステップ4: ビルドキャッシュをクリア

```bash
rm -rf .next
npm run dev
```

### ステップ5: 環境変数を再確認

```bash
cat .env.local
```

## ログの追加

エラーの詳細を確認するために、以下のようなログが追加されています：

```typescript
console.log('[TeamPage] Fetching team with slug:', slug);
console.log('[getTeamBySlug] Starting with slug:', slug);
console.error('[TeamPage] Error occurred:', error);
```

これらのログは開発サーバーのコンソールに表示されます。

## エラーハンドリングの改善

以下の改善を行いました：

1. **エラーページコンポーネント（error.tsx）**
   - エラーメッセージとスタックトレースを表示
   - 開発環境では詳細な情報を表示

2. **詳細なログ**
   - 各関数の開始と終了をログに記録
   - エラー発生時の詳細な情報をログに記録

3. **エラーの再スロー**
   - エラーを適切にキャッチして、エラーページで表示

## 次のステップ

1. 開発サーバーのコンソールでエラーログを確認
2. エラーページでエラーメッセージを確認
3. 上記の解決方法を試す
4. 問題が解決しない場合は、エラーログの全文を保存して報告

