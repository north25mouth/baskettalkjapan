# Firebase認証エラー: 400 Bad Request / auth/configuration-not-found

## エラー内容

```
identitytoolkit.googleapis.com/v1/accounts:signUp?key=...:1 Failed to load resource: the server responded with a status of 400
Firebase: Error (auth/configuration-not-found).
```

## 原因

このエラーは、Firebase Authが初期化されているにもかかわらず、Firebase Console側で認証設定が正しく構成されていない場合に発生します。

主な原因：
1. **Authenticationが有効化されていない**
2. **メール/パスワード認証が有効化されていない**
3. **APIキーに制限がかかっている**
4. **プロジェクトの設定が不完全**

## 解決方法

### 1. Firebase ConsoleでAuthenticationを確認

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクト「baskettalkjapan」を選択
3. 左メニューから「Authentication」をクリック
4. 「始める」ボタンをクリック（まだ有効化されていない場合）

### 2. メール/パスワード認証を有効化

1. Authenticationページで「Sign-in method」タブを開く
2. 「メール/パスワード」をクリック
3. 「有効にする」をクリック
4. 「保存」をクリック

### 3. APIキーの制限を確認

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクト「baskettalkjapan」を選択
3. 「APIとサービス」→「認証情報」を開く
4. APIキー（`AIzaSyDhsVWP09oK92AIZcVUjQqWiMZv2t33jcM`）をクリック
5. 「APIの制限」セクションを確認
   - 「制限なし」または「Identity Toolkit API」が有効になっているか確認
   - 制限がかかっている場合は、適切なAPIを有効化

### 4. Identity Toolkit APIが有効か確認

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクト「baskettalkjapan」を選択
3. 「APIとサービス」→「ライブラリ」を開く
4. 「Identity Toolkit API」を検索
5. 有効になっているか確認（無効の場合は「有効にする」をクリック）

## 確認手順

### ステップ1: Authenticationの状態確認

Firebase Consoleで以下を確認：
- [ ] Authenticationが有効化されている
- [ ] メール/パスワード認証が有効化されている
- [ ] プロジェクトIDが正しい（`baskettalkjapan`）

### ステップ2: APIキーの確認

Google Cloud Consoleで以下を確認：
- [ ] APIキーが存在する
- [ ] APIキーに適切な制限が設定されている（または制限なし）
- [ ] Identity Toolkit APIが有効になっている

### ステップ3: 再試行

設定を確認・修正した後：
1. ブラウザをリフレッシュ
2. 会員登録を再試行

## トラブルシューティング

### エラーが続く場合

1. **Firebase Consoleでプロジェクトを再確認**
   - プロジェクトIDが正しいか
   - プロジェクトが有効な状態か

2. **APIキーを再生成**
   - Google Cloud Consoleで新しいAPIキーを生成
   - `.env.local`を更新
   - 開発サーバーを再起動

3. **Firebaseプロジェクトを再作成**
   - 最後の手段として、新しいFirebaseプロジェクトを作成
   - 設定を再構成

## 参考

- [Firebase Authentication ドキュメント](https://firebase.google.com/docs/auth)
- [Identity Toolkit API ドキュメント](https://cloud.google.com/identity-platform/docs)

