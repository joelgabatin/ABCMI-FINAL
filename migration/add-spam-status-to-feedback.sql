-- ============================================================================
-- MIGRATION: Add 'spam' status to feedback table
-- ============================================================================

-- 1. Drop existing check constraint
ALTER TABLE public.feedback DROP CONSTRAINT IF EXISTS feedback_status_check;

-- 2. Add new check constraint with 'spam' included
ALTER TABLE public.feedback ADD CONSTRAINT feedback_status_check 
  CHECK (status IN ('new', 'under_review', 'acknowledged', 'resolved', 'spam'));

-- 3. Add index for performance if it doesn't exist (it should, but for safety)
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
