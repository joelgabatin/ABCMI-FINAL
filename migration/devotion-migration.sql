-- ============================================================================
-- MIGRATION: Set up Daily Devotions table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.daily_devotions (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  scripture TEXT NOT NULL,
  scripture_text TEXT NOT NULL,
  reflection TEXT NOT NULL,
  featured_verse TEXT NOT NULL,
  featured_verse_ref TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  author TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.daily_devotions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Public can view published devotionals" 
  ON public.daily_devotions FOR SELECT 
  USING (published = true AND status = 'active');

CREATE POLICY "Admins can manage all devotionals"
  ON public.daily_devotions
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Seed sample data
INSERT INTO public.daily_devotions 
(date, title, scripture, scripture_text, reflection, featured_verse, featured_verse_ref, published, featured, author, status) 
VALUES
('2026-03-21', 'Walking in the Light', 'John 8:12', 'Again Jesus spoke to them, saying, ''I am the light of the world. Whoever follows me will not walk in darkness, but will have the light of life.''', 'Jesus declares Himself the Light of the world — not a light, but the light. In a world filled with confusion, moral ambiguity, and spiritual darkness, Christ offers clear direction and life. To follow Him is to walk in clarity, purpose, and peace. Today, let us choose to walk closely with Him, letting His Word illuminate our steps and His Spirit guide our decisions. When we face uncertainty, we can trust that the One who made the stars knows the path ahead.', 'Your word is a lamp to my feet and a light to my path.', 'Psalm 119:105', true, true, 'Ptr. Ysrael Coyoy', 'active'),
('2026-03-20', 'The God Who Provides', 'Philippians 4:19', 'And my God will supply every need of yours according to his riches in glory in Christ Jesus.', 'Paul wrote this from prison — and yet he speaks with absolute confidence in God''s provision. He did not say God might supply, or sometimes supplies, but that God will supply every need according to His riches in glory. This is not a promise for comfort and luxury, but for sufficiency. God knows your needs before you ask. He sees the gaps in your life and is already working to fill them. Trust in His timing and His goodness.', 'Cast all your anxiety on him because he cares for you.', '1 Peter 5:7', true, false, 'Ptr. Fhey Coyoy', 'active'),
('2026-03-19', 'Arise and Build', 'Nehemiah 2:18', 'I also told them about the gracious hand of my God on me and what the king had said to me. They replied, ''Let us start rebuilding.'' So they began this good work.', 'Nehemiah faced a broken Jerusalem and a seemingly impossible mission. But when the people heard about God''s gracious hand, they were stirred to action — ''Let us start rebuilding.'' This is the spirit of ABCMI: to arise from what is broken and build what God has purposed. Every ministry, every outreach, every local church planted is a stone laid in God''s wall of salvation. Today, be encouraged. The work is not in vain. God''s hand is upon it.', 'We are God''s handiwork, created in Christ Jesus to do good works.', 'Ephesians 2:10', true, false, 'Ptr. Ysrael Coyoy', 'active'),
('2026-03-18', 'The Power of Prayer', 'James 5:16', 'The prayer of a righteous person is powerful and effective.', 'James reminds us that prayer is not a religious ritual — it is a powerful, effective force. The Greek word for ''effective'' suggests something that accomplishes its purpose. When we pray according to God''s will, in faith, and in righteousness, heaven moves. Elijah was a man just like us, and his prayers shut and opened the heavens. Your prayers matter. Do not treat them as a last resort. Make them your first response.', 'Devote yourselves to prayer, being watchful and thankful.', 'Colossians 4:2', false, false, 'Ptr. Julio Coyoy', 'active'),
('2026-03-17', 'Faithful in Little', 'Luke 16:10', 'Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.', 'God''s kingdom operates on the principle of faithfulness. Before God entrusts us with greater responsibility, He watches how we handle the small things — our time, our words, our daily commitments. The servant who was faithful with little was given charge over much. Whatever God has placed in your hands today — whether a small ministry, a family to care for, or a job that feels insignificant — do it with excellence. Faithfulness in small things is the training ground for great things.', 'Well done, good and faithful servant!', 'Matthew 25:21', true, false, 'Ptr. Fhey Coyoy', 'active')
ON CONFLICT DO NOTHING;
