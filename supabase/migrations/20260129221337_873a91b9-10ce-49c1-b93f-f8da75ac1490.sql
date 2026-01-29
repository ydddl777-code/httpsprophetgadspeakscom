-- Create profiles table for parent accounts (stored locally was previous approach, now we use Supabase)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  age_group TEXT NOT NULL CHECK (age_group IN ('child', 'teen', 'youngAdult', 'parent', 'adult', 'elder')),
  city TEXT,
  state TEXT,
  school_district TEXT,
  alarm_time TEXT DEFAULT '07:00',
  alarm_enabled BOOLEAN DEFAULT false,
  audio_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create child_profiles table for children managed by parents
CREATE TABLE public.child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER CHECK (age >= 1 AND age <= 17),
  school_district TEXT,
  
  -- Parental control settings
  message_tone TEXT DEFAULT 'gentle' CHECK (message_tone IN ('gentle', 'encouraging')),
  counseling_access BOOLEAN DEFAULT false,
  doctrine_access BOOLEAN DEFAULT false,
  alarm_time TEXT DEFAULT '07:00',
  alarm_enabled BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies: users can only access their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (user_id = auth.uid());

-- Child profiles policies: parents can manage their children
CREATE POLICY "Parents can view their children"
ON public.child_profiles FOR SELECT
USING (parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Parents can add children"
ON public.child_profiles FOR INSERT
WITH CHECK (parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Parents can update their children"
ON public.child_profiles FOR UPDATE
USING (parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Parents can delete their children"
ON public.child_profiles FOR DELETE
USING (parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_child_profiles_updated_at
BEFORE UPDATE ON public.child_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();