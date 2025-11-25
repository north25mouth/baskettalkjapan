// 既存のFirebase AuthユーザーをFirestoreに移行するスクリプト
// 注意: このスクリプトはFirebase Admin SDKを使用する必要があります
// または、Firebase Consoleから手動でユーザーデータを作成してください

require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc, getDoc, Timestamp } = require('firebase/firestore');

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

async function migrateExistingUsers() {
  try {
    console.log('🔥 既存ユーザーの移行を開始します...\n');

    // 注意: Firebase Client SDKでは、Firebase Authのユーザー一覧を取得できません
    // このスクリプトは、Firestoreに既に存在するユーザーを確認し、
    // 不足している情報を補完するために使用します

    // 既存のFirestoreユーザーを確認
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const existingUsers = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`📋 Firestoreに ${existingUsers.length} 人のユーザーが見つかりました\n`);

    // 各ユーザーのデータを確認
    for (const user of existingUsers) {
      console.log(`✓ ユーザー: ${user.display_name || user.id}`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: ${user.email || 'N/A'}`);
      console.log(`  Created: ${user.created_at ? 'Yes' : 'No'}\n`);
    }

    console.log('\n✅ 移行確認完了');
    console.log('\n注意: Firebase Authのユーザー一覧を取得するには、Firebase Admin SDKが必要です。');
    console.log('既存のFirebase AuthユーザーがFirestoreに存在しない場合は、');
    console.log('Firebase Consoleから手動でユーザーデータを作成するか、');
    console.log('ユーザーが再度サインアップする必要があります。');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

migrateExistingUsers();



