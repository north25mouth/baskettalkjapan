// Firestoreヘルパー関数
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
  Query,
} from 'firebase/firestore';
import { getFirebaseDb } from './config';
import {
  User,
  Team,
  Match,
  Thread,
  Post,
  Like,
  Report,
  Notification,
} from '@/types';

// サーバー側とクライアント側の両方で動作するように
function getDb() {
  try {
    if (typeof window !== 'undefined') {
      // クライアント側
      const { db } = require('./config');
      if (!db) {
        throw new Error('Firebase db is not initialized on client side');
      }
      return db;
    } else {
      // サーバー側
      // getFirebaseDb()は自動的に初期化を行う
      return getFirebaseDb();
    }
  } catch (error) {
    console.error('[getDb] Error:', error);
    console.error('[getDb] Error details:', {
      isClient: typeof window !== 'undefined',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

// 型変換ヘルパー
export function timestampToDate(timestamp: Timestamp | Date | null | undefined): Date {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  return new Date();
}

export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

// User関連
export async function getUser(userId: string): Promise<User | null> {
  try {
    if (!userId || typeof userId !== 'string') {
      console.warn('[getUser] Invalid userId:', userId);
      return null;
    }
    const db = getDb();
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      console.log('[getUser] User not found:', userId);
      return null;
    }
    const data = userDoc.data();
    return {
      ...data,
      id: userDoc.id,
      created_at: timestampToDate(data.created_at),
      updated_at: data.updated_at ? timestampToDate(data.updated_at) : undefined,
    } as User;
  } catch (error) {
    console.error('[getUser] Error occurred:', error);
    console.error('[getUser] Error details:', {
      userId,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export async function createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, 'users'), {
    ...userData,
    created_at: dateToTimestamp(new Date()),
  });
  return docRef.id;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
  const db = getDb();
  const userRef = doc(db, 'users', userId);
  const updateData: any = { ...updates };
  if (updates.updated_at) {
    updateData.updated_at = dateToTimestamp(updates.updated_at);
  }
  await updateDoc(userRef, updateData);
}

// Team関連
export async function getTeam(teamId: string): Promise<Team | null> {
  const db = getDb();
  const teamDoc = await getDoc(doc(db, 'teams', teamId));
  if (!teamDoc.exists()) return null;
  const data = teamDoc.data();
  return {
    ...data,
    id: teamDoc.id,
    created_at: timestampToDate(data.created_at),
  } as Team;
}

export async function getTeamBySlug(slug: string): Promise<Team | null> {
  try {
    console.log('[getTeamBySlug] Starting with slug:', slug);
    const db = getDb();
    console.log('[getTeamBySlug] Database initialized');
    
    const teamsSnapshot = await getDocs(
      query(
        collection(db, 'teams'),
        where('slug', '==', slug),
        limit(1)
      )
    );

    console.log('[getTeamBySlug] Query completed, found:', teamsSnapshot.size, 'teams');

    if (teamsSnapshot.empty) {
      console.log(`[getTeamBySlug] No team found with slug: ${slug}`);
      return null;
    }

    const teamDoc = teamsSnapshot.docs[0];
    const data = teamDoc.data();
    console.log('[getTeamBySlug] Team data retrieved:', { id: teamDoc.id, name: data.name });
    
    // created_atが存在しない場合の処理
    const createdAt = data.created_at 
      ? timestampToDate(data.created_at)
      : new Date();
    
    // slugが存在しない場合は追加（後方互換性）
    const teamData: Team = {
      ...data,
      id: teamDoc.id,
      slug: data.slug || slug, // slugが存在しない場合は引数のslugを使用
      created_at: createdAt,
    } as Team;
    
    console.log('[getTeamBySlug] Team data processed successfully');
    return teamData;
  } catch (error) {
    console.error('[getTeamBySlug] Error occurred:', error);
    console.error('[getTeamBySlug] Error details:', {
      slug,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      errorName: error instanceof Error ? error.name : undefined,
    });
    throw error;
  }
}

export async function getTeams(): Promise<Team[]> {
  const db = getDb();
  const teamsSnapshot = await getDocs(collection(db, 'teams'));
  return teamsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    created_at: timestampToDate(doc.data().created_at),
  })) as Team[];
}

// Match関連
export async function getMatch(matchId: string): Promise<Match | null> {
  const db = getDb();
  const matchDoc = await getDoc(doc(db, 'matches', matchId));
  if (!matchDoc.exists()) return null;
  const data = matchDoc.data();
  return {
    ...data,
    id: matchDoc.id,
    start_time: timestampToDate(data.start_time),
    created_at: timestampToDate(data.created_at),
  } as Match;
}

export async function getTodayMatches(): Promise<Match[]> {
  try {
    console.log('[getTodayMatches] Starting...');
    const db = getDb();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log('[getTodayMatches] Querying matches for today:', today.toISOString());

    const matchesSnapshot = await getDocs(
      query(
        collection(db, 'matches'),
        where('start_time', '>=', dateToTimestamp(today)),
        where('start_time', '<', dateToTimestamp(tomorrow)),
        orderBy('start_time')
      )
    );

    console.log('[getTodayMatches] Found matches:', matchesSnapshot.size);

    return matchesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      start_time: timestampToDate(doc.data().start_time),
      created_at: timestampToDate(doc.data().created_at),
    })) as Match[];
  } catch (error) {
    console.error('[getTodayMatches] Error occurred:', error);
    console.error('[getTodayMatches] Error details:', {
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    // エラーが発生した場合は空配列を返す（ページが表示されるように）
    // インデックスエラーの場合は、エラーメッセージにリンクが含まれている
    if (error instanceof Error && error.message.includes('index')) {
      console.warn('[getTodayMatches] Index required. Please create the index.');
    }
    return [];
  }
}

// Thread関連
export async function getThread(threadId: string): Promise<Thread | null> {
  const db = getDb();
  const threadDoc = await getDoc(doc(db, 'threads', threadId));
  if (!threadDoc.exists()) return null;
  const data = threadDoc.data();
  return {
    ...data,
    id: threadDoc.id,
    created_at: timestampToDate(data.created_at),
    updated_at: timestampToDate(data.updated_at),
  } as Thread;
}

export async function getThreads(
  filters?: {
    type?: Thread['type'];
    team_id?: string;
    match_id?: string;
    author_id?: string;
  },
  orderByField: string = 'created_at',
  orderDirection: 'asc' | 'desc' = 'desc',
  limitCount?: number
): Promise<Thread[]> {
  try {
    console.log('[getThreads] Starting with filters:', filters);
    const constraints: QueryConstraint[] = [];

    if (filters?.type) {
      constraints.push(where('type', '==', filters.type));
    }
    if (filters?.team_id) {
      constraints.push(where('team_id', '==', filters.team_id));
    }
    if (filters?.match_id) {
      constraints.push(where('match_id', '==', filters.match_id));
    }
    if (filters?.author_id) {
      constraints.push(where('author_id', '==', filters.author_id));
    }

    constraints.push(orderBy(orderByField, orderDirection));
    if (limitCount) {
      constraints.push(limit(limitCount));
    }

    const db = getDb();
    console.log('[getThreads] Querying threads...');
    const threadsSnapshot = await getDocs(
      query(collection(db, 'threads'), ...constraints)
    );

    console.log('[getThreads] Found threads:', threadsSnapshot.size);

    return threadsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      created_at: timestampToDate(doc.data().created_at),
      updated_at: timestampToDate(doc.data().updated_at),
    })) as Thread[];
  } catch (error) {
    console.error('[getThreads] Error occurred:', error);
    console.error('[getThreads] Error details:', {
      filters,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    // エラーが発生した場合は空配列を返す
    if (error instanceof Error && error.message.includes('index')) {
      console.warn('[getThreads] Index required. Please create the index.');
    }
    return [];
  }
}

export async function createThread(threadData: Omit<Thread, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const db = getDb();
  const now = new Date();
  const docRef = await addDoc(collection(db, 'threads'), {
    ...threadData,
    created_at: dateToTimestamp(now),
    updated_at: dateToTimestamp(now),
  });
  return docRef.id;
}

export async function updateThread(threadId: string, updates: Partial<Thread>): Promise<void> {
  const db = getDb();
  const threadRef = doc(db, 'threads', threadId);
  const updateData: any = { ...updates };
  if (updates.updated_at) {
    updateData.updated_at = dateToTimestamp(updates.updated_at);
  }
  await updateDoc(threadRef, updateData);
}

// Post関連
export async function getPost(postId: string): Promise<Post | null> {
  const db = getDb();
  const postDoc = await getDoc(doc(db, 'posts', postId));
  if (!postDoc.exists()) return null;
  const data = postDoc.data();
  return {
    ...data,
    id: postDoc.id,
    created_at: timestampToDate(data.created_at),
    edited_at: data.edited_at ? timestampToDate(data.edited_at) : undefined,
    deleted_at: data.deleted_at ? timestampToDate(data.deleted_at) : undefined,
  } as Post;
}

export async function getPostsByThread(threadId: string): Promise<Post[]> {
  const db = getDb();
  const postsSnapshot = await getDocs(
    query(
      collection(db, 'posts'),
      where('thread_id', '==', threadId),
      where('deleted_flag', '==', false),
      orderBy('created_at', 'asc')
    )
  );

  return postsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: timestampToDate(data.created_at),
      edited_at: data.edited_at ? timestampToDate(data.edited_at) : undefined,
      deleted_at: data.deleted_at ? timestampToDate(data.deleted_at) : undefined,
    };
  }) as Post[];
}

