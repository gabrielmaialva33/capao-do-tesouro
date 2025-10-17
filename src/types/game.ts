/**
 * Game-specific type definitions for check-ins, badges, and gamification
 */

export interface Location {
  id: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  points: number;
  radius: number; // Check-in radius in meters
  category: 'historical' | 'nature' | 'cultural' | 'hidden' | 'religious' | 'museum' | 'viewpoint' | 'market';
  address?: string;
  imageUrl?: string;
  checkedIn: boolean;
  checkinCount: number;
  
  // AI-enhanced fields
  aiRefinedCoordinates?: {
    lat: number;
    lng: number;
  };
  confidenceScore?: number;
  culturalContext?: string;
  historicalFacts?: string[];
  visitorTips?: string[];
  aiEnhancedDescription?: string;
  lastAiUpdate?: Date;
}

export interface CheckIn {
  id: string;
  locationId: string;
  userId: string;
  timestamp: Date;
  points: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: string;
  category: 'explorer' | 'master' | 'collector' | 'streak';
}

export interface UserProgress {
  userId: string;
  points: number;
  level: number;
  nextLevelPoints: number;
  totalCheckIns: number;
  uniqueLocations: number;
  badges: Badge[];
  currentStreak: number;
  longestStreak: number;
  rank?: number;
}

export interface LeaderboardUser {
  userId: string;
  displayName: string;
  photoURL?: string;
  points: number;
  level: number;
  rank: number;
  totalCheckIns: number;
  isCurrentUser?: boolean;
}

export interface CheckInResponse {
  success: boolean;
  checkIn?: CheckIn;
  points: number;
  newLevel?: number;
  newBadges?: Badge[];
  message: string;
}