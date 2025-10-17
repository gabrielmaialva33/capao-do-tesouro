/**
 * Profile Page Component
 *
 * Displays user information, statistics, and achievements.
 * Includes logout functionality.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Alert } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, formatNumber } from '../../lib/utils';

// Mock data - In a real app, this would come from a user profile store/API
const mockUserStats = {
  points: 2450,
  level: 12,
  badges: 8,
  treasuresFound: 23,
  questsCompleted: 15,
  checkIns: 47,
};

const mockAchievements = [
  {
    id: 1,
    title: 'Primeiro Tesouro',
    description: 'Encontrou seu primeiro tesouro',
    icon: '🏆',
    unlockedAt: '2025-10-01T10:30:00',
  },
  {
    id: 2,
    title: 'Explorador',
    description: 'Completou 10 check-ins',
    icon: '🗺️',
    unlockedAt: '2025-10-05T15:20:00',
  },
  {
    id: 3,
    title: 'Mestre das Quests',
    description: 'Completou 15 missões',
    icon: '⭐',
    unlockedAt: '2025-10-10T18:45:00',
  },
  {
    id: 4,
    title: 'Colecionador',
    description: 'Encontrou 20 tesouros',
    icon: '💎',
    unlockedAt: '2025-10-12T12:15:00',
  },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setError(null);

    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer logout');
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Meu Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Veja suas conquistas e estatísticas
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="lg:col-span-1">
            <div className="text-center">
              {/* Avatar */}
              <div className="mb-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-24 h-24 rounded-full mx-auto border-4 border-primary"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">
                      {(user.displayName?.[0] || user.email?.[0] || '?').toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* User Details */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {user.displayName || 'Jogador'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {user.email}
              </p>

              {/* Email Verification Status */}
              {user.emailVerified ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  ✓ Email verificado
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  Email não verificado
                </span>
              )}

              {/* Member Since */}
              {user.createdAt && (
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                  Membro desde {formatDate(new Date(user.createdAt))}
                </p>
              )}

              {/* Logout Button */}
              <Button
                variant="outline"
                className="w-full mt-6"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Saindo...' : 'Sair da conta'}
              </Button>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level & Points */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Estatísticas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {mockUserStats.level}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Nível</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg">
                  <div className="text-3xl font-bold text-secondary mb-1">
                    {formatNumber(mockUserStats.points)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pontos</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg">
                  <div className="text-3xl font-bold text-accent mb-1">
                    {mockUserStats.badges}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Conquistas</div>
                </div>

                <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {mockUserStats.treasuresFound}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Tesouros Encontrados
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {mockUserStats.questsCompleted}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Quests Completas
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {mockUserStats.checkIns}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Check-ins</div>
                </div>
              </div>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Conquistas Recentes
                </h3>
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </div>

              <div className="space-y-3">
                {mockAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Desbloqueada em {formatDate(new Date(achievement.unlockedAt))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ações Rápidas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate('/map')}
                >
                  Explorar Mapa
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate('/quests')}
                >
                  Ver Missões
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/leaderboard')}
                >
                  Ranking
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/achievements')}
                >
                  Todas Conquistas
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
