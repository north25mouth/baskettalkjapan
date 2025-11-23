# 500エラーのデバッグ手順

## ステップ1: シンプルなページで確認

現在、`app/page.tsx`をFirebaseを使わないシンプルなページに変更しました。

### 確認方法

1. 開発サーバーを再起動
   ```bash
   # 開発サーバーを停止（Ctrl+C）
   rm -rf .next
   npm run dev
   ```

2. ブラウザで `http://localhost:3000/` にアクセス

3. 結果の確認
   - ✅ **ページが表示される**: Next.jsの基本動作は正常。Firebaseの初期化が原因の可能性が高い
   - ❌ **まだ500エラー**: Next.jsの設定やビルドに問題がある可能性

## ステップ2: Firebaseの初期化を確認

### 環境変数の確認

```bash
npm run check:firebase
```

すべての環境変数が正しく設定されているか確認してください。

### Firebase初期化のテスト

`lib/firebase/config.ts`の初期化処理を確認：

```typescript
// サーバー側での初期化
if (typeof window === 'undefined') {
  if (!app) {
    initializeFirebase();
  }
}
```

## ステップ3: 段階的にFirebase機能を追加

### 1. まず、Firebaseの初期化だけをテスト

```typescript
// app/page.tsx
import { getFirebaseDb } from '@/lib/firebase/config';

export default async function Home() {
  try {
    const db = getFirebaseDb();
    console.log('Firebase initialized:', !!db);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
  
  return <div>Test page</div>;
}
```

### 2. 次に、シンプルなクエリをテスト

```typescript
import { getTeams } from '@/lib/firebase/firestore';

export default async function Home() {
  try {
    const teams = await getTeams();
    console.log('Teams fetched:', teams.length);
  } catch (error) {
    console.error('Error fetching teams:', error);
  }
  
  return <div>Test page</div>;
}
```

## ステップ4: エラーログの確認

### 開発サーバーのコンソール

開発サーバーを起動しているターミナルで、以下のログを確認：

```
[Home] Fetching data...
[getTodayMatches] Starting...
[getThreads] Starting...
```

エラーが発生している場合は、エラーメッセージが表示されます。

### ブラウザのコンソール

ブラウザでF12キーを押して、コンソールタブを確認してください。

## よくある原因と解決方法

### 1. Firebase初期化エラー

**症状**: `Firebase db is not initialized` エラー

**解決方法**:
- `.env.local`ファイルを確認
- 環境変数が正しく設定されているか確認
- 開発サーバーを再起動

### 2. Firestoreインデックスエラー

**症状**: `The query requires an index` エラー

**解決方法**:
- エラーメッセージに表示されたリンクからインデックスを作成
- `docs/FIRESTORE_INDEX_SETUP.md`を参照

### 3. 環境変数の読み込みエラー

**症状**: 環境変数が`undefined`

**解決方法**:
- `.env.local`ファイルがプロジェクトルートにあるか確認
- 環境変数名が`NEXT_PUBLIC_`で始まっているか確認
- 開発サーバーを再起動

### 4. Next.jsのビルドエラー

**症状**: ビルド時にエラーが発生

**解決方法**:
```bash
rm -rf .next
npm run build
```

## 次のステップ

1. シンプルなページが表示されるか確認
2. 表示される場合は、段階的にFirebase機能を追加
3. まだエラーが出る場合は、開発サーバーのコンソールに表示されるエラーメッセージを確認

