// 各チーム用のスレッドを1つずつ作成するスクリプト
require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, query, where, Timestamp } = require('firebase/firestore');

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

// Firebase SDKを動的にインポート（Node.js環境用）
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// システムユーザーID（存在しない場合は最初のユーザーを使用、または固定ID）
const SYSTEM_USER_ID = 'system';

async function getOrCreateSystemUser() {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    if (!usersSnapshot.empty) {
      // 最初のユーザーを使用
      return usersSnapshot.docs[0].id;
    }
    // システムユーザーが存在しない場合は作成
    const userRef = await addDoc(collection(db, 'users'), {
      display_name: 'システム',
      email: 'system@baskettalkjapan.com',
      bio: 'システムアカウント',
      roles: ['admin'],
      created_at: Timestamp.now(),
    });
    return userRef.id;
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    // フォールバック: 固定IDを使用（実際のユーザーIDに置き換える必要がある）
    return SYSTEM_USER_ID;
  }
}

async function seedTeamThreads() {
  try {
    console.log('🔥 チームスレッドの作成を開始します...\n');

    // システムユーザーを取得
    const authorId = await getOrCreateSystemUser();
    console.log(`✓ 作成者ID: ${authorId}\n`);

    // すべてのチームを取得
    const teamsSnapshot = await getDocs(collection(db, 'teams'));
    const teams = teamsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`📋 ${teams.length}個のチームが見つかりました\n`);

    let createdCount = 0;
    let skippedCount = 0;

    for (const team of teams) {
      try {
        // 既存のスレッドを確認
        const existingThreadsSnapshot = await getDocs(
          query(
            collection(db, 'threads'),
            where('team_id', '==', team.id),
            where('type', '==', 'team')
          )
        );

        if (!existingThreadsSnapshot.empty) {
          console.log(`⏭️  ${team.name}: 既にスレッドが存在します（スキップ）`);
          skippedCount++;
          continue;
        }

        // スレッドを作成
        const threadData = {
          title: `${team.name} 掲示板`,
          type: 'team',
          team_id: team.id,
          author_id: authorId,
          tags: [team.abbreviation, team.region],
          pinned: false,
          likes_count: 0,
          posts_count: 0,
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        };

        await addDoc(collection(db, 'threads'), threadData);
        console.log(`✅ ${team.name}: スレッドを作成しました`);
        createdCount++;
      } catch (error) {
        console.error(`❌ ${team.name}: エラー -`, error.message);
      }
    }

    console.log(`\n📊 結果:`);
    console.log(`  作成: ${createdCount}件`);
    console.log(`  スキップ: ${skippedCount}件`);
    console.log(`  合計: ${teams.length}件`);
    console.log(`\n✅ 完了しました！`);
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

seedTeamThreads();