export async function createPost(postData: Omit<Post, 'id' | 'created_at' | 'likes_count' | 'deleted_flag'>): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, 'posts'), {
    ...postData,
    likes_count: 0,
    deleted_flag: false,
    created_at: dateToTimestamp(new Date()),
  });

  // スレッドのposts_countを更新
  const threadRef = doc(db, 'threads', postData.thread_id);
  const threadDoc = await getDoc(threadRef);
  if (threadDoc.exists()) {
    const currentCount = threadDoc.data().posts_count || 0;
    await updateDoc(threadRef, {
      posts_count: currentCount + 1,
      updated_at: dateToTimestamp(new Date()),
    });
  }

  return docRef.id;
}

export async function updatePost(postId: string, updates: Partial<Post>): Promise<void> {
  const db = getDb();
  const postRef = doc(db, 'posts', postId);
  const updateData: any = { ...updates };
  if (updates.edited_at) {
    updateData.edited_at = dateToTimestamp(updates.edited_at);
  }
  await updateDoc(postRef, updateData);
}

export async function deletePost(postId: string): Promise<void> {
  const db = getDb();
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    deleted_flag: true,
    deleted_at: dateToTimestamp(new Date()),
  });

  // スレッドのposts_countを更新
  const postDoc = await getDoc(postRef);
  if (postDoc.exists()) {
    const threadId = postDoc.data().thread_id;
    const threadRef = doc(db, 'threads', threadId);
    const threadDoc = await getDoc(threadRef);
    if (threadDoc.exists()) {
      const currentCount = threadDoc.data().posts_count || 0;
      await updateDoc(threadRef, {
        posts_count: Math.max(0, currentCount - 1),
      });
    }
  }
}

