# トラブルシューティングドキュメント

このディレクトリには、アプリケーションのトラブルシューティングとエラーハンドリングに関するドキュメントが含まれています。

## ドキュメント一覧

### [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
一般的なエラーとその解決方法をまとめたガイドです（500エラーのデバッグ手順を含む）。

**内容:**
- 500 Internal Server Error（原因の特定方法、デバッグ手順を含む）
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

### [AUTH_CONFIGURATION_ERROR.md](./AUTH_CONFIGURATION_ERROR.md)
認証設定エラーの解決方法です。

### [AUTH_400_ERROR.md](./AUTH_400_ERROR.md)
認証400エラーの解決方法です。

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

