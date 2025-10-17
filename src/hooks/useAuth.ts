/**
 * Custom hook for authentication
 *
 * Provides easy access to auth state and actions.
 * Note: The auth listener should be initialized once in App.tsx,
 * not in every component that uses this hook.
 */

import { useAuthStore, authActions } from '../stores/authStore';

export const useAuth = () => {
  const { user, loading, error, isAuthenticated } = useAuthStore();

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
