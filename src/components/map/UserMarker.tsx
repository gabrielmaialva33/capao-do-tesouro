import { useEffect, useMemo } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * User marker props
 */
export interface UserMarkerProps {
  /**
   * User's latitude
   */
  lat: number;
  /**
   * User's longitude
   */
  lng: number;
  /**
   * Whether to center map on user position
   */
  centerMap?: boolean;
  /**
   * Zoom level when centering (default: 15)
   */
  zoom?: number;
}

/**
 * Create a custom pulsating blue circle icon for user position
 */
const createUserIcon = () => {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div class="user-marker-wrapper">
        <div class="user-marker-pulse"></div>
        <div class="user-marker-dot"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

/**
 * User position marker component with custom pulsating blue icon
 *
 * @example
 * ```tsx
 * <MapContainer>
 *   <UserMarker lat={userLat} lng={userLng} centerMap />
 * </MapContainer>
 * ```
 */
export function UserMarker({ lat, lng, centerMap = false, zoom = 15 }: UserMarkerProps) {
  const map = useMap();

  const position: L.LatLngExpression = useMemo(() => [lat, lng], [lat, lng]);
  const userIcon = useMemo(() => createUserIcon(), []);

  useEffect(() => {
    if (centerMap) {
      map.setView(position, zoom);
    }
  }, [map, position, centerMap, zoom]);

  return (
    <>
      <Marker position={position} icon={userIcon} />
      <style>{`
        .user-location-marker {
          background: transparent;
          border: none;
        }

        .user-marker-wrapper {
          position: relative;
          width: 40px;
          height: 40px;
        }

        .user-marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          background: rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .user-marker-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          z-index: 1;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.5;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
