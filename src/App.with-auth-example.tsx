/**
 * App.tsx with Firebase Authentication Example
 *
 * This is an example of how to integrate Firebase Authentication into your App.
 * To use it, rename this file to App.tsx (backup the original first).
 *
 * Features demonstrated:
 * - Auth state management with Zustand
 * - Loading states
 * - Protected content
 * - Sign in/out functionality
 */

import { useAuth } from './hooks/useAuth';
import { AuthExample } from './components/AuthExample';
import { Button, Card } from './components/ui';

function App() {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Show auth UI if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-12 px-4">
        <div className="max-w-md mx-auto mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Capao do Tesouro
          </h1>
          <p className="text-gray-600">
            Sign in to start your treasure hunting adventure!
          </p>
        </div>
        <AuthExample />
      </div>
    );
  }

  // Show protected content when authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {user?.displayName || 'Treasure Hunter'}!
          </h1>
          <p className="text-gray-600">
            You are authenticated and ready to explore
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
            <div className="space-y-3">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
              )}
              <div className="text-sm">
                <p className="text-gray-600">Email:</p>
                <p className="font-semibold">{user?.email}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">User ID:</p>
                <p className="font-mono text-xs break-all">{user?.uid}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">Email Verified:</p>
                <p className="font-semibold">
                  {user?.emailVerified ? '✅ Yes' : '❌ No'}
                </p>
              </div>
            </div>
          </Card>

          <Card variant="bordered">
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="primary" size="lg" className="w-full">
                Start Quest
              </Button>
              <Button variant="secondary" size="lg" className="w-full">
                View Map
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Leaderboard
              </Button>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold mb-4">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">Created At:</p>
              <p className="font-semibold">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">Last Login:</p>
              <p className="font-semibold">
                {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Firebase Authentication is working correctly!
          </p>
          <p className="text-xs text-gray-500">
            User state is managed with Zustand and persisted across page refreshes
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
