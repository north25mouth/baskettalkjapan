'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/config';
import { signOutUser } from '@/lib/firebase/auth';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      const authInstance = getFirebaseAuth();
      if (!authInstance) {
        console.warn('[Header] Firebase auth is not initialized');
        return;
      }
      const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error('[Header] Error initializing auth:', error);
    }
  }, []);

  const handleLogout = async () => {
    await signOutUser();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ロゴ */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-orange-600 dark:text-orange-400">
              BasketTalk Japan
            </Link>
          </div>

          {/* 検索バー（デスクトップ） */}
          <div className="hidden flex-1 max-w-md mx-8 md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="スレッド・記事を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className="flex items-center gap-4">
            <Link
              href="/community"
              className={`text-sm font-medium ${
                pathname?.startsWith('/community')
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400'
              }`}
            >
              コミュニティ
            </Link>
            <Link
              href="/articles"
              className={`text-sm font-medium ${
                pathname?.startsWith('/articles')
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400'
              }`}
            >
              記事
            </Link>

            {user ? (
              <>
                <Link
                  href={`/community/user/${user.uid}`}
                  className="text-sm font-medium text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400"
                >
                  マイページ
                </Link>
                {user.email && ['admin081805@admin.com', 'admin@example.com'].includes(user.email) && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400"
                  >
                    管理
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
              >
                ログイン
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

