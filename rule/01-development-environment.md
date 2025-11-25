# 開発環境セットアップガイド（Windows初学者向け）

このガイドは、Windows環境でBasketTalk Japanの開発環境を構築するための詳細な手順です。

## 目次

1. [必要なソフトウェアのインストール](#必要なソフトウェアのインストール)
2. [Gitのセットアップ](#gitのセットアップ)
3. [Node.jsのインストール](#nodejsのインストール)
4. [プロジェクトのクローン](#プロジェクトのクローン)
5. [環境変数の設定](#環境変数の設定)
6. [開発サーバーの起動](#開発サーバーの起動)
7. [トラブルシューティング](#トラブルシューティング)

## 必要なソフトウェアのインストール

### 1. Git for Windows

#### ダウンロード
1. ブラウザで [https://git-scm.com/download/win](https://git-scm.com/download/win) を開く
2. ダウンロードが自動的に開始されます（開始しない場合は「Download」ボタンをクリック）

#### インストール
1. ダウンロードした `Git-x.x.x-64-bit.exe` をダブルクリック
2. 「Next」をクリックして進む
3. **重要**: 「Select Components」画面で以下を確認：
   - ✅ Git Bash Here
   - ✅ Git GUI Here
   - ✅ Associate .git* configuration files with the default text editor
4. 「Next」をクリック
5. 「Choosing the default editor」では「Use Visual Studio Code as Git's default editor」を選択（VSCodeをインストールしている場合）
6. その他はデフォルトのまま「Next」をクリック
7. 「Install」をクリック
8. インストール完了後、「Finish」をクリック

#### 確認
1. **コマンドプロンプト**または**PowerShell**を開く
2. 以下のコマンドを実行：
   ```bash
   git --version
   ```
3. `git version x.x.x` と表示されればOK

### 2. Node.jsのインストール

#### ダウンロード
1. ブラウザで [https://nodejs.org/](https://nodejs.org/) を開く
2. **LTS版**（推奨版）の「Download」ボタンをクリック
   - 例: `v20.x.x LTS` など

#### インストール
1. ダウンロードした `node-vxx.x.x-x64.msi` をダブルクリック
2. 「Next」をクリック
3. 「Accept the terms」にチェックを入れて「Next」
4. インストール先はデフォルトのまま「Next」
5. 「Add to PATH」が選択されていることを確認して「Next」
6. 「Install」をクリック
7. インストール完了後、「Finish」をクリック

#### 確認
1. **コマンドプロンプト**または**PowerShell**を**新しく開く**（重要：既に開いている場合は閉じて新しく開く）
2. 以下のコマンドを実行：
   ```bash
   node --version
   npm --version
   ```
3. 両方ともバージョン番号が表示されればOK
   - Node.js: `v20.x.x` 以上
   - npm: `10.x.x` 以上

### 3. Visual Studio Code（推奨）

#### ダウンロード
1. ブラウザで [https://code.visualstudio.com/](https://code.visualstudio.com/) を開く
2. 「Download for Windows」をクリック

#### インストール
1. ダウンロードした `VSCodeUserSetup-x64-x.x.x.exe` をダブルクリック
2. 「同意する」にチェックを入れて「次へ」
3. インストール先はデフォルトのまま「次へ」
4. 「追加タスクの選択」で以下を確認：
   - ✅ デスクトップにアイコンを作成
   - ✅ コンテキストメニューに「Codeで開く」を追加
5. 「インストール」をクリック
6. インストール完了後、「完了」をクリック

#### 拡張機能のインストール（推奨）
1. VSCodeを起動
2. 左側の「拡張機能」アイコンをクリック（または `Ctrl+Shift+X`）
3. 以下の拡張機能を検索してインストール：
   - **ES7+ React/Redux/React-Native snippets**
   - **ESLint**
   - **Prettier - Code formatter**
   - **Tailwind CSS IntelliSense**
   - **TypeScript and JavaScript Language Features**（通常は標準でインストール済み）

## Gitのセットアップ

### 初回設定

1. **Git Bash**を開く（スタートメニューから検索）
2. 以下のコマンドを実行（自分の情報に置き換える）：

```bash
git config --global user.name "あなたの名前"
git config --global user.email "your-email@example.com"
```

### 確認

```bash
git config --global user.name
git config --global user.email
```

## プロジェクトのクローン

### 1. GitHubアカウントの準備

1. [GitHub](https://github.com/) にアカウントを作成（まだの場合）
2. リポジトリへのアクセス権限を確認

### 2. プロジェクトをクローン

1. **Git Bash**または**コマンドプロンプト**を開く
2. プロジェクトを配置したいフォルダに移動：
   ```bash
   cd C:\Users\あなたのユーザー名\Documents
   # または任意の場所
   ```
3. リポジトリをクローン：
   ```bash
   git clone https://github.com/north25mouth/baskettalkjapan.git
   ```
4. プロジェクトフォルダに移動：
   ```bash
   cd baskettalkjapan
   ```

## 環境変数の設定

### 1. .env.localファイルの作成

1. プロジェクトのルートフォルダ（`baskettalkjapan`）を開く
2. `.env.example` ファイルがあるか確認（ない場合は作成）
3. `.env.example` をコピーして `.env.local` という名前で保存
   - Windowsの場合：`.env.example` を右クリック → 「コピー」 → 同じフォルダで「貼り付け」 → 名前を `.env.local` に変更

### 2. Firebase設定の取得

1. [Firebase Console](https://console.firebase.google.com/) にログイン
2. プロジェクトを選択（または新規作成）
3. プロジェクト設定（⚙️アイコン）を開く
4. 「アプリを追加」→「ウェブ」を選択
5. アプリのニックネームを入力（例: `BasketTalk Japan Web`）
6. 「Firebase Hosting もセットアップしますか？」は「今はしない」を選択
7. 「アプリを登録」をクリック
8. 表示される設定情報をコピー

### 3. .env.localの編集

`.env.local` ファイルをVSCodeで開き、以下の形式で設定を追加：

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
- `.env.local` は**絶対にGitにコミットしない**
- 機密情報を含むため、他の人と共有しない

## 依存関係のインストール

1. **コマンドプロンプト**または**PowerShell**を開く
2. プロジェクトフォルダに移動：
   ```bash
   cd C:\Users\あなたのユーザー名\Documents\baskettalkjapan
   ```
3. 依存関係をインストール：
   ```bash
   npm install
   ```
4. インストールが完了するまで待つ（数分かかる場合があります）

## 開発サーバーの起動

1. プロジェクトフォルダで以下のコマンドを実行：
   ```bash
   npm run dev
   ```
2. 以下のメッセージが表示されれば成功：
   ```
   ▲ Next.js 16.x.x
   - Local:        http://localhost:3000
   ```
3. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## トラブルシューティング

### Node.jsのバージョンが表示されない

**原因**: 環境変数PATHが正しく設定されていない

**解決方法**:
1. コマンドプロンプトを**完全に閉じる**
2. 再起動するか、新しいコマンドプロンプトを開く
3. それでも表示されない場合は、Node.jsを再インストール

### npm installでエラーが出る

**原因**: ネットワークエラーや権限の問題

**解決方法**:
1. 管理者権限でコマンドプロンプトを開く
2. 以下のコマンドを実行：
   ```bash
   npm cache clean --force
   npm install
   ```

### ポート3000が既に使用されている

**原因**: 他のアプリケーションがポート3000を使用している

**解決方法**:
1. 別のポートで起動：
   ```bash
   npm run dev -- -p 3001
   ```
2. または、ポート3000を使用しているアプリを終了

### Gitコマンドが認識されない

**原因**: Gitが正しくインストールされていない、またはPATHが設定されていない

**解決方法**:
1. Git Bashを開いて確認
2. コマンドプロンプトではなく、Git Bashを使用する

### .env.localが認識されない

**原因**: ファイル名が間違っている、または場所が間違っている

**解決方法**:
1. ファイル名が `.env.local` であることを確認（`.env.local.txt` ではない）
2. プロジェクトのルートフォルダ（`package.json` がある場所）に配置されているか確認
3. VSCodeでファイルを開いて、内容が正しいか確認

## 次のステップ

環境構築が完了したら、以下を確認してください：

1. [Gitブランチルール](./02-git-branch-rules.md) を読む
2. [コーディング規約](./03-coding-standards.md) を読む
3. [コミットメッセージルール](./04-commit-message-rules.md) を読む

## 参考リンク

- [Git公式ドキュメント](https://git-scm.com/doc)
- [Node.js公式ドキュメント](https://nodejs.org/docs/)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Firebase公式ドキュメント](https://firebase.google.com/docs)

