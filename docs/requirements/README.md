# 要件定義書

各機能の要件定義書を管理するフォルダ

## フォルダ構造

```
requirements/
├── README.md (このファイル)
├── 01-thread-detail-page.md (優先順位1: スレッド詳細ページ)
├── 06-user-profile-page.md (優先順位6: ユーザープロフィールページ)
├── API_GUIDE.md (APIデータ取得の手順)
└── completed/ (完了した要件定義書を移動)
    └── 07-nba-api-integration.md (NBA API統合 - 現在は使用していない)
```

## 作業フロー

1. 要件定義書を作成
2. 実装
3. テスト・動作確認
4. 完了した要件定義書を `completed/` フォルダに移動

## 優先順位とステータス

1. ✅ スレッド詳細ページ (`01-thread-detail-page.md`) - 完了
2. ✅ ユーザープロフィールページ (`06-user-profile-page.md`) - 完了
3. ✅ API ガイド (`API_GUIDE.md`) - 完了
4. ❌ NBA API統合 (`07-nba-api-integration.md`) - 完了（現在は使用していない、バックアップあり）

## ステータス

- ⏳ 未着手
- 🔄 実装中
- ✅ 完了
- ❌ 保留

