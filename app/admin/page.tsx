'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getReports, updateReport, deletePost } from '@/lib/firebase/firestore';
import { Report } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  useEffect(() => {
    if (!auth) {
      console.warn('[AdminPage] Firebase auth is not initialized');
      router.push('/login');
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }

      // 管理者チェック（簡易版）
      // 実際の実装では、Firestoreのユーザー情報からrolesを確認する
      if (!currentUser.email?.includes('admin')) {
        router.push('/');
        return;
      }

      setUser(currentUser);
      loadReports();
    });

    return () => unsubscribe();
  }, [router, filter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const reportsData = await getReports(
        filter === 'pending' ? 'pending' : undefined,
        50
      );
      setReports(reportsData);
    } catch (error) {
      console.error('通報の読み込みに失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (reportId: string, action: 'resolved' | 'dismissed') => {
    try {
      await updateReport(reportId, {
        status: action,
        reviewed_at: new Date(),
        reviewed_by: user?.uid || '',
      });
      loadReports();
    } catch (error) {
      console.error('通報の更新に失敗しました:', error);
      alert('更新に失敗しました');
    }
  };

  const handleDeletePost = async (postId: string, reportId: string) => {
    if (!confirm('この投稿を削除しますか？')) return;

    try {
      await deletePost(postId);
      await updateReport(reportId, {
        status: 'resolved',
        reviewed_at: new Date(),
        reviewed_by: user?.uid || '',
      });
      loadReports();
      alert('投稿を削除しました');
    } catch (error) {
      console.error('投稿の削除に失敗しました:', error);
      alert('削除に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
          管理画面
        </h1>

        {/* フィルタ */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setFilter('pending')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === 'pending'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            未対応
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            すべて
          </button>
        </div>

        {/* 通報一覧 */}
        <div className="space-y-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report.id}
                className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          report.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : report.status === 'resolved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {report.status === 'pending'
                          ? '未対応'
                          : report.status === 'resolved'
                          ? '対応済み'
                          : '却下'}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {report.target_type === 'post' ? '投稿' : 'ユーザー'}
                      </span>
                    </div>

                    <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                      <strong>理由：</strong>
                      {report.reason}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      通報日時: {formatDate(report.created_at)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      対象ID: {report.target_id}
                    </p>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    {report.status === 'pending' && (
                      <>
                        {report.target_type === 'post' && (
                          <button
                            onClick={() => handleDeletePost(report.target_id, report.id)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                          >
                            投稿削除
                          </button>
                        )}
                        <button
                          onClick={() => handleResolveReport(report.id, 'resolved')}
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                          対応済み
                        </button>
                        <button
                          onClick={() => handleResolveReport(report.id, 'dismissed')}
                          className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                        >
                          却下
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
              <p className="text-gray-600 dark:text-gray-400">
                通報はありません。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

