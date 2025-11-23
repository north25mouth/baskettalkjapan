# Git/GitHub セットアップガイド

## 初回セットアップ

### 1. Gitリポジトリの初期化（まだの場合）

```bash
git init
```

### 2. リモートリポジトリの追加

```bash
git remote add origin https://github.com/north25mouth/baskettalkjapan.git
```

### 3. 現在の変更をコミット

```bash
# すべての変更をステージング
git add .

# コミット
git commit -m "Initial commit: BasketTalk Japan MVP implementation"
```

### 4. メインブランチの設定

```bash
git branch -M main
```

### 5. リモートにプッシュ

```bash
git push -u origin main
```

## 日常的な作業フロー

### 変更をコミット

```bash
# 変更を確認
git status

# 変更をステージング
git add .

# または特定のファイルのみ
git add app/community/page.tsx

# コミット
git commit -m "説明: 変更内容の説明"
```

### リモートにプッシュ

```bash
git push origin main
```

### リモートから最新を取得

```bash
git pull origin main
```

## ブランチ管理

### 機能ブランチの作成

```bash
# 新しいブランチを作成して切り替え
git checkout -b feature/thread-detail-post-form

# 作業後、コミット
git add .
git commit -m "Add: 投稿フォーム機能を実装"

# リモートにプッシュ
git push -u origin feature/thread-detail-post-form
```

### メインブランチにマージ

```bash
# メインブランチに切り替え
git checkout main

# 最新を取得
git pull origin main

# 機能ブランチをマージ
git merge feature/thread-detail-post-form

# リモートにプッシュ
git push origin main
```

## .gitignore の確認

以下のファイル/ディレクトリはGitに含まれません：

- `node_modules/` - 依存関係
- `.next/` - Next.jsのビルドファイル
- `.env*.local` - 環境変数ファイル
- `backups/` - バックアップファイル
- `.DS_Store` - macOSのシステムファイル

## コミットメッセージの規約

### プレフィックス

- `Add:` - 新機能の追加
- `Fix:` - バグ修正
- `Update:` - 既存機能の更新
- `Refactor:` - リファクタリング
- `Docs:` - ドキュメントの更新
- `Style:` - スタイルの変更
- `Test:` - テストの追加・修正

### 例

```bash
git commit -m "Add: スレッド詳細ページの投稿フォーム機能"
git commit -m "Fix: チームページの404エラーを修正"
git commit -m "Update: エラーハンドリングを改善"
git commit -m "Docs: バックアップガイドを追加"
```

## トラブルシューティング

### リモートリポジトリのURLを変更

```bash
git remote set-url origin https://github.com/north25mouth/baskettalkjapan.git
```

### リモートリポジトリの確認

```bash
git remote -v
```

### コミット履歴の確認

```bash
git log --oneline
```

### 変更を元に戻す（未コミット）

```bash
# すべての変更を破棄
git checkout .

# 特定のファイルのみ
git checkout app/page.tsx
```

## 注意事項

1. **環境変数ファイル（.env.local）はコミットしない**
   - `.gitignore`に含まれていますが、確認してください

2. **機密情報を含むファイルはコミットしない**
   - APIキー、パスワードなど

3. **大きなファイルは避ける**
   - 画像や動画などは別の方法で管理

4. **定期的にコミット・プッシュ**
   - 作業の進捗を保存

