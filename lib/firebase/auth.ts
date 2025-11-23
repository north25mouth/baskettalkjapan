// Firebase認証ヘルパー関数
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from 'firebase/auth';
import { getFirebaseAuth } from './config';
import { User } from '@/types';

// メール/パスワードでサインアップ
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<FirebaseUser> {
  try {
    // クライアント側でのみ実行可能
    if (typeof window === 'undefined') {
      throw new Error('この関数はクライアント側でのみ実行可能です');
    }

    const authInstance = getFirebaseAuth();
    
    if (!authInstance) {
      console.error('[signUpWithEmail] authInstance is null');
      throw new Error('Firebase認証が初期化されていません。環境変数を確認してください。');
    }

    console.log('[signUpWithEmail] Firebase Auth初期化成功');

    const userCredential = await createUserWithEmailAndPassword(
      authInstance,
      email,
      password
    );
    const user = userCredential.user;

    // プロフィール更新
    if (user) {
      await updateProfile(user, { displayName });
      await sendEmailVerification(user);
    }

    return user;
  } catch (error: any) {
    console.error('[signUpWithEmail] Error:', error);
    console.error('[signUpWithEmail] Error code:', error.code);
    console.error('[signUpWithEmail] Error message:', error.message);
    
    // より分かりやすいエラーメッセージに変換
    if (error.code === 'auth/configuration-not-found' || error.message?.includes('configuration-not-found')) {
      throw new Error(
        'Firebase設定が見つかりません。開発サーバーを再起動してください。.env.localファイルに必要な環境変数が設定されているか確認してください。'
      );
    }
    
    throw error;
  }
}

// メール/パスワードでログイン
export async function signInWithEmail(
  email: string,
  password: string
): Promise<FirebaseUser> {
  const authInstance = getFirebaseAuth();
  const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
  return userCredential.user;
}

// Googleでログイン
export async function signInWithGoogle(): Promise<FirebaseUser> {
  const authInstance = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(authInstance, provider);
  return userCredential.user;
}

// ログアウト
export async function signOutUser(): Promise<void> {
  const authInstance = getFirebaseAuth();
  await signOut(authInstance);
}

// パスワードリセットメール送信
export async function resetPassword(email: string): Promise<void> {
  const authInstance = getFirebaseAuth();
  await sendPasswordResetEmail(authInstance, email);
}

// Firebase User を User 型に変換（必要に応じて）
export function firebaseUserToUser(firebaseUser: FirebaseUser): Partial<User> {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    display_name: firebaseUser.displayName || '',
    avatar_url: firebaseUser.photoURL || undefined,
  };
}

