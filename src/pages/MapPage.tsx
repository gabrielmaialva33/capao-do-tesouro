/**
 * Map Page Placeholder
 *
 * Interactive map with treasure locations (to be implemented)
 */

import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';

export default function MapPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Mapa de Tesouros
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Explore e encontre tesouros próximos
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            ← Voltar
          </Button>
        </div>

        <Card className="min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Mapa Interativo
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              O componente de mapa será implementado aqui
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Utilizando Leaflet + React Leaflet
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
