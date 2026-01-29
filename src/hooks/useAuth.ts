import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  age_group: 'child' | 'teen' | 'youngAdult' | 'parent' | 'adult' | 'elder';
  city: string | null;
  state: string | null;
  school_district: string | null;
  alarm_time: string;
  alarm_enabled: boolean;
  audio_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChildProfile {
  id: string;
  parent_id: string;
  name: string;
  age: number | null;
  school_district: string | null;
  message_tone: 'gentle' | 'encouraging';
  counseling_access: boolean;
  doctrine_access: boolean;
  alarm_time: string;
  alarm_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile for current user
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile | null;
  }, []);

  // Fetch children for current profile
  const fetchChildren = useCallback(async (profileId: string) => {
    const { data, error } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('parent_id', profileId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching children:', error);
      return [];
    }
    return data as ChildProfile[];
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
            
            if (profileData) {
              const childrenData = await fetchChildren(profileData.id);
              setChildren(childrenData);
            }
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setChildren([]);
          setIsLoading(false);
        }
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(profileData => {
          setProfile(profileData);
          if (profileData) {
            fetchChildren(profileData.id).then(setChildren);
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, fetchChildren]);

  // Sign up with email/password
  const signUp = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    return { data, error };
  }, []);

  // Sign in with email/password
  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setProfile(null);
      setChildren([]);
    }
    return { error };
  }, []);

  // Create profile after signup
  const createProfile = useCallback(async (
    name: string,
    ageGroup: Profile['age_group'],
    city?: string,
    state?: string,
    schoolDistrict?: string
  ) => {
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        name,
        age_group: ageGroup,
        city: city || null,
        state: state || null,
        school_district: schoolDistrict || null
      })
      .select()
      .single();

    if (!error && data) {
      setProfile(data as Profile);
    }
    return { data, error };
  }, [user]);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!profile) return { data: null, error: new Error('No profile') };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data as Profile);
    }
    return { data, error };
  }, [profile]);

  // Add child profile
  const addChild = useCallback(async (
    name: string,
    age: number,
    settings: Partial<ChildProfile> = {}
  ) => {
    if (!profile) return { data: null, error: new Error('No profile') };

    const { data, error } = await supabase
      .from('child_profiles')
      .insert({
        parent_id: profile.id,
        name,
        age,
        ...settings
      })
      .select()
      .single();

    if (!error && data) {
      setChildren(prev => [...prev, data as ChildProfile]);
    }
    return { data, error };
  }, [profile]);

  // Update child profile
  const updateChild = useCallback(async (childId: string, updates: Partial<ChildProfile>) => {
    const { data, error } = await supabase
      .from('child_profiles')
      .update(updates)
      .eq('id', childId)
      .select()
      .single();

    if (!error && data) {
      setChildren(prev => prev.map(c => c.id === childId ? data as ChildProfile : c));
    }
    return { data, error };
  }, []);

  // Delete child profile
  const deleteChild = useCallback(async (childId: string) => {
    const { error } = await supabase
      .from('child_profiles')
      .delete()
      .eq('id', childId);

    if (!error) {
      setChildren(prev => prev.filter(c => c.id !== childId));
    }
    return { error };
  }, []);

  return {
    user,
    session,
    profile,
    children,
    isLoading,
    isAuthenticated: !!user,
    hasProfile: !!profile,
    signUp,
    signIn,
    signOut,
    createProfile,
    updateProfile,
    addChild,
    updateChild,
    deleteChild
  };
};
