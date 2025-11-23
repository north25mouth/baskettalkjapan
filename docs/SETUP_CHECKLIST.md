# セットアップチェックリスト

BasketTalk Japanプロジェクトのセットアップ完了確認用チェックリスト

## ✅ Firebase設定

- [x] `.env.local`ファイルが作成され、Firebase設定情報が入力されている
- [ ] Firebase Consoleでプロジェクトが作成されている
- [ ] **請求先情報が登録されている**（[詳細はこちら](BILLING_SETUP.md)）
- [ ] Firestore Databaseが作成されている（ロケーション: `asia-northeast1`推奨）
- [ ] セキュリティルールが設定されている

## ✅ Authentication設定

Firebase Console > Authentication で以下を有効化：

- [ ] メール/パスワード認証を有効化
  1. Firebase Console > Authentication > Sign-in method
  2. 「メール/パスワード」を選択
  3. 「有効にする」をクリック
  4. 「保存」をクリック

- [ ] Google認証を有効化（オプション）
  1. Firebase Console > Authentication > Sign-in method
  2. 「Google」を選択
  3. 「有効にする」をクリック
  4. プロジェクトのサポートメールを設定
  5. 「保存」をクリック

## ✅ Firestore Database設定

- [ ] Firestore Databaseが作成されている
- [ ] セキュリティルールが設定されている（[詳細はこちら](FIRESTORE_SETUP.md)）
- [ ] 初期データ（チームデータ）が投入されている（オプション）

### セキュリティルールの確認

Firebase Console > Firestore Database > ルール で以下を確認：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 開発環境用（簡易版）
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

または、本番環境用の詳細なルール（[FIRESTORE_SETUP.md](FIRESTORE_SETUP.md#32-本番環境用ルール推奨)を参照）

## ✅ 初期データの投入

### チームデータの投入（推奨）

```bash
# firebase-adminをインストール（初回のみ）
npm install firebase-admin

# 環境変数を設定
export FIREBASE_PROJECT_ID=baskettalkjapan

# チームデータを投入
node scripts/seed-teams.js
```

- [ ] チームデータが投入されている（Firestore Consoleで確認）

## ✅ 動作確認

### 1. 開発サーバーの起動

```bash
npm run dev
```

- [ ] 開発サーバーが正常に起動する
- [ ] `http://localhost:3000`にアクセスできる

### 2. 認証機能の確認

- [ ] `/signup`でユーザー登録ができる
- [ ] `/login`でログインができる
- [ ] Firestore Consoleの`users`コレクションにユーザーデータが作成される

### 3. コミュニティ機能の確認

- [ ] `/community`でコミュニティページが表示される
- [ ] `/community/new`でスレッド作成ができる
- [ ] Firestore Consoleの`threads`コレクションにスレッドデータが作成される

### 4. エラーの確認

- [ ] ブラウザのコンソールにエラーが表示されない
- [ ] Firestore Consoleでデータが正しく保存されている

## 🔧 トラブルシューティング

### エラー: This API method requires billing to be enabled

**原因**: 請求先情報が登録されていない

**対処法**:
1. [請求先情報の登録手順](BILLING_SETUP.md)を参照
2. 請求先情報を登録（無料枠内であれば課金されません）
3. 数分待ってから再試行

### エラー: Missing or insufficient permissions

**原因**: セキュリティルールが正しく設定されていない

**対処法**:
1. Firebase Console > Firestore Database > ルール を確認
2. 開発環境用の簡易ルールを設定
3. 「公開」をクリック

### エラー: Firebase not initialized

**原因**: 環境変数が正しく設定されていない

**対処法**:
1. `.env.local`ファイルが存在するか確認
2. 環境変数名が`NEXT_PUBLIC_`で始まっているか確認
3. 開発サーバーを再起動（`npm run dev`）

### エラー: Index not found

**原因**: Firestoreのインデックスが作成されていない

**対処法**:
1. エラーメッセージに表示されるリンクをクリック
2. または、Firebase Console > Firestore Database > インデックス から手動で作成

## 📝 次のステップ

セットアップが完了したら、以下を実装できます：

- [ ] スレッド詳細ページの実装
- [ ] 投稿・返信機能の実装
- [ ] いいね機能の実装
- [ ] 通報機能の実装
- [ ] 通知機能の実装
- [ ] ユーザープロフィールページの実装

## 📚 参考ドキュメント

- [Firestore Database セットアップガイド](FIRESTORE_SETUP.md)
- [請求先情報の登録手順](BILLING_SETUP.md)
- [課金について - 安全に使用する方法](BILLING_SAFETY.md) ⭐ **必読**
- [予算アラート・使用量制限の設定ガイド](BUDGET_SETUP_GUIDE.md) ⭐ **必読**
- [Firebase ドキュメント](https://firebase.google.com/docs)
- [Next.js ドキュメント](https://nextjs.org/docs)

