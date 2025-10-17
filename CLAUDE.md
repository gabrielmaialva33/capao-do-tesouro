# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Capao do Tesouro** is a gamified cultural tourism PWA (Progressive Web App) built with React 19, TypeScript, and Vite. The application enables users to explore points of interest, check-in at locations, earn points and badges, and compete on leaderboards.

**Tech Stack:**
- Frontend: React 19 + TypeScript + Vite
- Styling: Tailwind CSS 4
- State Management: Zustand
- Authentication: Firebase Auth
- Maps: Leaflet + React-Leaflet
- Database: PostgreSQL 17 + TimescaleDB + PostGIS (backend)
- PWA: vite-plugin-pwa with Workbox

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start dev server (with HMR at http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Firebase Setup
Before running the app, Firebase credentials must be configured:

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env and add Firebase credentials from Firebase Console
# See QUICK_START.md for detailed instructions
```

Required environment variables (all prefixed with `VITE_`):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

**Note:** After creating or modifying `.env`, restart the dev server.

## Architecture

### Directory Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Basic UI components (Button, Card, Input, Alert)
│   ├── game/         # Game-specific components (PointsDisplay, CheckInButton, BadgeCard)
│   ├── map/          # Map components (LeafletMap, UserMarker, TreasurePin)
│   └── ProtectedRoute.tsx
├── features/         # Feature modules (organized by domain)
│   ├── auth/         # Authentication pages (LoginPage, SignupPage, ProfilePage)
│   └── leaderboard/  # Leaderboard feature
├── pages/            # Top-level page components
│   ├── HomePage.tsx
│   ├── MapPage.tsx
│   └── NotFoundPage.tsx
├── stores/           # Zustand state management
│   ├── authStore.ts  # Authentication state + actions
│   └── questStore.ts # Quest/game state
├── services/         # External service integrations
│   ├── firebase.ts   # Firebase Auth configuration and functions
│   └── api.ts        # Backend API calls (currently mock data)
├── hooks/            # Custom React hooks
│   ├── useAuth.ts    # Authentication hook (wraps authStore)
│   └── useGeolocation.ts # Geolocation hook for maps
├── types/            # TypeScript type definitions
│   ├── user.ts       # User and AuthState types
│   └── game.ts       # Location, CheckIn, Badge, UserProgress types
└── lib/              # Utility libraries
```

### State Management Pattern

**Zustand stores** are used for global state. The pattern is:

1. **Store** (`src/stores/*.ts`): Defines state shape and basic setters
2. **Actions** (exported as `*Actions` object): Contains async logic that integrates services with the store
3. **Hooks** (`src/hooks/*.ts`): Convenience hooks that wrap stores and actions for components

**Example:** Authentication flow
- `authStore.ts` → defines `AuthState` + basic setters
- `authActions` → provides `signInWithGoogle()`, `signInWithEmail()`, `signOut()` etc.
- `useAuth.ts` hook → wraps the store and actions, initializes auth listener on mount

### Authentication Flow

1. User signs in via `authActions.signInWithGoogle()` or `authActions.signInWithEmail()`
2. Firebase handles authentication
3. `onAuthStateChange` listener in `authActions.initializeAuthListener()` detects user state
4. Listener calls `setUser()` in authStore to update global state
5. Components using `useAuth()` hook reactively update
6. `ProtectedRoute` component guards routes that require authentication

### Routing Structure

All routes defined in `src/App.tsx`:

**Public Routes:**
- `/login` - LoginPage (redirects to `/` if authenticated)
- `/signup` - SignupPage (redirects to `/` if authenticated)

**Protected Routes (require auth):**
- `/` - HomePage
- `/map` - MapPage (interactive Leaflet map)
- `/profile` - ProfilePage
- `/quests` - Placeholder (not implemented)
- `/leaderboard` - Placeholder (not implemented)
- `/achievements` - Placeholder (not implemented)

### Map Integration (Leaflet)

Map components use **React-Leaflet** for interactive maps:

- `LeafletMap.tsx` - Main map container with tiles from OpenStreetMap
- `UserMarker.tsx` - Shows user's current position
- `TreasurePin.tsx` - Displays location pins for check-in points
- `MapIntegrationTest.tsx` - Test component for map functionality

**Geolocation:** Use `useGeolocation()` hook to access user's current position.

**Important:** Leaflet CSS must be imported in components that use maps (`import 'leaflet/dist/leaflet.css'`).

### Backend API (Currently Mock)

`src/services/api.ts` provides mock data for development. All functions return promises with artificial delays.

**When implementing real backend:**
1. Replace mock functions with actual `fetch()` calls
2. Update API endpoint URLs (comments in `api.ts` show structure)
3. Backend should use PostgreSQL database (schema in `database/schema.sql`)

**Mock functions:**
- `fetchLocations()` - Get all available locations
- `performCheckin()` - Check-in at a location
- `fetchUserStats()` - Get user progress/stats
- `getLeaderboard()` - Get ranked users
- `fetchBadges()` - Get all badges

### Database (Backend)

**Location:** VPS at `162.12.204.30:5432`
**Database:** `capao_db` (PostgreSQL 17 + TimescaleDB + PostGIS)

**Schema files:**
- `database/schema.sql` - Complete database schema
- `database/seed.sql` - Test data (development only)
- `database/README.md` - Setup instructions and documentation

**Key Tables:**
- `users` - User profiles (synced with Firebase UID)
- `locations` - Points of interest with GPS coordinates
- `checkins` - TimescaleDB hypertable for time-series check-in data
- `badges` - Achievement badges
- `user_badges` - Unlocked badges per user

**Important Functions:**
- `get_nearby_locations(lat, lon, radius_meters)` - Spatial query for nearby POIs
- `get_leaderboard(limit)` - Ranked users by points
- `can_checkin(user_id, location_id)` - Validates check-in eligibility (24h cooldown)

### PWA Configuration

PWA setup in `vite.config.ts` using `vite-plugin-pwa`:

- **Manifest:** App name, icons, theme colors, display mode
- **Service Worker:** Auto-updates, caches static assets
- **Workbox:** Runtime caching for API calls (NetworkFirst strategy)
- **Dev Mode:** PWA features enabled in development

**Icons:** Place PWA icons in `public/` (see `ICONS_TODO.md` for requirements)

## Tailwind Configuration

Custom theme extends in `tailwind.config.js`:

**Colors:**
- `primary: #10b981` (emerald green)
- `secondary: #3b82f6` (blue)
- `accent: #f59e0b` (amber)

**Custom Animations:**
- `animate-pulse-slow` - Slow pulse effect
- `animate-shine` - Shine/shimmer effect

## TypeScript Configuration

- `tsconfig.json` - Base config
- `tsconfig.app.json` - App-specific config
- `tsconfig.node.json` - Node/Vite config

**Important:** React 19 uses new types; ensure `@types/react` and `@types/react-dom` are up-to-date.

## Firebase Security

- **Never commit** `.env` file (included in `.gitignore`)
- Use `.env.example` as template
- Firebase API keys are public but protected by domain restrictions in Firebase Console
- Admin SDK key (`capao-do-tesouro-firebase-adminsdk-*.json`) is for backend/Cloud Functions only - **never import in frontend code**

## Common Development Workflows

### Adding a New Protected Route

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx` within `<ProtectedRoute>` wrapper
3. Update navigation if needed

### Adding a New Location Type

1. Update `category` type in `src/types/game.ts` (Location interface)
2. Update mock data in `src/services/api.ts` (MOCK_LOCATIONS)
3. Update database `locations` table category enum (if using real backend)

### Implementing Real Backend API

1. Replace mock functions in `src/services/api.ts`
2. Set up API endpoint (Node.js/Express recommended)
3. Connect to PostgreSQL using connection string from `.env`
4. Use database functions defined in `schema.sql`

### Working with Zustand Stores

1. Define state interface (e.g., `AuthState`)
2. Create store with `create<StateType>()` from zustand
3. Export actions object with async functions
4. Create convenience hook if needed

## Code Style

- **Imports:** Group by external, internal, types
- **Components:** Functional components with TypeScript props interfaces
- **File naming:** PascalCase for components, camelCase for utilities
- **Comments:** JSDoc-style for public functions and complex logic

## Known Limitations

- Backend API is currently mocked (see `src/services/api.ts`)
- Some routes are placeholders (`/quests`, `/leaderboard`, `/achievements`)
- Database schema exists but no backend server implementation yet
- PWA icons may need to be generated (see `ICONS_TODO.md`)

## Additional Documentation

- `README.md` - Basic Vite + React template info
- `QUICK_START.md` - Firebase authentication quick start
- `FIREBASE_SETUP.md` - Detailed Firebase setup guide
- `database/README.md` - Database schema and setup
- `PWA_SETUP.md` - PWA configuration details
- `TAILWIND_SETUP.md` - Tailwind CSS setup
- `GEMINI.md` - Gemini AI integration notes