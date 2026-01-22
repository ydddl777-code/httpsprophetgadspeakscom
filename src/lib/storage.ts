import { UserProfile, AgeGroup } from './types';

const STORAGE_KEY = 'thepillar_user';

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

export const getUserProfile = (): UserProfile | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const clearUserProfile = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createNewProfile = (
  name: string,
  ageGroup: AgeGroup,
  city: string,
  state: string,
  schoolDistrict?: string
): UserProfile => {
  return {
    id: generateUserId(),
    name,
    ageGroup,
    location: { city, state },
    schoolDistrict,
    alarmTime: '07:00',
    alarmEnabled: false,
    audioEnabled: true,
    createdAt: new Date(),
  };
};
