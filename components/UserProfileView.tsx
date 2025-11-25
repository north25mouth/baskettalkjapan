'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/config';
import { updateUser } from '@/lib/firebase/firestore';
import { User } from '@/types';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface UserProfileViewProps {
  user: User;
}

// デフォルトアイコンのリスト
const DEFAULT_AVATARS = [
  '/avatars/default-1.svg',
  '/avatars/default-2.svg',
  '/avatars/default-3.svg',
  '/avatars/default-4.svg',
  '/avatars/default-5.svg',
  '/avatars/default-6.svg',
  '/avatars/default-7.svg',
  '/avatars/default-8.svg',
];

export default function UserProfileView({ user: initialUser }: UserProfileViewProps) {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(initialUser.display_name);
  const [bio, setBio] = useState(initialUser.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(
    initialUser.avatar_url || DEFAULT_AVATARS[0]
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isOwnProfile = firebaseUser?.uid === user.id;

  // 認証状態の確認とユーザーデータの確認
  useEffect(() => {
    const authInstance = getFirebaseAuth();
    if (!authInstance) {
      console.warn('[UserProfileView] Firebase auth is not initialized');
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      setFirebaseUser(currentUser);
      
      // 自分のプロフィールで、Firestoreにデータが存在しない場合は作成
      if (currentUser && currentUser.uid === user.id) {
        try {
          const { getUser, createUser } = await import('@/lib/firebase/firestore');
          const existingUser = await getUser(currentUser.uid);
          
          if (!existingUser) {
            console.log('[UserProfileView] User not found in Firestore, creating...');
            // Firestoreにユーザーデータを作成
            await createUser(
              {
                display_name: currentUser.displayName || 'ユーザー',
                email: currentUser.email || '',
                bio: '',
                roles: ['user'],
              },
              currentUser.uid
            );
            
            // ユーザーデータを再取得
            const newUser = await getUser(currentUser.uid);
            if (newUser) {
              setUser(newUser);
            }
          }
        } catch (error) {
          console.error('[UserProfileView] Error creating user in Firestore:', error);
        }
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user.id]);

  // プロフィール更新
  const handleSave = async () => {
    if (!isOwnProfile) {
      setError('自分のプロフィールのみ編集可能です');
      return;
    }

    if (!displayName.trim()) {
      setError('表示名を入力してください');
      return;
    }

    if (displayName.length > 50) {
      setError('表示名は50文字以内で入力してください');
      return;
    }

    if (bio.length > 500) {
      setError('自己紹介は500文字以内で入力してください');
      return;
    }

    setError('');
    setSubmitting(true);
    setSuccess(false);

    try {
      await updateUser(user.id, {
        display_name: displayName.trim(),
        bio: bio.trim() || undefined,
        avatar_url: selectedAvatar,
        updated_at: new Date(),
      });

      // ユーザー情報を更新
      setUser({
        ...user,
        display_name: displayName.trim(),
        bio: bio.trim() || undefined,
        avatar_url: selectedAvatar,
        updated_at: new Date(),
      });

      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('プロフィールの更新に失敗しました:', err);
      setError(err.message || 'プロフィールの更新に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(initialUser.display_name);
    setBio(initialUser.bio || '');
    setSelectedAvatar(initialUser.avatar_url || DEFAULT_AVATARS[0]);
    setIsEditing(false);
    setError('');
    setSuccess(false);
  };

  // アバター表示用の関数
  const getAvatarUrl = () => {
    if (user.avatar_url) {
      return user.avatar_url;
    }
    return DEFAULT_AVATARS[0];
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ナビゲーション */}
        <div className="mb-4">
          <Link
            href="/community"
            className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400"
          >
            ← コミュニティに戻る
          </Link>
        </div>

        {/* プロフィールヘッダー */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
            {/* アバター */}
            <div className="mb-4 sm:mb-0">
              {isEditing ? (
                  <div className="relative">
                  <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-orange-500">
                    <img
                      src={selectedAvatar}
                      alt="アバター"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-orange-500">
                  <img
                    src={getAvatarUrl()}
                    alt={user.display_name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* ユーザー情報 */}
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      表示名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      maxLength={50}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="表示名を入力"
                    />
                    <div className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
                      {displayName.length} / 50 文字
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      アバター
                    </label>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                      {DEFAULT_AVATARS.map((avatar) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar)}
                          className={`h-12 w-12 overflow-hidden rounded-full border-2 transition-all ${
                            selectedAvatar === avatar
                              ? 'border-orange-500 ring-2 ring-orange-500'
                              : 'border-gray-300 hover:border-orange-300 dark:border-gray-600'
                          }`}
                        >
                          <img
                            src={avatar}
                            alt="アバター"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      自己紹介
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={500}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="自己紹介を入力（任意）"
                    />
                    <div className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
                      {bio.length} / 500 文字
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
                      プロフィールを更新しました
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={submitting}
                      className="rounded-lg bg-orange-600 px-6 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? '保存中...' : '保存'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={submitting}
                      className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      キャンセル
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {user.display_name}
                  </h1>
                  {user.bio && (
                    <p className="mb-4 whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                      {user.bio}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>登録日: {formatDate(user.created_at)}</span>
                    {user.updated_at && (
                      <span>更新日: {formatDate(user.updated_at)}</span>
                    )}
                  </div>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 rounded-lg bg-orange-600 px-6 py-2 text-sm font-medium text-white hover:bg-orange-700"
                    >
                      プロフィールを編集
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* 統計情報（将来実装） */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            統計情報
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">-</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">投稿数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">-</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">いいね数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">-</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">スレッド数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">-</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">フォロワー</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

