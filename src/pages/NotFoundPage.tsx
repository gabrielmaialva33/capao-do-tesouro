/**
 * 404 Not Found Page
 */

import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <Card className="text-center max-w-lg">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Página Não Encontrada
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          O tesouro que você procura não existe neste local.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="primary" onClick={() => navigate('/')}>
            Voltar ao Início
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </div>
      </Card>
    </div>
  );
}
