/**
 * Main App Component with React Router
 *
 * Configures application routes and authentication flow
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { authActions } from './stores/authStore';

// Pages
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import NotFoundPage from './pages/NotFoundPage';

// Auth Pages
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import ProfilePage from './features/auth/ProfilePage';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';
import RequestLocation from './components/RequestLocation';

// Admin Page
import AdminPage from './pages/AdminPage';

import './App.css';

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  // Initialize auth listener once when app starts
  useEffect(() => {
    const unsubscribe = authActions.initializeAuthListener();
    return () => unsubscribe();
  }, []);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* Request location permission for authenticated users */}
      {isAuthenticated && !locationPermissionGranted && (
        <RequestLocation
          onPermissionGranted={() => {
            console.log('Location permission granted!');
            setLocationPermissionGranted(true);
          }}
          onPermissionDenied={() => {
            console.log('Location permission denied');
            // User pode usar app mas sem funcionalidades de localização
            setLocationPermissionGranted(true); // Permite continuar mesmo sem permissão
          }}
        />
      )}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Placeholder routes for future features */}
        <Route
          path="/quests"
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="text-center">
                  <div className="text-6xl mb-4">⭐</div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Missões
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Em breve...
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏆</div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Ranking
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Em breve...
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏅</div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Conquistas
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Em breve...
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;