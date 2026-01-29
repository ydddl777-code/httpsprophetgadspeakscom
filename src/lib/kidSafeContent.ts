// Kid-safe affirmations - simple platitudes only
// No religious content, no doctrine, no condemnation
// Just sweet, kind, loving encouragement

export interface KidAffirmation {
  message: string;
  category: 'kindness' | 'honesty' | 'family' | 'friendship' | 'courage' | 'gratitude';
}

// Simple platitude-based affirmations for children
export const KID_AFFIRMATIONS: KidAffirmation[] = [
  // Kindness
  { message: "Be kind to everyone you meet today.", category: 'kindness' },
  { message: "A kind word can brighten someone's whole day.", category: 'kindness' },
  { message: "Share with others and you'll feel happy inside.", category: 'kindness' },
  { message: "Help someone who needs it today.", category: 'kindness' },
  { message: "Being gentle makes you strong.", category: 'kindness' },
  { message: "Smile at someone today.", category: 'kindness' },
  { message: "You make the world better by being kind.", category: 'kindness' },
  
  // Honesty
  { message: "Always tell the truth, even when it's hard.", category: 'honesty' },
  { message: "Honest words build trust with friends and family.", category: 'honesty' },
  { message: "Don't take what isn't yours.", category: 'honesty' },
  { message: "Being honest makes you someone others can count on.", category: 'honesty' },
  { message: "Your word is your promise.", category: 'honesty' },
  { message: "Telling the truth feels good.", category: 'honesty' },
  
  // Family
  { message: "Be a good helper to your family today.", category: 'family' },
  { message: "Listen to your parents, they love you.", category: 'family' },
  { message: "Your family believes in you.", category: 'family' },
  { message: "Give your family a hug today.", category: 'family' },
  { message: "Be patient with your brothers and sisters.", category: 'family' },
  { message: "You are loved.", category: 'family' },
  { message: "Your family is proud of you.", category: 'family' },
  
  // Friendship
  { message: "Be a good friend to others.", category: 'friendship' },
  { message: "Include someone new in your games today.", category: 'friendship' },
  { message: "Friends share and take turns.", category: 'friendship' },
  { message: "Stand up for your friends.", category: 'friendship' },
  { message: "Forgive your friends when they make mistakes.", category: 'friendship' },
  { message: "A good friend listens.", category: 'friendship' },
  
  // Courage
  { message: "You can do hard things.", category: 'courage' },
  { message: "It's okay to try new things.", category: 'courage' },
  { message: "Be brave, even when you feel scared.", category: 'courage' },
  { message: "Mistakes help you learn and grow.", category: 'courage' },
  { message: "Believe in yourself today.", category: 'courage' },
  { message: "You are stronger than you think.", category: 'courage' },
  
  // Gratitude
  { message: "Say thank you to someone who helps you.", category: 'gratitude' },
  { message: "Be thankful for your food and home.", category: 'gratitude' },
  { message: "Notice the good things in your day.", category: 'gratitude' },
  { message: "A thankful heart is a happy heart.", category: 'gratitude' },
  { message: "Thank your teachers for helping you learn.", category: 'gratitude' },
  { message: "Today is a good day.", category: 'gratitude' },
];

// Get a random kid-safe affirmation
export const getRandomKidAffirmation = (): KidAffirmation => {
  const index = Math.floor(Math.random() * KID_AFFIRMATIONS.length);
  return KID_AFFIRMATIONS[index];
};

// Get affirmation by category
export const getAffirmationByCategory = (category: KidAffirmation['category']): KidAffirmation => {
  const categoryAffirmations = KID_AFFIRMATIONS.filter(a => a.category === category);
  const index = Math.floor(Math.random() * categoryAffirmations.length);
  return categoryAffirmations[index];
};

// School day check
export const isSchoolDay = (): boolean => {
  const day = new Date().getDay();
  return day >= 1 && day <= 5; // Monday-Friday
};

// Get day name
export const getDayName = (): string => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
};

// Get time-appropriate greeting
export const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

// Build child greeting message
export const buildChildGreeting = (name: string, age?: number | null): string => {
  const timeGreeting = getTimeGreeting();
  const affirmation = getRandomKidAffirmation();
  const dayName = getDayName();
  
  let message = `${timeGreeting}, ${name}!`;
  
  if (isSchoolDay()) {
    message += ` Today is ${dayName}, a school day. Time to rise and shine!`;
  } else {
    message += ` Today is ${dayName}. No school today!`;
  }
  
  // Add encouraging prompt
  if (isSchoolDay()) {
    message += ` Help your family get ready for the day.`;
  }
  
  // Add affirmation
  message += ` ${affirmation.message}`;
  
  return message;
};

// Build gentle wake-up sequence for children
export const buildChildWakeUpSequence = (name: string): string[] => {
  const affirmation = getRandomKidAffirmation();
  const dayName = getDayName();
  
  return [
    `${getTimeGreeting()}, ${name}!`,
    isSchoolDay() 
      ? `Today is ${dayName}, a school day.` 
      : `Today is ${dayName}. No school today!`,
    isSchoolDay() 
      ? `Time to get up and help your family get ready.` 
      : `Enjoy your day!`,
    affirmation.message
  ];
};
