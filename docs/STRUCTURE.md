# ドキュメント構造

## ディレクトリ構造

```
docs/
├── README.md                    # ドキュメントの概要
├── INDEX.md                     # ドキュメントインデックス（カテゴリ別）
├── STRUCTURE.md                 # このファイル（構造説明）
│
├── QUICK_START.md               # クイックスタートガイド
├── SETUP_CHECKLIST.md           # セットアップチェックリスト
│
├── FIRESTORE_SETUP.md           # Firestore Database セットアップ
├── FIRESTORE_INDEX_SETUP.md    # Firestore インデックス設定
├── COLLECTION_CREATION.md       # コレクション作成方法
│
├── BILLING_SETUP.md             # 課金設定ガイド
├── BILLING_SAFETY.md            # 課金に関する安全対策
├── BILLING_CHANGES.md           # 課金ポリシーの変更について
├── BUDGET_SETUP_GUIDE.md        # 予算アラート設定ガイド
│
├── DEV_SECURITY_RULES.md        # 開発用セキュリティルール
├── MANUAL_SEED_TEAMS.md         # チームデータの手動シード方法
│
├── requirements/                # 要件定義書
│   ├── README.md
│   ├── 01-thread-detail-page.md
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
        ├── README.md
        └── 500_ERROR_FINAL.md
```

## カテゴリ別分類

### 📚 セットアップ・開始
- `QUICK_START.md` - プロジェクトの開始方法
- `SETUP_CHECKLIST.md` - セットアップ手順の確認

### 🔥 Firebase関連
- `FIRESTORE_SETUP.md` - Firestoreの初期設定
- `FIRESTORE_INDEX_SETUP.md` - インデックスの作成方法
- `COLLECTION_CREATION.md` - コレクションの作成について

### 💰 課金・予算管理
- `BILLING_SETUP.md` - Firebase課金の設定方法
- `BILLING_SAFETY.md` - 予期しない課金を防ぐ方法
- `BILLING_CHANGES.md` - 課金ポリシーの変更履歴
- `BUDGET_SETUP_GUIDE.md` - 予算アラートの設定方法

### 📋 要件定義
- `requirements/` - 各ページの要件定義
  - `01-thread-detail-page.md` - スレッド詳細ページ
  - `API_GUIDE.md` - APIデータ取得の手順
  - `completed/` - 完了した要件定義書

### 🐛 トラブルシューティング
- `troubleshooting/TROUBLESHOOTING.md` - 一般的なエラーと解決方法
- `troubleshooting/ERROR_HANDLING.md` - エラーハンドリングのベストプラクティス
- `troubleshooting/500_ERROR_DEBUG.md` - 500エラーの詳細なデバッグ手順
- `troubleshooting/DEBUG_STEPS.md` - デバッグ手順
- `troubleshooting/archive/` - 解決済みの問題（参考用）

### 🛠️ 開発ツール
- `DEV_SECURITY_RULES.md` - 開発環境での一時的なセキュリティルール
- `MANUAL_SEED_TEAMS.md` - チームデータの手動追加方法

## ファイル命名規則

- **大文字**: 主要なガイドやセットアップ手順
- **小文字**: 詳細な手順や特定の機能に関するドキュメント
- **数字プレフィックス**: 優先順位が明確な場合（例: `01-thread-detail-page.md`）

## ドキュメントの更新ルール

1. **新しい機能を追加した場合**
   - `requirements/` に要件定義書を作成
   - 完了したら `requirements/completed/` に移動

2. **エラーが発生した場合**
   - `troubleshooting/` にトラブルシューティングドキュメントを作成または更新
   - 解決済みの場合は `troubleshooting/archive/` に移動

3. **設定方法を追加した場合**
   - 適切なカテゴリのドキュメントに追加
   - 必要に応じて新しいドキュメントを作成

