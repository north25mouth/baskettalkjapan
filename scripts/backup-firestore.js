// Firestoreデータのバックアップスクリプト
require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// バックアップディレクトリを作成
const backupsDir = path.join(__dirname, '..', 'backups');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const backupDir = path.join(backupsDir, `firestore_${timestamp}`);

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

async function backupCollection(collectionName) {
  try {
    console.log(`📦 ${collectionName} をバックアップ中...`);
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, collectionName));
    
    const data = [];
    snapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    const filePath = path.join(backupDir, `${collectionName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`   ✓ ${collectionName}: ${data.length}件のドキュメントをバックアップしました`);
    
    return data.length;
  } catch (error) {
    console.error(`   ✗ ${collectionName} のバックアップに失敗しました:`, error.message);
    return 0;
  }
}

async function backupFirestore() {
  try {
    console.log('🔥 Firestoreデータのバックアップを開始します...');
    console.log(`バックアップ先: ${backupDir}\n`);

    // Firebaseを初期化
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // バックアップするコレクションのリスト
    const collections = [
      'users',
      'teams',
      'matches',
      'threads',
      'posts',
      'likes',
      'reports',
      'notifications',
    ];

    let totalDocs = 0;
    for (const collectionName of collections) {
      const count = await backupCollection(collectionName);
      totalDocs += count;
    }

    // バックアップ情報を保存
    const backupInfo = {
      timestamp: new Date().toISOString(),
      projectId: firebaseConfig.projectId,
      collections: collections,
      totalDocuments: totalDocs,
    };

    fs.writeFileSync(
      path.join(backupDir, 'backup_info.json'),
      JSON.stringify(backupInfo, null, 2),
      'utf8'
    );

    console.log(`\n✅ バックアップが完了しました！`);
    console.log(`📦 合計: ${totalDocs}件のドキュメント`);
    console.log(`📁 バックアップ先: ${backupDir}`);
  } catch (error) {
    console.error('❌ バックアップ中にエラーが発生しました:', error);
    process.exit(1);
  }
}

backupFirestore();

