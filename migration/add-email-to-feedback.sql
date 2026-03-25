-- ============================================================================
-- MIGRATION: Add 'email' column to feedback table
-- ============================================================================

-- 1. Add email column
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Add index for performance (optional, but good for searching)
CREATE INDEX IF NOT EXISTS idx_feedback_email ON public.feedback(email);
