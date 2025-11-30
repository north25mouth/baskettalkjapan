# Windows環境構築プロンプト（詳細版・Cursor用）

このプロンプトは、より詳細な手順を含むWindows環境構築用のCursorプロンプトです。

---

## Cursorへのプロンプト（詳細版）

```
Windows環境でBasketTalk Japanプロジェクトの開発環境を完全に構築してください。

## プロジェクト概要
- プロジェクト名: BasketTalk Japan（日本語NBAファンコミュニティサイト）
- リポジトリURL: https://github.com/north25mouth/baskettalkjapan.git
- 技術スタック:
  - フロントエンド: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
  - バックエンド: Firebase (Auth, Firestore)
  - デプロイ: Vercel または Node.js対応サーバー

## セットアップ手順

### ステップ1: 前提条件の確認とインストール

以下のソフトウェアがインストールされているか確認してください。未インストールの場合は、インストール手順を案内してください。

#### 1.1 Git for Windows
- ダウンロードURL: https://git-scm.com/download/win
- 確認コマンド: `git --version`
- インストール時の注意点:
  - 「Git Bash Here」と「Git GUI Here」を選択
  - 「Use Visual Studio Code as Git's default editor」を選択（VSCode使用時）

#### 1.2 Node.js
- バージョン: Node.js 18以上（LTS版推奨）
- ダウンロードURL: https://nodejs.org/
- 確認コマンド: `node --version` と `npm --version`
- インストール時の注意点:
  - 「Add to PATH」が選択されていることを確認
  - インストール後、コマンドプロンプトを再起動

#### 1.3 Visual Studio Code（推奨）
- ダウンロードURL: https://code.visualstudio.com/
- 推奨拡張機能:
  - ES7+ React/Redux/React-Native snippets
  - ESLint
  - Prettier - Code formatter
  - Tailwind CSS IntelliSense

### ステップ2: プロジェクトのクローン

1. プロジェクトを配置したいディレクトリに移動（例: `C:\Users\ユーザー名\Documents`）
2. 以下のコマンドでリポジトリをクローン:
   ```bash
   git clone https://github.com/north25mouth/baskettalkjapan.git
   cd baskettalkjapan
   ```

### ステップ3: 依存関係のインストール

プロジェクトディレクトリで以下のコマンドを実行:
```bash
npm install
```

インストールが完了するまで待機（数分かかる場合があります）。

### ステップ4: 環境変数の設定

#### 4.1 .env.localファイルの作成

プロジェクトのルートディレクトリ（package.jsonがある場所）に`.env.local`ファイルを作成してください。

#### 4.2 Firebase設定の取得

Firebase Consoleから設定情報を取得する手順を案内してください:

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクトを選択（または新規作成）
3. プロジェクト設定（⚙️アイコン）を開く
4. 「アプリを追加」→「ウェブ」を選択
5. アプリのニックネームを入力（例: `BasketTalk Japan Web`）
6. 「Firebase Hosting もセットアップしますか？」は「今はしない」を選択
7. 「アプリを登録」をクリック
8. 表示される設定情報をコピー

#### 4.3 .env.localファイルの編集

以下の形式で環境変数を設定してください:

```env
# Firebase設定
NEXT_PUBLIC_FIREBASE_API_KEY=あなたのAPIキー
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=あなたのプロジェクト.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=あなたのプロジェクトID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=あなたのプロジェクト.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=あなたのSender ID
NEXT_PUBLIC_FIREBASE_APP_ID=あなたのApp ID

# NBA API（オプション）
NBA_API_BASE_URL=https://api.balldontlie.io/v1
NBA_API_KEY=あなたのAPIキー（オプション）
```

**重要**: 
- `.env.local`ファイルは絶対にGitにコミットしないでください
- 機密情報を含むため、他の人と共有しないでください

### ステップ5: Firebaseプロジェクトのセットアップ

#### 5.1 Firestore Databaseの作成

1. Firebase Console > Firestore Database を選択
2. 「データベースを作成」をクリック
3. セキュリティルール: 「テストモードで開始」を選択（開発環境）
4. ロケーション: `asia-northeast1`（東京）を選択
5. 「有効にする」をクリック

**注意**: Firestore Databaseを作成するには、請求先情報の登録が必要です（無料枠内であれば課金されません）。

#### 5.2 Authenticationの設定

1. Firebase Console > Authentication を選択
2. 「始める」をクリック
3. 「Sign-in method」タブで以下を有効化:
   - メール/パスワード: 「有効にする」→「保存」
   - Google（オプション）: 「有効にする」→「保存」

#### 5.3 セキュリティルールの設定

Firestore Console > ルール タブで、開発環境用のルールを設定してください:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

ルールを入力後、「公開」をクリックしてください。

### ステップ6: 開発サーバーの起動

プロジェクトディレクトリで以下のコマンドを実行:

```bash
npm run dev
```

以下のメッセージが表示されれば成功:
```
▲ Next.js 16.x.x
- Local:        http://localhost:3000
```

### ステップ7: 動作確認

1. ブラウザで http://localhost:3000 にアクセス
2. エラーが表示されないことを確認
3. ブラウザの開発者ツール（F12）のConsoleタブでエラーがないか確認

### ステップ8: 初期データの投入（オプション）

チームデータを投入する場合:

```bash
# firebase-adminをインストール（初回のみ）
npm install firebase-admin

