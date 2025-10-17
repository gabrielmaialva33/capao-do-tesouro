/**
 * Map Page - Interactive Treasure Map
 *
 * Displays an interactive Leaflet map with treasure locations,
 * user position tracking, and check-in functionality.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { LeafletMap } from '../components/map/LeafletMap';
import type { TreasureLocation } from '../components/map/TreasurePin';
import { fetchLocations, performCheckin } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { useGeolocation } from '../hooks/useGeolocation';

export default function MapPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { position } = useGeolocation({ watch: true });
  const [locations, setLocations] = useState<TreasureLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  // Load treasure locations on mount
  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await fetchLocations();

      // Transform API data to TreasureLocation format
      const treasureLocations: TreasureLocation[] = data.map(loc => ({
        id: loc.id,
        name: loc.name,
        lat: loc.coordinates.lat,
        lng: loc.coordinates.lng,
        description: loc.description,
        points: loc.points,
        discovered: loc.checkedIn,
      }));

      setLocations(treasureLocations);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (locationId: string) => {
    if (!user || checkingIn || !position) {
      alert('❌ Não foi possível obter sua localização.');
      return;
    }

    try {
      setCheckingIn(true);
      const userCoords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const result = await performCheckin(locationId, user.uid, userCoords);

      if (result.success) {
        alert(`✅ Check-in realizado! Você ganhou ${result.points} pontos!`);
        // Reload locations to update discovered status
        await loadLocations();
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Check-in error:', error);
      alert('❌ Erro ao realizar check-in. Tente novamente.');
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Mapa de Tesouros
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {loading ? 'Carregando locais...' : `${locations.length} tesouros disponíveis`}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/')} size="sm">
              ← Voltar
            </Button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[calc(100vh-120px)] p-4 md:p-6">
        <div className="h-full max-w-7xl mx-auto">
          {loading ? (
            <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Carregando mapa...</p>
              </div>
            </div>
          ) : (
            <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <LeafletMap
                locations={locations}
                onLocationClick={handleCheckIn}
                zoom={14}
                height="100%"
                showUserMarker={true}
                centerOnUser={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-80 z-[1000]">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start">
            <div className="text-2xl mr-3">ℹ️</div>
            <div className="flex-1 text-sm">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">
                Como fazer check-in:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>Chegue perto do tesouro (raio de 100m)</li>
                <li>Clique no marcador no mapa</li>
                <li>Toque em "Fazer Check-in"</li>
                <li>Ganhe pontos e conquistas!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
