# Firebase認証エラー: auth/configuration-not-found

## エラー内容

```
Firebase: Error (auth/configuration-not-found).
```

## 原因

このエラーは、Firebase認証の設定が正しく初期化されていない場合に発生します。

主な原因：
1. 環境変数が`.env.local`に設定されていない
2. 開発サーバーを再起動していない（環境変数の変更が反映されていない）
3. 環境変数の値が空または不正

## 解決方法

### 1. 環境変数の確認

`.env.local`ファイルに以下の環境変数が設定されているか確認してください：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. 設定確認スクリプトの実行

```bash
npm run check:firebase
```

すべての環境変数が正しく設定されているか確認できます。

### 3. 開発サーバーの再起動

環境変数を変更した場合は、**必ず開発サーバーを再起動**してください：

```bash
# 開発サーバーを停止（Ctrl+C）
# その後、再起動
npm run dev
```

### 4. ブラウザのキャッシュクリア

ブラウザのキャッシュをクリアして、ページを再読み込みしてください。

### 5. .nextディレクトリの削除

ビルドキャッシュをクリアする場合：

```bash
rm -rf .next
npm run dev
```

## 確認事項

### Firebase Consoleでの確認

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクトを選択
3. プロジェクトの設定（⚙️）を開く
4. 「マイアプリ」セクションで、Webアプリの設定を確認
5. 設定値が`.env.local`の値と一致しているか確認

### Authenticationの有効化

1. Firebase Consoleで「Authentication」を開く
2. 「Sign-in method」タブを開く
3. 「メール/パスワード」が有効になっているか確認
4. 無効の場合は有効化

## トラブルシューティング

### エラーメッセージが表示されない場合

ブラウザの開発者ツール（F12）のコンソールを確認してください：

```javascript
// コンソールに以下のようなエラーが表示される場合
[Firebase Config] 環境変数が不完全です。.env.localファイルを確認してください。
```

### 環境変数が読み込まれない場合

1. `.env.local`ファイルがプロジェクトルートにあるか確認
2. ファイル名が正確か確認（`.env.local`、`.env`ではない）
3. 環境変数名が`NEXT_PUBLIC_`で始まっているか確認

### 開発サーバーを再起動しても解決しない場合

1. `.env.local`ファイルの内容を再確認
2. 環境変数の値に余分なスペースや引用符がないか確認
3. Firebase Consoleから設定値を再コピー

## 参考

- [Firebase Authentication ドキュメント](https://firebase.google.com/docs/auth)
- [Next.js 環境変数](https://nextjs.org/docs/basic-features/environment-variables)

