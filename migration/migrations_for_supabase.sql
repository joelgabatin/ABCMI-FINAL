-- ============================================================================
-- MIGRATION: Set up Regions and Branches tables with proper foreign key
-- Run this in your Supabase SQL Editor (https://hxeyrlacblbbfflfyqyb.supabase.co)
-- ============================================================================

-- ============================================================================
-- STEP 1: Create regions table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.regions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 2: Create branches table with region_id as foreign key
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.branches (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  region_id INTEGER NOT NULL REFERENCES public.regions(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  member_count INTEGER DEFAULT 0,
  established TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 3: Create related tables
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pastors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  branch_id INTEGER REFERENCES public.branches(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  joined_year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.service_schedules (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  time TEXT,
  type TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.branch_members (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  joined_date TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 4: Create indexes for better query performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_branches_region_id ON public.branches(region_id);
CREATE INDEX IF NOT EXISTS idx_pastors_branch_id ON public.pastors(branch_id);
CREATE INDEX IF NOT EXISTS idx_service_schedules_branch_id ON public.service_schedules(branch_id);
CREATE INDEX IF NOT EXISTS idx_branch_members_branch_id ON public.branch_members(branch_id);
CREATE INDEX IF NOT EXISTS idx_branch_members_profile_id ON public.branch_members(profile_id);

-- ============================================================================
-- STEP 5: Enable Row Level Security
-- ============================================================================
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pastors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branch_members ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 6: Create RLS Policies
-- ============================================================================

-- Regions policies
CREATE POLICY "Public can view regions" 
  ON public.regions FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage regions"
  ON public.regions 
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Branches policies
CREATE POLICY "Public can view active branches" 
  ON public.branches FOR SELECT 
  USING (status = 'active' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage branches"
  ON public.branches
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Pastors policies
CREATE POLICY "Public can view pastors" 
  ON public.pastors FOR SELECT 
  USING (status = 'active' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage pastors"
  ON public.pastors
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Service schedules policies
CREATE POLICY "Public can view service schedules" 
  ON public.service_schedules FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage service schedules"
  ON public.service_schedules
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Branch members policies
CREATE POLICY "Pastors and admins can view branch members" 
  ON public.branch_members FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'pastor')));

CREATE POLICY "Admins can manage branch members"
  ON public.branch_members
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================================
-- STEP 7: Seed regions data
-- ============================================================================
INSERT INTO public.regions (name) VALUES
('CAR'),
('Region I'),
('Region II'),
('Region III'),
('International')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- STEP 8: Seed branches data with proper region_id foreign keys
-- ============================================================================
INSERT INTO public.branches (name, location, region_id, status, member_count, established) VALUES
('ABCMI Main Church', 'East Quirino Hill, Baguio City', (SELECT id FROM regions WHERE name = 'CAR'), 'active', 245, '2020'),
('Camp 8 Branch', 'Camp 8, Baguio City', (SELECT id FROM regions WHERE name = 'CAR'), 'active', 87, ''),
('San Carlos Branch', 'San Carlos, Baguio City', (SELECT id FROM regions WHERE name = 'CAR'), 'active', 64, ''),
('Kias Branch', 'Kias, Baguio City', (SELECT id FROM regions WHERE name = 'CAR'), 'active', 53, ''),
('Patiacan Branch', 'Patiacan, Quirino, Ilocos Sur', (SELECT id FROM regions WHERE name = 'Region I'), 'active', 41, ''),
('Villa Conchita Branch', 'Villa Conchita, Manabo, Abra', (SELECT id FROM regions WHERE name = 'CAR'), 'active', 78, ''),
('Casacgudan Branch', 'Casacgudan, Manabo, Abra', (SELECT id FROM regions WHERE name = 'CAR'), 'active', 92, ''),
('San Juan Branch', 'San Juan, Abra', (SELECT id FROM regions WHERE name = 'CAR'), 'active', 35, ''),
('Dianawan Branch', 'Dianawan, Maria Aurora, Aurora', (SELECT id FROM regions WHERE name = 'Region III'), 'active', 48, ''),
('Lower Decoliat Branch', 'Lower Decoliat, Alfonso Castaneda, Nueva Vizcaya', (SELECT id FROM regions WHERE name = 'Region II'), 'active', 31, ''),
('Dalic Branch', 'Dalic, Bontoc, Mt. Province', (SELECT id FROM regions WHERE name = 'CAR'), 'active', 56, ''),
('Ansagan Branch', 'Ansagan, Tuba, Benguet', (SELECT id FROM regions WHERE name = 'CAR'), 'active', 44, ''),
('Vientiane Mission', 'Vientiane, Laos', (SELECT id FROM regions WHERE name = 'International'), 'active', 22, '')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- CREATE contact_messages table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view and manage contact messages"
  ON public.contact_messages FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================================
-- ADD maps_url TO branches table
-- ============================================================================
ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS maps_url TEXT;

-- ============================================================================
-- FIX MIGRATION: Replace region (text) with region_id (FK) in branches table
-- Run this if your branches table already exists with a 'region' text column
-- ============================================================================

-- Step 1: Add region_id column
ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS region_id INTEGER;

-- Step 2: Populate region_id by matching existing region text to regions.id
UPDATE public.branches b
SET region_id = r.id
FROM public.regions r
WHERE b.region = r.name;

-- Step 3: Set NOT NULL and add FK constraint
ALTER TABLE public.branches
  ALTER COLUMN region_id SET NOT NULL,
  ADD CONSTRAINT fk_branches_region
    FOREIGN KEY (region_id) REFERENCES public.regions(id) ON DELETE RESTRICT;

-- Step 4: Drop the old region text column
ALTER TABLE public.branches DROP COLUMN IF EXISTS region;

-- ============================================================================
-- VERIFICATION QUERIES (Run these to verify the setup)
-- ============================================================================

-- View all regions
-- SELECT id, name FROM public.regions ORDER BY id;

-- View all branches with their region names (using JOIN)
-- SELECT 
--   b.id, 
--   b.name, 
--   b.location, 
--   b.region_id, 
--   r.name as region_name, 
--   b.member_count, 
--   b.status
-- FROM public.branches b
-- LEFT JOIN public.regions r ON b.region_id = r.id
-- ORDER BY b.id;

-- View foreign key constraints
-- SELECT 
--   tc.constraint_name,
--   tc.table_name,
--   kcu.column_name,
--   ccu.table_name AS foreign_table_name,
--   ccu.column_name AS foreign_column_name
-- FROM information_schema.table_constraints AS tc
-- JOIN information_schema.key_column_usage AS kcu
--   ON tc.constraint_name = kcu.constraint_name
--   AND tc.table_schema = kcu.table_schema
-- JOIN information_schema.constraint_column_usage AS ccu
--   ON ccu.constraint_name = tc.constraint_name
--   AND ccu.table_schema = tc.table_schema
-- WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'branches';
