'use client';

import { Thread, Post, User, Match, Team } from '@/types';
import { formatDate, getThreadTypeLabel } from '@/lib/utils';
import Link from 'next/link';

interface ThreadDetailViewProps {
  thread: Thread;
  posts: Post[];
  authorMap: Map<string, User>;
  match: Match | null;
  team: Team | null;
}

export default function ThreadDetailView({
  thread,
  posts,
  authorMap,
  match,
  team,
}: ThreadDetailViewProps) {
  const author = authorMap.get(thread.author_id);

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

        {/* スレッドヘッダー */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  {getThreadTypeLabel(thread.type)}
                </span>
                {thread.pinned && (
                  <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                    固定
                  </span>
                )}
                {thread.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {thread.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                {author && (
                  <>
                    <span>{author.display_name}</span>
                    <span>•</span>
                  </>
                )}
                <span>{formatDate(thread.created_at)}</span>
                <span>•</span>
                <span>{thread.posts_count} コメント</span>
                <span>•</span>
                <span>{thread.likes_count} いいね</span>
              </div>
            </div>
          </div>

          {/* 試合情報 */}
          {match && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
              <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                試合情報
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p>
                  {match.start_time.toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {match.status === 'live' && (
                  <span className="mt-2 inline-block rounded bg-red-500 px-2 py-1 text-xs text-white">
                    生放送中
                  </span>
                )}
                {match.status === 'finished' && match.score_home !== undefined && (
                  <p className="mt-2">
                    スコア: {match.score_home} - {match.score_away}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* チーム情報 */}
          {team && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
              <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                チーム情報
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p>{team.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {team.abbreviation} • {team.region}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 投稿一覧 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            コメント ({posts.length})
          </h2>

          {posts.length > 0 ? (
            posts.map((post) => {
              const postAuthor = authorMap.get(post.author_id);
              return (
                <div
                  key={post.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  {post.deleted_flag ? (
                    <p className="text-sm italic text-gray-500 dark:text-gray-400">
                      この投稿は削除されました
                    </p>
                  ) : (
                    <>
                      <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        {postAuthor && (
                          <>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {postAuthor.display_name}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span>{formatDate(post.created_at)}</span>
                        {post.edited_at && (
                          <>
                            <span>•</span>
                            <span className="text-xs">編集済み</span>
                          </>
                        )}
                      </div>

                      <div className="mb-3 whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                        {post.content}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          {post.likes_count}
                        </button>
                        <button className="text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400">
                          返信
                        </button>
                        <button className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                          通報
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
              <p className="text-gray-600 dark:text-gray-400">
                まだコメントがありません。最初のコメントを投稿してみましょう！
              </p>
            </div>
          )}
        </div>

        {/* 投稿フォーム（後で実装） */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            投稿フォームはフェーズ2で実装します
          </p>
        </div>
      </div>
    </div>
  );
}

