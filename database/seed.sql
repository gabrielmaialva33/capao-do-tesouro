-- ============================================================================
-- CAPAO DO TESOURO - SEED DATA
-- Purpose: Insert sample data for development and testing
-- ============================================================================

-- Note: Run schema.sql before running this seed file

-- ============================================================================
-- LOCATIONS - Sample tourist locations
-- ============================================================================

INSERT INTO locations (id, name, description, latitude, longitude, category, address, image_url, points_reward) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Igreja Matriz Nossa Senhora da Conceicao',
    'Igreja catolica historica construida no seculo XVIII, um dos principais marcos arquitetonicos da regiao. Possui belo estilo barroco colonial com detalhes em ouro nas talhas internas.',
    -12.4686111,
    -41.5794444,
    'religious',
    'Praca da Matriz, s/n - Centro, Capao do Tesouro - BA',
    'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=800',
    150
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Cachoeira do Tesouro',
    'Cachoeira paradisiaca escondida na mata atlantica, com queda d agua de 15 metros e piscina natural cristalina. Ideal para banho e contemplacao da natureza.',
    -12.4751234,
    -41.5856789,
    'nature',
    'Trilha da Cachoeira, km 3 - Zona Rural, Capao do Tesouro - BA',
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800',
    200
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'Museu do Garimpo',
    'Museu que preserva a memoria dos garimpeiros e a historia da extracao de diamantes na regiao durante os seculos XIX e XX. Exposicao permanente com ferramentas, fotos e relatos orais.',
    -12.4695555,
    -41.5801111,
    'museum',
    'Rua do Garimpo, 123 - Centro Historico, Capao do Tesouro - BA',
    'https://images.unsplash.com/photo-1566127444979-b3d2b654e3a8?w=800',
    180
),
(
    '550e8400-e29b-41d4-a716-446655440004',
    'Mirante do Por do Sol',
    'Ponto elevado com vista panoramica de 360 graus da cidade e das montanhas ao redor. Melhor horario para visitacao e ao entardecer, quando o ceu ganha tons alaranjados.',
    -12.4723456,
    -41.5768901,
    'viewpoint',
    'Estrada do Mirante, km 2 - Alto da Serra, Capao do Tesouro - BA',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    120
),
(
    '550e8400-e29b-41d4-a716-446655440005',
    'Feira de Artesanato Local',
    'Feira permanente de artesanato regional com produtos feitos por artesaos locais: cestarias, bordados, esculturas em madeira, doces caseiros e licores artesanais.',
    -12.4701234,
    -41.5789876,
    'market',
    'Praca da Cultura, s/n - Centro, Capao do Tesouro - BA',
    'https://images.unsplash.com/photo-1555529902-5261145633bf?w=800',
    100
);

-- ============================================================================
-- BADGES - Achievement badges
-- ============================================================================

INSERT INTO badges (id, name, description, icon_url, condition_type, condition_value) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    'Explorador Iniciante',
    'Desbloqueado ao fazer seu primeiro check-in em qualquer locacao. Bem-vindo a aventura pelo Capao do Tesouro!',
    'https://api.iconify.design/mdi:map-marker-star.svg?color=%23FFD700',
    'total_checkins',
    1
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    'Colecionador de Tesouros',
    'Desbloqueado ao visitar 5 locacoes diferentes. Voce esta descobrindo os tesouros escondidos da nossa cidade!',
    'https://api.iconify.design/mdi:treasure-chest.svg?color=%23FFD700',
    'total_checkins',
    5
),
(
    '660e8400-e29b-41d4-a716-446655440003',
    'Mestre dos Pontos',
    'Desbloqueado ao acumular 1000 pontos. Sua dedicacao esta sendo recompensada!',
    'https://api.iconify.design/mdi:star-circle.svg?color=%23FFD700',
    'total_points',
    1000
);

-- ============================================================================
-- SAMPLE USERS (for testing)
-- ============================================================================

-- Note: In production, users will be created via Firebase Authentication
-- These are sample users for testing purposes only

