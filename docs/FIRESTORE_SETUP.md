# Firestore Database セットアップ手順

BasketTalk Japanプロジェクト用のFirestore Database設定ガイド

## 目次

1. [Firebaseプロジェクトの作成](#1-firebaseプロジェクトの作成)
2. [Firestore Databaseの作成](#2-firestore-databaseの作成)
3. [セキュリティルールの設定](#3-セキュリティルールの設定)
4. [コレクション構造の確認](#4-コレクション構造の確認)
5. [初期データの投入（オプション）](#5-初期データの投入オプション)

---

## 1. Firebaseプロジェクトの作成

### 1.1 Firebase Consoleにアクセス

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. Googleアカウントでログイン

### 1.2 プロジェクトの作成

1. 「プロジェクトを追加」をクリック
2. プロジェクト名を入力（例: `baskettalkjapan`）
3. Google Analyticsの設定（任意）
4. 「プロジェクトを作成」をクリック
5. プロジェクトの作成完了を待つ（数秒〜数分）

### 1.3 Webアプリの登録

1. プロジェクトダッシュボードで「</>」アイコン（Webアプリを追加）をクリック
2. アプリのニックネームを入力（例: `BasketTalk Japan Web`）
3. 「このアプリのFirebase Hostingも設定します」はチェック不要（後で設定可能）
4. 「アプリを登録」をクリック
5. **Firebase設定情報をコピー**（後で使用します）

設定情報の例：
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "baskettalkjapan.firebaseapp.com",
  projectId: "baskettalkjapan",
  storageBucket: "baskettalkjapan.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

## 2. 請求先情報の登録（必須）

⚠️ **重要**: Firestore Databaseを作成するには、請求先情報の登録が必要です。
無料プラン（Spark プラン）でも請求先情報の登録は必要ですが、**無料枠内であれば課金されません**。

### 2.1 請求先情報の登録手順

1. エラーメッセージに表示されたリンクをクリック、または以下にアクセス：
   - [Google Cloud Console - 請求を有効化](https://console.developers.google.com/billing/enable?project=baskettalkjapan)
   - または、[Firebase Console](https://console.firebase.google.com/) > プロジェクト設定 > 使用量と請求

2. 「請求先アカウントをリンク」をクリック

3. 新しい請求先アカウントを作成するか、既存のアカウントを選択

4. 請求先情報を入力：
   - 国/地域を選択
   - 請求先名を入力
   - 住所を入力
   - クレジットカード情報を入力（無料枠内では課金されません）

5. 「送信して有効化」をクリック

6. **数分待つ**（請求先情報の反映に時間がかかる場合があります）

### 2.2 Firestoreの無料枠について

Firestoreには**無料枠（Spark プラン）**があり、以下の範囲内であれば無料です：

- **ストレージ**: 1GB
- **読み取り**: 50,000回/日
- **書き込み**: 20,000回/日
- **削除**: 20,000回/日

開発・テスト段階では、通常この無料枠で十分です。

詳細: [Firestore 料金](https://firebase.google.com/pricing?hl=ja)

### 2.3 代替案: Firebase Emulator Suite（開発環境のみ）

請求先情報を登録したくない場合、開発環境では**Firebase Emulator Suite**を使用できます：

```bash
# Firebase CLIをインストール
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# プロジェクトを初期化
firebase init

# Emulatorを起動
firebase emulators:start
```

ただし、本番環境ではFirestore Databaseが必要です。

## 3. Firestore Databaseの作成

### 3.1 Firestore Databaseの作成

1. Firebase Consoleの左メニューから「Firestore Database」を選択
2. 「データベースを作成」をクリック
3. **セキュリティルールの選択**：
   - **開発中**: 「テストモードで開始」を選択（後でルールを設定）
   - **本番環境**: 「本番モードで開始」を選択
4. **ロケーションの選択**：
   - 推奨: `asia-northeast1`（東京リージョン）
   - または `asia-northeast2`（大阪リージョン）
   - 注意: ロケーションは後から変更できません
5. 「有効にする」をクリック
6. データベースの作成完了を待つ（数分かかる場合があります）

**注意**: 請求先情報が反映されていない場合は、数分待ってから再試行してください。

### 3.2 データベースモードの確認

- **ネイティブモード**: 推奨（本プロジェクトで使用）
- **Datastoreモード**: 使用しない

---

## 4. セキュリティルールの設定

### 4.1 開発環境用ルール（初期設定）

Firestore Consoleの「ルール」タブで以下を設定：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーコレクション
    match /users/{userId} {
      allow read: if true; // 全員が読み取り可能
      allow write: if request.auth != null && request.auth.uid == userId; // 自分のみ書き込み可能
    }
    
    // チームコレクション
    match /teams/{teamId} {
      allow read: if true; // 全員が読み取り可能
      allow write: if request.auth != null; // 認証済みユーザーのみ書き込み可能
    }
    
    // 試合コレクション
    match /matches/{matchId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // スレッドコレクション
    match /threads/{threadId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.author_id || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'moderator']));
    }
    
    // 投稿コレクション
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.author_id || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'moderator']));
    }
    
    // いいねコレクション
    match /likes/{likeId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.user_id == request.auth.uid;
      allow delete: if request.auth != null && resource.data.user_id == request.auth.uid;
    }
    
    // 通報コレクション
    match /reports/{reportId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'moderator']);
      allow create: if request.auth != null && request.resource.data.reporter_id == request.auth.uid;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'moderator']);
    }
    
    // 通知コレクション
    match /notifications/{notificationId} {
      allow read: if request.auth != null && resource.data.user_id == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.user_id == request.auth.uid;
    }
  }
}
```

### 4.2 本番環境用ルール（推奨）

本番環境では、より厳格なルールを設定してください：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ヘルパー関数：管理者チェック
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin']);
    }
    
    function isModerator() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'moderator']);
    }
    
    // ユーザーコレクション
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // チームコレクション（読み取り専用）
    match /teams/{teamId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // 試合コレクション（読み取り専用）
    match /matches/{matchId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // スレッドコレクション
    match /threads/{threadId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.author_id || isModerator());
      allow delete: if isModerator();
    }
    
    // 投稿コレクション
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.author_id || isModerator());
      allow delete: if isModerator();
    }
    
    // いいねコレクション
    match /likes/{likeId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.user_id == request.auth.uid;
      allow delete: if request.auth != null && resource.data.user_id == request.auth.uid;
    }
    
    // 通報コレクション
    match /reports/{reportId} {
      allow read: if isModerator();
      allow create: if request.auth != null && request.resource.data.reporter_id == request.auth.uid;
      allow update: if isModerator();
    }
    
    // 通知コレクション
    match /notifications/{notificationId} {
      allow read: if request.auth != null && resource.data.user_id == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.user_id == request.auth.uid;
    }
  }
}
```