// Like関連
export async function toggleLike(userId: string, postId: string): Promise<boolean> {
  const db = getDb();
  const likesSnapshot = await getDocs(
    query(
      collection(db, 'likes'),
      where('user_id', '==', userId),
      where('post_id', '==', postId)
    )
  );

  if (likesSnapshot.empty) {
    // いいねを追加
    await addDoc(collection(db, 'likes'), {
      user_id: userId,
      post_id: postId,
      created_at: dateToTimestamp(new Date()),
    });

    // 投稿のいいね数を更新
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const currentCount = postDoc.data().likes_count || 0;
      await updateDoc(postRef, { likes_count: currentCount + 1 });
    }

    return true; // いいね済み
  } else {
    // いいねを削除
    const likeDoc = likesSnapshot.docs[0];
    await deleteDoc(doc(db, 'likes', likeDoc.id));

    // 投稿のいいね数を更新
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const currentCount = postDoc.data().likes_count || 0;
      await updateDoc(postRef, { likes_count: Math.max(0, currentCount - 1) });
    }

    return false; // いいね解除
  }
}

export async function isLiked(userId: string, postId: string): Promise<boolean> {
  const db = getDb();
  const likesSnapshot = await getDocs(
    query(
      collection(db, 'likes'),
      where('user_id', '==', userId),
      where('post_id', '==', postId)
    )
  );
  return !likesSnapshot.empty;
}

// Report関連
export async function createReport(reportData: Omit<Report, 'id' | 'created_at' | 'status'>): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, 'reports'), {
    ...reportData,
    status: 'pending',
    created_at: dateToTimestamp(new Date()),
  });
  return docRef.id;
}

export async function getReports(
  status?: Report['status'],
  limitCount?: number
): Promise<Report[]> {
  const constraints: QueryConstraint[] = [];
  if (status) {
    constraints.push(where('status', '==', status));
  }
  constraints.push(orderBy('created_at', 'desc'));
  if (limitCount) {
    constraints.push(limit(limitCount));
  }

  const db = getDb();
  const reportsSnapshot = await getDocs(
    query(collection(db, 'reports'), ...constraints)
  );

  return reportsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: timestampToDate(data.created_at),
      reviewed_at: data.reviewed_at ? timestampToDate(data.reviewed_at) : undefined,
    };
  }) as Report[];
}

export async function updateReport(reportId: string, updates: Partial<Report>): Promise<void> {
  const db = getDb();
  const reportRef = doc(db, 'reports', reportId);
  const updateData: any = { ...updates };
  if (updates.reviewed_at) {
    updateData.reviewed_at = dateToTimestamp(updates.reviewed_at);
  }
  await updateDoc(reportRef, updateData);
}

// Notification関連
export async function createNotification(notificationData: Omit<Notification, 'id' | 'created_at' | 'read_flag'>): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, 'notifications'), {
    ...notificationData,
    read_flag: false,
    created_at: dateToTimestamp(new Date()),
  });
  return docRef.id;
}

export async function getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
  const db = getDb();
  const constraints: QueryConstraint[] = [where('user_id', '==', userId)];
  if (unreadOnly) {
    constraints.push(where('read_flag', '==', false));
  }
  constraints.push(orderBy('created_at', 'desc'));
  constraints.push(limit(50));

  const notificationsSnapshot = await getDocs(
    query(collection(db, 'notifications'), ...constraints)
  );

  return notificationsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: timestampToDate(data.created_at),
    };
  }) as Notification[];
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const db = getDb();
  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, { read_flag: true });
}

