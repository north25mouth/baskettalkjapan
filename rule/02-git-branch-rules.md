# Gitブランチルール

このドキュメントでは、BasketTalk JapanプロジェクトにおけるGitブランチの命名規則と運用ルールを定義します。

## ブランチ命名規則

### メインブランチ

- **`main`**: 本番環境にデプロイ可能な安定版コード
- **`develop`**: 開発中の統合ブランチ（将来的に使用する可能性あり）

### 機能ブランチ（Feature Branch）

**命名規則**: `feature/機能名`

**例**:
- `feature/user-profile-page`
- `feature/favorite-teams`
- `feature/search-functionality`

**ルール**:
- 機能追加時に使用
- 必ず `main` ブランチから分岐
- 機能名は英語で、ハイフン区切り（kebab-case）

### バグ修正ブランチ（Bugfix Branch）

**命名規則**: `bugfix/修正内容`

**例**:
- `bugfix/login-error`
- `bugfix/thread-display-issue`
- `bugfix/firestore-query-error`

**ルール**:
- バグ修正時に使用
- 必ず `main` ブランチから分岐
- 修正内容を簡潔に表現

### ホットフィックスブランチ（Hotfix Branch）

**命名規則**: `hotfix/緊急修正内容`

**例**:
- `hotfix/security-patch`
- `hotfix/critical-bug`

**ルール**:
- 本番環境の緊急修正時に使用
- 必ず `main` ブランチから分岐
- 修正後、即座に `main` にマージ

### リファクタリングブランチ（Refactor Branch）

**命名規則**: `refactor/リファクタリング内容`

**例**:
- `refactor/firestore-functions`
- `refactor/component-structure`

**ルール**:
- コードのリファクタリング時に使用
- 機能追加やバグ修正を伴わない場合のみ

## ブランチ運用フロー

### 1. 新しいブランチの作成

```bash
# mainブランチに切り替え
git checkout main

# 最新の状態に更新
git pull origin main

# 新しいブランチを作成して切り替え
git checkout -b feature/機能名
```

### 2. 作業の進め方

```bash
# 変更を確認
git status

# 変更をステージング
git add .

# または特定のファイルのみ
git add app/community/page.tsx

# コミット（コミットメッセージルールに従う）
git commit -m "Add: お気に入りチーム機能を実装"

# リモートにプッシュ
git push -u origin feature/機能名
```

### 3. ブランチのマージ

#### プルリクエスト経由（推奨）

1. GitHubでプルリクエストを作成
2. コードレビューを受ける
3. 承認後、マージ

#### コマンドライン経由

```bash
# mainブランチに切り替え
git checkout main

# 最新の状態に更新
git pull origin main

# 機能ブランチをマージ
git merge feature/機能名

# リモートにプッシュ
git push origin main
```

### 4. ブランチの削除

#### ローカルブランチの削除

```bash
# マージ済みのブランチを削除
git branch -d feature/機能名

# 強制削除（マージしていない場合）
git branch -D feature/機能名
```

#### リモートブランチの削除

```bash
git push origin --delete feature/機能名
```

## 禁止事項

### ❌ やってはいけないこと

1. **`main`ブランチに直接コミットしない**
   - 必ず機能ブランチを作成してから作業

2. **ブランチ名に日本語を使用しない**
   - ❌ `feature/お気に入り機能`
   - ✅ `feature/favorite-teams`

3. **ブランチ名にスペースを使用しない**
   - ❌ `feature/user profile`
   - ✅ `feature/user-profile`

4. **大文字を使用しない（先頭以外）**
   - ❌ `feature/UserProfile`
   - ✅ `feature/user-profile`

5. **長すぎるブランチ名を使用しない**
   - ❌ `feature/implement-user-authentication-with-email-and-password-and-google-sign-in`
   - ✅ `feature/user-authentication`

6. **`main`ブランチを強制プッシュしない**
   ```bash
   # ❌ 絶対にやらない
   git push -f origin main
   ```

## ブランチ命名チェックリスト

新しいブランチを作成する前に、以下を確認：

- [ ] ブランチ名は英語で記述されているか
- [ ] ハイフン区切り（kebab-case）になっているか
- [ ] 適切なプレフィックス（`feature/`, `bugfix/`, `hotfix/`, `refactor/`）が付いているか
- [ ] ブランチ名が簡潔で分かりやすいか
- [ ] `main`ブランチから分岐しているか

## よくある質問

### Q: ブランチ名を間違えて作成してしまった

**A**: ブランチ名を変更できます：

```bash
# 現在のブランチ名を変更
git branch -m 新しいブランチ名

# リモートに既にプッシュしている場合
git push origin -u 新しいブランチ名
git push origin --delete 古いブランチ名
```

### Q: 複数の機能を同時に開発したい

**A**: それぞれ別のブランチを作成してください：

```bash
git checkout -b feature/機能A
# 作業後、コミット・プッシュ

git checkout main
git checkout -b feature/機能B
# 別の機能の作業
```

### Q: 他の人のブランチで作業したい

**A**: リモートブランチを取得して切り替えます：

```bash
# リモートブランチの一覧を取得
git fetch origin

# リモートブランチをチェックアウト
git checkout feature/他の人のブランチ名
```

## 参考

- [Git公式ドキュメント - ブランチ](https://git-scm.com/book/ja/v2/Git-%E3%83%96%E3%83%A9%E3%83%B3%E3%83%81%E3%81%AE%E4%BD%9C%E6%88%90%E3%81%A8%E5%90%88%E5%90%88)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

