-- ============================================================================
-- CAPAO DO TESOURO - DATABASE SCHEMA
-- Database: PostgreSQL 17 + TimescaleDB
-- Purpose: Gamified cultural tourism PWA
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "timescaledb";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- USERS TABLE
-- Stores user profile information synced with Firebase Authentication
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    total_points INTEGER DEFAULT 0 NOT NULL CHECK (total_points >= 0),
    level INTEGER DEFAULT 1 NOT NULL CHECK (level >= 1 AND level <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for users table
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_total_points ON users(total_points DESC);
CREATE INDEX idx_users_level ON users(level DESC);

-- ============================================================================
-- LOCATIONS TABLE
-- Stores points of interest (tourist attractions, cultural sites, etc.)
-- ============================================================================
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude DECIMAL(10, 7) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    category VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    image_url TEXT,
    points_reward INTEGER DEFAULT 100 NOT NULL CHECK (points_reward >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add PostGIS geometry column for efficient geospatial queries
SELECT AddGeometryColumn('locations', 'geom', 4326, 'POINT', 2);
UPDATE locations SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326);

-- Add AI-enhanced fields
ALTER TABLE locations ADD COLUMN IF NOT EXISTS ai_refined_coordinates GEOMETRY(POINT, 4326);
ALTER TABLE locations ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1);
ALTER TABLE locations ADD COLUMN IF NOT EXISTS cultural_context TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS historical_facts JSONB;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS visitor_tips JSONB;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS last_ai_update TIMESTAMPTZ;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS ai_enhanced_description TEXT;

-- Indexes for locations table
CREATE INDEX idx_locations_category ON locations(category);
CREATE INDEX idx_locations_geom ON locations USING GIST(geom);
CREATE INDEX idx_locations_created_at ON locations(created_at DESC);

-- ============================================================================
-- CHECKINS TABLE (HYPERTABLE)
-- TimescaleDB hypertable for check-in events with automatic time-based partitioning
-- ============================================================================
CREATE TABLE checkins (
    id UUID DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    points_earned INTEGER NOT NULL CHECK (points_earned >= 0),
    photo_url TEXT,
    checkin_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, checkin_timestamp)
);

-- Convert to hypertable with 7-day chunks
SELECT create_hypertable('checkins', 'checkin_timestamp', chunk_time_interval => INTERVAL '7 days');

-- Indexes for checkins table
CREATE INDEX idx_checkins_user_id ON checkins(user_id, checkin_timestamp DESC);
CREATE INDEX idx_checkins_location_id ON checkins(location_id, checkin_timestamp DESC);
CREATE INDEX idx_checkins_timestamp ON checkins(checkin_timestamp DESC);

-- Compression policy for older data (compress chunks older than 30 days)
SELECT add_compression_policy('checkins', INTERVAL '30 days');

-- Retention policy (optional: remove data older than 2 years)
-- SELECT add_retention_policy('checkins', INTERVAL '2 years');

-- ============================================================================
-- BADGES TABLE
-- Achievement badges that users can unlock
-- ============================================================================
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT NOT NULL,
    condition_type VARCHAR(50) NOT NULL,
    condition_value INTEGER NOT NULL CHECK (condition_value >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for badges table
CREATE INDEX idx_badges_condition_type ON badges(condition_type);

-- ============================================================================
-- USER_BADGES TABLE
-- Junction table tracking which badges each user has unlocked
-- ============================================================================
CREATE TABLE user_badges (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_id, badge_id)
);

-- Indexes for user_badges table
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id, unlocked_at DESC);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX idx_user_badges_unlocked_at ON user_badges(unlocked_at DESC);

-- ============================================================================
-- CONTINUOUS AGGREGATES (TimescaleDB)
-- Pre-computed materialized views for analytics and leaderboards
-- ============================================================================

-- Daily check-in statistics per user
CREATE MATERIALIZED VIEW daily_user_checkins
WITH (timescaledb.continuous) AS
SELECT
    user_id,
    time_bucket('1 day', checkin_timestamp) AS day,
    COUNT(*) AS checkin_count,
    SUM(points_earned) AS points_earned
FROM checkins
GROUP BY user_id, day
WITH NO DATA;

