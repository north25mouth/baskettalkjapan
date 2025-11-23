// チームスレッドの作成者名を「管理者」に変更するスクリプト
require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, updateDoc, doc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.error('❌ エラー: .env.local ファイルにFirebase設定がありません');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateThreadAuthors() {
  try {
    console.log('🔥 チームスレッドの作成者名を更新します...\n');

    // すべてのチームスレッドを取得
    const threadsSnapshot = await getDocs(
      query(
        collection(db, 'threads'),
        where('type', '==', 'team')
      )
    );

    console.log(`📋 ${threadsSnapshot.size}個のチームスレッドが見つかりました\n`);

    const authorIds = new Set();
    threadsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.author_id) {
        authorIds.add(data.author_id);
      }
    });

    console.log(`📋 ${authorIds.size}個のユニークな作成者IDが見つかりました\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    // 各作成者のユーザー情報を更新
    for (const authorId of authorIds) {
      try {
        // ユーザードキュメントを直接取得
        const userDocRef = doc(db, 'users', authorId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.log(`⏭️  ユーザー ${authorId}: 存在しません（スキップ）`);
          skippedCount++;
          continue;
        }

        const userData = userDoc.data();
        
        if (userData.display_name === '管理者') {
          console.log(`⏭️  ユーザー ${authorId}: 既に「管理者」です（スキップ）`);
          skippedCount++;
          continue;
        }

        // ユーザーの表示名を「管理者」に更新
        await updateDoc(userDocRef, {
          display_name: '管理者',
        });
        
        console.log(`✅ ユーザー ${authorId}: 表示名を「${userData.display_name}」から「管理者」に更新しました`);
        updatedCount++;
      } catch (error) {
        console.error(`❌ ユーザー ${authorId}: エラー -`, error.message);
      }
    }

    console.log(`\n📊 結果:`);
    console.log(`  更新: ${updatedCount}件`);
    console.log(`  スキップ: ${skippedCount}件`);
    console.log(`  合計: ${authorIds.size}件`);
    console.log(`\n✅ 完了しました！`);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

updateThreadAuthors();
