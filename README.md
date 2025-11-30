# BasketTalk Japan

日本語NBAファンコミュニティサイト

## 概要

BasketTalk Japanは、日本のNBAファンが集まり、試合について語り合い、チーム情報を共有できるコミュニティサイトです。

## 機能

### コミュニティ機能
- スレッド作成・閲覧
- 投稿・返信
- いいね機能
- 通報機能
- チーム別掲示板

### 認証機能
- メール/パスワード認証
- Google認証

## 技術スタック

- **フロントエンド**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **バックエンド**: Firebase (Auth, Firestore, Cloud Functions)
- **デプロイ**: Vercel または 有料サーバー（Node.js対応）

## セットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn
- Firebase プロジェクト
- Git

### インストール

#### 1. リポジトリのクローン

```bash
git clone https://github.com/north25mouth/baskettalkjapan.git
cd baskettalkjapan
```

#### 2. 依存関係のインストール

```bash
npm install
```

#### 3. 環境変数の設定

```bash
# .env.exampleをコピーして.env.localを作成
cp .env.example .env.local
```

`.env.local` ファイルを編集して、Firebase設定を追加してください。

```env
NEXT_PUBLIC_FIREBASE_API_KEY=あなたのAPIキー
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=あなたのプロジェクト.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=あなたのプロジェクトID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=あなたのプロジェクト.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=あなたのSender ID
NEXT_PUBLIC_FIREBASE_APP_ID=あなたのApp ID
```

#### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### Windows初学者向けガイド

Windows環境でのセットアップが初めての方は、[開発環境セットアップガイド](./rule/01-development-environment.md) を参照してください。

**Cursorを使った環境構築**: [Windows環境構築プロンプト（Cursor用）](./docs/WINDOWS_SETUP_PROMPT.md) または [詳細版](./docs/WINDOWS_SETUP_PROMPT_DETAILED.md) を参照してください。

### WordPressローカル環境のセットアップ

ローカル環境でWordPressとSWELLテーマをセットアップする場合：

```bash
# セットアップスクリプトを実行（初回のみ）
npm run setup:wordpress

# WordPress REST API接続をチェック
npm run check:wordpress
```

**Mac向けの詳細な手順**: [Mac向けセットアップガイド](./scripts/setup-wordpress-mac.md)

詳細な手順は [WordPress統合ガイド](./rule/05-wordpress-integration-guide.md) を参照してください。

詳細は [クイックスタートガイド](./docs/QUICK_START.md) を参照してください。

## ドキュメント

### 開発ルール（必読）

- [開発環境セットアップガイド](./rule/01-development-environment.md) - Windows初学者向け
- [Gitブランチルール](./rule/02-git-branch-rules.md) - ブランチの命名規則と運用
- [コーディング規約](./rule/03-coding-standards.md) - コードの書き方
- [コミットメッセージルール](./rule/04-commit-message-rules.md) - コミットメッセージの書き方
- [WordPress統合ガイド](./rule/05-wordpress-integration-guide.md) - WordPressとSWELLテーマのセットアップ

### その他のドキュメント

- [ドキュメント一覧](./docs/README.md)
- [セットアップチェックリスト](./docs/SETUP_CHECKLIST.md)
- [要件定義書](./docs/requirements/README.md)
- [トラブルシューティング](./docs/troubleshooting/README.md)

## スクリプト

```bash
# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番サーバーの起動
npm run start

# チームデータのシード
npm run seed:teams

# チームスラッグの更新
npm run update:team-slugs

# Firebase設定の確認
npm run check:firebase

# バックアップ
npm run backup

# Firestoreデータのバックアップ
npm run backup:firestore
```

## プロジェクト構造

```
baskettalkjapan/
├── app/                    # Next.js App Router
│   ├── community/         # コミュニティページ
│   ├── login/             # ログインページ
│   └── ...
├── components/            # Reactコンポーネント
├── lib/                   # ユーティリティ・ヘルパー
│   └── firebase/         # Firebase設定・関数
├── types/                 # TypeScript型定義
├── scripts/               # スクリプト
├── docs/                  # ドキュメント
└── public/                # 静的ファイル
```

## ライセンス

このプロジェクトは非公式のファンコミュニティサイトです。NBAとは一切関係ありません。

## リンク

- [GitHub リポジトリ](https://github.com/north25mouth/baskettalkjapan)
