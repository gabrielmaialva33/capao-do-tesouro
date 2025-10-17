/**
 * Admin Page - Location Management with AI Enhancement
 */

import { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { enhanceLocation } from '../services/locationAI';
import { fetchLocations } from '../services/api';
import type { Location } from '../types/game';

export default function AdminPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [enhancing, setEnhancing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await fetchLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceSingleLocation = async (locationId: string) => {
    setEnhancing(locationId);
    try {
      const location = locations.find(loc => loc.id === locationId);
      if (!location) return;

      const enhancement = await enhanceLocation(location);
      
      // Update the location in state
      setLocations(prev => prev.map(loc => 
        loc.id === locationId 
          ? {
              ...loc,
              aiRefinedCoordinates: enhancement.refinedCoordinates,
              confidenceScore: enhancement.confidenceScore,
              culturalContext: enhancement.culturalContext,
              historicalFacts: enhancement.historicalFacts,
              visitorTips: enhancement.visitorTips,
              aiEnhancedDescription: enhancement.enhancedDescription,
              lastAiUpdate: new Date(),
            }
          : loc
      ));

      // In a real app, you would also send this to your backend
      console.log('Enhanced location:', locationId, enhancement);
    } catch (error) {
      console.error('Error enhancing location:', error);
    } finally {
      setEnhancing(null);
    }
  };

  const handleEnhanceAllLocations = async () => {
    setEnhancing('all');
    try {
      const enhancedLocations = await Promise.all(
        locations.map(async (location) => {
          const enhancement = await enhanceLocation(location);
          return {
            ...location,
            aiRefinedCoordinates: enhancement.refinedCoordinates,
            confidenceScore: enhancement.confidenceScore,
            culturalContext: enhancement.culturalContext,
            historicalFacts: enhancement.historicalFacts,
            visitorTips: enhancement.visitorTips,
            aiEnhancedDescription: enhancement.enhancedDescription,
            lastAiUpdate: new Date(),
          };
        })
      );

      setLocations(enhancedLocations);
      console.log('All locations enhanced');
    } catch (error) {
      console.error('Error enhancing all locations:', error);
    } finally {
      setEnhancing(null);
    }
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin - Gerenciamento de Locais</h1>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando locais...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin - Gerenciamento de Locais</h1>
        
        {/* Search and Actions */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar locais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleEnhanceAllLocations}
            disabled={enhancing === 'all'}
            variant="primary"
          >
            {enhancing === 'all' ? 'Melhorando Todos...' : 'Melhorar Todos com IA'}
          </Button>
        </div>

        {/* Locations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <Card key={location.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {location.name}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {location.description}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {location.category}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {location.points} pts
                  </span>
                </div>

                {/* Confidence Indicator */}
                {location.confidenceScore !== undefined && (
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Precisão IA</span>
                      <span>{Math.round(location.confidenceScore * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          location.confidenceScore > 0.8
                            ? 'bg-green-500'
                            : location.confidenceScore > 0.6
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${location.confidenceScore * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Last Updated */}
                {location.lastAiUpdate && (
                  <div className="text-xs text-gray-500">
                    Atualizado: {new Date(location.lastAiUpdate).toLocaleDateString()}
                  </div>
                )}

                <Button
                  onClick={() => handleEnhanceSingleLocation(location.id)}
                  disabled={enhancing === location.id}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {enhancing === location.id ? 'Melhorando...' : 'Melhorar com IA'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum local encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}