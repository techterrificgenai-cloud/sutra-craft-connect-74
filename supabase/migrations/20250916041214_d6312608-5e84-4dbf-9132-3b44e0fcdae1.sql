-- Insert sample seller profiles
INSERT INTO sellers (user_id, shop_name, bio, region, verified_badge, cultural_badge, eco_badge, rating) VALUES
('00000000-0000-0000-0000-000000000001', 'Meera''s Silk House', 'Master weaver specializing in Banarasi silk sarees with 30+ years experience', 'Varanasi, UP', true, true, false, 4.8),
('00000000-0000-0000-0000-000000000002', 'Rajesh Pottery Works', 'Traditional blue pottery artisan from the royal city of Jaipur', 'Jaipur, RJ', true, true, true, 4.6),
('00000000-0000-0000-0000-000000000003', 'Lakshmi Silver Crafts', 'Expert in Cuttack silver filigree with heritage techniques', 'Cuttack, OR', true, false, false, 4.7),
('00000000-0000-0000-0000-000000000004', 'Sita''s Folk Art', 'Madhubani painting artist preserving ancient Mithila traditions', 'Mithila, BR', false, true, true, 4.5),
('00000000-0000-0000-0000-000000000005', 'Kashmir Pashmina Co', 'Authentic Kashmiri pashmina weavers since 1890', 'Kashmir, JK', true, false, true, 4.9),
('00000000-0000-0000-0000-000000000006', 'Ganga Terracotta Studio', 'Traditional pottery from the ceramic hub of Khurja', 'Khurja, UP', false, false, true, 4.3);

-- Insert sample products
INSERT INTO products (seller_id, title, description, price, stock, photos, tags, eco_badge, cultural_badge, story_text, story_language, published) VALUES
(
  (SELECT id FROM sellers WHERE shop_name = 'Meera''s Silk House'),
  'Handwoven Banarasi Silk Saree',
  'Exquisite Banarasi silk saree with intricate gold zari work. Handwoven on traditional pit looms using techniques passed down through generations.',
  15000,
  5,
  ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500'],
  ARRAY['saree', 'silk', 'banarasi', 'traditional', 'handwoven'],
  false,
  true,
  'This saree carries the legacy of 500-year-old weaving traditions from the sacred city of Varanasi. Each thread tells a story of devotion and craftsmanship.',
  'en',
  true
),
(
  (SELECT id FROM sellers WHERE shop_name = 'Rajesh Pottery Works'),
  'Blue Pottery Ceramic Bowl Set',
  'Traditional Jaipur blue pottery bowl set made with natural dyes and quartz stone powder. Perfect for serving and decoration.',
  2500,
  10,
  ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'],
  ARRAY['pottery', 'ceramic', 'blue', 'jaipur', 'bowls'],
  true,
  true,
  'Crafted using traditional techniques passed down through generations, this blue pottery showcases the royal heritage of Jaipur.',
  'en',
  true
),
(
  (SELECT id FROM sellers WHERE shop_name = 'Lakshmi Silver Crafts'),
  'Silver Filigree Jewelry Box',
  'Elegant silver filigree jewelry box from Cuttack, Odisha. Features intricate wirework and traditional patterns.',
  8500,
  3,
  ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'],
  ARRAY['silver', 'filigree', 'jewelry box', 'cuttack', 'traditional'],
  false,
  false,
  'Each delicate wire is shaped by hand in an art form dating back to the Mughal era, creating timeless beauty.',
  'en',
  true
),
(
  (SELECT id FROM sellers WHERE shop_name = 'Sita''s Folk Art'),
  'Madhubani Painting Canvas',
  'Authentic Madhubani painting on canvas depicting traditional motifs and folk stories from Bihar.',
  3200,
  8,
  ARRAY['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500'],
  ARRAY['madhubani', 'painting', 'folk art', 'bihar', 'canvas'],
  true,
  true,
  'Natural pigments and traditional motifs tell stories of ancient folklore passed down through generations of women artists.',
  'en',
  true
),
(
  (SELECT id FROM sellers WHERE shop_name = 'Kashmir Pashmina Co'),
  'Pashmina Wool Shawl',
  'Pure Pashmina wool shawl from Kashmir, handwoven with the finest goat wool from the Changthang plateau.',
  12000,
  7,
  ARRAY['https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=500'],
  ARRAY['pashmina', 'shawl', 'kashmir', 'wool', 'handwoven'],
  true,
  false,
  'From the highlands of Kashmir, each thread is spun with generations of expertise, creating the world''s finest wool.',
  'en',
  true
),
(
  (SELECT id FROM sellers WHERE shop_name = 'Ganga Terracotta Studio'),
  'Terracotta Garden Planter Set',
  'Set of 3 terracotta planters handcrafted from locally sourced clay. Perfect for indoor and outdoor gardening.',
  1800,
  15,
  ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'],
  ARRAY['terracotta', 'planters', 'garden', 'pottery', 'eco-friendly'],
  true,
  false,
  'Made from locally sourced clay, these planters bring earthen beauty to your space while supporting sustainable crafts.',
  'en',
  true
);