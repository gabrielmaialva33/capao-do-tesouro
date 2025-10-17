/**
 * Authentication Store using Zustand
 *
 * Manages global authentication state including user data,
 * loading states, and error handling.
 */

import { create } from 'zustand';
import type { AuthState, User } from '../types/user';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut as firebaseSignOut,
  onAuthStateChange,
} from '../services/firebase';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,

  setUser: (user: User | null) => {
    console.log('setUser called:', { user: user ? 'exists' : 'null', willSetLoading: false });
    set({
      user,
      isAuthenticated: !!user,
      loading: false,
    });
  },

  setLoading: (loading: boolean) => {
    console.log('setLoading called:', loading);
    set({ loading });
  },

  setError: (error: string | null) => set({ error }),

  clearError: () => set({ error: null }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    }),
}));

/**
 * Authentication Actions
 * These functions integrate Firebase authentication with the Zustand store
 */

export const authActions = {
  /**
   * Sign in with Google
   */
  signInWithGoogle: async (): Promise<void> => {
    const { setLoading, setError, clearError } = useAuthStore.getState();

    try {
      setLoading(true);
      clearError();
      await signInWithGoogle();
      // User will be set by onAuthStateChange listener
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  },

  /**
   * Sign in with Email and Password
   */
  signInWithEmail: async (email: string, password: string): Promise<void> => {
    const { setLoading, setError, clearError } = useAuthStore.getState();

    try {
      setLoading(true);
      clearError();
      await signInWithEmail(email, password);
      // User will be set by onAuthStateChange listener
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  },

  /**
   * Sign up with Email and Password
   */
  signUpWithEmail: async (email: string, password: string): Promise<void> => {
    const { setLoading, setError, clearError } = useAuthStore.getState();

    try {
      setLoading(true);
      clearError();
      await signUpWithEmail(email, password);
      // User will be set by onAuthStateChange listener
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  },

  /**
   * Sign out current user
   */
  signOut: async (): Promise<void> => {
    const { setLoading, setError, clearError, logout } = useAuthStore.getState();

    try {
      setLoading(true);
      clearError();
      await firebaseSignOut();
      logout();
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  },

  /**
   * Initialize auth listener
   * Call this once when the app starts to subscribe to auth state changes
   */
  initializeAuthListener: (): (() => void) => {
    const { setUser } = useAuthStore.getState();

    // Don't set loading to true here - it causes issues when multiple
    // components call useAuth() and re-initialize the listener
    // The store already starts with loading: true

    const unsubscribe = onAuthStateChange((user) => {
      console.log('Auth state changed:', user ? 'Logged in' : 'Logged out');
      setUser(user);
    });

    return unsubscribe;
  },
};
