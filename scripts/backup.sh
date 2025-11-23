#!/bin/bash

# BasketTalk Japan バックアップスクリプト
# 使用方法: ./scripts/backup.sh

set -e

# プロジェクトルートに移動
cd "$(dirname "$0")/.."

# バックアップディレクトリを作成
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_PATH="$BACKUP_DIR/backup_$TIMESTAMP"

mkdir -p "$BACKUP_PATH"

echo "📦 バックアップを開始します..."
echo "バックアップ先: $BACKUP_PATH"

# 1. ソースコードのバックアップ（.gitignoreで除外されているファイルを除く）
echo "📁 ソースコードをバックアップ中..."
mkdir -p "$BACKUP_PATH/src"
rsync -av --exclude='node_modules' \
          --exclude='.next' \
          --exclude='.git' \
          --exclude='backups' \
          --exclude='*.log' \
          . "$BACKUP_PATH/src/"

# 2. 環境変数ファイルのバックアップ（存在する場合）
if [ -f ".env.local" ]; then
  echo "🔐 環境変数ファイルをバックアップ中..."
  cp .env.local "$BACKUP_PATH/.env.local.backup"
fi

# 3. package.jsonとpackage-lock.jsonのバックアップ
echo "📦 依存関係情報をバックアップ中..."
cp package.json "$BACKUP_PATH/"
if [ -f "package-lock.json" ]; then
  cp package-lock.json "$BACKUP_PATH/"
fi

# 4. Firestoreデータのエクスポート（オプション）
if command -v firebase &> /dev/null; then
  echo "🔥 Firestoreデータをエクスポート中..."
  mkdir -p "$BACKUP_PATH/firestore"
  firebase firestore:export "$BACKUP_PATH/firestore" --project baskettalkjapan 2>/dev/null || {
    echo "⚠️  Firestoreのエクスポートに失敗しました（スキップします）"
  }
fi

# 5. バックアップ情報ファイルを作成
cat > "$BACKUP_PATH/backup_info.txt" << EOF
バックアップ情報
================
日時: $(date)
プロジェクト: BasketTalk Japan
バージョン: $(node -p "require('./package.json').version" 2>/dev/null || echo "不明")
Gitコミット: $(git rev-parse HEAD 2>/dev/null || echo "Gitリポジトリ外")
ブランチ: $(git branch --show-current 2>/dev/null || echo "不明")

バックアップ内容:
- ソースコード（node_modules、.next、.gitを除く）
- 環境変数ファイル（.env.local）
- 依存関係情報（package.json、package-lock.json）
- Firestoreデータ（エクスポート可能な場合）

復元方法:
1. バックアップディレクトリからファイルをコピー
2. npm install を実行
3. .env.local を復元
4. Firestoreデータをインポート（必要に応じて）
EOF

# 6. バックアップを圧縮
echo "🗜️  バックアップを圧縮中..."
cd "$BACKUP_DIR"
tar -czf "backup_$TIMESTAMP.tar.gz" "backup_$TIMESTAMP"
rm -rf "backup_$TIMESTAMP"
cd ..

echo ""
echo "✅ バックアップが完了しました！"
echo "📦 バックアップファイル: $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
echo "📄 バックアップ情報: $BACKUP_PATH/backup_info.txt"
echo ""
echo "💡 ヒント: 古いバックアップを削除する場合は以下を実行"
echo "   find $BACKUP_DIR -name 'backup_*.tar.gz' -mtime +30 -delete"

