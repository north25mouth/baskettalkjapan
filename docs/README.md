# BasketTalk Japan ドキュメント

このディレクトリには、プロジェクトのドキュメントが含まれています。

## ディレクトリ構造

詳細は [STRUCTURE.md](./STRUCTURE.md) を参照してください。

```
docs/
├── README.md                    # このファイル
├── INDEX.md                     # ドキュメントインデックス（カテゴリ別）
├── STRUCTURE.md                 # ドキュメント構造の詳細説明
│
├── QUICK_START.md               # クイックスタートガイド
├── SETUP_CHECKLIST.md           # セットアップチェックリスト
│
├── FIRESTORE_SETUP.md           # Firestore Database セットアップ
├── FIRESTORE_INDEX_SETUP.md    # Firestore インデックス設定
├── COLLECTION_CREATION.md       # コレクション作成方法
│
├── BILLING.md                   # 課金・予算管理ガイド（統合版）
│
├── DEV_SECURITY_RULES.md        # 開発用セキュリティルール
├── MANUAL_SEED_TEAMS.md         # チームデータの手動シード方法
├── WINDOWS_SETUP_PROMPT.md      # Windows環境構築プロンプト（Cursor用）
├── WINDOWS_SETUP_PROMPT_DETAILED.md  # Windows環境構築プロンプト（詳細版）
│
├── requirements/                # 要件定義書
│   ├── README.md
│   ├── 01-thread-detail-page.md
│   ├── 06-user-profile-page.md
│   ├── API_GUIDE.md
│   └── completed/               # 完了した要件定義書
│
└── troubleshooting/             # トラブルシューティング
    ├── README.md
    ├── TROUBLESHOOTING.md       # 一般的なエラーと解決方法
    ├── ERROR_HANDLING.md        # エラーハンドリングのベストプラクティス
    ├── 500_ERROR_DEBUG.md       # 500エラーのデバッグガイド
    ├── DEBUG_STEPS.md           # デバッグ手順
    └── archive/                 # 解決済みの問題（参考用）
```

## 主要ドキュメント

### セットアップ関連
- [クイックスタートガイド](./QUICK_START.md) - プロジェクトの開始方法
- [セットアップチェックリスト](./SETUP_CHECKLIST.md) - セットアップ手順の確認
- [Firestore Database セットアップ](./FIRESTORE_SETUP.md) - Firestoreの初期設定
- [課金・予算管理ガイド](./BILLING.md) - Firebase課金の設定と予算管理
- [Windows環境構築プロンプト（Cursor用）](./WINDOWS_SETUP_PROMPT.md) - Windows環境でのCursorを使った環境構築
- [Windows環境構築プロンプト（詳細版）](./WINDOWS_SETUP_PROMPT_DETAILED.md) - より詳細な手順を含むWindows環境構築プロンプト

### 開発関連
- [要件定義書](./requirements/README.md) - 各ページの要件定義
- [API ガイド](./requirements/API_GUIDE.md) - APIデータ取得の手順
- [エラーハンドリング](./troubleshooting/ERROR_HANDLING.md) - エラーハンドリングのベストプラクティス

### トラブルシューティング
- [トラブルシューティングガイド](./troubleshooting/TROUBLESHOOTING.md) - 一般的なエラーと解決方法（500エラー含む）
- [エラーハンドリング](./troubleshooting/ERROR_HANDLING.md) - エラーハンドリングのベストプラクティス

### データ管理
- [チームデータの手動シード](./MANUAL_SEED_TEAMS.md) - チームデータの手動追加方法
- [Firestore インデックス設定](./FIRESTORE_INDEX_SETUP.md) - インデックスの作成方法

## ドキュメントの更新

- 新しい機能を追加した場合は、対応する要件定義書を作成
- 完了した要件定義書は `requirements/completed/` に移動
- エラーが発生した場合は、トラブルシューティングドキュメントを更新

## 注意事項

- 開発用のセキュリティルール（`DEV_SECURITY_RULES.md`）は本番環境では使用しないでください
- 課金に関する設定は、必ず予算アラートを設定してください（`BILLING.md`参照）

