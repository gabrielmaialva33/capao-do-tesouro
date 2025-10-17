/**
 * LeaderboardPage Component
 * Displays ranking of top users with their stats
 */

import { useEffect, useState } from 'react';
import { getLeaderboard } from '../../services/api';
import { formatNumber } from '../../lib/utils';
import Card from '../../components/ui/Card';
import type { LeaderboardUser } from '../../types/game';

export interface LeaderboardPageProps {
  currentUserId?: string;
  limit?: number;
}

export default function LeaderboardPage({
  currentUserId,
  limit = 50,
}: LeaderboardPageProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      setError(null);
      try {
        const data = await getLeaderboard(limit);

        // Mark current user
        const withCurrentUser = data.map(user => ({
          ...user,
          isCurrentUser: user.userId === currentUserId,
        }));

        setLeaderboard(withCurrentUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar ranking');
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, [currentUserId, limit]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Ranking de Exploradores
        </h1>
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="font-bold text-red-800 dark:text-red-200">
                Erro ao carregar ranking
              </h3>
              <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Ranking de Exploradores
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Top {leaderboard.length} jogadores com mais pontos
        </p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <div className="flex flex-col items-center pt-8">
            <Card className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-4xl">🥈</div>
                {leaderboard[1].photoURL && (
                  <img
                    src={leaderboard[1].photoURL}
                    alt={leaderboard[1].displayName}
                    className="w-16 h-16 rounded-full border-4 border-gray-400"
                  />
                )}
                <div>
                  <p className="font-bold text-sm">{leaderboard[1].displayName}</p>
                  <p className="text-lg font-bold text-gray-500">
                    {formatNumber(leaderboard[1].points)}
                  </p>
                  <p className="text-xs text-gray-500">pts</p>
                </div>
              </div>
            </Card>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <Card className="w-full bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-2 border-yellow-400">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-5xl">🥇</div>
                {leaderboard[0].photoURL && (
                  <img
                    src={leaderboard[0].photoURL}
                    alt={leaderboard[0].displayName}
                    className="w-20 h-20 rounded-full border-4 border-yellow-500"
                  />
                )}
                <div>
                  <p className="font-bold">{leaderboard[0].displayName}</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {formatNumber(leaderboard[0].points)}
                  </p>
                  <p className="text-xs text-gray-500">pts</p>
                </div>
              </div>
            </Card>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center pt-8">
            <Card className="w-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-4xl">🥉</div>
                {leaderboard[2].photoURL && (
                  <img
                    src={leaderboard[2].photoURL}
                    alt={leaderboard[2].displayName}
                    className="w-16 h-16 rounded-full border-4 border-amber-600"
                  />
                )}
                <div>
                  <p className="font-bold text-sm">{leaderboard[2].displayName}</p>
                  <p className="text-lg font-bold text-amber-700">
                    {formatNumber(leaderboard[2].points)}
                  </p>
                  <p className="text-xs text-gray-500">pts</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-2">
        {leaderboard.map((user) => (
          <Card
            key={user.userId}
            className={`transition-all hover:shadow-lg ${
              user.isCurrentUser
                ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary'
                : ''
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
                {getRankIcon(user.rank) ? (
                  <span className="text-3xl">{getRankIcon(user.rank)}</span>
                ) : (
                  <span
                    className={`text-2xl font-bold ${getRankColor(user.rank)}`}
                  >
                    #{user.rank}
                  </span>
                )}
              </div>

              {/* Avatar */}
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              )}

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate">
                  {user.displayName}
                  {user.isCurrentUser && (
                    <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">
                      Voce
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Level {user.level} • {user.totalCheckIns} check-ins
                </p>
              </div>

              {/* Points */}
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-primary">
                  {formatNumber(user.points)}
                </p>
                <p className="text-xs text-gray-500">pontos</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {leaderboard.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Ranking vazio
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Seja o primeiro a aparecer no ranking!
          </p>
        </Card>
      )}
    </div>
  );
}
