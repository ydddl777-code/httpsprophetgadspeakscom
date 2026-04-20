-- Extend prophetic_decrees to support intercessory prayers alongside sealed
-- counsel decrees. Prayers are distinct in purpose (PGAI stands in the gap
-- for the user, addressing the Father) but share the same archival plumbing
-- (reference_no, content, audio_url, user scoping).

ALTER TABLE public.prophetic_decrees
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'decree';

-- Constrain type to the two supported kinds.
ALTER TABLE public.prophetic_decrees
  DROP CONSTRAINT IF EXISTS prophetic_decrees_type_check;
ALTER TABLE public.prophetic_decrees
  ADD CONSTRAINT prophetic_decrees_type_check
  CHECK (type IN ('decree', 'prayer'));

-- Helper index for "all my prayers" / "all my decrees" views.
CREATE INDEX IF NOT EXISTS prophetic_decrees_user_type_idx
  ON public.prophetic_decrees (user_id, type, created_at DESC);
