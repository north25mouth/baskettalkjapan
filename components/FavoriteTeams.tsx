'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/config';
import { getFavoriteTeams, addFavoriteTeam, removeFavoriteTeam, getTeams } from '@/lib/firebase/firestore';
import { Team } from '@/types';
import { getTeamColor } from '@/lib/utils';

export default function FavoriteTeams() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [favoriteTeams, setFavoriteTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const authInstance = getFirebaseAuth();
    if (!authInstance) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const [favorites, teams] = await Promise.all([
            getFavoriteTeams(currentUser.uid),
            getTeams(),
          ]);
          setFavoriteTeams(favorites);
          setAllTeams(teams);
        } catch (error) {
          console.error('[FavoriteTeams] Error fetching data:', error);
        }
      } else {
        setFavoriteTeams([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTeam = async (teamId: string) => {
    if (!user) return;

    setAdding(true);
    try {
      await addFavoriteTeam(user.uid, teamId);
      const updated = await getFavoriteTeams(user.uid);
      setFavoriteTeams(updated);
      setShowAddModal(false);
    } catch (error: any) {
      alert(error.message || 'お気に入りチームの追加に失敗しました');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveTeam = async (teamId: string) => {
    if (!user) return;

    try {
      await removeFavoriteTeam(user.uid, teamId);
      const updated = await getFavoriteTeams(user.uid);
      setFavoriteTeams(updated);
    } catch (error) {
      console.error('[FavoriteTeams] Error removing team:', error);
      alert('お気に入りチームの削除に失敗しました');
    }
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  const availableTeams = allTeams.filter(
    (team) => !favoriteTeams.some((fav) => fav.id === team.id)
  );

  return (
    <section className="mb-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          お気に入りチーム
        </h2>
        {favoriteTeams.length < 3 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            + チームを追加
          </button>
        )}
      </div>

      {favoriteTeams.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {favoriteTeams.map((team) => {
            const teamColor = getTeamColor(team.abbreviation);
            return (
              <div
                key={team.id}
                className="group relative rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-800 dark:hover:border-gray-700"
              >
                <button
                  onClick={() => handleRemoveTeam(team.id)}
                  className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                  title="お気に入りから削除"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <Link
                  href={`/community/team/${team.slug || team.id}`}
                  className="block"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 flex-shrink-0 rounded"
                      style={{
                        background: `linear-gradient(135deg, ${teamColor.primary} 0%, ${teamColor.primary} 50%, ${teamColor.secondary} 50%, ${teamColor.secondary} 100%)`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                        {team.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {team.abbreviation} • {team.region}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            お気に入りチームが登録されていません
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            チームを追加
          </button>
        </div>
      )}

      {/* 追加モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                チームを追加
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {availableTeams.length > 0 ? (
                availableTeams.map((team) => {
                  const teamColor = getTeamColor(team.abbreviation);
                  return (
                    <button
                      key={team.id}
                      onClick={() => handleAddTeam(team.id)}
                      disabled={adding}
                      className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 flex-shrink-0 rounded"
                          style={{
                            background: `linear-gradient(135deg, ${teamColor.primary} 0%, ${teamColor.primary} 50%, ${teamColor.secondary} 50%, ${teamColor.secondary} 100%)`,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {team.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {team.abbreviation} • {team.region}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  追加できるチームがありません
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

