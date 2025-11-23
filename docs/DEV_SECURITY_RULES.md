# 開発環境用セキュリティルール（一時的）

⚠️ **重要**: このルールは開発環境でのみ使用してください。本番環境では使用しないでください。

## 開発環境用ルール（全コレクション書き込み許可）

Firebase Console > Firestore Database > ルール で以下を設定：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 開発環境用：すべてのコレクションで読み書きを許可
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

このルールを設定すると：
- ✅ すべてのコレクションで読み取りが可能
- ✅ すべてのコレクションで書き込みが可能
- ✅ 認証なしでもデータの作成・更新・削除が可能

## 使用方法

1. Firebase Console > Firestore Database > ルール を開く
2. 上記のルールをコピー&ペースト
3. 「公開」をクリック
4. スクリプトを実行：
   ```bash
   npm run seed:teams
   ```

## 本番環境用ルールに戻す方法

データ投入が完了したら、**必ず本番環境用のルールに戻してください**。

### 本番環境用ルール（推奨）

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーコレクション
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // チームコレクション（読み取り専用）
    match /teams/{teamId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin']);
    }
    
    // 試合コレクション（読み取り専用）
    match /matches/{matchId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin']);
    }
    
    // スレッドコレクション
    match /threads/{threadId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.author_id || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'moderator']));
      allow delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'moderator']);
    }
    
    // 投稿コレクション
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.author_id || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'moderator']));
      allow delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'moderator']);
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

## チェックリスト

- [ ] 開発環境用ルールを設定
- [ ] データ投入スクリプトを実行
- [ ] データが正しく投入されたことを確認
- [ ] **本番環境用ルールに戻す** ⚠️ 重要

## 注意事項

⚠️ **開発環境用ルールは本番環境では絶対に使用しないでください。**

- 誰でもデータを読み書きできる状態になります
- 悪意のあるユーザーがデータを削除・改ざんする可能性があります
- セキュリティリスクが非常に高くなります

データ投入が完了したら、**必ず本番環境用のルールに戻してください**。

