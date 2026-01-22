export type AgeGroup = 'child' | 'teen' | 'parent' | 'elder';

export interface UserProfile {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  location: {
    city: string;
    state: string;
  };
  schoolDistrict?: string;
  alarmTime: string;
  audioEnabled: boolean;
  createdAt: Date;
}

export interface DailyVerse {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
}

export interface MusicCheckResult {
  song: string;
  artist: string;
  bpm: number | null;
  status: 'safe' | 'caution' | 'danger';
  reason: string;
}

export interface FoodCheckResult {
  food: string;
  status: 'clean' | 'unclean';
  reference: string;
}

export interface WalletCalculation {
  income: number;
  payment: number;
  percentage: number;
  status: 'safe' | 'warning' | 'danger';
  scripture: string;
}

export interface DoctrineQuestion {
  id: string;
  question: string;
  answer: string;
  verse: string;
  verseText: string;
  practicalTip?: string;
  ageGroups: AgeGroup[];
}

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  child: 'Child (4-12)',
  teen: 'Teen (13-19)',
  parent: 'Parent',
  elder: 'Elder (60+)',
};

export const AGE_GROUP_GREETINGS: Record<AgeGroup, string> = {
  child: 'little one',
  teen: 'young one',
  parent: 'brother/sister',
  elder: 'elder',
};
