import { notFound, redirect } from 'next/navigation';
import { getUser } from '@/lib/firebase/firestore';
import { User } from '@/types';
import UserProfileView from '@/components/UserProfileView';

interface UserProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const resolvedParams = await params;
  const userId = resolvedParams.userId;

  console.log('[UserProfilePage] userId:', userId);

  if (!userId || typeof userId !== 'string') {
    console.error('[UserProfilePage] Invalid userId:', userId);
    return notFound();
  }

  try {
    console.log('[UserProfilePage] Fetching user with id:', userId);
    const user = await getUser(userId);
    console.log('[UserProfilePage] User found:', user ? 'yes' : 'no');

    // ユーザーが見つからない場合でも、404を返さずにエラーメッセージを表示
    // （クライアント側で自動的に作成される可能性があるため）
    if (!user) {
      console.log('[UserProfilePage] User not found in Firestore');
      // 一時的なユーザーオブジェクトを作成（クライアント側で実際のデータが作成されるまで）
      const tempUser: User = {
        id: userId,
        display_name: 'ユーザー',
        email: '',
        roles: ['user'],
        created_at: new Date(),
      };
      return <UserProfileView user={tempUser} />;
    }

    return <UserProfileView user={user} />;
  } catch (error) {
    console.error('[UserProfilePage] Error occurred:', error);
    console.error('[UserProfilePage] Error details:', {
      userId,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    
    // エラーが発生した場合でも、一時的なユーザーオブジェクトを表示
    // （ネットワークエラーの場合など）
    const tempUser: User = {
      id: userId,
      display_name: 'ユーザー',
      email: '',
      roles: ['user'],
      created_at: new Date(),
    };
    return <UserProfileView user={tempUser} />;
  }
}

