-- ============================================================================
-- MIGRATION: Create feedback table
-- Run this in your Supabase SQL Editor
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.feedback (
  id          SERIAL PRIMARY KEY,
  author      TEXT NOT NULL DEFAULT 'Anonymous',
  branch      TEXT NOT NULL DEFAULT '',
  type        TEXT NOT NULL DEFAULT 'General Feedback'
                CHECK (type IN ('General Feedback', 'Service Improvement', 'Pastoral Care', 'Facilities', 'Programs', 'Other')),
  subject     TEXT NOT NULL DEFAULT '',
  message     TEXT NOT NULL DEFAULT '',
  rating      INTEGER NOT NULL DEFAULT 3 CHECK (rating >= 1 AND rating <= 5),
  status      TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'under_review', 'acknowledged', 'resolved')),
  anonymous      BOOLEAN NOT NULL DEFAULT false,
  wants_response BOOLEAN NOT NULL DEFAULT false,
  admin_reply    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common query patterns
CREATE INDEX IF NOT EXISTS idx_feedback_status     ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

-- Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Anyone can insert feedback (public submission)
CREATE POLICY "Anyone can submit feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

-- Admins can view and manage all feedback
CREATE POLICY "Admins can manage feedback"
  ON public.feedback FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- ============================================================================
-- Seed data (from initial hardcoded dataset)
-- ============================================================================
INSERT INTO public.feedback (author, branch, type, subject, message, rating, status, anonymous, wants_response, admin_reply, created_at) VALUES
(
  'Elena Pascual',
  'ABCMI Main Church, Baguio City',
  'Service Improvement',
  'Sound system during worship',
  'The audio quality during worship service has been inconsistent over the past few weeks. Sometimes the microphones produce feedback and it''s quite distracting during the message. I think it would greatly improve the worship experience if this could be looked into.',
  3, 'under_review', false, true, NULL,
  NOW() - INTERVAL '5 days'
),
(
  'Anonymous',
  'Camp 8, Baguio City',
  'Pastoral Care',
  'More pastoral visits for elderly members',
  'We have several elderly members who can no longer attend Sunday service regularly. It would be a tremendous blessing if the pastoral team could schedule regular home visits for them. They often feel disconnected from the church community.',
  4, 'acknowledged', true, false,
  'Thank you for this thoughtful suggestion. We have shared this with our pastoral team and will be organizing a visitation schedule for our elderly members beginning next month.',
  NOW() - INTERVAL '7 days'
),
(
  'Robert Liwanag',
  'Kias, Baguio City',
  'Programs',
  'Request for a seniors ministry',
  'Our congregation has a growing number of members aged 60 and above, but we don''t have a dedicated ministry or fellowship group for them. A seniors ministry with relevant Bible studies and social activities would be very meaningful.',
  5, 'new', false, true, NULL,
  NOW() - INTERVAL '10 days'
),
(
  'Maribel Corpuz',
  'Dalic, Bontoc, Mt. Province',
  'Facilities',
  'Restroom maintenance needed',
  'The restroom facilities at our branch need some attention. They are often not clean, and some fixtures are not functioning properly. A proper maintenance schedule would make a big difference especially for guests and visitors.',
  2, 'resolved', false, true,
  'We sincerely apologize for the inconvenience. We have assigned a maintenance team to perform repairs and have set up a regular cleaning schedule. Thank you for bringing this to our attention.',
  NOW() - INTERVAL '12 days'
),
(
  'Anonymous',
  'Villa Conchita, Manabo, Abra',
  'General Feedback',
  'Grateful for the church community',
  'I just wanted to say how thankful I am for this church. During a very difficult season in my life, the members rallied around my family with support, prayer, and practical help. This church truly lives out the love of Christ.',
  5, 'acknowledged', true, false,
  'Praise God! This is exactly what we strive to be as a church family. Thank you so much for sharing this encouragement with us.',
  NOW() - INTERVAL '14 days'
),
(
  'Aurelio Bautista',
  'San Juan, Abra',
  'Service Improvement',
  'Suggestion for live streaming services',
  'Many of our members who travel for work or are ill cannot attend in person. A live stream of Sunday services on Facebook or YouTube would allow them to stay connected and continue to be spiritually fed even from a distance.',
  4, 'new', false, true, NULL,
  NOW() - INTERVAL '17 days'
),
(
  'Petra Villanueva',
  'Casacgudan, Manabo, Abra',
  'Pastoral Care',
  'Pre-marriage counseling availability',
  'My fiance and I are engaged and are looking for pre-marriage counseling. We inquired at the church office but were told the schedule was full. Is there a way to expand counseling availability, perhaps with other trained counselors?',
  3, 'resolved', false, true,
  'We have spoken with two additional qualified members of our pastoral team and they are now available for pre-marital counseling. Please contact the church office to schedule your sessions.',
  NOW() - INTERVAL '21 days'
);
