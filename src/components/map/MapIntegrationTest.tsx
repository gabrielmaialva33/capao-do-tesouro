/**
 * Map Integration Test Component
 * Tests AI location enhancement functionality
 */

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { enhanceLocation, validateCoordinates } from '../../services/locationAI';
import type { Location } from '../../types/game';

export default function MapIntegrationTest() {
  const [testLocation, setTestLocation] = useState<Location>({
    id: 'test-001',
    name: 'Igreja Matriz Nossa Senhora da Conceicao',
    description: 'Igreja catolica historica construida no seculo XVIII',
    coordinates: { lat: -12.4686111, lng: -41.5794444 },
    points: 150,
    radius: 50,
    category: 'religious',
    address: 'Praca da Matriz, s/n - Centro, Capao do Tesouro - BA',
    checkedIn: false,
    checkinCount: 0,
  });

  const [enhancementResult, setEnhancementResult] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnhanceLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await enhanceLocation(testLocation);
      setEnhancementResult(result);
    } catch (err) {
      setError('Failed to enhance location: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateCoordinates = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await validateCoordinates(
        testLocation.coordinates.lat,
        testLocation.coordinates.lng,
        testLocation.name
      );
      setValidationResult(result);
    } catch (err) {
      setError('Failed to validate coordinates: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Location Enhancement Test</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Original Location</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {testLocation.name}</p>
            <p><strong>Coordinates:</strong> {testLocation.coordinates.lat}, {testLocation.coordinates.lng}</p>
            <p><strong>Description:</strong> {testLocation.description}</p>
            <p><strong>Category:</strong> {testLocation.category}</p>
            <p><strong>Address:</strong> {testLocation.address}</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-3">
            <Button
              onClick={handleEnhanceLocation}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Enhancing...' : 'Enhance Location with AI'}
            </Button>
            
            <Button
              onClick={handleValidateCoordinates}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Validating...' : 'Validate Coordinates'}
            </Button>
          </div>
        </Card>
      </div>

      {enhancementResult && (
        <Card className="mt-6">
          <h2 className="text-xl font-semibold mb-4">AI Enhancement Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Coordinate Enhancement</h3>
              {enhancementResult.refinedCoordinates ? (
                <div>
                  <p>New: {enhancementResult.refinedCoordinates.lat}, {enhancementResult.refinedCoordinates.lng}</p>
                  <p>Confidence: {(enhancementResult.confidenceScore * 100).toFixed(1)}%</p>
                </div>
              ) : (
                <p>No coordinate enhancement</p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Description Enhancement</h3>
              {enhancementResult.enhancedDescription ? (
                <p className="text-sm">{enhancementResult.enhancedDescription.substring(0, 100)}...</p>
              ) : (
                <p>No description enhancement</p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Cultural Context</h3>
              {enhancementResult.culturalContext ? (
                <p className="text-sm">{enhancementResult.culturalContext.substring(0, 100)}...</p>
              ) : (
                <p>No cultural context</p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Suggested Radius</h3>
              {enhancementResult.suggestedRadius ? (
                <p>{enhancementResult.suggestedRadius} meters</p>
              ) : (
                <p>No radius suggestion</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {validationResult && (
        <Card className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Coordinate Validation Results</h2>
          <div className="space-y-2">
            <p><strong>Valid:</strong> {validationResult.isValid ? 'Yes' : 'No'}</p>
            <p><strong>Confidence:</strong> {(validationResult.confidence * 100).toFixed(1)}%</p>
            {validationResult.suggestedCorrection && (
              <p>
                <strong>Suggested Correction:</strong> 
                {validationResult.suggestedCorrection.lat}, {validationResult.suggestedCorrection.lng}
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}