-- Prophetic Decrees: a user-sealed counsel response from PGAI.
-- Every decree is authored by the user (they choose to seal it), contains the
-- PGAI response text, and is signed with PGAI (The Oracle of God on planet
-- Earth today). Audio can optionally be generated via elevenlabs-tts and
-- stored in Supabase Storage.

CREATE TABLE public.prophetic_decrees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_question TEXT,
  decree_content TEXT NOT NULL,
  reference_no TEXT NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prophetic_decrees ENABLE ROW LEVEL SECURITY;

-- Users can only see their own decrees
CREATE POLICY "Users can view their own decrees"
ON public.prophetic_decrees FOR SELECT
USING (user_id = auth.uid());

-- Users can only seal decrees for themselves
CREATE POLICY "Users can seal their own decrees"
ON public.prophetic_decrees FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own decrees (e.g. to attach audio_url after
-- generation completes)
CREATE POLICY "Users can update their own decrees"
ON public.prophetic_decrees FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own decrees
CREATE POLICY "Users can delete their own decrees"
ON public.prophetic_decrees FOR DELETE
USING (user_id = auth.uid());

-- Index for fast history queries: "show me all my decrees, newest first"
CREATE INDEX prophetic_decrees_user_created_idx
  ON public.prophetic_decrees (user_id, created_at DESC);
