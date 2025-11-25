# ドキュメントインデックス

## 📚 カテゴリ別ドキュメント

### 🚀 セットアップ・開始
- [クイックスタートガイド](./QUICK_START.md) - プロジェクトの開始方法
- [セットアップチェックリスト](./SETUP_CHECKLIST.md) - セットアップ手順の確認

### 🔥 Firebase関連
- [Firestore Database セットアップ](./FIRESTORE_SETUP.md) - Firestoreの初期設定
- [Firestore インデックス設定](./FIRESTORE_INDEX_SETUP.md) - インデックスの作成方法
- [コレクション作成方法](./COLLECTION_CREATION.md) - コレクションの作成について

### 💰 課金・予算管理
- [課金・予算管理ガイド](./BILLING.md) - Firebase課金の設定、予算管理、安全対策（統合版）

### 📋 要件定義
- [要件定義書一覧](./requirements/README.md) - 各ページの要件定義
- [API ガイド](./requirements/API_GUIDE.md) - APIデータ取得の手順

### 🐛 トラブルシューティング
- [トラブルシューティングガイド](./troubleshooting/TROUBLESHOOTING.md) - 一般的なエラーと解決方法（500エラー含む）
- [エラーハンドリング](./troubleshooting/ERROR_HANDLING.md) - エラーハンドリングのベストプラクティス

### 🛠️ 開発ツール
- [開発用セキュリティルール](./DEV_SECURITY_RULES.md) - 開発環境での一時的なセキュリティルール
- [チームデータの手動シード](./MANUAL_SEED_TEAMS.md) - チームデータの手動追加方法

## 📝 ドキュメントの更新ルール

1. **新しい機能を追加した場合**
   - `docs/requirements/` に要件定義書を作成
   - 完了したら `docs/requirements/completed/` に移動

2. **エラーが発生した場合**
   - `docs/troubleshooting/` にトラブルシューティングドキュメントを作成または更新
   - 解決済みの場合は `docs/troubleshooting/archive/` に移動

3. **設定方法を追加した場合**
   - 適切なカテゴリのドキュメントに追加
   - 必要に応じて新しいドキュメントを作成

## 🔍 よく使うドキュメント

### 初めてセットアップする場合
1. [クイックスタートガイド](./QUICK_START.md)
2. [セットアップチェックリスト](./SETUP_CHECKLIST.md)
3. [Firestore Database セットアップ](./FIRESTORE_SETUP.md)
4. [課金・予算管理ガイド](./BILLING.md)

### エラーが発生した場合
1. [トラブルシューティングガイド](./troubleshooting/TROUBLESHOOTING.md)
2. [エラーハンドリング](./troubleshooting/ERROR_HANDLING.md)
3. 開発サーバーのコンソールでエラーメッセージを確認

### 新しい機能を開発する場合
1. [要件定義書一覧](./requirements/README.md)
2. 該当する要件定義書を確認
3. 実装後、要件定義書を `completed/` に移動

