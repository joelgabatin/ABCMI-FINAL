-- ============================================================================
-- MIGRATION: Create bible_study_groups and bible_study_requests tables
-- ============================================================================

-- GROUPS TABLE
CREATE TABLE IF NOT EXISTS public.bible_study_groups (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL DEFAULT '',
  branch        TEXT NOT NULL DEFAULT '',
  leader        TEXT NOT NULL DEFAULT '',
  topic         TEXT NOT NULL DEFAULT '',
  schedule      TEXT NOT NULL DEFAULT '',
  time          TEXT NOT NULL DEFAULT '',
  location      TEXT NOT NULL DEFAULT '',
  members       INTEGER NOT NULL DEFAULT 0,
  max_members   INTEGER NOT NULL DEFAULT 20,
  status        TEXT NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'full', 'inactive')),
  description   TEXT NOT NULL DEFAULT '',
  start_date    DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bible_study_groups_status     ON public.bible_study_groups(status);
CREATE INDEX IF NOT EXISTS idx_bible_study_groups_branch     ON public.bible_study_groups(branch);
CREATE INDEX IF NOT EXISTS idx_bible_study_groups_created_at ON public.bible_study_groups(created_at DESC);

ALTER TABLE public.bible_study_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active bible study groups"
  ON public.bible_study_groups FOR SELECT
  USING (status IN ('active', 'full'));

CREATE POLICY "Admins can manage bible study groups"
  ON public.bible_study_groups FOR ALL
  USING (true);

-- ============================================================================
-- REQUESTS TABLE (join requests + open-house requests)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bible_study_requests (
  id              SERIAL PRIMARY KEY,
  request_type    TEXT NOT NULL DEFAULT 'join'
                    CHECK (request_type IN ('join', 'open_house')),
  name            TEXT NOT NULL DEFAULT '',
  email           TEXT,
  phone           TEXT,
  branch          TEXT NOT NULL DEFAULT '',
  -- join-request fields
  preferred_group TEXT,
  -- open-house fields
  address         TEXT,
  preferred_day   TEXT,
  preferred_time  TEXT,
  capacity        INTEGER,
  message         TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'declined')),
  admin_notes     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bible_study_requests_status      ON public.bible_study_requests(status);
CREATE INDEX IF NOT EXISTS idx_bible_study_requests_type        ON public.bible_study_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_bible_study_requests_created_at  ON public.bible_study_requests(created_at DESC);

ALTER TABLE public.bible_study_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit bible study request"
  ON public.bible_study_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage bible study requests"
  ON public.bible_study_requests FOR ALL
  USING (true);

-- ============================================================================
-- SEED: Bible Study Groups
-- ============================================================================
INSERT INTO public.bible_study_groups (name, branch, leader, topic, schedule, time, location, members, max_members, status, description, start_date) VALUES
('Foundations of Faith',    'ABCMI Main Church',      'Ptr. Ysrael Coyoy',   'Book of Romans',                    'Wednesday', '7:00 PM', 'Main Sanctuary',    18, 25, 'active',   'In-depth study of Paul''s letter to the Romans covering grace, faith, and salvation.',                           '2024-01-10'),
('Women of the Word',       'ABCMI Main Church',      'Ptr. Fhey Coyoy',     'Proverbs 31 & Women of the Bible',  'Saturday',  '9:00 AM', 'Fellowship Hall',   22, 30, 'active',   'A women''s Bible study group focusing on biblical womanhood and practical faith.',                               '2024-02-01'),
('Youth Discipleship',      'Camp 8 Branch',          'Ptr. Julio Coyoy',    'Identity in Christ',                'Friday',    '6:00 PM', 'Camp 8 Hall',       15, 20, 'active',   'Bible study for youth focusing on their identity in Christ and purpose in life.',                                '2024-01-20'),
('New Believers Class',     'ABCMI Main Church',      'Ptr. Fhey Coyoy',     'Christian Basics & Foundations',    'Sunday',    '8:00 AM', 'Room A',             8, 15, 'active',   'Orientation and basic discipleship class for new believers and church members.',                                 '2024-03-01'),
('Men''s Brotherhood Study','Kias Branch',            'Ptr. Domingo Coyoy',  'Book of Proverbs',                  'Saturday',  '7:00 AM', 'Kias Hall',         12, 20, 'active',   'Early morning Bible study for men focusing on wisdom and godly leadership.',                                     '2024-02-10'),
('Couples'' Fellowship',    'Casacgudan Branch',      'Ptr. Rolando Teneza', 'Marriage & Family in the Bible',    'Thursday',  '7:30 PM', 'Casacgudan Hall',   20, 20, 'full',     'Bible study for married couples focusing on biblical principles for family life.',                               '2024-01-15'),
('House of Prayer Study',   'San Carlos Branch',      'Ptr. Carmelo Bautista','Psalms & Worship',                 'Tuesday',   '6:30 PM', 'Brgy. San Carlos',  10, 15, 'active',   'A community house-based study centered on worship and the Psalms.',                                             '2024-03-15'),
('Living Word Circle',      'Villa Conchita Branch',  'Ptr. Alfredo Soria',  'Gospel of John',                   'Wednesday', '5:00 PM', 'Villa Conchita Hall',9, 18, 'active',   'An evening group exploring the Gospel of John, focusing on the life and teachings of Jesus.',                   '2024-04-01');

