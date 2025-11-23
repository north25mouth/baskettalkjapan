# Firebase 請求先情報の登録手順

Firestore Databaseを作成する際に発生する「請求を有効化」エラーの解決方法

## エラーメッセージ

```
This API method requires billing to be enabled. Please enable billing on project baskettalkjapan by visiting https://console.developers.google.com/billing/enable?project=baskettalkjapan then retry.
```

## なぜ請求先情報が必要になったのか？

### 以前の状況

**2020年以前**は、請求先情報を登録しなくてもFirestore Databaseを作成できました。

### 現在の状況

**2020年以降**、Google Cloudのポリシー変更により、**Firestore Databaseを作成する際に請求先情報の登録が必須**になりました。

### 理由

- 無料枠を超えた場合の課金を明確にするため
- 予想外の課金を防ぐため（予算アラートの設定を推奨）
- サービス利用の透明性を高めるため

### 重要なポイント

- **請求先情報を登録しても、無料枠内であれば一切課金されません**
- 無料枠を超えた場合のみ、超過分に対して課金されます
- 予算アラートや使用量制限を設定することで、予想外の課金を防げます

## 解決方法

### ステップ1: 請求先情報の登録

⚠️ **注意**: 以前は請求先情報なしで作成できましたが、現在は必須です。

1. **エラーメッセージのリンクをクリック**
   - または、直接アクセス: [請求を有効化](https://console.developers.google.com/billing/enable?project=baskettalkjapan)

2. **Google Cloud Consoleにログイン**
   - Firebaseプロジェクトと同じGoogleアカウントでログイン

3. **請求先アカウントを作成**
   - 「請求先アカウントを作成」をクリック
   - または、既存の請求先アカウントを選択

4. **請求先情報を入力**
   - **国/地域**: 日本を選択
   - **請求先名**: 個人名または組織名を入力
   - **住所**: 請求先の住所を入力
   - **クレジットカード情報**: カード情報を入力
     - ⚠️ **重要**: 無料枠内であれば課金されません

5. **送信して有効化**
   - 「送信して有効化」をクリック
   - 請求先情報の登録が完了します

### ステップ2: 反映を待つ

請求先情報の登録後、**数分（通常2-5分）**待ってから再試行してください。

システムへの反映に時間がかかる場合があります。

### ステップ3: Firestore Databaseの作成を再試行

1. [Firebase Console](https://console.firebase.google.com/)に戻る
2. プロジェクト「baskettalkjapan」を選択
3. 左メニューから「Firestore Database」を選択
4. 「データベースを作成」をクリック
5. セキュリティルールとロケーションを選択
6. 「有効にする」をクリック

## 無料枠について

### Firestoreの無料枠（Spark プラン）

Firestoreには**無料枠**があり、以下の範囲内であれば**完全に無料**です：

| 項目 | 無料枠 |
|------|--------|
| ストレージ | 1GB |
| 読み取り | 50,000回/日 |
| 書き込み | 20,000回/日 |
| 削除 | 20,000回/日 |
| ネットワーク送信 | 10GB/月 |

**開発・テスト段階では、通常この無料枠で十分です。**

### ⚠️ 重要なポイント

**無料枠内であれば、一切課金されません。**

請求先情報を登録しても、無料枠内であれば**勝手に課金されることはありません**。

### 無料枠を超えた場合

無料枠を超えた場合のみ、従量課金が発生します：

- ストレージ: $0.18/GB/月（1GB超えた分）
- 読み取り: $0.06/100,000回（50,000回/日超えた分）
- 書き込み: $0.18/100,000回（20,000回/日超えた分）

**例：**
- ストレージが1.5GBの場合: (1.5 - 1.0) × $0.18 = **$0.09/月**
- 1日に60,000回読み取った場合: (60,000 - 50,000) / 100,000 × $0.06 = **$0.006/日**

詳細: [Firestore 料金](https://firebase.google.com/pricing?hl=ja)

### 課金を防ぐための対策

詳細は [課金について - 安全に使用する方法](BILLING_SAFETY.md) を参照してください。

主な対策：
- 使用量を定期的に確認
- 予算アラートを設定
- 開発中は大量のテストデータを作成しない

## 請求先情報の確認方法

### Firebase Consoleから確認

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクト「baskettalkjapan」を選択
3. 左メニューの⚙️アイコン > 「プロジェクトの設定」をクリック
4. 「使用量と請求」タブを選択
5. 「請求先アカウント」セクションで確認

### Google Cloud Consoleから確認

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクト「baskettalkjapan」を選択
3. 左メニューから「請求」を選択
4. 請求先アカウントが表示されているか確認

## トラブルシューティング

### エラーが続く場合

1. **数分待つ**
   - 請求先情報の反映に時間がかかる場合があります（最大10分程度）

2. **ブラウザをリフレッシュ**
   - Firebase Consoleをリフレッシュ（F5またはCmd+R）

3. **別のブラウザで試す**
   - キャッシュの問題の可能性があります

4. **請求先アカウントの状態を確認**
   - Google Cloud Console > 請求 > 請求先アカウント
   - アカウントが「有効」になっているか確認

5. **プロジェクトの選択を確認**
   - 正しいプロジェクト（baskettalkjapan）が選択されているか確認

### 請求先情報を登録したくない場合

開発環境のみで使用する場合、**Firebase Emulator Suite**を使用できます：

```bash
# Firebase CLIをインストール
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# プロジェクトを初期化
firebase init

# Emulatorを起動
firebase emulators:start
```

ただし、**本番環境ではFirestore Databaseが必要**です。

## 参考リンク

- [Firebase 請求先情報の変更について](BILLING_CHANGES.md) - 以前と現在の違いについて
- [Firebase 料金](https://firebase.google.com/pricing?hl=ja)
- [Firestore 料金詳細](https://firebase.google.com/docs/firestore/pricing)
- [Google Cloud 請求の有効化](https://cloud.google.com/billing/docs/how-to/modify-project)

