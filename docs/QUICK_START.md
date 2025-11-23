# クイックスタートガイド

セキュリティルールの公開まで完了した後の、次のステップ

## ✅ 完了した作業

- [x] Firebaseプロジェクトの作成
- [x] Firestore Databaseの作成
- [x] セキュリティルールの設定と公開

## 🚀 次のステップ

### 1. 必要なパッケージのインストール

```bash
# firebase-adminをインストール（チームデータ投入用）
npm install firebase-admin

# dotenvをインストール（環境変数読み込み用）
npm install dotenv
```

### 2. チームデータの投入

`.env.local`ファイルに`NEXT_PUBLIC_FIREBASE_PROJECT_ID`が設定されていれば、以下のコマンドでチームデータを投入できます：

```bash
npm run seed:teams
```

または：

```bash
node scripts/seed-teams.js
```

**実行結果の例：**
```
✅ Firebase Admin SDKを初期化しました (プロジェクト: baskettalkjapan)

📊 チームデータの投入を開始します...

📝 30 件の新しいチームデータを追加します...

✅ 30 チームのデータを投入しました！

📋 投入されたチーム:
   - アトランタ・ホークス (ATL)
   - ボストン・セルティックス (BOS)
   ...（省略）

🔗 Firestore Consoleで確認: https://console.firebase.google.com/
   プロジェクト > Firestore Database > データ > teams
```

### 3. 動作確認

#### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

#### 確認項目

1. **トップページが表示される**
   - エラーが表示されないことを確認

2. **ユーザー登録**
   - `/signup`にアクセス
   - ユーザー登録を実行
   - Firestore Consoleの`users`コレクションにデータが作成されることを確認

3. **コミュニティページ**
   - `/community`にアクセス
   - チーム一覧が表示されることを確認

4. **スレッド作成**
   - `/community/new`にアクセス
   - スレッドを作成
   - Firestore Consoleの`threads`コレクションにデータが作成されることを確認

## 🔧 トラブルシューティング

### エラー: FIREBASE_PROJECT_ID が設定されていません

**原因**: `.env.local`ファイルに`NEXT_PUBLIC_FIREBASE_PROJECT_ID`が設定されていない

**対処法**:
1. `.env.local`ファイルを確認
2. `NEXT_PUBLIC_FIREBASE_PROJECT_ID=baskettalkjapan`が設定されているか確認

### エラー: Firebase Admin SDKの初期化に失敗しました

**原因**: Firebase CLIでログインしていない

**対処法**:
```bash
# Firebase CLIをインストール（未インストールの場合）
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# 再度実行
npm run seed:teams
```

### エラー: permission-denied

**原因**: セキュリティルールが正しく設定されていない

**対処法**:
1. Firebase Console > Firestore Database > ルール を確認
2. 開発環境用のルールが設定されているか確認
3. 「公開」をクリック

### エラー: dotenv is not defined

**原因**: `dotenv`パッケージがインストールされていない

**対処法**:
```bash
npm install dotenv
```

## 📚 次のステップ

セットアップが完了したら、以下を実装できます：

- [ ] スレッド詳細ページの実装
- [ ] 投稿・返信機能の実装
- [ ] いいね機能の実装
- [ ] 通報機能の実装
- [ ] 通知機能の実装
- [ ] ユーザープロフィールページの実装

## 📖 参考ドキュメント

- [Firestore Database セットアップガイド](FIRESTORE_SETUP.md)
- [セットアップチェックリスト](SETUP_CHECKLIST.md)

