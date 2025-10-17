/**
 * BadgeCard Component
 * Displays a badge/achievement with locked/unlocked state
 */

import { formatDate } from '../../lib/utils';
import Card from '../ui/Card';
import type { Badge } from '../../types/game';

export interface BadgeCardProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export default function BadgeCard({
  badge,
  size = 'md',
  showDetails = true,
}: BadgeCardProps) {
  const sizeConfig = {
    sm: {
      iconSize: 'text-3xl',
      titleSize: 'text-sm',
      descSize: 'text-xs',
      padding: 'p-3',
    },
    md: {
      iconSize: 'text-5xl',
      titleSize: 'text-base',
      descSize: 'text-sm',
      padding: 'p-4',
    },
    lg: {
      iconSize: 'text-6xl',
      titleSize: 'text-lg',
      descSize: 'text-base',
      padding: 'p-6',
    },
  };

  const config = sizeConfig[size];

  const categoryColors = {
    explorer: 'from-blue-500 to-blue-600',
    master: 'from-purple-500 to-purple-600',
    collector: 'from-green-500 to-green-600',
    streak: 'from-orange-500 to-orange-600',
  };

  const gradientColor = categoryColors[badge.category] || 'from-gray-500 to-gray-600';

  return (
    <Card
      className={`relative ${config.padding} transition-all duration-300 ${
        badge.unlocked
          ? 'hover:shadow-xl hover:scale-105'
          : 'opacity-60 grayscale'
      }`}
    >
      {/* Locked overlay */}
      {!badge.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg backdrop-blur-[2px]">
          <div className="text-4xl opacity-50">🔒</div>
        </div>
      )}

      <div className="flex flex-col items-center text-center space-y-3">
        {/* Icon with gradient background */}
        <div
          className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-lg ${
            badge.unlocked ? 'animate-pulse-slow' : ''
          }`}
        >
          <span className={config.iconSize}>{badge.icon}</span>
        </div>

        {/* Badge info */}
        <div className="space-y-1 w-full">
          <h3 className={`font-bold text-gray-900 dark:text-white ${config.titleSize}`}>
            {badge.name}
          </h3>

          {showDetails && (
            <>
              <p className={`text-gray-600 dark:text-gray-400 ${config.descSize}`}>
                {badge.description}
              </p>

              <p className={`text-gray-500 dark:text-gray-500 ${config.descSize} pt-1`}>
                {badge.requirement}
              </p>

              {badge.unlocked && badge.unlockedAt && (
                <p className="text-xs text-primary font-medium pt-2">
                  Desbloqueado em {formatDate(badge.unlockedAt)}
                </p>
              )}
            </>
          )}
        </div>

        {/* Category tag */}
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${gradientColor}`}
          >
            {badge.category === 'explorer' && 'Explorador'}
            {badge.category === 'master' && 'Mestre'}
            {badge.category === 'collector' && 'Colecionador'}
            {badge.category === 'streak' && 'Sequencia'}
          </span>
        </div>
      </div>

      {/* Shine effect for unlocked badges */}
      {badge.unlocked && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full animate-shine pointer-events-none rounded-lg" />
      )}
    </Card>
  );
}
