# チームデータの手動投入方法

Firebase Consoleから直接チームデータを投入する方法

## 手順

### 1. Firebase Consoleにアクセス

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクト「baskettalkjapan」を選択
3. 左メニューから「Firestore Database」を選択
4. 「データ」タブを選択

### 2. teamsコレクションを作成

1. 「コレクションを開始」をクリック
2. コレクションIDに `teams` を入力
3. 「次へ」をクリック

### 3. 最初のドキュメントを作成

1. ドキュメントID: `team1`（または自動生成を選択）
2. フィールドを追加：
   - **フィールド名**: `name`
   - **型**: `string`
   - **値**: `アトランタ・ホークス`
3. フィールドを追加：
   - **フィールド名**: `abbreviation`
   - **型**: `string`
   - **値**: `ATL`
4. フィールドを追加：
   - **フィールド名**: `region`
   - **型**: `string`
   - **値**: `East`
5. フィールドを追加：
   - **フィールド名**: `created_at`
   - **型**: `timestamp`
   - **値**: 現在の日時を選択
6. 「保存」をクリック

### 4. 残りのチームを追加

以下の30チームのデータを同様に追加してください：

#### East Conference

1. アトランタ・ホークス (ATL) - East
2. ボストン・セルティックス (BOS) - East
3. ブルックリン・ネッツ (BKN) - East
4. シャーロット・ホーネッツ (CHA) - East
5. シカゴ・ブルズ (CHI) - East
6. クリーブランド・キャバリアーズ (CLE) - East
7. デトロイト・ピストンズ (DET) - East
8. インディアナ・ペイサーズ (IND) - East
9. マイアミ・ヒート (MIA) - East
10. ミルウォーキー・バックス (MIL) - East
11. ニューヨーク・ニックス (NYK) - East
12. オーランド・マジック (ORL) - East
13. フィラデルフィア・76ers (PHI) - East
14. トロント・ラプターズ (TOR) - East
15. ワシントン・ウィザーズ (WAS) - East

#### West Conference

16. ダラス・マーベリックス (DAL) - West
17. デンバー・ナゲッツ (DEN) - West
18. ゴールデンステート・ウォリアーズ (GSW) - West
19. ヒューストン・ロケッツ (HOU) - West
20. LAクリッパーズ (LAC) - West
21. LAレイカーズ (LAL) - West
22. メンフィス・グリズリーズ (MEM) - West
23. ミネソタ・ティンバーウルブズ (MIN) - West
24. ニューオーリンズ・ペリカンズ (NOP) - West
25. オクラホマシティ・サンダー (OKC) - West
26. フェニックス・サンズ (PHX) - West
27. ポートランド・トレイルブレイザーズ (POR) - West
28. サクラメント・キングス (SAC) - West
29. サンアントニオ・スパーズ (SAS) - West
30. ユタ・ジャズ (UTA) - West

## より簡単な方法：JSONインポート（推奨）

### 1. JSONファイルを作成

以下のJSONファイルを作成してください：

```json
{
  "teams": [
    {"name": "アトランタ・ホークス", "abbreviation": "ATL", "region": "East"},
    {"name": "ボストン・セルティックス", "abbreviation": "BOS", "region": "East"},
    {"name": "ブルックリン・ネッツ", "abbreviation": "BKN", "region": "East"},
    {"name": "シャーロット・ホーネッツ", "abbreviation": "CHA", "region": "East"},
    {"name": "シカゴ・ブルズ", "abbreviation": "CHI", "region": "East"},
    {"name": "クリーブランド・キャバリアーズ", "abbreviation": "CLE", "region": "East"},
    {"name": "ダラス・マーベリックス", "abbreviation": "DAL", "region": "West"},
    {"name": "デンバー・ナゲッツ", "abbreviation": "DEN", "region": "West"},
    {"name": "デトロイト・ピストンズ", "abbreviation": "DET", "region": "East"},
    {"name": "ゴールデンステート・ウォリアーズ", "abbreviation": "GSW", "region": "West"},
    {"name": "ヒューストン・ロケッツ", "abbreviation": "HOU", "region": "West"},
    {"name": "インディアナ・ペイサーズ", "abbreviation": "IND", "region": "East"},
    {"name": "LAクリッパーズ", "abbreviation": "LAC", "region": "West"},
    {"name": "LAレイカーズ", "abbreviation": "LAL", "region": "West"},
    {"name": "メンフィス・グリズリーズ", "abbreviation": "MEM", "region": "West"},
    {"name": "マイアミ・ヒート", "abbreviation": "MIA", "region": "East"},
    {"name": "ミルウォーキー・バックス", "abbreviation": "MIL", "region": "East"},
    {"name": "ミネソタ・ティンバーウルブズ", "abbreviation": "MIN", "region": "West"},
    {"name": "ニューオーリンズ・ペリカンズ", "abbreviation": "NOP", "region": "West"},
    {"name": "ニューヨーク・ニックス", "abbreviation": "NYK", "region": "East"},
    {"name": "オクラホマシティ・サンダー", "abbreviation": "OKC", "region": "West"},
    {"name": "オーランド・マジック", "abbreviation": "ORL", "region": "East"},
    {"name": "フィラデルフィア・76ers", "abbreviation": "PHI", "region": "East"},
    {"name": "フェニックス・サンズ", "abbreviation": "PHX", "region": "West"},
    {"name": "ポートランド・トレイルブレイザーズ", "abbreviation": "POR", "region": "West"},
    {"name": "サクラメント・キングス", "abbreviation": "SAC", "region": "West"},
    {"name": "サンアントニオ・スパーズ", "abbreviation": "SAS", "region": "West"},
    {"name": "トロント・ラプターズ", "abbreviation": "TOR", "region": "East"},
    {"name": "ユタ・ジャズ", "abbreviation": "UTA", "region": "West"},
    {"name": "ワシントン・ウィザーズ", "abbreviation": "WAS", "region": "East"}
  ]
}
```

### 2. Firebase Consoleからインポート

残念ながら、Firebase Consoleから直接JSONをインポートする機能はありません。上記の手順で手動で追加する必要があります。

## 確認

データ投入後、以下を確認してください：

1. Firestore Console > データ > teams
2. 30チームのデータが表示される
3. 各チームに `name`, `abbreviation`, `region`, `created_at` フィールドがある

## 次のステップ

チームデータの投入が完了したら：

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスし、`/community` でチーム一覧が表示されることを確認してください。

