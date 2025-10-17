// Utility functions

/**
 * Calculates distance between two geographic coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Check if user is within check-in radius of a location
 * @param userLat - User's latitude
 * @param userLng - User's longitude
 * @param locationLat - Location's latitude
 * @param locationLng - Location's longitude
 * @param radius - Check-in radius in meters
 * @returns true if user is within radius
 */
export function isWithinRadius(
  userLat: number,
  userLng: number,
  locationLat: number,
  locationLng: number,
  radius: number
): boolean {
  const distance = calculateDistance(userLat, userLng, locationLat, locationLng);
  return distance <= radius;
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Classnames utility for conditional CSS classes
 */
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(num);
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(current: number, target: number): number {
  return Math.min(100, Math.max(0, (current / target) * 100));
}
