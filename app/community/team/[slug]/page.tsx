import { notFound } from 'next/navigation';
import { getTeamBySlug, getThreads, getUser } from '@/lib/firebase/firestore';
import { Team, Thread, ThreadWithDetails } from '@/types';
import ThreadCard from '@/components/ThreadCard';
import Link from 'next/link';
import { getTeamColor } from '@/lib/utils';

interface TeamPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getThreadsWithDetails(teamId: string): Promise<ThreadWithDetails[]> {
  // インデックスエラーを回避するため、typeでフィルタリングしてからクライアント側でフィルタリング
  // インデックス作成後は、getThreads({ team_id: teamId, type: 'team' }, 'created_at', 'desc', 20) を使用可能
  // インデックス作成方法: docs/FIRESTORE_INDEX_SETUP.md を参照
  // または、エラーメッセージに含まれるURLから直接作成可能
  
  // まず、typeでフィルタリングしてからクライアント側でフィルタリング（インデックス不要）
  const allThreads = await getThreads({ type: 'team' }, 'created_at', 'desc', 100);
  const teamThreads = allThreads.filter(thread => thread.team_id === teamId);
  
  const threadsWithDetails: ThreadWithDetails[] = [];

  for (const thread of teamThreads) {
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

export default async function TeamPage({ params }: TeamPageProps) {
  // Next.js 16では、paramsがPromiseとして渡される場合がある
  const resolvedParams = await params;
  
  // パラメータの検証
  if (!resolvedParams || !resolvedParams.slug) {
    console.error('[TeamPage] Invalid params:', resolvedParams);
    return notFound();
  }

  const slug = resolvedParams.slug;

  if (typeof slug !== 'string' || slug.trim() === '') {
    console.error('[TeamPage] Invalid slug:', slug, typeof slug);
    return notFound();
  }

  try {
    console.log('[TeamPage] Fetching team with slug:', slug);
    
    const team = await getTeamBySlug(slug);
    
    if (!team) {
      console.log(`[TeamPage] Team not found for slug: ${slug}`);
      return notFound();
    }

    console.log('[TeamPage] Team found:', team.name);
    const threads = await getThreadsWithDetails(team.id);
    console.log('[TeamPage] Threads fetched:', threads.length);

    return (
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* ナビゲーション */}
          <div className="mb-4">
            <Link
              href="/community"
              className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400"
            >
              ← コミュニティに戻る
            </Link>
          </div>

          {/* チームヘッダー */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${getTeamColor(team.abbreviation).primary} 0%, ${getTeamColor(team.abbreviation).primary} 50%, ${getTeamColor(team.abbreviation).secondary} 50%, ${getTeamColor(team.abbreviation).secondary} 100%)`,
                }}
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {team.name}
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {team.abbreviation} • {team.region}
                </p>
              </div>
            </div>
          </div>

          {/* スレッド一覧 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              スレッド ({threads.length})
            </h2>

            {threads.length > 0 ? (
              threads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              ))
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400">
                  まだスレッドがありません。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // エラーの詳細をログに記録
    console.error('[TeamPage] Error occurred:', error);
    console.error('[TeamPage] Error details:', {
      slug,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorName: error instanceof Error ? error.name : undefined,
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    
    // エラーを再スローして、error.tsxで処理させる
    throw error;
  }
}

