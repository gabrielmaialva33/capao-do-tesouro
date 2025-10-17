/**
 * Custom hook for authentication
 *
 * Provides easy access to auth state and actions
 */

import { useEffect } from 'react';
import { useAuthStore, authActions } from '../stores/authStore';

export const useAuth = () => {
  const { user, loading, error, isAuthenticated } = useAuthStore();

  // Initialize auth listener on mount
  useEffect(() => {
    const unsubscribe = authActions.initializeAuthListener();
    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    signInWithGoogle: authActions.signInWithGoogle,
    signInWithEmail: authActions.signInWithEmail,
    signUpWithEmail: authActions.signUpWithEmail,
    signOut: authActions.signOut,
  };
};
