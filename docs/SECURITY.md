# セキュリティガイド

## 重要な注意事項

**このドキュメントは、APIキーや機密情報をGitHubにコミットしないためのガイドです。**

## 1. 環境変数ファイルの管理

### ローカル開発環境

1. `.env.example`をコピーして`.env.local`を作成：
   ```bash
   cp .env.example .env.local
   ```

2. `.env.local`に実際の値を設定してください
   - **重要**: `.env.local`は絶対にGitにコミットしないでください
   - `.gitignore`に`.env*`が含まれているため、通常は自動的に除外されます

3. `.env.local`の内容を確認：
   ```bash
   # コミット前に確認（.env.localが含まれていないことを確認）
   git status
   ```

### 本番環境（Vercel）

1. Vercelダッシュボードにログイン
2. プロジェクト > Settings > Environment Variables
3. 必要な環境変数を追加：
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
   - `NBA_API_KEY`
   - `NBA_API_BASE_URL`
   - `NEXT_PUBLIC_WORDPRESS_API_URL`

4. 環境ごとに設定（Production, Preview, Development）

## 2. 機密情報がコミットされていないか確認

### コミット前のチェック

```bash
# ステージングされているファイルを確認
git status

# .envファイルが含まれていないか確認
git diff --cached | grep -E "API_KEY|SECRET|PASSWORD|PRIVATE_KEY"
```

### 過去のコミット履歴を確認

```bash
# 過去のコミットで機密情報が含まれていないか確認
git log --all --full-history --source -- "*env*" "*secret*" "*key*"
```

### 機密情報がコミットされてしまった場合

もし機密情報がGitHubにコミットされてしまった場合：

1. **即座に機密情報を変更**（APIキーを再生成など）
2. Git履歴から削除（`git filter-branch`または`git filter-repo`を使用）
3. 強制プッシュ（**注意**: チームメンバーと相談してから実行）

```bash
# 例：.env.localを履歴から削除
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# 強制プッシュ（注意：チームメンバーと相談してから）
git push origin --force --all
```

## 3. コード内での機密情報の扱い

### ✅ 良い例

```typescript
// 環境変数から読み取る
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const secretKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY; // サーバーサイドのみ
```

### ❌ 悪い例

```typescript
// ハードコード（絶対にしない）
const apiKey = "AIzaSyDhsVWP09oK92AIZcVUjQqWiMZv2t33jcM";
const secretKey = "-----BEGIN PRIVATE KEY-----\n...";
```

## 4. .gitignoreの確認

`.gitignore`には以下のパターンが含まれていることを確認してください：

```
.env*
!.env.example
*secret*
*key*.json
*credentials*
*.pem
*.key
```

## 5. GitHub Secrets（GitHub Actions使用時）

GitHub Actionsを使用する場合、Secretsを使用してください：

1. リポジトリ > Settings > Secrets and variables > Actions
2. New repository secret をクリック
3. 機密情報を追加

ワークフローファイル（`.github/workflows/*.yml`）で使用：

```yaml
env:
  FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
```

## 6. セキュリティチェックリスト

コミット前に以下を確認：

- [ ] `.env.local`がステージングされていない
- [ ] コード内にハードコードされたAPIキーがない
- [ ] 機密情報を含むファイルが`.gitignore`に含まれている
- [ ] `.env.example`には実際の値ではなくプレースホルダーが使用されている
- [ ] 本番環境の環境変数が正しく設定されている

## 7. 定期的なセキュリティ監査

以下のコマンドで定期的にチェック：

```bash
# 機密情報のパターンを検索
grep -r "AIza\|api.*key\|secret\|password" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | grep -v ".env" | grep -v "node_modules"

# .envファイルがGitに含まれていないか確認
git ls-files | grep -E "\.env"
```

## 8. 緊急時の対応

機密情報が漏洩した場合の対応手順：

1. **即座に機密情報を無効化・再生成**
   - Firebase: プロジェクト設定 > 全般 > アプリ > APIキーを再生成
   - NBA API: APIキーを再生成
   - その他のサービス: 同様に対応

2. **Git履歴から削除**（上記の手順を参照）

3. **影響範囲の確認**
   - 誰がリポジトリにアクセスできるか
   - フォークされているか

4. **必要に応じて報告**
   - 影響を受けるサービスに報告
   - チームメンバーに通知

## 9. 参考リンク

- [GitHub: Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Next.js: Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel: Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

