CREATE TABLE public.prophetic_decrees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_question TEXT,
  decree_content TEXT NOT NULL,
  reference_no TEXT NOT NULL UNIQUE,
  audio_url TEXT,
  type TEXT NOT NULL DEFAULT 'decree',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prophetic_decrees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own decrees"
ON public.prophetic_decrees FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own decrees"
ON public.prophetic_decrees FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decrees"
ON public.prophetic_decrees FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decrees"
ON public.prophetic_decrees FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX idx_prophetic_decrees_user_id ON public.prophetic_decrees(user_id);
CREATE INDEX idx_prophetic_decrees_created_at ON public.prophetic_decrees(created_at DESC);

CREATE TRIGGER update_prophetic_decrees_updated_at
BEFORE UPDATE ON public.prophetic_decrees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();