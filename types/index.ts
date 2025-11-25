// データモデル型定義（要件定義書 v0.2 に基づく）

export interface User {
  id: string;
  display_name: string;
  email: string;
  password_hash?: string; // 認証後は不要
  bio?: string;
  avatar_url?: string;
  roles: string[]; // 'user', 'admin', 'moderator' など
  favorite_teams?: string[]; // お気に入りチームIDの配列（最大3つ）
  created_at: Date;
  updated_at?: Date;
}

export interface Team {
  id: string;
  name: string;
  abbreviation: string; // 'LAL', 'GSW' など
  slug: string; // URL用のスラッグ（例: 'golden-state-warriors'）
  region: string; // 'West', 'East'
  logo_url?: string;
  created_at: Date;
}

export interface Match {
  id: string;
  team_home_id: string;
  team_away_id: string;
  start_time: Date;
  status: 'scheduled' | 'live' | 'finished' | 'cancelled';
  boxscore_url?: string;
  score_home?: number;
  score_away?: number;
  created_at: Date;
}

export type ThreadType = 'match' | 'team' | 'free';

export interface Thread {
  id: string;
  title: string;
  type: ThreadType;
  match_id?: string;
  team_id?: string;
  author_id: string;
  tags: string[];
  created_at: Date;
  updated_at: Date;
  pinned: boolean;
  likes_count: number;
  posts_count: number;
  views_count?: number;
}

export interface Post {
  id: string;
  thread_id: string;
  author_id: string;
  parent_post_id?: string; // 返信の場合
  content: string;
  likes_count: number;
  created_at: Date;
  edited_at?: Date;
  deleted_flag: boolean;
  deleted_at?: Date;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: Date;
}

export type ReportTargetType = 'post' | 'user';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: string;
  status: ReportStatus;
  created_at: Date;
  reviewed_at?: Date;
  reviewed_by?: string;
}

export type NotificationType = 'reply' | 'like' | 'mention' | 'admin' | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  payload: Record<string, any>; // 型安全にする場合は詳細化
  read_flag: boolean;
  created_at: Date;
}

// UI用の拡張型
export interface ThreadWithDetails extends Thread {
  author: User;
  match?: Match;
  team?: Team;
  latest_post?: Post;
}

export interface PostWithDetails extends Post {
  author: User;
  thread?: Thread;
  parent_post?: Post;
  is_liked?: boolean; // 現在のユーザーがいいね済みか
}

