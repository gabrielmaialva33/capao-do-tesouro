/**
 * Home Page Component
 *
 * Landing page for authenticated users with quick access to main features.
 */

import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Capao do Tesouro
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Explore, descubra e conquiste tesouros escondidos pela cidade!
          </p>
          {user && (
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Bem-vindo,
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {user.displayName || user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
              >
                Ver Perfil
              </Button>
            </div>
          )}
        </header>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/map')}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-3xl">
                🗺️
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Explorar Mapa
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Descubra tesouros escondidos pelo mapa da cidade
              </p>
              <Button variant="primary" className="w-full">
                Abrir Mapa
              </Button>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/quests')}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center text-3xl">
                ⭐
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Missões
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Complete missões e ganhe recompensas incríveis
              </p>
              <Button variant="secondary" className="w-full">
                Ver Missões
              </Button>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/leaderboard')}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center text-3xl">
                🏆
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Ranking
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Veja sua posição entre os melhores jogadores
              </p>
              <Button variant="outline" className="w-full">
                Ver Ranking
              </Button>
            </div>
          </Card>
        </div>

        {/* How It Works Section */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Explore o Mapa
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Navegue pelo mapa interativo e encontre tesouros próximos a você
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-secondary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Faça Check-in
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chegue ao local e faça check-in para coletar o tesouro
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Ganhe Recompensas
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Acumule pontos, suba de nível e desbloqueie conquistas
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
