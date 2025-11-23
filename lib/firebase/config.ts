// Firebase設定
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase設定の型
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// 環境変数から設定を取得
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// 設定の検証（クライアント側のみ）
if (typeof window !== 'undefined') {
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];
  
  const missingFields = requiredFields.filter(
    (field) => !firebaseConfig[field] || firebaseConfig[field].trim() === ''
  );
  
  // デバッグ用: 環境変数の読み込み状況を確認
  console.log('[Firebase Config] クライアント側での環境変数確認:', {
    hasApiKey: !!firebaseConfig.apiKey && firebaseConfig.apiKey.length > 0,
    hasProjectId: !!firebaseConfig.projectId && firebaseConfig.projectId.length > 0,
    hasAuthDomain: !!firebaseConfig.authDomain && firebaseConfig.authDomain.length > 0,
    apiKeyPrefix: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 10) + '...' : 'empty',
    projectId: firebaseConfig.projectId || 'empty',
    authDomain: firebaseConfig.authDomain || 'empty',
  });
  
  if (missingFields.length > 0) {
    console.error('[Firebase Config] 以下の環境変数が設定されていません:', missingFields);
    console.error('[Firebase Config] .env.localファイルを確認してください');
    console.error('[Firebase Config] 開発サーバーを再起動してください（環境変数の変更を反映するため）');
  }
}

// Firebase初期化（シングルトン）
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

function initializeFirebase() {
  // 設定の検証
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    const error = new Error(
      'Firebase設定が不完全です。.env.localファイルに必要な環境変数が設定されているか確認してください。'
    );
    console.error('[Firebase Config]', error.message);
    throw error;
  }

  // デバッグ用: 設定値をログ出力（機密情報は一部のみ）
  console.log('[Firebase Config] 初期化開始:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    apiKeyPrefix: firebaseConfig.apiKey.substring(0, 10) + '...',
  });

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('[Firebase Config] Firebase初期化成功');
  } else {
    app = getApps()[0];
    console.log('[Firebase Config] 既存のFirebaseインスタンスを使用');
  }
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  return { app, auth, db, storage };
}

// クライアント側とサーバー側の両方で初期化
// 注意: クライアント側では、getFirebaseAuth()などが呼ばれたときに初期化する
// モジュール読み込み時には初期化しない（環境変数が読み込まれていない可能性があるため）
if (typeof window === 'undefined') {
  // サーバー側（初回のみ）
  if (!app) {
    try {
      initializeFirebase();
    } catch (error) {
      console.error('[Firebase Config] サーバー側初期化エラー:', error);
    }
  }
}

// エクスポート用のゲッター関数
export function getFirebaseApp() {
  if (!app) {
    initializeFirebase();
  }
  return app!;
}

export function getFirebaseAuth() {
  // クライアント側では、必ず初期化を試みる
  if (typeof window !== 'undefined') {
    if (!auth) {
      try {
        initializeFirebase();
      } catch (error) {
        console.error('[getFirebaseAuth] 初期化エラー:', error);
        throw new Error(
          'Firebase認証の初期化に失敗しました。環境変数を確認してください。'
        );
      }
    }
    if (!auth) {
      throw new Error(
        'Firebase認証が初期化されていません。環境変数が正しく設定されているか確認してください。'
      );
    }
    return auth;
  }
  
  // サーバー側
  if (!auth) {
    initializeFirebase();
  }
  return auth!;
}

export function getFirebaseDb() {
  if (!db) {
    initializeFirebase();
  }
  return db!;
}

export function getFirebaseStorage() {
  if (!storage) {
    initializeFirebase();
  }
  return storage!;
}

// 後方互換性のため、既存のエクスポートも維持
// クライアント側でのみ使用可能（サーバー側ではundefinedになる可能性がある）
export { app, auth, db, storage };

