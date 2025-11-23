'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUpWithEmail } from '@/lib/firebase/auth';
import { createUser } from '@/lib/firebase/firestore';

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上である必要があります');
      return;
    }

    if (!agreeToTerms) {
      setError('利用規約に同意してください');
      return;
    }

    setLoading(true);

    try {
      const firebaseUser = await signUpWithEmail(email, password, displayName);
      
      // Firestoreにユーザー情報を保存
      await createUser({
        display_name: displayName,
        email: email,
        bio: '',
        roles: ['user'],
      });

      router.push('/community');
    } catch (err: any) {
      setError(err.message || '登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
            新規登録
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            または{' '}
            <Link
              href="/login"
              className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400"
            >
              ログイン
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="displayName" className="sr-only">
                表示名
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="relative block w-full rounded-t-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                placeholder="表示名"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                placeholder="メールアドレス"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                placeholder="パスワード（6文字以上）"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                パスワード（確認）
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="relative block w-full rounded-b-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                placeholder="パスワード（確認）"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
              <Link
                href="/rules"
                className="text-orange-600 hover:text-orange-500 dark:text-orange-400"
              >
                利用規約
              </Link>
              と
              <Link
                href="/rules#copyright"
                className="text-orange-600 hover:text-orange-500 dark:text-orange-400"
              >
                著作権ポリシー
              </Link>
              に同意します
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? '登録中...' : '登録'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