INSERT INTO users (id, firebase_uid, username, email, avatar_url, total_points, level) VALUES
(
    '770e8400-e29b-41d4-a716-446655440001',
    'firebase_test_uid_001',
    'maria_exploradora',
    'maria@example.com',
    'https://i.pravatar.cc/150?img=1',
    850,
    1
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    'firebase_test_uid_002',
    'joao_aventureiro',
    'joao@example.com',
    'https://i.pravatar.cc/150?img=12',
    1250,
    2
),
(
    '770e8400-e29b-41d4-a716-446655440003',
    'firebase_test_uid_003',
    'ana_viajante',
    'ana@example.com',
    'https://i.pravatar.cc/150?img=5',
    2100,
    3
);

-- ============================================================================
-- SAMPLE CHECKINS (for testing)
-- ============================================================================

-- Maria's check-ins
INSERT INTO checkins (user_id, location_id, points_earned, photo_url, checkin_timestamp) VALUES
(
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    150,
    'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=400',
    NOW() - INTERVAL '7 days'
),
(
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440004',
    120,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    NOW() - INTERVAL '5 days'
),
(
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440005',
    100,
    'https://images.unsplash.com/photo-1555529902-5261145633bf?w=400',
    NOW() - INTERVAL '2 days'
);

-- Joao's check-ins
INSERT INTO checkins (user_id, location_id, points_earned, photo_url, checkin_timestamp) VALUES
(
    '770e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    200,
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',
    NOW() - INTERVAL '10 days'
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003',
    180,
    'https://images.unsplash.com/photo-1566127444979-b3d2b654e3a8?w=400',
    NOW() - INTERVAL '8 days'
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    150,
    'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=400',
    NOW() - INTERVAL '4 days'
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440004',
    120,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    NOW() - INTERVAL '1 day'
);

-- Ana's check-ins
INSERT INTO checkins (user_id, location_id, points_earned, photo_url, checkin_timestamp) VALUES
(
    '770e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440001',
    150,
    NULL,
    NOW() - INTERVAL '15 days'
),
(
    '770e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440002',
    200,
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',
    NOW() - INTERVAL '12 days'
),
(
    '770e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    180,
    NULL,
    NOW() - INTERVAL '9 days'
),
(
    '770e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440004',
    120,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    NOW() - INTERVAL '6 days'
),
(
    '770e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440005',
    100,
    NULL,
    NOW() - INTERVAL '3 days'
);

-- ============================================================================
-- SAMPLE USER BADGES (for testing)
-- ============================================================================

-- Assign badges to users based on their achievements
INSERT INTO user_badges (user_id, badge_id, unlocked_at) VALUES
-- Maria unlocked "Explorador Iniciante"
(
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    NOW() - INTERVAL '7 days'
),

-- Joao unlocked "Explorador Iniciante" and "Colecionador de Tesouros"
(
    '770e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440001',
    NOW() - INTERVAL '10 days'
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440002',
    NOW() - INTERVAL '4 days'
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440003',
    NOW() - INTERVAL '1 day'
),

-- Ana unlocked all three badges
(
    '770e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440001',
    NOW() - INTERVAL '15 days'
),
(
    '770e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440002',
    NOW() - INTERVAL '9 days'
),
(
    '770e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440003',
    NOW() - INTERVAL '3 days'
);

-- ============================================================================
-- REFRESH CONTINUOUS AGGREGATES
-- ============================================================================

-- Refresh the materialized views with the sample data
CALL refresh_continuous_aggregate('daily_user_checkins', NULL, NULL);
CALL refresh_continuous_aggregate('location_stats', NULL, NULL);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify data insertion
DO $$
DECLARE
    location_count INTEGER;
    badge_count INTEGER;
    user_count INTEGER;
    checkin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO location_count FROM locations;
    SELECT COUNT(*) INTO badge_count FROM badges;
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO checkin_count FROM checkins;

    RAISE NOTICE 'Seed data inserted successfully:';
    RAISE NOTICE '  - % locations', location_count;
    RAISE NOTICE '  - % badges', badge_count;
    RAISE NOTICE '  - % users', user_count;
    RAISE NOTICE '  - % check-ins', checkin_count;
END $$;

-- Show sample leaderboard
SELECT * FROM get_leaderboard(10);

-- Show sample nearby locations (using coordinates of Igreja Matriz)
SELECT * FROM get_nearby_locations(-12.4686111, -41.5794444, 5000);

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
