/**
 * API service for backend communication
 * Contains mock data for initial development
 */

import type { Location, CheckIn, CheckInResponse, UserProgress, LeaderboardUser, Badge } from '../types/game';

// Mock delay to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const MOCK_LOCATIONS: Location[] = [
  {
    id: 'loc-001',
    name: 'Cachoeira Principal',
    description: 'Bela cachoeira com queda de 15 metros, perfeita para banho.',
    coordinates: { lat: -15.7942, lng: -47.8822 },
    points: 100,
    radius: 50,
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400',
    checkedIn: false,
    checkinCount: 0,
  },
  {
    id: 'loc-002',
    name: 'Mirante do Capao',
    description: 'Vista panoramica da regiao, ideal para por do sol.',
    coordinates: { lat: -15.7890, lng: -47.8900 },
    points: 150,
    radius: 30,
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    checkedIn: false,
    checkinCount: 0,
  },
  {
    id: 'loc-003',
    name: 'Centro Historico',
    description: 'Marco historico da fundacao do municipio.',
    coordinates: { lat: -15.8000, lng: -47.8800 },
    points: 80,
    radius: 100,
    category: 'historical',
    imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400',
    checkedIn: false,
    checkinCount: 0,
  },
  {
    id: 'loc-004',
    name: 'Trilha das Arvores Antigas',
    description: 'Trilha ecologica com arvores centenarias.',
    coordinates: { lat: -15.7950, lng: -47.8750 },
    points: 120,
    radius: 40,
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    checkedIn: false,
    checkinCount: 0,
  },
  {
    id: 'loc-005',
    name: 'Gruta Escondida',
    description: 'Gruta natural com formacoes rochosas unicas.',
    coordinates: { lat: -15.8050, lng: -47.8850 },
    points: 200,
    radius: 25,
    category: 'hidden',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
    checkedIn: false,
    checkinCount: 0,
  },
];

const MOCK_BADGES: Badge[] = [
  {
    id: 'badge-001',
    name: 'Primeiro Passo',
    description: 'Fez seu primeiro check-in',
    icon: '👣',
    unlocked: false,
    requirement: '1 check-in',
    category: 'explorer',
  },
  {
    id: 'badge-002',
    name: 'Explorador',
    description: 'Visitou 5 locais diferentes',
    icon: '🧭',
    unlocked: false,
    requirement: '5 locais unicos',
    category: 'explorer',
  },
  {
    id: 'badge-003',
    name: 'Colecionador',
    description: 'Visitou 10 locais diferentes',
    icon: '🎯',
    unlocked: false,
    requirement: '10 locais unicos',
    category: 'collector',
  },
  {
    id: 'badge-004',
    name: 'Mestre dos Tesouros',
    description: 'Visitou todos os locais disponiveis',
    icon: '👑',
    unlocked: false,
    requirement: 'Todos os locais',
    category: 'master',
  },
  {
    id: 'badge-005',
    name: 'Sequencia de 7',
    description: 'Check-ins em 7 dias consecutivos',
    icon: '🔥',
    unlocked: false,
    requirement: '7 dias de sequencia',
    category: 'streak',
  },
  {
    id: 'badge-006',
    name: 'Amante da Natureza',
    description: 'Visitou todos os locais de natureza',
    icon: '🌿',
    unlocked: false,
    requirement: 'Todos os locais de natureza',
    category: 'collector',
  },
];

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  {
    userId: 'user-001',
    displayName: 'Ana Silva',
    photoURL: 'https://i.pravatar.cc/150?img=1',
    points: 2500,
    level: 12,
    rank: 1,
    totalCheckIns: 45,
  },
  {
    userId: 'user-002',
    displayName: 'Carlos Santos',
    photoURL: 'https://i.pravatar.cc/150?img=2',
    points: 2300,
    level: 11,
    rank: 2,
    totalCheckIns: 38,
  },
  {
    userId: 'user-003',
    displayName: 'Beatriz Costa',
    photoURL: 'https://i.pravatar.cc/150?img=3',
    points: 2100,
    level: 10,
    rank: 3,
    totalCheckIns: 35,
  },
  {
    userId: 'user-004',
    displayName: 'Diego Oliveira',
    photoURL: 'https://i.pravatar.cc/150?img=4',
    points: 1950,
    level: 10,
    rank: 4,
    totalCheckIns: 32,
  },
  {
    userId: 'user-005',
    displayName: 'Elena Ferreira',
    photoURL: 'https://i.pravatar.cc/150?img=5',
    points: 1800,
    level: 9,
    rank: 5,
    totalCheckIns: 30,
  },
];

