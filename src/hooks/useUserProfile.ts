import { useState, useEffect, useCallback } from 'react';
import { UserProfile, AgeGroup } from '@/lib/types';
import { getUserProfile, saveUserProfile, createNewProfile, clearUserProfile } from '@/lib/storage';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getUserProfile();
    setProfile(stored);
    setIsLoading(false);
  }, []);

  const createProfile = useCallback(
    (name: string, ageGroup: AgeGroup, city: string, state: string, schoolDistrict?: string) => {
      const newProfile = createNewProfile(name, ageGroup, city, state, schoolDistrict);
      saveUserProfile(newProfile);
      setProfile(newProfile);
      return newProfile;
    },
    []
  );

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((current) => {
      if (!current) return null;
      const updated = { ...current, ...updates };
      saveUserProfile(updated);
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    clearUserProfile();
    setProfile(null);
  }, []);

  return {
    profile,
    isLoading,
    createProfile,
    updateProfile,
    logout,
    isAuthenticated: !!profile,
  };
};
