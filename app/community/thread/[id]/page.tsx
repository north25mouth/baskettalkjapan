import { notFound } from 'next/navigation';
import { getThread, getPostsByThread, getUser, getMatch, getTeam } from '@/lib/firebase/firestore';
import { Thread, Post, User, Match, Team } from '@/types';
import ThreadDetailView from '@/components/ThreadDetailView';

interface ThreadDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ThreadDetailPage({ params }: ThreadDetailPageProps) {
  const threadId = params.id;

  try {
    // スレッドと投稿を並列取得
    const [thread, posts] = await Promise.all([
      getThread(threadId),
      getPostsByThread(threadId)
    ]);

    if (!thread) {
      return notFound();
    }

    // 作成者IDを取得
    const authorIds = new Set([
      thread.author_id,
      ...posts.map(post => post.author_id)
    ]);

    // ユーザー情報を並列取得
    const authors = await Promise.all(
      Array.from(authorIds).map(id => getUser(id))
    );

    // ユーザーマップを作成
    const authorMap = new Map<string, User>(
      authors.filter((user): user is User => user !== null).map(user => [user.id, user])
    );

    // 試合情報またはチーム情報を取得
    let match: Match | null = null;
    let team: Team | null = null;

    if (thread.type === 'match' && thread.match_id) {
      match = await getMatch(thread.match_id);
    } else if (thread.type === 'team' && thread.team_id) {
      team = await getTeam(thread.team_id);
    }

    return (
      <ThreadDetailView
        thread={thread}
        posts={posts}
        authorMap={authorMap}
        match={match}
        team={team}
      />
    );
  } catch (error) {
    console.error('データの取得に失敗しました:', error);
    throw error;
  }
}

