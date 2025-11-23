'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/config';
import { createThread, getTeams } from '@/lib/firebase/firestore';
import { Team } from '@/types';

function NewThreadPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [threadType, setThreadType] = useState<'match' | 'team' | 'free'>('free');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [tags, setTags] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

  // URLパラメータからチームIDを取得
  useEffect(() => {
    const teamId = searchParams.get('team');
    if (teamId) {
      setSelectedTeam(teamId);
      setThreadType('team');
    }
  }, [searchParams]);

  useEffect(() => {
    const authInstance = getFirebaseAuth();
    if (!authInstance) {
      console.warn('[NewThreadPage] Firebase auth is not initialized');
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getTeams().then(setTeams).catch(console.error);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">ログイン中...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('タイトルと本文を入力してください');
      return;
    }

    if (!agreeToTerms) {
      setError('利用規約に同意してください');
      return;
    }

    setSubmitting(true);

    try {
      const tagArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await createThread({
        title: title.trim(),
        type: threadType,
        author_id: user.uid,
        tags: tagArray,
        team_id: threadType === 'team' && selectedTeam ? selectedTeam : undefined,
        match_id: undefined, // 試合スレは別途実装
        pinned: false,
        likes_count: 0,
        posts_count: 0,
      });

      // 最初の投稿（OP）を作成
      // ここでは簡略化のため、スレッド作成後に投稿ページにリダイレクト
      router.push('/community');
    } catch (err: any) {
      setError(err.message || 'スレッドの作成に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
          新規スレッド作成
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* スレッドタイプ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              スレッドタイプ
            </label>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="free"
                  checked={threadType === 'free'}
                  onChange={(e) => setThreadType(e.target.value as any)}
                  className="mr-2"
                />
                自由スレ
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="team"
                  checked={threadType === 'team'}
                  onChange={(e) => setThreadType(e.target.value as any)}
                  className="mr-2"
                />
                チーム掲示板
              </label>
            </div>
          </div>

          {/* チーム選択 */}
          {threadType === 'team' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                チーム
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                required={threadType === 'team'}
              >
                <option value="">チームを選択</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* タイトル */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              タイトル
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              required
              maxLength={200}
            />
          </div>

          {/* 本文 */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              本文
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              required
            />
          </div>

          {/* タグ */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              タグ（カンマ区切り）
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              placeholder="例: 試合, 雑談, 選手"
            />
          </div>

          {/* 利用規約同意 */}
          <div className="flex items-center">
            <input
              id="agreeToTerms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              required
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
              <a
                href="/rules"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-500 dark:text-orange-400"
              >
                利用規約
              </a>
              と
              <a
                href="/rules#copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-500 dark:text-orange-400"
              >
                著作権ポリシー
              </a>
              に同意し、著作権違反していないことを確認します
            </label>
          </div>

          {/* 送信ボタン */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-orange-600 px-6 py-2 text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {submitting ? '作成中...' : 'スレッドを作成'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewThreadPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
        </div>
      </div>
    }>
      <NewThreadPageContent />
    </Suspense>
  );
}