-- Refresh policy: update every hour for last 7 days
SELECT add_continuous_aggregate_policy('daily_user_checkins',
    start_offset => INTERVAL '7 days',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour');

-- Location popularity statistics
CREATE MATERIALIZED VIEW location_stats
WITH (timescaledb.continuous) AS
SELECT
    location_id,
    time_bucket('1 day', checkin_timestamp) AS day,
    COUNT(*) AS visit_count,
    COUNT(DISTINCT user_id) AS unique_visitors
FROM checkins
GROUP BY location_id, day
WITH NO DATA;

-- Refresh policy for location stats
SELECT add_continuous_aggregate_policy('location_stats',
    start_offset => INTERVAL '7 days',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour');

-- ============================================================================
-- TRIGGERS
-- Automatic timestamp updates and data validation
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON badges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update location geometry when coordinates change
CREATE OR REPLACE FUNCTION update_location_geom()
RETURNS TRIGGER AS $$
BEGIN
    NEW.geom = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_locations_geom BEFORE INSERT OR UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_location_geom();

-- Function to update user total_points when check-in occurs
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET total_points = total_points + NEW.points_earned,
        level = LEAST(100, 1 + (total_points + NEW.points_earned) / 1000)
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_points_on_checkin AFTER INSERT ON checkins
    FOR EACH ROW EXECUTE FUNCTION update_user_points();

-- ============================================================================
-- USEFUL FUNCTIONS
-- Helper functions for common queries
-- ============================================================================

-- Get nearby locations within radius (in meters)
CREATE OR REPLACE FUNCTION get_nearby_locations(
    user_lat DECIMAL,
    user_lon DECIMAL,
    radius_meters INTEGER DEFAULT 1000
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    description TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    category VARCHAR,
    address TEXT,
    image_url TEXT,
    points_reward INTEGER,
    distance_meters FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        l.id,
        l.name,
        l.description,
        l.latitude,
        l.longitude,
        l.category,
        l.address,
        l.image_url,
        l.points_reward,
        ST_Distance(
            l.geom::geography,
            ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography
        ) AS distance_meters
    FROM locations l
    WHERE ST_DWithin(
        l.geom::geography,
        ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography,
        radius_meters
    )
    ORDER BY distance_meters;
END;
$$ LANGUAGE plpgsql;

-- Get user ranking by total points
CREATE OR REPLACE FUNCTION get_leaderboard(limit_count INTEGER DEFAULT 100)
RETURNS TABLE (
    rank BIGINT,
    user_id UUID,
    username VARCHAR,
    avatar_url TEXT,
    total_points INTEGER,
    level INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ROW_NUMBER() OVER (ORDER BY u.total_points DESC) AS rank,
        u.id,
        u.username,
        u.avatar_url,
        u.total_points,
        u.level
    FROM users u
    ORDER BY u.total_points DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Check if user can check-in at location (prevent duplicate within 24h)
CREATE OR REPLACE FUNCTION can_checkin(
    p_user_id UUID,
    p_location_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    last_checkin TIMESTAMPTZ;
BEGIN
    SELECT MAX(checkin_timestamp) INTO last_checkin
    FROM checkins
    WHERE user_id = p_user_id
      AND location_id = p_location_id;

    IF last_checkin IS NULL THEN
        RETURN TRUE;
    END IF;

    RETURN (NOW() - last_checkin) > INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- Documentation for tables and columns
-- ============================================================================

COMMENT ON TABLE users IS 'User profiles synchronized with Firebase Authentication';
COMMENT ON TABLE locations IS 'Points of interest for cultural tourism';
COMMENT ON TABLE checkins IS 'TimescaleDB hypertable for check-in events (time-series data)';
COMMENT ON TABLE badges IS 'Achievement badges that users can unlock';
COMMENT ON TABLE user_badges IS 'Junction table tracking user badge unlocks';

COMMENT ON COLUMN users.firebase_uid IS 'Firebase Authentication UID';
COMMENT ON COLUMN users.total_points IS 'Cumulative points from all check-ins';
COMMENT ON COLUMN users.level IS 'User level calculated from total_points (1 level per 1000 points)';

COMMENT ON COLUMN locations.geom IS 'PostGIS geometry for efficient spatial queries';
COMMENT ON COLUMN locations.points_reward IS 'Points awarded for checking in at this location';

COMMENT ON COLUMN checkins.checkin_timestamp IS 'Time-series partition key for TimescaleDB';
COMMENT ON COLUMN badges.condition_type IS 'Type of unlock condition: total_checkins, total_points, visit_category, etc.';

-- ============================================================================
-- GRANTS (adjust based on your application user)
-- ============================================================================

-- Example: Create application user and grant permissions
-- CREATE USER capao_app WITH PASSWORD 'secure_password_here';
-- GRANT CONNECT ON DATABASE capao_db TO capao_app;
-- GRANT USAGE ON SCHEMA public TO capao_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO capao_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO capao_app;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO capao_app;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================