import { useState } from 'react';
import { LeafletMap } from './LeafletMap';
import type { TreasureLocation } from './TreasurePin';

/**
 * Example usage of LeafletMap component
 *
 * This component demonstrates how to use the map with treasure locations
 * and check-in functionality
 */
export function MapExample() {
  const [checkedInLocations, setCheckedInLocations] = useState<Set<string>>(new Set());

  // Example treasure locations in Capão do Tesouro area
  const locations: TreasureLocation[] = [
    {
      id: '1',
      name: 'Mirante do Vale',
      lat: -14.0642,
      lng: -41.3025,
      description: 'Vista panorâmica do vale do Capão',
      points: 50,
      discovered: checkedInLocations.has('1'),
    },
    {
      id: '2',
      name: 'Cachoeira da Fumaça',
      lat: -14.0891,
      lng: -41.2875,
      description: 'Uma das cachoeiras mais altas do Brasil',
      points: 100,
      discovered: checkedInLocations.has('2'),
    },
    {
      id: '3',
      name: 'Cachoeirão',
      lat: -14.0701,
      lng: -41.3142,
      description: 'Cachoeira com piscina natural',
      points: 75,
      discovered: checkedInLocations.has('3'),
    },
    {
      id: '4',
      name: 'Rodas',
      lat: -14.0534,
      lng: -41.2987,
      description: 'Conjunto de poços cristalinos',
      points: 60,
      discovered: checkedInLocations.has('4'),
    },
  ];

  const handleCheckIn = (locationId: string) => {
    console.log('Check-in at location:', locationId);

    // Add location to checked-in set
    setCheckedInLocations(prev => new Set(prev).add(locationId));

    // Find the location to get points
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      alert(`Check-in realizado! Você ganhou ${location.points} pontos!`);
    }

    // Here you would typically:
    // - Update user score in the database
    // - Save check-in to user's history
    // - Trigger animations/celebrations
  };

  return (
    <div className="map-example">
      <div className="map-example-header">
        <h2>Tesouros do Vale do Capão</h2>
        <p>
          Descubra locais incríveis e ganhe pontos. Aproxime-se de um local para fazer
          check-in!
        </p>
      </div>

      <div className="map-example-content">
        <LeafletMap
          locations={locations}
          onLocationClick={handleCheckIn}
          zoom={13}
          height="500px"
        />
      </div>

      <div className="map-example-stats">
        <div className="stat">
          <span className="stat-value">{checkedInLocations.size}</span>
          <span className="stat-label">Descobertos</span>
        </div>
        <div className="stat">
          <span className="stat-value">{locations.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat">
          <span className="stat-value">
            {locations
              .filter(loc => checkedInLocations.has(loc.id))
              .reduce((sum, loc) => sum + loc.points, 0)}
          </span>
          <span className="stat-label">Pontos</span>
        </div>
      </div>

      <style>{`
        .map-example {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        .map-example-header {
          margin-bottom: 24px;
        }

        .map-example-header h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
        }

        .map-example-header p {
          margin: 0;
          font-size: 16px;
          color: #6b7280;
        }

        .map-example-content {
          margin-bottom: 24px;
        }

        .map-example-stats {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          background: white;
          border-radius: 6px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #3b82f6;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          text-transform: uppercase;
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .map-example {
            padding: 16px;
          }

          .map-example-header h2 {
            font-size: 24px;
          }

          .map-example-stats {
            flex-direction: column;
          }

          .stat {
            flex-direction: row;
            justify-content: space-between;
          }

          .stat-value {
            font-size: 24px;
            margin-bottom: 0;
          }
        }

        @media (prefers-color-scheme: dark) {
          .map-example-header h2 {
            color: #f9fafb;
          }

          .map-example-header p {
            color: #9ca3af;
          }

          .map-example-stats {
            background: #1f2937;
          }

          .stat {
            background: #374151;
          }

          .stat-label {
            color: #9ca3af;
          }
        }
      `}</style>
    </div>
  );
}
