'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[ErrorBoundary] Root error:', error);
    console.error('[ErrorBoundary] Error message:', error.message);
    console.error('[ErrorBoundary] Error stack:', error.stack);
    console.error('[ErrorBoundary] Error digest:', error.digest);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          エラーが発生しました
        </h2>
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
          <p className="text-sm font-mono text-red-800 dark:text-red-200 break-all">
            {error.message || '予期しないエラーが発生しました'}
          </p>
          {process.env.NODE_ENV === 'development' && error.stack && (
            <details className="mt-2">
              <summary className="text-xs text-red-600 dark:text-red-400 cursor-pointer">
                スタックトレースを表示
              </summary>
              <pre className="mt-2 text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap break-all">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
          >
            再試行
          </button>
          <a
            href="/"
            className="inline-block rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            ホームに戻る
          </a>
        </div>
      </div>
    </div>
  );
}

