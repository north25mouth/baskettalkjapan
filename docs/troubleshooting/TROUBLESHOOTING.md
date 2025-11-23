# トラブルシューティングガイド

## 500 Internal Server Error

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
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

3. 開発サーバーを再起動
   ```bash
   # 開発サーバーを停止（Ctrl+C）
   npm run dev
   ```

#### 2. Firestoreクエリエラー

**症状:**
- 500エラーが発生
- コンソールに「The query requires an index」エラー

**解決方法:**
1. エラーメッセージに表示されたリンクをクリック
2. Firebase Consoleでインデックスを作成
3. 詳細は `docs/FIRESTORE_INDEX_SETUP.md` を参照

#### 3. データ型の不一致

**症状:**
- 500エラーが発生
- コンソールに「Cannot read properties of undefined」エラー

**解決方法:**
1. データモデルを確認（`types/index.ts`）
2. Firestoreのデータ構造を確認
3. 型変換関数（`timestampToDate`など）が正しく動作しているか確認

#### 4. パラメータの取得エラー

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

#### 5. サーバーコンポーネントでのクライアントAPI使用

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

