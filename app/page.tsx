import Link from 'next/link';

export default async function Home() {
  // エラーが発生してもページを表示するため、個別にtry-catch
  let todayMatches: any[] = [];
  let hotThreads: any[] = [];

  try {
    const { getTodayMatches } = await import('@/lib/firebase/firestore');
    todayMatches = await getTodayMatches();
  } catch (error) {
    console.error('[Home] Error fetching matches:', error);
    todayMatches = [];
  }

  try {
    const { getThreads, getUser } = await import('@/lib/firebase/firestore');
    const threads = await getThreads({}, 'created_at', 'desc', 10);
    
    const threadsWithDetails = [];
    for (const thread of threads) {
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
  } catch (error) {
    console.error('[Home] Error fetching threads:', error);
    hotThreads = [];
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ファーストビュー：今日の試合 */}
        {todayMatches.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              今日の試合
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {todayMatches.map((match) => (
                <Link
                  key={match.id}
                  href={`/community/match/${match.id}`}
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {match.start_time.toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                      {match.status === 'live' && (
                        <span className="mr-2 rounded bg-red-500 px-2 py-1 text-xs text-white">
                          生放送中
                        </span>
                      )}
                      {match.status === 'finished' && (
                        <span className="mr-2 rounded bg-gray-500 px-2 py-1 text-xs text-white">
                          終了
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* メイン：ホット投稿 */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              新着投稿
            </h2>
            <Link
              href="/community"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400"
            >
              もっと見る →
            </Link>
          </div>
          <div className="space-y-4">
            {hotThreads.length > 0 ? (
              hotThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {thread.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {thread.author?.display_name || 'Unknown'} • {new Date(thread.created_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400">
                  まだ投稿がありません。最初の投稿を作成してみましょう！
                </p>
                <Link
                  href="/community/new"
                  className="mt-4 inline-block rounded-lg bg-orange-600 px-6 py-2 text-white hover:bg-orange-700"
                >
                  新規スレ作成
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* サイドバー的な情報 */}
        <section className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              注目チーム
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/community/team/la-lakers"
                  className="text-sm text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                >
                  LAレイカーズ
                </Link>
              </li>
              <li>
                <Link
                  href="/community/team/golden-state-warriors"
                  className="text-sm text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                >
                  ゴールデンステート・ウォリアーズ
                </Link>
              </li>
              <li>
                <Link
                  href="/community/team/boston-celtics"
                  className="text-sm text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                >
                  ボストン・セルティックス
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              最新記事
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <Link
                href="/articles"
                className="text-orange-600 hover:text-orange-700 dark:text-orange-400"
              >
                記事一覧を見る →
              </Link>
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              サイトルール
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              コミュニティを楽しく利用するために、利用規約と著作権ポリシーをご確認ください。
            </p>
            <Link
              href="/rules"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400"
            >
              利用規約を見る →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
