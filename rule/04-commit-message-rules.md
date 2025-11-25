# コミットメッセージルール

このドキュメントでは、BasketTalk Japanプロジェクトにおけるコミットメッセージの書き方を定義します。

## 基本形式

```
プレフィックス: 変更内容の簡潔な説明

詳細な説明（必要に応じて）
```

## プレフィックス

### 必須プレフィックス

コミットメッセージの先頭に、以下のいずれかを必ず付ける：

| プレフィックス | 用途 | 例 |
|------------|------|-----|
| `Add:` | 新機能の追加 | `Add: お気に入りチーム機能を実装` |
| `Fix:` | バグ修正 | `Fix: ログインエラーを修正` |
| `Update:` | 既存機能の更新・改善 | `Update: エラーハンドリングを改善` |
| `Refactor:` | リファクタリング | `Refactor: Firestore関数を整理` |
| `Remove:` | 機能・ファイルの削除 | `Remove: 未使用のコンポーネントを削除` |
| `Docs:` | ドキュメントの更新 | `Docs: 開発環境セットアップガイドを追加` |
| `Style:` | スタイル・UIの変更 | `Style: メインページのデザインを改善` |
| `Chore:` | ビルド・設定ファイルの変更 | `Chore: package.jsonの依存関係を更新` |

### プレフィックスの使い分け

#### Add: 新機能の追加

```bash
git commit -m "Add: お気に入りチーム機能を実装"
git commit -m "Add: ユーザープロフィールページを追加"
git commit -m "Add: スレッド検索機能を実装"
```

#### Fix: バグ修正

```bash
git commit -m "Fix: チームページの404エラーを修正"
git commit -m "Fix: ログイン時の認証エラーを修正"
git commit -m "Fix: Firestoreクエリのインデックスエラーを修正"
```

#### Update: 既存機能の更新

```bash
git commit -m "Update: エラーハンドリングを改善"
git commit -m "Update: スレッド一覧の表示順を変更"
git commit -m "Update: ユーザー情報の取得方法を最適化"
```

#### Refactor: リファクタリング

```bash
git commit -m "Refactor: Firestore関数を整理"
git commit -m "Refactor: コンポーネントの構造を改善"
git commit -m "Refactor: 型定義を整理"
```

#### Remove: 削除

```bash
git commit -m "Remove: 未使用のコンポーネントを削除"
git commit -m "Remove: バックアップファイルを削除"
```

#### Docs: ドキュメント

```bash
git commit -m "Docs: 開発環境セットアップガイドを追加"
git commit -m "Docs: READMEを更新"
git commit -m "Docs: Gitブランチルールを追加"
```

#### Style: スタイル

```bash
git commit -m "Style: メインページのデザインを改善"
git commit -m "Style: ボタンのスタイルを統一"
```

#### Chore: その他

```bash
git commit -m "Chore: package.jsonの依存関係を更新"
git commit -m "Chore: .gitignoreを更新"
```

## メッセージの書き方

### 基本ルール

1. **日本語で記述**（プロジェクトの言語に合わせる）
2. **簡潔に**（50文字以内を目安）
3. **動詞で始める**（「〜を実装」「〜を修正」など）
4. **現在形で記述**（「実装した」ではなく「実装」）

### 良い例

```bash
git commit -m "Add: お気に入りチーム機能を実装"
git commit -m "Fix: ログインエラーを修正"
git commit -m "Update: エラーハンドリングを改善"
git commit -m "Docs: 開発環境セットアップガイドを追加"
```

### 悪い例

```bash
# ❌ プレフィックスがない
git commit -m "お気に入りチーム機能"

# ❌ 説明が不十分
git commit -m "Fix: バグ修正"

# ❌ 過去形
git commit -m "Add: お気に入りチーム機能を実装した"

# ❌ 長すぎる
git commit -m "Add: ユーザーが好きなチームを3つまでお気に入り登録できる機能を実装し、メインページに表示するセクションを追加"

# ❌ 英語と日本語が混在
git commit -m "Add: favorite teams feature"
```

## 詳細説明（オプション）

複雑な変更の場合は、詳細説明を追加：

```bash
git commit -m "Add: お気に入りチーム機能を実装

- ユーザーが最大3つまでチームをお気に入り登録可能
- メインページに専用セクションを追加
- Firestoreにfavorite_teamsフィールドを追加"
```

## 複数の変更を含む場合

1つのコミットに複数の変更を含める場合：

```bash
# ✅ 良い例（関連する変更）
git commit -m "Update: メインページのデザインを改善

- 統計情報セクションを削除
- ヒーローセクションをシンプルに変更
- カードデザインを統一"
```

**注意**: 関連性のない変更は別々のコミットに分ける

## コミット前のチェックリスト

コミットする前に、以下を確認：

- [ ] プレフィックスが正しく付いているか
- [ ] メッセージが簡潔で分かりやすいか
- [ ] 日本語で記述されているか
- [ ] 関連する変更のみが含まれているか
- [ ] `.env.local` などの機密ファイルが含まれていないか

## よくある質問

### Q: 複数のファイルを変更した場合、1つのコミットで良い？

**A**: 関連する変更は1つのコミットにまとめ、関連性のない変更は分けます。

```bash
# ✅ 良い例（関連する変更）
git add app/page.tsx components/FavoriteTeams.tsx
git commit -m "Add: お気に入りチーム機能を実装"

# ❌ 悪い例（関連性のない変更をまとめる）
git add app/page.tsx docs/README.md
git commit -m "Add: お気に入りチーム機能とREADME更新"
# → 別々のコミットにすべき
```

### Q: コミットメッセージを間違えた

**A**: 直前のコミットメッセージを修正できます：

```bash
git commit --amend -m "正しいメッセージ"
```

**注意**: 既にプッシュしたコミットは修正しない（新しいコミットで修正）

### Q: 英語で書いても良い？

**A**: プロジェクトの方針として日本語を使用します。ただし、技術用語（Firebase、Next.jsなど）は英語のまま。

## 参考

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git公式ドキュメント - コミット](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E5%9F%BA%E6%9C%AC-%E3%83%81%E3%83%A7%E3%82%B0%E3%82%92%E5%8F%8E%E9%8C%B2%E3%81%99%E3%82%8B)

