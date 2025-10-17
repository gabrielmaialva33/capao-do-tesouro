/**
 * Integration test / demo component for map functionality
 *
 * This component can be used to test all map features in isolation
 */

import { useState } from 'react';
import { LeafletMap } from './LeafletMap';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculateDistance, formatDistance, isWithinRadius } from '../../lib/geolocation';
import type { TreasureLocation } from './TreasurePin';

export function MapIntegrationTest() {
  const { position, error, loading, refetch, isWatching } = useGeolocation({ watch: true });
  const [score, setScore] = useState(0);
  const [checkedIn, setCheckedIn] = useState<Set<string>>(new Set());
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Test locations around Capão do Tesouro
  const testLocations: TreasureLocation[] = [
    {
      id: '1',
      name: 'Mirante do Vale',
      lat: -14.0642,
      lng: -41.3025,
      description: 'Vista panorâmica incrível do Vale do Capão',
      points: 50,
      discovered: checkedIn.has('1'),
    },
    {
      id: '2',
      name: 'Cachoeira da Fumaça',
      lat: -14.0891,
      lng: -41.2875,
      description: 'Uma das cachoeiras mais altas do Brasil, com 340m de altura',
      points: 100,
      discovered: checkedIn.has('2'),
    },
    {
      id: '3',
      name: 'Cachoeirão',
      lat: -14.0701,
      lng: -41.3142,
      description: 'Cachoeira com grande piscina natural perfeita para banho',
      points: 75,
      discovered: checkedIn.has('3'),
    },
    {
      id: '4',
      name: 'Rodas',
      lat: -14.0534,
      lng: -41.2987,
      description: 'Conjunto de poços cristalinos em sequência',
      points: 60,
      discovered: checkedIn.has('4'),
    },
    {
      id: '5',
      name: 'Riachinho',
      lat: -14.0589,
      lng: -41.3156,
      description: 'Trilha leve com pequenas cachoeiras',
      points: 40,
      discovered: checkedIn.has('5'),
    },
  ];

  // Calculate distances to all locations
  const locationsWithDetails = testLocations.map(location => {
    if (!position) {
      return { ...location, distance: undefined, canCheckIn: false };
    }

    const distance = calculateDistance(
      position.coords.latitude,
      position.coords.longitude,
      location.lat,
      location.lng
    );

    const canCheckIn = isWithinRadius(
      { lat: position.coords.latitude, lng: position.coords.longitude },
      { lat: location.lat, lng: location.lng }
    );

    return {
      ...location,
      distance,
      canCheckIn,
    };
  });

  // Handle check-in
  const handleCheckIn = (locationId: string) => {
    const location = testLocations.find(loc => loc.id === locationId);
    if (!location || checkedIn.has(locationId)) return;

    // Add to checked-in set
    setCheckedIn(prev => new Set(prev).add(locationId));
    setSelectedLocation(locationId);

    // Add points
    setScore(prev => prev + location.points);

    // Celebrate!
    console.log(`Check-in successful at ${location.name}! +${location.points} points`);
  };

  // Sort locations by distance
  const sortedLocations = [...locationsWithDetails].sort((a, b) => {
    if (a.distance === undefined) return 1;
    if (b.distance === undefined) return -1;
    return a.distance - b.distance;
  });

  return (
    <div className="map-test">
      <header className="map-test-header">
        <h1>Capão do Tesouro - Map Test</h1>
        <div className="map-test-score">
          <span className="score-label">Score:</span>
          <span className="score-value">{score}</span>
        </div>
      </header>

      <div className="map-test-grid">
        {/* Main Map */}
        <div className="map-test-main">
          <LeafletMap
            locations={testLocations.map((loc) => ({
              ...loc,
              discovered: checkedIn.has(loc.id),
            }))}
            onLocationClick={handleCheckIn}
            zoom={13}
            height="600px"
          />
        </div>

        {/* Sidebar */}
        <aside className="map-test-sidebar">
          {/* Geolocation Status */}
          <div className="status-card">
            <h3>Geolocation Status</h3>
            {loading && <p className="status-loading">Loading...</p>}
            {error && <p className="status-error">{error}</p>}
            {position && (
              <div className="status-info">
                <p>
                  <strong>Lat:</strong> {position.coords.latitude.toFixed(6)}
                </p>
                <p>
                  <strong>Lng:</strong> {position.coords.longitude.toFixed(6)}
                </p>
                <p>
                  <strong>Accuracy:</strong> ±{Math.round(position.coords.accuracy)}m
                </p>
                <p>
                  <strong>Watching:</strong> {isWatching ? 'Yes' : 'No'}
                </p>
              </div>
            )}
            <button className="btn-refresh" onClick={refetch}>
              Refresh Location
            </button>
          </div>

          {/* Stats */}
          <div className="status-card">
            <h3>Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{checkedIn.size}</span>
                <span className="stat-label">Discovered</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{testLocations.length}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {((checkedIn.size / testLocations.length) * 100).toFixed(0)}%
                </span>
                <span className="stat-label">Progress</span>
              </div>
            </div>
          </div>

          {/* Locations List */}
          <div className="locations-list">
            <h3>Nearby Locations</h3>
            {sortedLocations.map(location => (
              <div
                key={location.id}
                className={`location-item ${location.discovered ? 'discovered' : ''} ${
                  selectedLocation === location.id ? 'selected' : ''
                }`}
              >
                <div className="location-header">
                  <span className="location-icon">
                    {location.discovered ? '✓' : '★'}
                  </span>
                  <h4>{location.name}</h4>
                </div>
                <div className="location-details">
                  <span className="location-points">{location.points} pts</span>
                  {location.distance !== undefined && (
                    <span className="location-distance">
                      {formatDistance(location.distance)}
                    </span>
                  )}
                  {location.canCheckIn && !location.discovered && (
                    <span className="location-badge">In Range!</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <style>{`
        .map-test {
          min-height: 100vh;
          background: #f9fafb;
        }

        .map-test-header {
          background: white;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .map-test-header h1 {
          margin: 0;
          font-size: 24px;
          color: #1f2937;
        }

        .map-test-score {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border-radius: 8px;
          font-weight: 600;
        }

        .score-value {
          font-size: 24px;
        }

        .map-test-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 20px;
          padding: 20px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .map-test-main {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .map-test-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .status-card {
          background: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .status-card h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          color: #1f2937;
        }

        .status-info p {
          margin: 4px 0;
          font-size: 14px;
          color: #4b5563;
        }

        .status-loading {
          color: #3b82f6;
        }

        .status-error {
          color: #ef4444;
          font-size: 14px;
        }

        .btn-refresh {
          margin-top: 12px;
          width: 100%;
          padding: 8px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-refresh:hover {
          background: #2563eb;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px;
          background: #f3f4f6;
          border-radius: 6px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #3b82f6;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .locations-list {
          background: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          max-height: 500px;
          overflow-y: auto;
        }

        .locations-list h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          color: #1f2937;
        }

        .location-item {
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 6px;
          background: #f9fafb;
          border: 2px solid transparent;
          transition: all 0.2s;
        }

        .location-item:hover {
          background: #f3f4f6;
        }

        .location-item.discovered {
          background: #d1fae5;
          border-color: #10b981;
        }

        .location-item.selected {
          border-color: #3b82f6;
        }

        .location-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .location-icon {
          font-size: 20px;
        }

        .location-header h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .location-details {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 12px;
        }

        .location-points {
          padding: 2px 8px;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 4px;
          font-weight: 500;
        }

        .location-distance {
          color: #6b7280;
        }

        .location-badge {
          padding: 2px 8px;
          background: #10b981;
          color: white;
          border-radius: 4px;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .map-test-grid {
            grid-template-columns: 1fr;
          }

          .map-test-sidebar {
            order: -1;
          }
        }

        @media (prefers-color-scheme: dark) {
          .map-test {
            background: #111827;
          }

          .map-test-header,
          .status-card,
          .locations-list,
          .map-test-main {
            background: #1f2937;
          }

          .map-test-header h1,
          .status-card h3,
          .locations-list h3,
          .location-header h4 {
            color: #f9fafb;
          }

          .status-info p {
            color: #d1d5db;
          }

          .location-item {
            background: #374151;
          }

          .location-item:hover {
            background: #4b5563;
          }

          .stat-item {
            background: #374151;
          }
        }
      `}</style>
    </div>
  );
}