### 4.3 ルールの公開

1. ルールを入力後、「公開」をクリック
2. ルールの検証が実行されます
3. エラーがないことを確認

---

## 5. コレクション構造の確認

### ⚠️ 重要な注意

**Firestoreでは、コレクションは自動的に作成されません。**

コレクションは、**最初のドキュメントを作成した時に自動的に作成**されます。

セキュリティルールの公開とは関係ありません。ルールは正しく公開されていれば、データの作成・読み取りの権限を制御するだけです。

### 5.1 コレクション一覧

以下のコレクションは、アプリやスクリプトから最初のドキュメントを作成した時に自動的に作成されます：

- `users` - ユーザー情報（ユーザー登録時に作成）
- `teams` - チーム情報（30チーム）（チームデータ投入時に作成）
- `matches` - 試合情報（試合データ作成時に作成）
- `threads` - スレッド（スレッド作成時に作成）
- `posts` - 投稿・コメント（投稿作成時に作成）
- `likes` - いいね（いいね作成時に作成）
- `reports` - 通報（通報作成時に作成）
- `notifications` - 通知（通知作成時に作成）

### 5.2 コレクションを確認する方法

**現在、Firestore Consoleにコレクションが表示されないのは正常です。**

コレクションは、以下のいずれかの方法で作成できます：

1. **チームデータを投入する**（推奨）
   ```bash
   npm install firebase-admin dotenv
   npm run seed:teams
   ```
   これで`teams`コレクションが作成されます。

