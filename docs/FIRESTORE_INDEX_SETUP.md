# Firestore インデックス設定ガイド

## エラーメッセージ

```
The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/baskettalkjapan/firestore/indexes?create_composite=...
```

## 解決方法

### 方法1: エラーメッセージのリンクから作成（推奨）

1. エラーメッセージに表示されたリンクをクリック
2. Firebase Consoleでインデックス作成画面が開く
3. 「インデックスを作成」をクリック
4. インデックスの作成完了を待つ（数分かかる場合があります）

### 方法2: Firebase Consoleから手動で作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクト「baskettalkjapan」を選択
3. 左メニューから「Firestore Database」を選択
4. 「インデックス」タブを選択
5. 「インデックスを作成」をクリック
6. 以下の設定を入力：

**コレクションID**: `threads`

**フィールドを追加**:
- フィールド: `team_id`
- 並び順: 昇順
- フィールド: `created_at`
- 並び順: 降順

7. 「作成」をクリック

### 方法3: firestore.indexes.json を使用（推奨）

プロジェクトルートに `firestore.indexes.json` を作成：

```json
{
  "indexes": [
    {
      "collectionGroup": "threads",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "team_id",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "created_at",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "threads",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "match_id",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "created_at",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "threads",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "type",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "created_at",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

その後、Firebase CLIでデプロイ：

```bash
firebase deploy --only firestore:indexes
```

## 必要なインデックス一覧

### threadsコレクション

1. **team_id + created_at（降順）**
   - 用途: チーム別スレッド一覧

2. **match_id + created_at（降順）**
   - 用途: 試合別スレッド一覧

3. **type + created_at（降順）**
   - 用途: スレッドタイプ別一覧

### postsコレクション

1. **thread_id + created_at（昇順）**
   - 用途: スレッド内の投稿一覧

2. **thread_id + deleted_flag + created_at（昇順）**
   - 用途: 削除されていない投稿のみ取得

### likesコレクション

1. **user_id + post_id**
   - 用途: ユーザーがいいね済みか確認

2. **post_id + created_at（降順）**
   - 用途: 投稿のいいね一覧

### notificationsコレクション

1. **user_id + read_flag + created_at（降順）**
   - 用途: ユーザーの未読通知一覧

## インデックスの作成完了確認

1. Firebase Console > Firestore Database > インデックス
2. 作成したインデックスが「構築中」から「有効」に変わったら完了

## 注意事項

- インデックスの作成には数分かかる場合があります
- インデックスが作成されるまで、該当のクエリはエラーになります
- 大量のデータがある場合、インデックスの作成に時間がかかります

