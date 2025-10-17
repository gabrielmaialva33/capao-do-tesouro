/**
 * Geolocation utilities for distance calculations and proximity checks
 */

/**
 * Check-in radius in meters
 */
export const CHECK_IN_RADIUS = 50;

/**
 * Default geolocation options
 */
export const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

/**
 * Geographic coordinates
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two geographic points using Haversine formula
 * @param lat1 Latitude of first point in degrees
 * @param lon1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lon2 Longitude of second point in degrees
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
}

/**
 * Check if user position is within radius of target position
 * @param userPos User's current position
 * @param targetPos Target position to check
 * @param radius Radius in meters (defaults to CHECK_IN_RADIUS)
 * @returns True if within radius, false otherwise
 */
export function isWithinRadius(
  userPos: Coordinates,
  targetPos: Coordinates,
  radius: number = CHECK_IN_RADIUS
): boolean {
  const distance = calculateDistance(
    userPos.lat,
    userPos.lng,
    targetPos.lat,
    targetPos.lng
  );
  return distance <= radius;
}

/**
 * Format distance for display
 * @param meters Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Get geolocation error message
 * @param error GeolocationPositionError
 * @returns User-friendly error message
 */
export function getGeolocationErrorMessage(
  error: GeolocationPositionError
): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Acesso à localização negado. Por favor, permita o acesso nas configurações.';
    case error.POSITION_UNAVAILABLE:
      return 'Localização indisponível. Verifique se o GPS está ativado.';
    case error.TIMEOUT:
      return 'Tempo de espera esgotado ao obter localização.';
    default:
      return 'Erro ao obter localização.';
  }
}
