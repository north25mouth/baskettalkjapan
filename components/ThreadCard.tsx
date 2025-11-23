import Link from 'next/link';
import { ThreadWithDetails } from '@/types';
import { formatDate, excerpt, getThreadTypeLabel, getTeamColor } from '@/lib/utils';

interface ThreadCardProps {
  thread: ThreadWithDetails;
}

export default function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <Link
      href={`/community/thread/${thread.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      prefetch={true}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
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

          <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {thread.title}
          </h3>

          {thread.latest_post && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {excerpt(thread.latest_post.content, 100)}
            </p>
          )}

          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{thread.author.display_name}</span>
            <span>•</span>
            <span>{formatDate(thread.created_at)}</span>
            <span>•</span>
            <span>{thread.posts_count} コメント</span>
            <span>•</span>
            <span>{thread.likes_count} いいね</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

