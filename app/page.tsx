import Link from 'next/link';
import { getThreads, getUser, getTeams } from '@/lib/firebase/firestore';
import { getThreadTypeLabel } from '@/lib/utils';
import FavoriteTeams from '@/components/FavoriteTeams';

export default async function Home() {
  // エラーが発生してもページを表示するため、個別にtry-catch
  let hotThreads: any[] = [];
  let popularThreads: any[] = [];
  let teams: any[] = [];

  try {
    const allThreads = await getThreads({}, 'created_at', 'desc', 20);
    
    const threadsWithDetails = [];
    for (const thread of allThreads.slice(0, 5)) {
      try {
        const author = await getUser(thread.author_id);
        if (author) {
          threadsWithDetails.push({
            ...thread,
            author,
          });
        }
      } catch (error) {
        // エラーが発生してもスキップして続行
      }
    }
    hotThreads = threadsWithDetails;

    // 人気スレッド（いいね数順）
    const sortedByLikes = [...allThreads].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    const popularThreadsWithDetails = [];
    for (const thread of sortedByLikes.slice(0, 3)) {
      try {
        const author = await getUser(thread.author_id);
        if (author) {
          popularThreadsWithDetails.push({
            ...thread,
            author,
          });
        }
      } catch (error) {
        // エラーが発生してもスキップして続行
      }
    }
    popularThreads = popularThreadsWithDetails;
  } catch (error) {
    console.error('[Home] Error fetching threads:', error);
    hotThreads = [];
    popularThreads = [];
  }

  try {
    const allTeams = await getTeams();
    // 人気チームを表示（ランダムに3つ選択、または固定）
    teams = allTeams.slice(0, 6);
  } catch (error) {
    console.error('[Home] Error fetching teams:', error);
    teams = [];
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* ヒーローセクション */}
      <section className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-100">
              BasketTalk Japan
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              日本のNBAファンが集まるコミュニティ
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/community"
                className="rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                コミュニティを見る
              </Link>
              <Link
                href="/articles"
                className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                記事を読む
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* お気に入りチームセクション */}
        <FavoriteTeams />

        {/* 人気スレッドセクション */}
        {popularThreads.length > 0 && (
          <section className="mb-16">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                人気スレッド
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {popularThreads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/community/thread/${thread.id}`}
                  className="group block rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-800 dark:hover:border-gray-700"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                      {getThreadTypeLabel(thread.type)}
                    </span>
                    {thread.pinned && (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                        固定
                      </span>
                    )}
                  </div>
                  <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                    {thread.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{thread.author?.display_name || 'Unknown'}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 0 00-6.364 0z"
                          />
                        </svg>
                        {thread.likes_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        {thread.posts_count || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 新着投稿セクション */}
        <section className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              新着投稿
            </h2>
            <Link
              href="/community"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              もっと見る →
            </Link>
          </div>
          <div className="space-y-3">
            {hotThreads.length > 0 ? (
              hotThreads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/community/thread/${thread.id}`}
                  className="group block rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-800 dark:hover:border-gray-700"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                      {getThreadTypeLabel(thread.type)}
                    </span>
                    {thread.tags.slice(0, 2).map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded px-2 py-0.5 text-xs text-gray-500 dark:text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                    {thread.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      {thread.author?.avatar_url ? (
                        <img
                          src={thread.author.avatar_url}
                          alt={thread.author.display_name}
                          className="h-5 w-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                          {thread.author?.display_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <span>{thread.author?.display_name || 'Unknown'}</span>
                    </div>
                    <span>•</span>
                    <span>
                      {`${thread.created_at.getFullYear()}/${String(thread.created_at.getMonth() + 1).padStart(2, '0')}/${String(thread.created_at.getDate()).padStart(2, '0')}`}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {thread.posts_count || 0}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {thread.likes_count || 0}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800">
                <p className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  まだ投稿がありません
                </p>
                <p className="mb-6 text-xs text-gray-600 dark:text-gray-400">
                  最初の投稿を作成して、コミュニティを始めましょう
                </p>
                <Link
                  href="/community/new"
                  className="inline-block rounded-md bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  新規スレッドを作成
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* チーム・記事・ルールセクション */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              注目チーム
            </h3>
            <ul className="space-y-2">
              {teams.slice(0, 3).map((team) => (
                <li key={team.id}>
                  <Link
                    href={`/community/team/${team.slug || team.id}`}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    {team.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/community"
              className="mt-4 inline-block text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              すべてのチームを見る →
            </Link>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              最新記事
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              NBAの最新ニュース、試合レポート、選手情報などをお届けします。
            </p>
            <Link
              href="/articles"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              記事一覧を見る →
            </Link>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              サイトルール
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              コミュニティを楽しく利用するために、利用規約と著作権ポリシーをご確認ください。
            </p>
            <Link
              href="/rules"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              利用規約を見る →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
