-- ============================================================================
-- MIGRATION: Create testimonies table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.testimonies (
  id          SERIAL PRIMARY KEY,
  author      TEXT NOT NULL DEFAULT 'Anonymous',
  email       TEXT,
  branch      TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL DEFAULT 'Other',
  title       TEXT NOT NULL DEFAULT '',
  content     TEXT NOT NULL DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'featured', 'hidden')),
  anonymous   BOOLEAN NOT NULL DEFAULT false,
  is_member   BOOLEAN NOT NULL DEFAULT true,
  likes       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common query patterns
CREATE INDEX IF NOT EXISTS idx_testimonies_status     ON public.testimonies(status);
CREATE INDEX IF NOT EXISTS idx_testimonies_created_at ON public.testimonies(created_at DESC);

-- Row Level Security
ALTER TABLE public.testimonies ENABLE ROW LEVEL SECURITY;

-- Anyone can insert testimony (public submission)
CREATE POLICY "Anyone can submit testimony"
  ON public.testimonies FOR INSERT
  WITH CHECK (true);

-- Anyone can view approved or featured testimonies
CREATE POLICY "Public can view approved testimonies"
  ON public.testimonies FOR SELECT
  USING (status IN ('approved', 'featured'));

-- Admins can view and manage all testimonies
CREATE POLICY "Admins can manage testimonies"
  ON public.testimonies FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Seed data
INSERT INTO public.testimonies (author, branch, category, title, content, status, anonymous, is_member, likes, created_at) VALUES
('Maria Santos', 'ABCMI Main Church, Baguio City', 'Healing', 'Healed from chronic illness', 'After months of prayer and trusting in God''s plan, my doctor confirmed last week that the tumor that was found in my kidney has completely disappeared. I want to give all the glory to God for this miraculous healing. Our church community prayed faithfully and I felt every single prayer. Thank you Lord!', 'featured', false, true, 34, NOW() - INTERVAL '5 days'),
('Anonymous', 'Camp 8, Baguio City', 'Provision', 'God provided for our family''s needs', 'We were on the verge of losing our home when God opened an unexpected door. A relative we hadn''t spoken to in years called out of nowhere and offered to help. God''s timing is always perfect. He never leaves us.', 'approved', true, true, 21, NOW() - INTERVAL '7 days'),
('Jonathan Reyes', 'Kias, Baguio City', 'Salvation', 'My son came back to the Lord', 'My son was lost for 6 years — caught in addiction and far from God. After persistent prayer and God''s grace, he walked into our church one Sunday, knelt at the altar, and surrendered his life to Christ. There is nothing too hard for God!', 'featured', false, true, 58, NOW() - INTERVAL '10 days'),
('Grace Alcantara', 'Villa Conchita, Manabo, Abra', 'Protection', 'Survived a road accident', 'Our family was involved in a severe road accident on the way home from a church event. Our vehicle rolled twice but everyone came out without a single serious injury. The paramedics said it was a miracle we were all alive. God protected us!', 'approved', false, true, 45, NOW() - INTERVAL '12 days'),
('Anonymous', 'San Carlos, Baguio City', 'Provision', 'Scholarship came through', 'I had already accepted that college was not going to be possible for me this year. Then with only 2 days left before the deadline, I received news of a full scholarship. God made a way when there seemed to be no way.', 'pending', true, false, 0, NOW() - INTERVAL '14 days');
