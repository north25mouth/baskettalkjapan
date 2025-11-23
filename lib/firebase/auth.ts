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
  const authInstance = getFirebaseAuth();
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

