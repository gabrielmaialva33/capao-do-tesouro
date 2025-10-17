/**
 * PointsDisplay Component
 * Shows user points, level, and progress to next level
 */

import { useEffect, useState } from 'react';
import { useQuestStore } from '../../stores/questStore';
import { formatNumber, calculateProgress } from '../../lib/utils';
import Card from '../ui/Card';

export interface PointsDisplayProps {
  userId: string;
  showDetails?: boolean;
  compact?: boolean;
}

export default function PointsDisplay({
  userId,
  showDetails = true,
  compact = false,
}: PointsDisplayProps) {
  const { userProgress, fetchUserStats, lastCheckInResponse } = useQuestStore();
  const [pointsAnimation, setPointsAnimation] = useState(false);
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserStats(userId);
    }
  }, [userId, fetchUserStats]);

  // Animate on new points
  useEffect(() => {
    if (lastCheckInResponse?.success && lastCheckInResponse.points > 0) {
      setPointsAnimation(true);
      setTimeout(() => setPointsAnimation(false), 600);

      if (lastCheckInResponse.newLevel) {
        setLevelUpAnimation(true);
        setTimeout(() => setLevelUpAnimation(false), 1500);
      }
    }
  }, [lastCheckInResponse]);

  if (!userProgress) {
    return (
      <Card className="animate-pulse">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </Card>
    );
  }

  const progressPercentage = calculateProgress(
    userProgress.points,
    userProgress.nextLevelPoints
  );

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
        {/* Level Badge */}
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-full text-white font-bold shadow-lg">
          <span className="text-sm">Lv</span>
          <span className="text-lg">{userProgress.level}</span>
        </div>

        {/* Points */}
        <div className="flex-1">
          <p className="text-xs text-gray-600 dark:text-gray-400">Pontos</p>
          <p
            className={`text-lg font-bold text-gray-900 dark:text-white transition-all ${
              pointsAnimation ? 'scale-110 text-accent' : ''
            }`}
          >
            {formatNumber(userProgress.points)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Level up animation overlay */}
      {levelUpAnimation && (
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 animate-pulse z-10 flex items-center justify-center">
          <div className="text-3xl font-bold text-accent animate-bounce">
            LEVEL UP!
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Header: Level and Points */}
        <div className="flex items-center justify-between">
          {/* Level Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-full text-white shadow-lg">
              <div className="text-center">
                <div className="text-xs font-medium">Level</div>
                <div className="text-2xl font-bold">{userProgress.level}</div>
              </div>
            </div>

            {/* Rank badge if available */}
            {userProgress.rank && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="font-medium">Ranking</div>
                <div className="text-lg font-bold text-primary">
                  #{userProgress.rank}
                </div>
              </div>
            )}
          </div>

          {/* Points */}
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pontos Totais</p>
            <p
              className={`text-3xl font-bold text-gray-900 dark:text-white transition-all duration-300 ${
                pointsAnimation ? 'scale-110 text-accent' : ''
              }`}
            >
              {formatNumber(userProgress.points)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Progresso para Level {userProgress.level + 1}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>

          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
            <span>{formatNumber(userProgress.points)} pts</span>
            <span>{formatNumber(userProgress.nextLevelPoints)} pts</span>
          </div>
        </div>

        {/* Stats Grid */}
        {showDetails && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {userProgress.totalCheckIns}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Check-ins</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">
                {userProgress.uniqueLocations}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Locais</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-accent">
                {userProgress.currentStreak}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Sequencia</p>
            </div>
          </div>
        )}

        {/* Badges count */}
        {showDetails && userProgress.badges.length > 0 && (
          <div className="flex items-center gap-2 pt-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-lg">🏆</span>
            <span>
              {userProgress.badges.filter(b => b.unlocked).length} conquistas desbloqueadas
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