2. **アプリからデータを作成する**
   - ユーザー登録（`/signup`）→ `users`コレクションが作成される
   - スレッド作成（`/community/new`）→ `threads`コレクションが作成される

3. **Firebase Consoleから手動で作成する**
   - Firestore Console > データ > 「コレクションを開始」をクリック
   - コレクションIDを入力（例: `teams`）
   - 最初のドキュメントを作成

### 5.3 コレクションを作成する方法

コレクションを作成するには、以下のいずれかの方法を使用します：

1. **チームデータを投入する**（推奨）
   
   **方法A: Firebase Consoleから手動で投入**（最も簡単）
   - [手動投入方法](MANUAL_SEED_TEAMS.md) を参照
   
   **方法B: スクリプトで投入**（認証が必要）
   ```bash
   npm install firebase-admin dotenv
   # Firebase CLIでログインが必要: firebase login
   npm run seed:teams
   ```
   
   詳細は [コレクションの作成について](COLLECTION_CREATION.md) を参照

2. **アプリからデータを作成する**
   - ユーザー登録 → `users`コレクションが作成される
   - スレッド作成 → `threads`コレクションが作成される

3. **Firebase Consoleから手動で作成する**
   - データタブ > 「コレクションを開始」をクリック

### 5.4 インデックスの作成

以下のクエリを使用する場合、インデックスの作成が必要です：

1. **threadsコレクション**
   - `team_id` + `created_at`（降順）
   - `match_id` + `created_at`（降順）
   - `type` + `created_at`（降順）

2. **postsコレクション**
   - `thread_id` + `created_at`（昇順）
   - `deleted_flag` + `created_at`（昇順）

3. **likesコレクション**
   - `user_id` + `post_id`
   - `post_id` + `created_at`（降順）

4. **notificationsコレクション**
   - `user_id` + `read_flag` + `created_at`（降順）

**インデックスの作成方法：**
- Firestore Consoleでクエリを実行すると、自動的にインデックス作成のリンクが表示されます
- または「インデックス」タブから手動で作成

**注意**: インデックスは、実際にクエリを実行した時に必要に応じて作成されます。事前に作成する必要はありません。

---

## 6. 初期データの投入（オプション）

### 6.1 チームデータの投入

Firestore Consoleの「データ」タブから、以下の手順でチームデータを投入：

1. `teams`コレクションを作成
2. 各チームのドキュメントを追加

**例：LAレイカーズ**
```json
{
  "name": "LAレイカーズ",
  "abbreviation": "LAL",
  "region": "West",
  "created_at": "2025-11-23T00:00:00Z"
}
```

**全30チームのデータ投入スクリプト**（Node.js）

