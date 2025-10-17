import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

/**
 * Location data for treasure pin
 */
export interface TreasureLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  points: number;
  discovered?: boolean;
  confidence?: number;
}

/**
 * Treasure pin props
 */
export interface TreasurePinProps {
  /**
   * Location data
   */
  location: TreasureLocation;
  /**
   * Callback when check-in button is clicked
   */
  onCheckIn?: (locationId: string) => void;
  /**
   * Whether check-in is disabled (out of range)
   */
  disabled?: boolean;
  /**
   * Distance to location in meters
   */
  distance?: number;
}

/**
 * Create custom treasure icon
 */
const createTreasureIcon = (discovered: boolean = false) => {
  const color = discovered ? '#10b981' : '#f59e0b';
  const icon = discovered ? '✓' : '★';

  return L.divIcon({
    className: 'treasure-marker',
    html: `
      <div class="treasure-marker-wrapper">
        <div class="treasure-marker-icon" style="background: ${color};">
          <span>${icon}</span>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

/**
 * Treasure marker component with popup and check-in functionality
 *
 * @example
 * ```tsx
 * <MapContainer>
 *   <TreasurePin
 *     location={treasureData}
 *     onCheckIn={handleCheckIn}
 *     disabled={!isInRange}
 *     distance={distanceInMeters}
 *   />
 * </MapContainer>
 * ```
 */
export function TreasurePin({
  location,
  onCheckIn,
  disabled = false,
  distance,
}: TreasurePinProps) {
  const position: L.LatLngExpression = useMemo(
    () => [location.lat, location.lng],
    [location.lat, location.lng]
  );

  const treasureIcon = useMemo(
    () => createTreasureIcon(location.discovered),
    [location.discovered]
  );

  const handleCheckInClick = () => {
    if (onCheckIn && !disabled) {
      onCheckIn(location.id);
    }
  };

  const formatDistance = (meters: number | undefined) => {
    if (meters === undefined) return '';
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <>
      <Marker position={position} icon={treasureIcon}>
        <Popup maxWidth={300} minWidth={250}>
          <div className="treasure-popup">
            <div className="treasure-popup-header">
              <h3 className="treasure-popup-title">{location.name}</h3>
              {location.discovered && (
                <span className="treasure-popup-badge">Descoberto</span>
              )}
            </div>

            <p className="treasure-popup-description">{location.description}</p>

            {/* Confidence indicator */}
            {location.confidence !== undefined && (
              <div className="treasure-popup-confidence">
                <div className="treasure-popup-confidence-bar">
                  <div 
                    className="treasure-popup-confidence-fill"
                    style={{ 
                      width: `${location.confidence * 100}%`,
                      backgroundColor: location.confidence > 0.8 ? '#10b981' : location.confidence > 0.6 ? '#f59e0b' : '#ef4444'
                    }}
                  ></div>
                </div>
                <div className="treasure-popup-confidence-text">
                  Precisão: {Math.round(location.confidence * 100)}%
                </div>
              </div>
            )}

            <div className="treasure-popup-info">
              <div className="treasure-popup-points">
                <span className="treasure-popup-label">Pontos:</span>
                <span className="treasure-popup-value">{location.points}</span>
              </div>

              {distance !== undefined && (
                <div className="treasure-popup-distance">
                  <span className="treasure-popup-label">Distância:</span>
                  <span className="treasure-popup-value">{formatDistance(distance)}</span>
                </div>
              )}
            </div>

            {!location.discovered && (
              <button
                className="treasure-popup-button"
                onClick={handleCheckInClick}
                disabled={disabled}
              >
                {disabled ? 'Muito Longe' : 'Check-in'}
              </button>
            )}
          </div>
        </Popup>
      </Marker>

      <style>{`
        .treasure-marker {
          background: transparent;
          border: none;
        }

        .treasure-marker-wrapper {
          position: relative;
          width: 40px;
          height: 40px;
        }

        .treasure-marker-icon {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform-origin: center center;
          transform: translateX(-50%) rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 2px solid white;
        }

        .treasure-marker-icon span {
          transform: rotate(45deg);
          color: white;
          font-size: 18px;
          font-weight: bold;
        }

        .treasure-popup {
          padding: 8px;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .treasure-popup-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          gap: 8px;
        }

        .treasure-popup-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          flex: 1;
        }

        .treasure-popup-badge {
          padding: 2px 8px;
          background: #10b981;
          color: white;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
        }

        .treasure-popup-description {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #4b5563;
          line-height: 1.5;
        }

        .treasure-popup-info {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
          padding: 8px;
          background: #f3f4f6;
          border-radius: 6px;
        }

        .treasure-popup-points,
        .treasure-popup-distance {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .treasure-popup-label {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          font-weight: 500;
        }

        .treasure-popup-value {
          font-size: 16px;
          color: #1f2937;
          font-weight: 600;
        }

        .treasure-popup-button {
          width: 100%;
          padding: 10px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .treasure-popup-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .treasure-popup-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          opacity: 0.6;
        }

        @media (prefers-color-scheme: dark) {
          .treasure-popup-title {
            color: #f9fafb;
          }

          .treasure-popup-description {
            color: #d1d5db;
          }

          .treasure-popup-info {
            background: #374151;
          }

          .treasure-popup-label {
            color: #9ca3af;
          }

          .treasure-popup-value {
            color: #f9fafb;
          }
        }
      `}</style>
    </>
  );
}