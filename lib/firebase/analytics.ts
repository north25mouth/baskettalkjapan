// Firebase Analytics設定（クライアント側のみ）
'use client';

import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { getFirebaseApp } from './config';

let analytics: Analytics | null = null;

export async function getAnalyticsInstance(): Promise<Analytics | null> {
  // クライアント側でのみ動作
  if (typeof window === 'undefined') {
    return null;
  }

  // 既に初期化済みの場合はそれを返す
  if (analytics) {
    return analytics;
  }

  // Analyticsがサポートされているか確認
  const supported = await isSupported();
  if (!supported) {
    console.warn('Firebase Analytics is not supported in this environment');
    return null;
  }

  try {
    const app = getFirebaseApp();
    analytics = getAnalytics(app);
    return analytics;
  } catch (error) {
    console.error('Failed to initialize Firebase Analytics:', error);
    return null;
  }
}

// 自動初期化（オプション）
if (typeof window !== 'undefined') {
  getAnalyticsInstance().catch(console.error);
}

