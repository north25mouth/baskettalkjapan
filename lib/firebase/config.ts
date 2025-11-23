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

// Firebase初期化（シングルトン）
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

function initializeFirebase() {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  return { app, auth, db, storage };
}

// クライアント側とサーバー側の両方で初期化
if (typeof window !== 'undefined') {
  // クライアント側
  initializeFirebase();
} else {
  // サーバー側（初回のみ）
  if (!app) {
    initializeFirebase();
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