-- ============================================================================
-- SEED: Bible Study Requests
-- ============================================================================
INSERT INTO public.bible_study_requests (request_type, name, email, phone, branch, preferred_group, address, preferred_day, preferred_time, capacity, message, status, created_at) VALUES
-- Join requests
('join',       'Maria Santos',      'maria@example.com',   '+63 912 111 1111', 'ABCMI Main Church', 'Foundations of Faith',     NULL, NULL,        NULL,       NULL, 'I want to deepen my understanding of the Bible.',                             'pending',  NOW() - INTERVAL '5 days'),
('join',       'Juan dela Cruz',    'juan@example.com',    '+63 912 222 2222', 'Camp 8 Branch',     'Youth Discipleship',       NULL, NULL,        NULL,       NULL, 'My teenager wants to join a youth Bible study.',                              'pending',  NOW() - INTERVAL '6 days'),
('join',       'Rosa Reyes',        'rosa@example.com',    '+63 912 333 3333', 'ABCMI Main Church', 'Women of the Word',        NULL, NULL,        NULL,       NULL, 'Looking for a women''s group I can join.',                                    'approved', NOW() - INTERVAL '10 days'),
('join',       'Pedro Villanueva',  'pedro@example.com',   '+63 912 444 4444', 'Kias Branch',       'Men''s Brotherhood Study', NULL, NULL,        NULL,       NULL, 'Interested in the men''s study group.',                                       'approved', NOW() - INTERVAL '12 days'),
('join',       'Anna Garcia',       'anna@example.com',    '+63 912 555 5555', 'Casacgudan Branch', 'Couples'' Fellowship',     NULL, NULL,        NULL,       NULL, 'My husband and I want to join a couples group.',                              'declined', NOW() - INTERVAL '15 days'),
-- Open-house requests
('open_house', 'Liza Fernandez',    'liza@example.com',    '+63 917 601 1111', 'ABCMI Main Church', NULL, '123 Magsaysay Ave, Baguio City',   'Thursday',  '6:00 PM',   15, 'We have a spacious sala and would love to host a weekly Bible study.',        'pending',  NOW() - INTERVAL '3 days'),
('open_house', 'Roberto Manalo',    'roberto@example.com', '+63 917 602 2222', 'Camp 8 Branch',     NULL, 'Blk 4 Lot 12, Camp 8, Baguio City','Saturday',  '9:00 AM',   12, 'Our home is near the Camp 8 church and can accommodate a small group.',       'pending',  NOW() - INTERVAL '4 days'),
('open_house', 'Cynthia Espiritu',  'cynthia@example.com', '+63 917 603 3333', 'San Carlos Branch', NULL, '45 Quirino Hill, San Carlos',      'Wednesday', '7:00 PM',   20, 'I have been praying for an opportunity to serve the congregation this way.',   'approved', NOW() - INTERVAL '20 days'),
('open_house', 'Danilo Reyes',      'danilo@example.com',  '+63 917 604 4444', 'Kias Branch',       NULL, 'Purok 3, Kias, Baguio City',       'Friday',    '5:30 PM',   10, 'Small but cozy space, perfect for an intimate study group.',                  'declined', NOW() - INTERVAL '25 days');