// Calculate level from points
function calculateLevel(points: number): number {
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

// Calculate points needed for next level
function pointsForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

/**
 * Fetch all available locations
 */
export async function fetchLocations(): Promise<Location[]> {
  await delay(500);

  // In production, replace with:
  // const response = await fetch('/api/locations');
  // if (!response.ok) throw new Error('Failed to fetch locations');
  // return response.json();

  return MOCK_LOCATIONS;
}

/**
 * Perform a check-in at a location
 */
export async function performCheckin(
  locationId: string,
  userId: string,
  userCoordinates: { lat: number; lng: number }
): Promise<CheckInResponse> {
  await delay(800);

  // In production, replace with:
  // const response = await fetch('/api/checkins', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ locationId, userId, coordinates: userCoordinates }),
  // });
  // if (!response.ok) throw new Error('Failed to perform check-in');
  // return response.json();

  const location = MOCK_LOCATIONS.find(loc => loc.id === locationId);
  if (!location) {
    return {
      success: false,
      points: 0,
      message: 'Localizacao nao encontrada',
    };
  }

  const checkIn: CheckIn = {
    id: `checkin-${Date.now()}`,
    locationId,
    userId,
    timestamp: new Date(),
    points: location.points,
    coordinates: userCoordinates,
  };

  // Simulate level up (would come from backend)
  const isLevelUp = Math.random() > 0.8;
  const newLevel = isLevelUp ? 5 : undefined;

  // Simulate new badge unlock (would come from backend)
  const newBadges = Math.random() > 0.7 ? [MOCK_BADGES[0]] : undefined;

  return {
    success: true,
    checkIn,
    points: location.points,
    newLevel,
    newBadges,
    message: 'Check-in realizado com sucesso!',
  };
}

/**
 * Fetch user progress and statistics
 */
export async function fetchUserStats(userId: string): Promise<UserProgress> {
  await delay(400);

  // In production, replace with:
  // const response = await fetch(`/api/users/${userId}/stats`);
  // if (!response.ok) throw new Error('Failed to fetch user stats');
  // return response.json();

  const points = 850;
  const level = calculateLevel(points);

  return {
    userId,
    points,
    level,
    nextLevelPoints: pointsForNextLevel(level),
    totalCheckIns: 12,
    uniqueLocations: 5,
    badges: MOCK_BADGES.slice(0, 2).map(b => ({ ...b, unlocked: true })),
    currentStreak: 3,
    longestStreak: 7,
    rank: 15,
  };
}

/**
 * Fetch leaderboard rankings
 */
export async function getLeaderboard(limit: number = 50): Promise<LeaderboardUser[]> {
  await delay(600);

  // In production, replace with:
  // const response = await fetch(`/api/leaderboard?limit=${limit}`);
  // if (!response.ok) throw new Error('Failed to fetch leaderboard');
  // return response.json();

  // Generate more mock users to fill the leaderboard
  const extendedLeaderboard: LeaderboardUser[] = [...MOCK_LEADERBOARD];

  for (let i = 6; i <= Math.min(limit, 50); i++) {
    extendedLeaderboard.push({
      userId: `user-${String(i).padStart(3, '0')}`,
      displayName: `Usuario ${i}`,
      photoURL: `https://i.pravatar.cc/150?img=${i}`,
      points: 1800 - (i - 5) * 100,
      level: Math.max(1, 9 - Math.floor((i - 5) / 5)),
      rank: i,
      totalCheckIns: Math.max(5, 30 - (i - 5) * 2),
    });
  }

  return extendedLeaderboard.slice(0, limit);
}

/**
 * Fetch all available badges
 */
export async function fetchBadges(): Promise<Badge[]> {
  await delay(300);

  // In production, replace with:
  // const response = await fetch('/api/badges');
  // if (!response.ok) throw new Error('Failed to fetch badges');
  // return response.json();

  return MOCK_BADGES;
}

/**
 * Error handler wrapper for API calls
 */
export async function apiCall<T>(
  fn: () => Promise<T>,
  errorMessage: string = 'Erro ao comunicar com servidor'
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
}
