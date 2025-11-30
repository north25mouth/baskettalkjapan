# Windows環境構築プロンプト（Cursor用）

このプロンプトをCursorにコピー＆ペーストして、Windows環境での開発環境構築を依頼してください。

---

## Cursorへのプロンプト

```
Windows環境でBasketTalk Japanプロジェクトの開発環境を構築してください。

## プロジェクト情報
- プロジェクト名: BasketTalk Japan
- リポジトリ: https://github.com/north25mouth/baskettalkjapan.git
- 技術スタック: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Firebase

## 必要な作業

### 1. 前提条件の確認
以下のソフトウェアがインストールされているか確認し、未インストールの場合はインストール手順を案内してください：
- Git for Windows
- Node.js 18以上（LTS版推奨）
- Visual Studio Code（推奨）

### 2. プロジェクトのクローン
リポジトリをクローンして、プロジェクトディレクトリに移動してください。

### 3. 依存関係のインストール
package.jsonに基づいて、必要なnpmパッケージをインストールしてください。

### 4. 環境変数の設定
.env.localファイルを作成し、以下のFirebase設定用の環境変数テンプレートを用意してください：
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

### 5. Firebase設定の取得方法
Firebase Consoleから設定情報を取得する手順を案内してください。

### 6. 開発サーバーの起動
npm run devコマンドで開発サーバーを起動できることを確認してください。

### 7. 動作確認
- http://localhost:3000 にアクセスできること
- エラーが表示されないこと

### 8. トラブルシューティング
よくあるエラーとその解決方法を案内してください：
- Node.jsのバージョンエラー
- ポート3000が使用中
- 環境変数が読み込まれない
- npm installのエラー

## 注意事項
- Windows環境特有の問題（パスの区切り文字、コマンドの違いなど）に注意してください
- .env.localファイルはGitにコミットしないようにしてください
- すべての手順を日本語で説明してください
```

---

## 使用方法

1. 上記のプロンプトをコピー
2. Cursorのチャットに貼り付け
3. Cursorが自動的に環境構築を進めます

## 補足情報

### プロジェクトの主要ファイル
- `package.json`: 依存関係とスクリプト
- `lib/firebase/config.ts`: Firebase設定
- `docs/QUICK_START.md`: クイックスタートガイド
- `docs/SETUP_CHECKLIST.md`: セットアップチェックリスト
- `rule/01-development-environment.md`: Windows初学者向けガイド

### 参考ドキュメント
- [開発環境セットアップガイド](../rule/01-development-environment.md)
- [Firestore Database セットアップガイド](./FIRESTORE_SETUP.md)
- [セットアップチェックリスト](./SETUP_CHECKLIST.md)

