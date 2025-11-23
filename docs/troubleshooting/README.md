# トラブルシューティングドキュメント

このディレクトリには、アプリケーションのトラブルシューティングとエラーハンドリングに関するドキュメントが含まれています。

## ドキュメント一覧

### [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
一般的なエラーとその解決方法をまとめたガイドです。

**内容:**
- 500 Internal Server Error
- 404 Not Found エラー
- 認証エラー
- パフォーマンスの問題
- よくある質問（FAQ）

### [ERROR_HANDLING.md](./ERROR_HANDLING.md)
エラーハンドリングのベストプラクティスをまとめたガイドです。

**内容:**
- サーバーコンポーネントでのエラーハンドリング
- Firebase関連のエラーハンドリング
- 型安全性とnullチェック
- エラーログのベストプラクティス
- リトライ機能

### [500_ERROR_DEBUG.md](./500_ERROR_DEBUG.md)
500エラーの詳細なデバッグガイドです。

### [DEBUG_STEPS.md](./DEBUG_STEPS.md)
デバッグ手順をまとめたガイドです。

### [500_ERROR_FINAL.md](./500_ERROR_FINAL.md) ⚠️ アーカイブ
500エラーの最終確認事項（解決済み - 参考用）

## 関連ドキュメント

- [Firestore Index Setup](../FIRESTORE_INDEX_SETUP.md) - Firestoreインデックスの設定方法
- [Firestore Setup](../FIRESTORE_SETUP.md) - Firestoreのセットアップ手順
- [Billing Safety](../BILLING_SAFETY.md) - 課金に関する安全対策

## エラーが発生した場合の手順

1. **エラーメッセージを確認**
   - 開発サーバーのコンソール（ターミナル）
   - ブラウザのコンソール（F12）

2. **エラーの種類を特定**
   - 500エラー → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)の「500 Internal Server Error」セクション
   - 404エラー → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)の「404 Not Found エラー」セクション

3. **解決方法を試す**
   - ドキュメントに記載されている解決方法を順番に試す

4. **問題が解決しない場合**
   - エラーログの全文を保存
   - 発生しているページのURLを記録
   - 実行した操作の手順を記録

## エラーハンドリングの実装

新しい機能を実装する際は、[ERROR_HANDLING.md](./ERROR_HANDLING.md)のベストプラクティスに従ってください。

特に重要なポイント：
- すべての非同期処理にtry-catchを実装
- nullチェックを実装
- パラメータの検証を実装
- 構造化されたログを出力