```javascript
// scripts/seed-teams.js
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const teams = [
  { name: "アトランタ・ホークス", abbreviation: "ATL", region: "East" },
  { name: "ボストン・セルティックス", abbreviation: "BOS", region: "East" },
  { name: "ブルックリン・ネッツ", abbreviation: "BKN", region: "East" },
  { name: "シャーロット・ホーネッツ", abbreviation: "CHA", region: "East" },
  { name: "シカゴ・ブルズ", abbreviation: "CHI", region: "East" },
  { name: "クリーブランド・キャバリアーズ", abbreviation: "CLE", region: "East" },
  { name: "ダラス・マーベリックス", abbreviation: "DAL", region: "West" },
  { name: "デンバー・ナゲッツ", abbreviation: "DEN", region: "West" },
  { name: "デトロイト・ピストンズ", abbreviation: "DET", region: "East" },
  { name: "ゴールデンステート・ウォリアーズ", abbreviation: "GSW", region: "West" },
  { name: "ヒューストン・ロケッツ", abbreviation: "HOU", region: "West" },
  { name: "インディアナ・ペイサーズ", abbreviation: "IND", region: "East" },
  { name: "LAクリッパーズ", abbreviation: "LAC", region: "West" },
  { name: "LAレイカーズ", abbreviation: "LAL", region: "West" },
  { name: "メンフィス・グリズリーズ", abbreviation: "MEM", region: "West" },
  { name: "マイアミ・ヒート", abbreviation: "MIA", region: "East" },
  { name: "ミルウォーキー・バックス", abbreviation: "MIL", region: "East" },
  { name: "ミネソタ・ティンバーウルブズ", abbreviation: "MIN", region: "West" },
  { name: "ニューオーリンズ・ペリカンズ", abbreviation: "NOP", region: "West" },
  { name: "ニューヨーク・ニックス", abbreviation: "NYK", region: "East" },
  { name: "オクラホマシティ・サンダー", abbreviation: "OKC", region: "West" },
  { name: "オーランド・マジック", abbreviation: "ORL", region: "East" },
  { name: "フィラデルフィア・76ers", abbreviation: "PHI", region: "East" },
  { name: "フェニックス・サンズ", abbreviation: "PHX", region: "West" },
  { name: "ポートランド・トレイルブレイザーズ", abbreviation: "POR", region: "West" },
  { name: "サクラメント・キングス", abbreviation: "SAC", region: "West" },
  { name: "サンアントニオ・スパーズ", abbreviation: "SAS", region: "West" },
  { name: "トロント・ラプターズ", abbreviation: "TOR", region: "East" },
  { name: "ユタ・ジャズ", abbreviation: "UTA", region: "West" },
  { name: "ワシントン・ウィザーズ", abbreviation: "WAS", region: "East" }
];

async function seedTeams() {
  const batch = db.batch();
  const now = admin.firestore.Timestamp.now();
  
  teams.forEach((team, index) => {
    const docRef = db.collection('teams').doc();
    batch.set(docRef, {
      ...team,
      created_at: now
    });
  });
  
  await batch.commit();
  console.log(`✅ ${teams.length}チームのデータを投入しました`);
}

seedTeams().catch(console.error);
```

### 6.2 環境変数の設定

プロジェクトルートに`.env.local`ファイルを作成：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 7. 動作確認

### 7.1 開発サーバーの起動

```bash
npm run dev
```

### 7.2 確認項目

1. **認証機能**
   - `/signup`でユーザー登録
   - `/login`でログイン
   - Firestore Consoleの`users`コレクションにデータが作成されているか確認

2. **スレッド作成**
   - `/community/new`でスレッド作成
   - Firestore Consoleの`threads`コレクションにデータが作成されているか確認

3. **データ読み込み**
   - `/community`でスレッド一覧が表示されるか確認

---

## 8. トラブルシューティング

### 8.1 よくあるエラー

**エラー: Missing or insufficient permissions**
- セキュリティルールを確認
- 認証状態を確認（ログインしているか）

**エラー: Index not found**
- Firestore Consoleの「インデックス」タブでインデックスを作成
- または、エラーメッセージに表示されるリンクから作成

**エラー: This API method requires billing to be enabled**

**原因**: 請求先情報が登録されていない、または反映されていない

**対処法**:
1. [Google Cloud Console - 請求を有効化](https://console.developers.google.com/billing/enable?project=baskettalkjapan)にアクセス
2. 請求先情報を登録（無料枠内であれば課金されません）
3. 数分待ってから再試行
4. それでもエラーが出る場合は、Firebase Console > プロジェクト設定 > 使用量と請求 で請求先アカウントがリンクされているか確認

**エラー: Firebase not initialized**
- `.env.local`ファイルが正しく設定されているか確認
- 環境変数名が`NEXT_PUBLIC_`で始まっているか確認

### 8.2 デバッグ方法

1. **Firestore Consoleでデータを確認**
   - データが正しく保存されているか
   - フィールド名が正しいか

2. **ブラウザの開発者ツール**
   - Consoleタブでエラーメッセージを確認
   - NetworkタブでFirestoreへのリクエストを確認

3. **Firebase Emulator Suite（開発時）**
   - ローカルでFirestoreをエミュレート
   - 本番環境に影響を与えずにテスト可能

---

## 9. 次のステップ

1. **Authenticationの設定**
   - メール/パスワード認証を有効化
   - Google認証を有効化

2. **Storageの設定（必要に応じて）**
   - ユーザーアバター画像のアップロード用

3. **Cloud Functionsの設定（将来）**
   - 通知送信
   - 試合スレッドの自動生成

---

## 参考リンク

- [Firestore ドキュメント](https://firebase.google.com/docs/firestore)
- [Firestore セキュリティルール](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)

