# パフォーマンス最適化ガイド

## CPU負荷が高い場合の対処法

### 1. 開発サーバーの最適化

#### Next.js開発サーバーの設定

`next.config.js`または`next.config.ts`で最適化設定を追加：

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 開発時の最適化
  ...(process.env.NODE_ENV === 'development' && {
    // ファイルウォッチャーの最適化
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {
        config.watchOptions = {
          poll: 1000, // 1秒ごとにチェック（デフォルトはより頻繁）
          aggregateTimeout: 300, // 変更後の待機時間
          ignored: [
            '**/node_modules/**',
            '**/.next/**',
            '**/backups/**',
          ],
        };
      }
      return config;
    },
  }),
};

module.exports = nextConfig;
```

#### 開発サーバー起動時のオプション

```bash
# CPU使用率を制限（macOS/Linux）
NODE_OPTIONS="--max-old-space-size=2048" npm run dev

# または、より軽量なモードで起動
npm run dev -- --turbo  # Turbopackを使用（Next.js 13+）
```

### 2. ファイルウォッチャーの最適化

#### `.watchmanconfig`の作成（Watchman使用時）

```json
{
  "ignore_dirs": [
    "node_modules",
    ".next",
    "backups",
    ".git"
  ]
}
```

#### VS Codeの設定

`.vscode/settings.json`に追加：

```json
{
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/.next/**": true,
    "**/backups/**": true,
    "**/dist/**": true,
    "**/build/**": true
  }
}
```

### 3. 開発時の推奨設定

#### 環境変数で最適化

`.env.local`に追加：

```env
# 開発時の最適化
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1  # テレメトリーを無効化
```

#### package.jsonのスクリプト最適化

```json
{
  "scripts": {
    "dev": "NODE_OPTIONS='--max-old-space-size=2048' next dev",
    "dev:turbo": "next dev --turbo",
    "dev:light": "NODE_OPTIONS='--max-old-space-size=1024' next dev"
  }
}
```

### 4. システムリソースの確認

#### メモリ使用量の確認

```bash
# macOS
top -l 1 | grep -E "PhysMem|CPU"

# Linux
free -h
```

#### Node.jsプロセスの確認

```bash
# Node.jsプロセスのメモリ使用量
ps aux | grep node | awk '{print $2, $3, $4, $11}'
```

### 5. 開発サーバーを安全に停止する方法

#### 通常の停止

```bash
# ターミナルで Ctrl + C
# または
pkill -f "next dev"
```

#### 強制終了（必要な場合）

```bash
# ポート3000を使用しているプロセスを終了
lsof -ti:3000 | xargs kill -9

# すべてのNode.jsプロセスを終了（注意：他のプロジェクトも影響）
pkill -9 node
```

### 6. 開発時のベストプラクティス

1. **不要なファイルを監視対象から除外**
   - `.gitignore`に追加
   - `.watchmanconfig`で除外

2. **定期的なクリーンアップ**
   ```bash
   # .nextフォルダを削除して再ビルド
   rm -rf .next
   npm run dev
   ```

3. **開発サーバーの再起動**
   - 長時間実行している場合は定期的に再起動

4. **不要なタブを閉じる**
   - ブラウザの開発者ツールはCPUを消費します
   - 不要なタブを閉じる

5. **他のアプリケーションを閉じる**
   - メモリやCPUを消費する他のアプリを閉じる

### 7. トラブルシューティング

#### CPU使用率が100%の場合

1. 開発サーバーを停止
2. `.next`フォルダを削除
3. `node_modules`を再インストール（必要に応じて）
4. 開発サーバーを再起動

```bash
# クリーンアップと再起動
rm -rf .next node_modules
npm install
npm run dev
```

#### メモリ不足の場合

```bash
# Node.jsのメモリ制限を増やす
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

### 8. 開発環境の軽量化

#### 最小限の機能で開発

- TypeScriptの型チェックを無効化（開発時のみ）
- ESLintの一部ルールを無効化
- 不要なプラグインを無効化

#### 開発用の設定ファイル

`next.config.dev.js`を作成：

```javascript
module.exports = {
  // 開発時の軽量化設定
  typescript: {
    ignoreBuildErrors: true, // 開発時のみ
  },
  eslint: {
    ignoreDuringBuilds: true, // 開発時のみ
  },
};
```

### 9. 参考リンク

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Node.js Memory Management](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Turbopack](https://nextjs.org/docs/app/api-reference/next-cli#turbopack)

