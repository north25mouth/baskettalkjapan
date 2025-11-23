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
- **デプロイ**: Vercel (予定)

## セットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn
- Firebase プロジェクト

### インストール

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env.local
# .env.localを編集してFirebase設定を追加

# 開発サーバーの起動
npm run dev
```

詳細は [クイックスタートガイド](./docs/QUICK_START.md) を参照してください。

## ドキュメント

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
