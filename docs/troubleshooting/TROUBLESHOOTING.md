# トラブルシューティングガイド

## 500 Internal Server Error

### 症状

- ブラウザのコンソールに「Failed to load resource: the server responded with a status of 500 (Internal Server Error)」のみ表示
- 詳細なエラーメッセージが表示されない

### 原因の特定方法

#### 1. 開発サーバーのコンソールを確認

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

#### 2. エラーページを確認

ブラウザでエラーページが表示されている場合、エラーメッセージとスタックトレースが表示されます。

#### 3. Firebase設定の確認

以下のコマンドでFirebase設定を確認：

```bash
npm run check:firebase
```

#### 4. 環境変数の確認

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

### よくある原因と解決方法

#### 1. Firebase初期化エラー

**症状:**
- 500エラーが発生
- コンソールに「Firebase db is not initialized」エラー

**解決方法:**
1. `.env.local`ファイルを確認
   ```bash
   cat .env.local
   ```
2. すべての環境変数が正しく設定されているか確認
3. 開発サーバーを再起動
   ```bash
   # 開発サーバーを停止（Ctrl+C）
   rm -rf .next
   npm run dev
   ```

#### 2. Next.js 16での`params`の扱い

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

#### 3. Firestoreクエリエラー

**症状:**
- 500エラーが発生
- コンソールに「The query requires an index」エラー

**解決方法:**
1. エラーメッセージに表示されたリンクをクリック
2. Firebase Consoleでインデックスを作成
3. 詳細は `docs/FIRESTORE_INDEX_SETUP.md` を参照

#### 4. データ型の不一致

Firestoreから取得したデータの型が期待と異なる可能性があります。

**確認方法:**
- Firestore Consoleでデータ構造を確認
- `types/index.ts`の型定義を確認

#### 5. パラメータの取得エラー

**症状:**
- 500エラーが発生
- コンソールに「params is undefined」エラー

**解決方法:**
1. Next.jsのバージョンを確認
   ```bash
   npm list next
   ```
2. 動的ルートのパラメータ名を確認
   - ディレクトリ名: `[slug]` → パラメータ名: `slug`
   - ディレクトリ名: `[id]` → パラメータ名: `id`

3. パラメータの型定義を確認
   ```typescript
   interface PageProps {
     params: {
       slug: string; // または id: string
     };
   }
   ```

#### 6. サーバーコンポーネントでのクライアントAPI使用

**症状:**
- 500エラーが発生
- コンソールに「window is not defined」エラー

**解決方法:**
1. サーバーコンポーネントでは`window`や`document`を使用しない
2. クライアント側の処理が必要な場合は`'use client'`ディレクティブを使用

### エラーログの確認方法

#### 開発サーバーのコンソール
```bash
# 開発サーバーを起動
npm run dev

# ターミナルにエラーメッセージが表示されます
```

#### ブラウザのコンソール
1. ブラウザでF12キーを押す
2. 「Console」タブを選択
3. エラーメッセージを確認

#### Next.jsのエラーログ
- `.next`ディレクトリ内のログファイルを確認
- 開発サーバーのターミナル出力を確認

### デバッグのベストプラクティス

1. **詳細なログを追加**
   ```typescript
   console.log('[FunctionName] Starting with params:', params);
   console.log('[FunctionName] Data retrieved:', data);
   console.error('[FunctionName] Error:', error);
   ```

2. **エラーハンドリングを実装**
   ```typescript
   try {
     // 処理
   } catch (error) {
     console.error('Error details:', {
       errorMessage: error instanceof Error ? error.message : String(error),
       errorStack: error instanceof Error ? error.stack : undefined,
     });
     throw error; // または適切なエラーレスポンス
   }
   ```

3. **型安全性を確保**
   ```typescript
   if (!data || typeof data !== 'object') {
     throw new Error('Invalid data format');
   }
   ```

4. **nullチェックを実装**
   ```typescript
   if (!team) {
     return notFound();
   }
   ```

## 404 Not Found エラー

### よくある原因と解決方法

#### 1. ルーティングの設定ミス

**症状:**
- 404エラーが発生
- ページが存在しない

**解決方法:**
1. ファイルパスを確認
   - `app/community/team/[slug]/page.tsx` が存在するか
2. ディレクトリ名を確認
   - `[slug]` は動的ルートの正しい形式

#### 2. データが存在しない

**症状:**
- 404エラーが発生
- コンソールに「Team not found」ログ

**解決方法:**
1. Firestoreでデータが存在するか確認
2. スラッグが正しいか確認
3. データのシードを実行
   ```bash
   npm run seed:teams
   ```

## その他のエラー

### 認証エラー

**症状:**
- ログインできない
- 認証が必要なページにアクセスできない

**解決方法:**
1. Firebase Authenticationの設定を確認
2. セキュリティルールを確認
3. 環境変数を確認

### パフォーマンスの問題

**症状:**
- ページの読み込みが遅い
- タイムアウトエラー

**解決方法:**
1. Firestoreのインデックスを作成
2. 不要なクエリを削減
3. 並列取得（`Promise.all`）を使用
4. キャッシュを活用

## よくある質問（FAQ）

### Q: 開発サーバーを再起動してもエラーが解消しない

A: 以下を試してください：
1. `.next`ディレクトリを削除
   ```bash
   rm -rf .next
   npm run dev
   ```
2. `node_modules`を再インストール
   ```bash
   rm -rf node_modules
   npm install
   ```

### Q: エラーメッセージが表示されない

A: 以下を確認してください：
1. 開発サーバーのコンソールを確認
2. ブラウザのコンソールを確認
3. エラーハンドリングが正しく実装されているか確認

### Q: 本番環境でエラーが発生する

A: 以下を確認してください：
1. 環境変数が正しく設定されているか
2. Firestoreのセキュリティルールが適切か
3. インデックスが作成されているか

## サポート

問題が解決しない場合は、以下を確認してください：
1. エラーログの全文
2. 発生しているページのURL
3. 実行した操作の手順
4. 環境情報（OS、Node.jsバージョンなど）

