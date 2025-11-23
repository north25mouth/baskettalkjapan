import Link from 'next/link';
import { getThreads, getTeams, getUser } from '@/lib/firebase/firestore';
import { Thread, Team, ThreadWithDetails } from '@/types';
import ThreadCard from '@/components/ThreadCard';
import { getTeamColor } from '@/lib/utils';

async function getThreadsWithDetails(filters?: {
  type?: Thread['type'];
  team_id?: string;
}): Promise<ThreadWithDetails[]> {
  const threads = await getThreads(filters, 'created_at', 'desc', 20);
  const threadsWithDetails: ThreadWithDetails[] = [];

  for (const thread of threads) {
    const author = await getUser(thread.author_id);
    if (author) {
      threadsWithDetails.push({
        ...thread,
        author,
      });
    }
  }

  return threadsWithDetails;
}

export default async function CommunityPage() {
  const [threads, teams] = await Promise.all([
    getThreadsWithDetails(),
    getTeams(),
  ]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            コミュニティ
          </h1>
          <Link
            href="/community/new"
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
          >
            新規スレ作成
          </Link>
        </div>

        {/* コンテンツ */}
        <div className="space-y-6">
          {/* チーム一覧セクション */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              チーム別掲示板
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teams.length > 0 ? (
                teams.map((team) => {
                  const teamColor = getTeamColor(team.abbreviation);
                  const teamSlug = team.slug || team.id; // slugが存在しない場合はidを使用（フォールバック）
                  return (
                    <Link
                      key={team.id}
                      href={`/community/team/${teamSlug}`}
                      className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${teamColor.primary} 0%, ${teamColor.primary} 50%, ${teamColor.secondary} 50%, ${teamColor.secondary} 100%)`,
                          }}
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {team.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {team.abbreviation} • {team.region}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  チームデータがありません。
                </p>
              )}
            </div>
          </section>

          {/* スレッド一覧セクション */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              新着スレッド
            </h2>
            <div className="space-y-4">
              {threads.length > 0 ? (
                threads.map((thread) => (
                  <ThreadCard key={thread.id} thread={thread} />
                ))
              ) : (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                  <p className="text-gray-600 dark:text-gray-400">
                    まだ投稿がありません。
                  </p>
                  <Link
                    href="/community/new"
                    className="mt-4 inline-block rounded-lg bg-orange-600 px-6 py-2 text-white hover:bg-orange-700"
                  >
                    最初のスレッドを作成
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

