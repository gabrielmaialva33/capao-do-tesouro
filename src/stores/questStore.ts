/**
 * Quest Store - Manages game state using Zustand
 * Handles locations, check-ins, and user progress
 */

import { create } from 'zustand';
import type { Location, CheckIn, UserProgress, CheckInResponse } from '../types/game';
import {
  fetchLocations as apiFetchLocations,
  performCheckin as apiPerformCheckin,
  fetchUserStats as apiFetchUserStats,
} from '../services/api';

interface QuestState {
  // State
  locations: Location[];
  checkIns: CheckIn[];
  userProgress: UserProgress | null;
  loading: boolean;
  error: string | null;
  checkInLoading: boolean;
  checkInError: string | null;
  lastCheckInResponse: CheckInResponse | null;

  // Actions
  fetchLocations: () => Promise<void>;
  performCheckin: (
    locationId: string,
    userId: string,
    userCoordinates: { lat: number; lng: number }
  ) => Promise<CheckInResponse>;
  fetchUserStats: (userId: string) => Promise<void>;
  clearError: () => void;
  clearCheckInResponse: () => void;
  markLocationAsCheckedIn: (locationId: string) => void;
  reset: () => void;
}

const initialState = {
  locations: [],
  checkIns: [],
  userProgress: null,
  loading: false,
  error: null,
  checkInLoading: false,
  checkInError: null,
  lastCheckInResponse: null,
};

export const useQuestStore = create<QuestState>((set, get) => ({
  ...initialState,

  /**
   * Fetch all available locations
   */
  fetchLocations: async () => {
    set({ loading: true, error: null });
    try {
      const locations = await apiFetchLocations();
      set({ locations, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar localizacoes';
      set({ error: errorMessage, loading: false });
    }
  },

  /**
   * Perform a check-in at a location
   */
  performCheckin: async (
    locationId: string,
    userId: string,
    userCoordinates: { lat: number; lng: number }
  ) => {
    set({ checkInLoading: true, checkInError: null, lastCheckInResponse: null });
    try {
      const response = await apiPerformCheckin(locationId, userId, userCoordinates);

      if (response.success && response.checkIn) {
        // Add check-in to store
        const { checkIns } = get();
        set({ checkIns: [...checkIns, response.checkIn] });

        // Mark location as checked in
        get().markLocationAsCheckedIn(locationId);

        // Update user progress if we got new level or points
        const { userProgress } = get();
        if (userProgress) {
          set({
            userProgress: {
              ...userProgress,
              points: userProgress.points + response.points,
              level: response.newLevel || userProgress.level,
              totalCheckIns: userProgress.totalCheckIns + 1,
              badges: response.newBadges
                ? [...userProgress.badges, ...response.newBadges]
                : userProgress.badges,
            },
          });
        }
      }

      set({ lastCheckInResponse: response, checkInLoading: false });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao realizar check-in';
      set({ checkInError: errorMessage, checkInLoading: false });
      return {
        success: false,
        points: 0,
        message: errorMessage,
      };
    }
  },

  /**
   * Fetch user statistics and progress
   */
  fetchUserStats: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const userProgress = await apiFetchUserStats(userId);
      set({ userProgress, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar estatisticas';
      set({ error: errorMessage, loading: false });
    }
  },

  /**
   * Mark a location as checked in (optimistic update)
   */
  markLocationAsCheckedIn: (locationId: string) => {
    const { locations } = get();
    const updatedLocations = locations.map(loc =>
      loc.id === locationId
        ? { ...loc, checkedIn: true, checkinCount: loc.checkinCount + 1 }
        : loc
    );
    set({ locations: updatedLocations });
  },

  /**
   * Clear general error
   */
  clearError: () => {
    set({ error: null, checkInError: null });
  },

  /**
   * Clear last check-in response (for dismissing notifications)
   */
  clearCheckInResponse: () => {
    set({ lastCheckInResponse: null });
  },

  /**
   * Reset store to initial state
   */
  reset: () => {
    set(initialState);
  },
}));
