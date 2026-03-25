-- ============================================================================
-- MIGRATION: Create prayer_requests table
-- Run this in your Supabase SQL Editor
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL DEFAULT 'Anonymous',
  contact       TEXT,
  address       TEXT,
  request       TEXT NOT NULL,
  is_anonymous  BOOLEAN NOT NULL DEFAULT false,
  face_to_face  BOOLEAN NOT NULL DEFAULT false,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'inprayer', 'interceded')),
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_prayer_requests_status     ON public.prayer_requests(status);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_created_at ON public.prayer_requests(created_at DESC);

-- Row Level Security
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a prayer request (public form)
CREATE POLICY "Anyone can submit prayer requests"
  ON public.prayer_requests FOR INSERT
  WITH CHECK (true);

-- Admins and super_admins can view and manage all prayer requests
CREATE POLICY "Admins can manage prayer requests"
  ON public.prayer_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- ============================================================================
-- Seed data
-- ============================================================================
INSERT INTO public.prayer_requests (name, contact, address, request, is_anonymous, face_to_face, status, admin_notes, created_at) VALUES
('Maria Santos',   '+63 912 111 2222', 'Baguio City',      'Please pray for healing from a recent illness. I have been battling fever and body pain for a week now and I believe God will restore my health completely.',           false, false, 'pending',   NULL,                               NOW() - INTERVAL '2 hours'),
('Anonymous',      NULL,               NULL,               'Pray for my family situation. We are going through financial difficulties and need God''s provision and wisdom.',                                                   true,  false, 'pending',   NULL,                               NOW() - INTERVAL '5 hours'),
('John dela Cruz', '+63 917 333 4444', 'La Trinidad',      'Thank you for praying for my job application last month. I got the job! Praising God for this answered prayer.',                                                    false, false, 'interceded',  'Testified during Sunday service.',  NOW() - INTERVAL '1 day'),
('Grace Reyes',    '+63 919 555 6666', 'Camp 7, Baguio',   'Please intercede for my son who has been away from the church. I am believing for his restoration and return to faith.',                                            false, true,  'inprayer', NULL,                               NOW() - INTERVAL '1 day'),
('Anonymous',      NULL,               NULL,               'Need prayer for a broken relationship. Seeking God''s guidance on whether to reconcile or move on.',                                                                true,  false, 'inprayer', NULL,                               NOW() - INTERVAL '2 days'),
('Samuel Torres',  '+63 915 777 8888', 'Abra',             'Praying for a mission trip to Laos next month. Need resources, safety, and open doors for ministry.',                                                               false, false, 'interceded',  NULL,                               NOW() - INTERVAL '3 days'),
('Luz Bautista',   '+63 920 999 0000', 'Kias, Baguio',     'Please pray for my mother who is scheduled for surgery next week. Trusting God for a successful operation and speedy recovery.',                                    false, true,  'pending',   NULL,                               NOW() - INTERVAL '4 days'),
('Anonymous',      NULL,               NULL,               'Struggling with anxiety and fear. Need prayer for peace of mind and clarity in direction.',                                                                          true,  false, 'inprayer', NULL,                               NOW() - INTERVAL '5 days');