# Firebase CLIでログイン（初回のみ）
npm install -g firebase-tools
firebase login

# チームデータを投入
npm run seed:teams
```

## トラブルシューティング

### エラー1: Node.jsのバージョンが表示されない

**原因**: 環境変数PATHが正しく設定されていない

**解決方法**:
1. コマンドプロンプトを完全に閉じる
2. 再起動するか、新しいコマンドプロンプトを開く
3. それでも表示されない場合は、Node.jsを再インストール

### エラー2: npm installでエラーが出る

**原因**: ネットワークエラーや権限の問題

**解決方法**:
1. 管理者権限でコマンドプロンプトを開く
2. 以下のコマンドを実行:
   ```bash
   npm cache clean --force
   npm install
   ```

### エラー3: ポート3000が既に使用されている

**原因**: 他のアプリケーションがポート3000を使用している

**解決方法**:
1. 別のポートで起動:
   ```bash
   npm run dev -- -p 3001
   ```
2. または、ポート3000を使用しているアプリを終了

### エラー4: .env.localが認識されない

**原因**: ファイル名が間違っている、または場所が間違っている

**解決方法**:
1. ファイル名が`.env.local`であることを確認（`.env.local.txt`ではない）
2. プロジェクトのルートフォルダ（`package.json`がある場所）に配置されているか確認
3. 開発サーバーを再起動（環境変数の変更を反映するため）

### エラー5: Firebase not initialized

**原因**: 環境変数が正しく設定されていない

**解決方法**:
1. `.env.local`ファイルが存在するか確認
2. 環境変数名が`NEXT_PUBLIC_`で始まっているか確認
3. 値に余分なスペースや引用符がないか確認
4. 開発サーバーを再起動

### エラー6: This API method requires billing to be enabled

**原因**: 請求先情報が登録されていない

**解決方法**:
1. [Google Cloud Console - 請求を有効化](https://console.developers.google.com/billing/enable)にアクセス
2. 請求先情報を登録（無料枠内であれば課金されません）
3. 数分待ってから再試行

## 確認チェックリスト

セットアップが完了したら、以下を確認してください:

- [ ] Gitがインストールされ、`git --version`でバージョンが表示される
- [ ] Node.js 18以上がインストールされ、`node --version`でバージョンが表示される
- [ ] npmがインストールされ、`npm --version`でバージョンが表示される
- [ ] プロジェクトがクローンされ、`cd baskettalkjapan`で移動できる
- [ ] `npm install`が正常に完了し、`node_modules`フォルダが作成されている
- [ ] `.env.local`ファイルが作成され、Firebase設定が入力されている
- [ ] Firebase ConsoleでFirestore Databaseが作成されている
- [ ] Firebase ConsoleでAuthenticationが有効化されている
- [ ] `npm run dev`で開発サーバーが起動し、http://localhost:3000 にアクセスできる
- [ ] ブラウザでエラーが表示されない

## 次のステップ

セットアップが完了したら、以下を確認してください:

1. [Gitブランチルール](../rule/02-git-branch-rules.md) を読む
2. [コーディング規約](../rule/03-coding-standards.md) を読む
3. [コミットメッセージルール](../rule/04-commit-message-rules.md) を読む
4. [セットアップチェックリスト](./SETUP_CHECKLIST.md) で最終確認

## 参考ドキュメント

- [開発環境セットアップガイド](../rule/01-development-environment.md) - Windows初学者向け詳細ガイド
- [Firestore Database セットアップガイド](./FIRESTORE_SETUP.md)
- [セットアップチェックリスト](./SETUP_CHECKLIST.md)
- [クイックスタートガイド](./QUICK_START.md)

すべての手順を日本語で説明し、Windows環境特有の問題（パスの区切り文字、コマンドの違いなど）に注意してください。
```

---

## 使用方法

1. 上記のプロンプト全体をコピー
2. Cursorのチャットに貼り付け
3. Cursorが自動的に環境構築を進めます

## 簡易版との違い

- **簡易版** (`WINDOWS_SETUP_PROMPT.md`): 基本的な手順のみ
- **詳細版** (このファイル): より詳細な手順、トラブルシューティング、チェックリストを含む

用途に応じて選択してください。

