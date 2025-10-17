import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { UserMarker } from './UserMarker';
import { TreasurePin } from './TreasurePin';
import type { TreasureLocation } from './TreasurePin';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculateDistance, CHECK_IN_RADIUS } from '../../lib/geolocation';

/**
 * Leaflet map props
 */
export interface LeafletMapProps {
  /**
   * Array of treasure locations to display
   */
  locations: TreasureLocation[];
  /**
   * Callback when a location is clicked for check-in
   */
  onLocationClick?: (locationId: string) => void;
  /**
   * Initial zoom level (default: 15)
   */
  zoom?: number;
  /**
   * Initial center position (defaults to user position)
   */
  center?: L.LatLngExpression;
  /**
   * Map height (default: '100%')
   */
  height?: string | number;
  /**
   * Whether to show user marker (default: true)
   */
  showUserMarker?: boolean;
  /**
   * Whether to auto-center on user position (default: true)
   */
  centerOnUser?: boolean;
}

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * Main map component using react-leaflet with OpenStreetMap tiles
 *
 * Features:
 * - User position tracking with custom marker
 * - Treasure location markers with popups
 * - Check-in functionality with radius validation
 * - Real-time distance calculation
 * - Responsive design
 *
 * @example
 * ```tsx
 * const locations = [
 *   {
 *     id: '1',
 *     name: 'Mirante',
 *     lat: -14.0642,
 *     lng: -41.3025,
 *     description: 'Vista panorâmica',
 *     points: 50
 *   }
 * ];
 *
 * <LeafletMap
 *   locations={locations}
 *   onLocationClick={handleCheckIn}
 *   zoom={15}
 * />
 * ```
 */
export function LeafletMap({
  locations,
  onLocationClick,
  zoom = 15,
  center,
  height = '100%',
  showUserMarker = true,
  centerOnUser = true,
}: LeafletMapProps) {
  const { position, error, loading } = useGeolocation({ watch: true });
  const [mapCenter, setMapCenter] = useState<L.LatLngExpression>(
    center || [-14.0642, -41.3025] // Default to Capão do Tesouro coordinates
  );
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );

  // Update map center when user position is available
  useEffect(() => {
    if (position && !center) {
      const newCenter: L.LatLngExpression = [
        position.coords.latitude,
        position.coords.longitude,
      ];
      setMapCenter(newCenter);
      setUserPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }
  }, [position, center]);

  // Calculate distance and check-in eligibility for each location
  const locationsWithDistance = locations.map(location => {
    if (!userPosition) {
      return { ...location, distance: undefined, canCheckIn: false };
    }

    const distance = calculateDistance(
      userPosition.lat,
      userPosition.lng,
      location.lat,
      location.lng
    );

    return {
      ...location,
      distance,
      canCheckIn: distance <= CHECK_IN_RADIUS,
    };
  });

  if (loading) {
    return (
      <div className="map-loading" style={{ height }}>
        <div className="map-loading-spinner"></div>
        <p>Obtendo localização...</p>
        <style>{`
          .map-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f3f4f6;
            color: #4b5563;
          }

          .map-loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 16px;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @media (prefers-color-scheme: dark) {
            .map-loading {
              background: #1f2937;
              color: #d1d5db;
            }
            .map-loading-spinner {
              border-color: #374151;
              border-top-color: #3b82f6;
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-error" style={{ height }}>
        <div className="map-error-icon">⚠</div>
        <p className="map-error-message">{error}</p>
        <p className="map-error-hint">
          O mapa será exibido na localização padrão.
        </p>
        <style>{`
          .map-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #fef2f2;
            color: #991b1b;
            padding: 24px;
            text-align: center;
          }

          .map-error-icon {
            font-size: 48px;
            margin-bottom: 16px;
          }

          .map-error-message {
            font-weight: 600;
            margin: 0 0 8px 0;
          }

          .map-error-hint {
            font-size: 14px;
            color: #7f1d1d;
            margin: 0;
          }

          @media (prefers-color-scheme: dark) {
            .map-error {
              background: #7f1d1d;
              color: #fecaca;
            }
            .map-error-hint {
              color: #fca5a5;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="leaflet-map-wrapper" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {showUserMarker && userPosition && (
          <UserMarker
            lat={userPosition.lat}
            lng={userPosition.lng}
            centerMap={centerOnUser}
            zoom={zoom}
          />
        )}

        {locationsWithDistance.map(location => (
          <TreasurePin
            key={location.id}
            location={location}
            onCheckIn={onLocationClick}
            disabled={!location.canCheckIn}
            distance={location.distance}
          />
        ))}
      </MapContainer>

      <style>{`
        .leaflet-map-wrapper {
          position: relative;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        }

        .leaflet-container {
          font-family: system-ui, -apple-system, sans-serif;
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .leaflet-popup-content {
          margin: 0;
          min-width: 250px;
        }

        .leaflet-popup-tip-container {
          display: none;
        }

        @media (max-width: 640px) {
          .leaflet-map-wrapper {
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
}
