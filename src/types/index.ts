// Global type definitions

// Re-export authentication types
export * from './user';

// Game-specific User interface (extends auth User)
export interface GameUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  score: number;
  createdAt: Date;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  location?: {
    lat: number;
    lng: number;
  };
  completed: boolean;
}

export interface Treasure {
  id: string;
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  value: number;
  found: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  score: number;
  rank: number;
}
