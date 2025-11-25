'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/config';
import { createPost, getPostsByThread, getUser, toggleLike, isLiked, createReport } from '@/lib/firebase/firestore';
import { Thread, Post, User, Match, Team } from '@/types';
import { formatDate, getThreadTypeLabel, getTeamColor } from '@/lib/utils';
import Link from 'next/link';

interface ThreadDetailViewProps {
  thread: Thread;
  posts: Post[];
  authorMap: Map<string, User>;
  match: Match | null;
  team: Team | null;
  homeTeam?: Team | null;
  awayTeam?: Team | null;
}

export default function ThreadDetailView({
  thread: initialThread,
  posts: initialPosts,
  authorMap: initialAuthorMap,
  match,
  team,
  homeTeam,
  awayTeam,
}: ThreadDetailViewProps) {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [authorMap, setAuthorMap] = useState<Map<string, User>>(initialAuthorMap);
  const [postContent, setPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [thread, setThread] = useState<Thread>(initialThread);
  const [displayedPostsCount, setDisplayedPostsCount] = useState(100); // 表示する投稿数
  const [loadingMore, setLoadingMore] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set()); // いいね済みの投稿ID
  const [likingPostId, setLikingPostId] = useState<string | null>(null); // いいね処理中の投稿ID
  const [reportingPostId, setReportingPostId] = useState<string | null>(null); // 通報中の投稿ID
  const [showReportForm, setShowReportForm] = useState<string | null>(null); // 通報フォームを表示する投稿ID
  const [reportReason, setReportReason] = useState(''); // 通報理由
  const [reportDetails, setReportDetails] = useState(''); // 通報詳細

  const author = authorMap.get(thread.author_id);

  // 認証状態の確認といいね状態の取得
  useEffect(() => {
    const authInstance = getFirebaseAuth();
    if (!authInstance) {
      console.warn('[ThreadDetailView] Firebase auth is not initialized');
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      setUser(currentUser);
      
      // ログイン済みの場合、いいね状態を取得
      if (currentUser) {
        const likedSet = new Set<string>();
        await Promise.all(
          posts.map(async (post) => {
            const liked = await isLiked(currentUser.uid, post.id);
            if (liked) {
              likedSet.add(post.id);
            }
          })
        );
        setLikedPosts(likedSet);
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, [posts]);

  // いいね切り替え
  const handleToggleLike = async (postId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (likingPostId === postId) {
      return; // 既に処理中
    }

    setLikingPostId(postId);

    try {
      const isLikedNow = await toggleLike(user.uid, postId);

      // いいね状態を更新
      const newLikedPosts = new Set(likedPosts);
      if (isLikedNow) {
        newLikedPosts.add(postId);
      } else {
        newLikedPosts.delete(postId);
      }
      setLikedPosts(newLikedPosts);

      // 投稿のいいね数を更新
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likes_count: isLikedNow ? post.likes_count + 1 : Math.max(0, post.likes_count - 1),
            };
          }
          return post;
        })
      );
    } catch (err: any) {
      console.error('いいねの切り替えに失敗しました:', err);
      // エラー時はUIを更新しない（ロールバック不要）
    } finally {
      setLikingPostId(null);
    }
  };

  // 投稿作成
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }

    const content = postContent.trim();
    if (!content) {
      setError('投稿内容を入力してください');
      return;
    }

    if (content.length > 10000) {
      setError('投稿内容は10,000文字以内で入力してください');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      // 投稿を作成
      await createPost({
        thread_id: thread.id,
        author_id: user.uid,
        content: content,
      });

      // 投稿内容をクリア
      setPostContent('');

      // 投稿一覧を再取得
      const updatedPosts = await getPostsByThread(thread.id);
      
      // 新しい投稿の作成者情報を取得
      const newAuthorIds = new Set<string>();
      updatedPosts.forEach(post => {
        if (!authorMap.has(post.author_id)) {
          newAuthorIds.add(post.author_id);
        }
      });

      // 新しい作成者情報を取得
      const newAuthors = await Promise.all(
        Array.from(newAuthorIds).map(id => getUser(id))
      );

      // 作成者マップを更新
      const updatedAuthorMap = new Map(authorMap);
      newAuthors.forEach(author => {
        if (author) {
          updatedAuthorMap.set(author.id, author);
        }
      });

      // 状態を更新
      setPosts(updatedPosts);
      setAuthorMap(updatedAuthorMap);
      
      // スレッドの投稿数を更新
      setThread({
        ...thread,
        posts_count: updatedPosts.length,
      });

      // 表示件数を更新（新しい投稿が表示されるように）
      setDisplayedPostsCount(prev => Math.max(prev, updatedPosts.length));
      
      // 投稿一覧の最後にスクロール（新しい投稿が下に表示されるため）
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    } catch (err: any) {
      console.error('投稿の作成に失敗しました:', err);
      setError(err.message || '投稿の作成に失敗しました');
    } finally {
      setSubmitting(false);
    }
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
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                試合情報
              </h3>
              
              {/* 対戦カード */}
              {homeTeam && awayTeam && (
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${getTeamColor(homeTeam.abbreviation).primary} 0%, ${getTeamColor(homeTeam.abbreviation).primary} 50%, ${getTeamColor(homeTeam.abbreviation).secondary} 50%, ${getTeamColor(homeTeam.abbreviation).secondary} 100%)`,
                      }}
                    />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {homeTeam.name}
                    </span>
                  </div>
                  
                  {match.status === 'finished' && match.score_home !== undefined && (
                    <div className="mx-4 text-lg font-bold text-gray-900 dark:text-gray-100">
                      {match.score_home} - {match.score_away}
                    </div>
                  )}
                  {match.status !== 'finished' && (
                    <div className="mx-4 text-gray-500 dark:text-gray-400">vs</div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${getTeamColor(awayTeam.abbreviation).primary} 0%, ${getTeamColor(awayTeam.abbreviation).primary} 50%, ${getTeamColor(awayTeam.abbreviation).secondary} 50%, ${getTeamColor(awayTeam.abbreviation).secondary} 100%)`,
                      }}
                    />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {awayTeam.name}
                    </span>
                  </div>
                </div>
              )}
              
              {/* 試合日時 */}
              <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  {`${match.start_time.getFullYear()}年${match.start_time.getMonth() + 1}月${match.start_time.getDate()}日 ${String(match.start_time.getHours()).padStart(2, '0')}:${String(match.start_time.getMinutes()).padStart(2, '0')}`}
                </p>
              </div>
              
              {/* 試合ステータス */}
              <div className="mb-2">
                {match.status === 'scheduled' && (
                  <span className="inline-block rounded bg-blue-500 px-2 py-1 text-xs text-white">
                    予定
                  </span>
                )}
                {match.status === 'live' && (
                  <span className="inline-block rounded bg-red-500 px-2 py-1 text-xs text-white">
                    生放送中
                  </span>
                )}
                {match.status === 'finished' && (
                  <span className="inline-block rounded bg-gray-500 px-2 py-1 text-xs text-white">
                    終了
                  </span>
                )}
                {match.status === 'cancelled' && (
                  <span className="inline-block rounded bg-gray-400 px-2 py-1 text-xs text-white">
                    中止
                  </span>
                )}
              </div>
              
              {/* BoxScoreリンク */}
              {match.boxscore_url && (
                <div className="mt-2">
                  <a
                    href={match.boxscore_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400"
                  >
                    BoxScoreを見る →
                  </a>
                </div>
              )}
            </div>
          )}

          {/* チーム情報 */}
          {team && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                チーム情報
              </h3>
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${getTeamColor(team.abbreviation).primary} 0%, ${getTeamColor(team.abbreviation).primary} 50%, ${getTeamColor(team.abbreviation).secondary} 50%, ${getTeamColor(team.abbreviation).secondary} 100%)`,
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {team.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {team.abbreviation} • {team.region}
                  </p>
                </div>
                <Link
                  href={`/community/team/${team.slug || team.id}`}
                  className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400"
                >
                  チームページへ →
                </Link>
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
            <>
              {posts.slice(0, displayedPostsCount).map((post) => {
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
                      {/* 投稿者情報 */}
                      <div className="mb-3 flex items-center gap-3">
                        {postAuthor && (
                          <>
                            {/* アバター */}
                            {postAuthor.avatar_url ? (
                              <img
                                src={postAuthor.avatar_url}
                                alt={postAuthor.display_name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700 dark:bg-orange-900 dark:text-orange-200">
                                {postAuthor.display_name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            {/* 投稿者名と日時 */}
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-gray-100">
                                {postAuthor.display_name}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>{formatDate(post.created_at)}</span>
                                {post.edited_at && (
                                  <>
                                    <span>•</span>
                                    <span>編集済み</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                        {!postAuthor && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <span>不明なユーザー</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                        )}
                      </div>

                      <div className="mb-3 whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                        {post.content}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          disabled={!user || likingPostId === post.id}
                          className={`flex items-center gap-1 transition-colors ${
                            likedPosts.has(post.id)
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400'
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          <svg
                            className="h-5 w-5"
                            fill={likedPosts.has(post.id) ? 'currentColor' : 'none'}
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
                        <button
                          onClick={() => {
                            if (!user) {
                              router.push('/login');
                              return;
                            }
                            setShowReportForm(showReportForm === post.id ? null : post.id);
                            setReportReason('');
                            setReportDetails('');
                          }}
                          className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          通報
                        </button>
                      </div>

                      {/* 通報フォーム */}
                      {showReportForm === post.id && (
                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                          <h4 className="mb-3 text-sm font-semibold text-red-900 dark:text-red-200">
                            通報理由を選択してください
                          </h4>
                          <div className="mb-3 space-y-2">
                            {['スパム', '不適切な内容', 'ハラスメント', 'その他'].map((reason) => (
                              <label
                                key={reason}
                                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                              >
                                <input
                                  type="radio"
                                  name={`report-reason-${post.id}`}
                                  value={reason}
                                  checked={reportReason === reason}
                                  onChange={(e) => setReportReason(e.target.value)}
                                  className="h-4 w-4 text-red-600"
                                />
                                {reason}
                              </label>
                            ))}
                          </div>
                          <div className="mb-3">
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                              詳細（任意）
                            </label>
                            <textarea
                              value={reportDetails}
                              onChange={(e) => setReportDetails(e.target.value)}
                              placeholder="詳細を入力してください"
                              className="w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                              rows={3}
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                if (!user || !reportReason) {
                                  alert('通報理由を選択してください');
                                  return;
                                }
                                if (reportingPostId === post.id) return;

                                setReportingPostId(post.id);
                                try {
                                  await createReport({
                                    reporter_id: user.uid,
                                    target_type: 'post',
                                    target_id: post.id,
                                    reason: reportReason + (reportDetails ? `: ${reportDetails}` : ''),
                                  });
                                  alert('通報を受け付けました。ありがとうございます。');
                                  setShowReportForm(null);
                                  setReportReason('');
                                  setReportDetails('');
                                } catch (err: any) {
                                  console.error('通報の送信に失敗しました:', err);
                                  alert('通報の送信に失敗しました。');
                                } finally {
                                  setReportingPostId(null);
                                }
                              }}
                              disabled={!reportReason || reportingPostId === post.id}
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {reportingPostId === post.id ? '送信中...' : '送信'}
                            </button>
                            <button
                              onClick={() => {
                                setShowReportForm(null);
                                setReportReason('');
                                setReportDetails('');
                              }}
                              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                              キャンセル
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
              })}
              
              {/* もっと表示ボタン */}
              {posts.length > displayedPostsCount && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => {
                      setDisplayedPostsCount(prev => Math.min(prev + 100, posts.length));
                    }}
                    disabled={loadingMore}
                    className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {loadingMore ? '読み込み中...' : `もっと表示 (残り ${posts.length - displayedPostsCount}件)`}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
              <p className="text-gray-600 dark:text-gray-400">
                まだコメントがありません。最初のコメントを投稿してみましょう！
              </p>
            </div>
          )}
        </div>

        {/* 投稿フォーム */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          {loading ? (
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              読み込み中...
            </div>
          ) : user ? (
            <form onSubmit={handleSubmitPost}>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                コメントを投稿
              </h3>
              
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="コメントを入力してください..."
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                  disabled={submitting}
                />
                <div className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
                  {postContent.length} / 10,000 文字
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  投稿することで、利用規約に同意したものとみなされます
                </p>
                <button
                  type="submit"
                  disabled={submitting || !postContent.trim()}
                  className="rounded-lg bg-orange-600 px-6 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? '投稿中...' : '投稿'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                コメントを投稿するにはログインが必要です
              </p>
              <Link
                href="/login"
                className="inline-block rounded-lg bg-orange-600 px-6 py-2 text-sm font-medium text-white hover:bg-orange-700"
              >
                ログイン
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

