// Firebase設定の確認スクリプト
require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

console.log('Firebase設定の確認中...\n');

let hasError = false;

requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    console.error(`❌ ${varName}: 設定されていません`);
    hasError = true;
  } else {
    // 機密情報の一部をマスク
    const maskedValue = varName.includes('KEY') || varName.includes('SECRET')
      ? value.substring(0, 10) + '...'
      : value;
    console.log(`✓ ${varName}: ${maskedValue}`);
  }
});

if (hasError) {
  console.error('\n❌ 一部の環境変数が設定されていません。');
  console.error('.env.localファイルを確認してください。');
  process.exit(1);
} else {
  console.log('\n✅ すべての環境変数が正しく設定されています。');
  
  // Firebase初期化のテスト
  try {
    const { initializeApp } = require('firebase/app');
    const { getFirestore } = require('firebase/firestore');
    
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase初期化に成功しました。');
    console.log(`   Project ID: ${firebaseConfig.projectId}`);
  } catch (error) {
    console.error('❌ Firebase初期化に失敗しました:', error.message);
    process.exit(1);
  }
}

