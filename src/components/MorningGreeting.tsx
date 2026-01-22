import { forwardRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile, AGE_GROUP_GREETINGS, DailyVerse } from '@/lib/types';
import { DAILY_VERSES } from '@/lib/data';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface MorningGreetingProps {
  profile: UserProfile;
  onComplete?: () => void;
}

const getDayName = (): string => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
};

const getFormattedDate = (): string => {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const isWeekend = (): boolean => {
  const day = new Date().getDay();
  return day === 0 || day === 6;
};

const getDailyVerse = (profile: UserProfile): DailyVerse => {
  const verses = DAILY_VERSES[profile.ageGroup];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return verses[dayOfYear % verses.length];
};

// English greetings based on age group
const getEnglishGreeting = (ageGroup: string): string => {
  switch (ageGroup) {
    case 'child': return 'little one';
    case 'teen': return 'young one';
    case 'parent': return 'friend';
    case 'elder': return 'elder';
    default: return 'friend';
  }
};

export const MorningGreeting = forwardRef<HTMLDivElement, MorningGreetingProps>(
  ({ profile, onComplete }, ref) => {
    const { speak, stop, isSpeaking } = useTextToSpeech();
    const [verse] = useState(() => getDailyVerse(profile));
    const [hasSpoken, setHasSpoken] = useState(false);

    const greeting = getEnglishGreeting(profile.ageGroup);
    const dayName = getDayName();
    const formattedDate = getFormattedDate();
    const weekend = isWeekend();

    const greetingText = `Good morning, ${profile.name}! Today is ${dayName}, ${formattedDate}. ${
      weekend ? "It's the weekend, a time for rest and family." : "Have a blessed day."
    }`;

    const verseText = `Today's verse is from ${verse.reference}. ${verse.text}`;

    useEffect(() => {
      if (profile.audioEnabled && !hasSpoken) {
        setHasSpoken(true);
        speak(greetingText, () => {
          speak(verseText);
        });
      }
    }, [profile.audioEnabled, hasSpoken, speak, greetingText, verseText]);

    const handleToggleAudio = () => {
      if (isSpeaking) {
        stop();
      } else {
        speak(`${greetingText} ${verseText}`);
      }
    };

    return (
      <div ref={ref} className="w-full max-w-2xl mx-auto p-6">
        {/* Greeting Card */}
        <div className="bg-card rounded-3xl shadow-lg p-8 mb-6 border border-border gold-border-frame">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-muted-foreground text-sm uppercase tracking-wide">
                {dayName}
              </p>
              <p className="text-foreground/70 text-sm">{formattedDate}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleAudio}
              className="text-accent hover:bg-accent/10"
            >
              {isSpeaking ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </Button>
          </div>

          <h1 className="text-2xl md:text-3xl text-primary font-bold mb-2">
            Good morning, {greeting} {profile.name}!
          </h1>
          <p className="text-muted-foreground">
            {weekend
              ? "It's the weekend — a time for rest, family, and reflection."
              : "May the Most High guide your steps today."}
          </p>
        </div>

        {/* Daily Verse */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent rounded-3xl p-8 border border-primary/10 gold-border-frame">
          <p className="text-sm text-accent font-semibold uppercase tracking-wide mb-4">
            Today's Verse
          </p>
          <p className="verse-display text-primary leading-relaxed">
            "{verse.text}"
          </p>
          <p className="text-right text-muted-foreground font-bold mt-4">
            — {verse.reference}
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => speak(verse.text)}
              variant="outline"
              className="flex-1 gap-2 border-accent text-accent hover:bg-accent/10"
            >
              <Volume2 className="w-4 h-4" />
              Read Aloud
            </Button>
            <Button
              onClick={onComplete}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continue to Pillars
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

MorningGreeting.displayName = 'MorningGreeting';