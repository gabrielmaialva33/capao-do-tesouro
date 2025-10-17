/**
 * GameDemo Page
 * Demonstrates all game components working together
 */

import { useState, useEffect } from 'react';
import { useQuestStore } from '../stores/questStore';
import { CheckInButton, PointsDisplay, BadgeCard } from '../components/game';
import LeaderboardPage from '../features/leaderboard/LeaderboardPage';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import type { Location } from '../types/game';

const MOCK_USER_ID = 'demo-user-001';

export default function GameDemo() {
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [activeTab, setActiveTab] = useState<'locations' | 'badges' | 'leaderboard'>('locations');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { locations, userProgress, fetchLocations, fetchUserStats, lastCheckInResponse, clearCheckInResponse } = useQuestStore();

  useEffect(() => {
    // Initialize data
    fetchLocations();
    fetchUserStats(MOCK_USER_ID);

    // Simulate getting user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Use default location if geolocation fails (near first location)
          if (locations.length > 0) {
            setUserPosition({
              lat: locations[0].coordinates.lat + 0.0001,
              lng: locations[0].coordinates.lng + 0.0001,
            });
          }
        }
      );
    }
  }, [fetchLocations, fetchUserStats, locations]);

  // Show notification on check-in response
  useEffect(() => {
    if (lastCheckInResponse) {
      setNotification({
        type: lastCheckInResponse.success ? 'success' : 'error',
        message: lastCheckInResponse.message,
      });

      setTimeout(() => {
        setNotification(null);
        clearCheckInResponse();
      }, 3000);
    }
  }, [lastCheckInResponse, clearCheckInResponse]);

  const handleCheckInSuccess = () => {
    console.log('Check-in successful!');
  };

  const handleCheckInError = (error: string) => {
    setNotification({ type: 'error', message: error });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Capao do Tesouro
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore, descubra e colete tesouros escondidos
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-slide-in ${
              notification.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{notification.type === 'success' ? '✓' : '⚠'}</span>
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* User Progress Card */}
        <PointsDisplay userId={MOCK_USER_ID} showDetails={true} />

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('locations')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'locations'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Localizacoes
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'badges'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Conquistas
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'leaderboard'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Ranking
          </button>
        </div>

        {/* Locations Tab */}
        {activeTab === 'locations' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Locations List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Locais para Explorar
              </h2>
              {locations.map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedLocation?.id === location.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="space-y-3">
                    {location.imageUrl && (
                      <img
                        src={location.imageUrl}
                        alt={location.name}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {location.name}
                          {location.checkedIn && (
                            <span className="ml-2 text-sm text-green-500">✓</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {location.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-accent">{location.points}</p>
                        <p className="text-xs text-gray-500">pts</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        {location.category}
                      </span>
                      <span>Raio: {location.radius}m</span>
                      {location.checkinCount > 0 && (
                        <span>{location.checkinCount} check-ins</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Selected Location Detail */}
            <div className="space-y-4">
              {selectedLocation ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Detalhes do Local
                  </h2>
                  <Card>
                    <div className="space-y-4">
                      {selectedLocation.imageUrl && (
                        <img
                          src={selectedLocation.imageUrl}
                          alt={selectedLocation.name}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {selectedLocation.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {selectedLocation.description}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Pontos</p>
                            <p className="text-2xl font-bold text-accent">
                              {selectedLocation.points}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Raio</p>
                            <p className="text-2xl font-bold text-primary">
                              {selectedLocation.radius}m
                            </p>
                          </div>
                        </div>
                        <CheckInButton
                          locationId={selectedLocation.id}
                          locationName={selectedLocation.name}
                          locationCoordinates={selectedLocation.coordinates}
                          radius={selectedLocation.radius}
                          userPosition={userPosition}
                          userId={MOCK_USER_ID}
                          onSuccess={handleCheckInSuccess}
                          onError={handleCheckInError}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Simulate user being near location */}
                  <Card className="bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        Modo Demo
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Clique para simular sua posicao perto deste local:
                      </p>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setUserPosition({
                            lat: selectedLocation.coordinates.lat + 0.00001,
                            lng: selectedLocation.coordinates.lng + 0.00001,
                          });
                        }}
                      >
                        Teleportar para este local
                      </Button>
                    </div>
                  </Card>
                </>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <p className="text-4xl mb-2">📍</p>
                    <p>Selecione um local para ver detalhes</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Suas Conquistas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProgress?.badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} size="md" showDetails={true} />
              ))}
            </div>
            {(!userProgress?.badges || userProgress.badges.length === 0) && (
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Nenhuma conquista ainda
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comece a explorar para desbloquear conquistas!
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <LeaderboardPage currentUserId={MOCK_USER_ID} limit={50} />
        )}
      </div>
    </div>
  );
}
