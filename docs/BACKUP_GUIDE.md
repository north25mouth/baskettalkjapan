# バックアップガイド

## 概要

このプロジェクトには、ソースコードとFirestoreデータをバックアップする機能が含まれています。

## バックアップ方法

### 1. 完全バックアップ（推奨）

ソースコード、環境変数、依存関係情報をバックアップします：

```bash
npm run backup
```

または

```bash
./scripts/backup.sh
```

**バックアップ内容:**
- ソースコード（`node_modules`、`.next`、`.git`を除く）
- 環境変数ファイル（`.env.local`）
- 依存関係情報（`package.json`、`package-lock.json`）
- Firestoreデータ（エクスポート可能な場合）

**バックアップ先:**
- `backups/backup_YYYYMMDD_HHMMSS.tar.gz`

### 2. Firestoreデータのみのバックアップ

Firestoreデータのみをバックアップします：

```bash
npm run backup:firestore
```

**バックアップ内容:**
- すべてのコレクション（users, teams, matches, threads, posts, likes, reports, notifications）
- 各コレクションはJSONファイルとして保存

**バックアップ先:**
- `backups/firestore_YYYY-MM-DDTHH-MM-SS/`

## バックアップの復元

### 完全バックアップから復元

1. バックアップファイルを展開：
   ```bash
   cd backups
   tar -xzf backup_YYYYMMDD_HHMMSS.tar.gz
   cd backup_YYYYMMDD_HHMMSS
   ```

2. ファイルを復元：
   ```bash
   # ソースコードを復元
   cp -r src/* ../../
   
   # 環境変数を復元
   cp .env.local.backup ../../.env.local
   
   # 依存関係を再インストール
   cd ../..
   npm install
   ```

### Firestoreデータから復元

1. バックアップディレクトリを確認：
   ```bash
   ls backups/firestore_YYYY-MM-DDTHH-MM-SS/
   ```

2. 各JSONファイルを確認し、必要に応じてFirestore Consoleから手動でインポート

3. または、スクリプトを使用して復元（要実装）

## 自動バックアップ

### cronジョブの設定（オプション）

毎日自動的にバックアップを実行する場合：

```bash
# crontabを編集
crontab -e

# 毎日午前2時にバックアップを実行
0 2 * * * cd /path/to/baskettalkjapan && npm run backup
```

## バックアップの管理

### 古いバックアップの削除

30日以上古いバックアップを削除：

```bash
find backups -name 'backup_*.tar.gz' -mtime +30 -delete
find backups -name 'firestore_*' -type d -mtime +30 -exec rm -rf {} +
```

### バックアップの確認

```bash
# バックアップ一覧を表示
ls -lh backups/

# バックアップ情報を確認
tar -tzf backups/backup_YYYYMMDD_HHMMSS.tar.gz | head -20
```

## 注意事項

1. **環境変数の保護**
   - `.env.local`には機密情報が含まれています
   - バックアップファイルは安全な場所に保管してください

2. **Firestoreデータのサイズ**
   - データが多い場合、バックアップに時間がかかる可能性があります

3. **バックアップの保存場所**
   - `backups/`ディレクトリは`.gitignore`に含まれています
   - バックアップファイルはGitにコミットされません

4. **定期的なバックアップ**
   - 重要な変更の前後には必ずバックアップを取ることを推奨します

## トラブルシューティング

### バックアップスクリプトが実行できない

```bash
# 実行権限を付与
chmod +x scripts/backup.sh
```

### Firestoreのエクスポートに失敗する

- Firebase CLIがインストールされているか確認
- Firebaseにログインしているか確認
- プロジェクトIDが正しいか確認

### バックアップファイルが大きすぎる

- `node_modules`や`.next`が含まれていないか確認
- 必要に応じて、バックアップ対象を調整

