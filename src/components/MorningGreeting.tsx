import { forwardRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile, DailyVerse } from '@/lib/types';
import { DAILY_VERSES } from '@/lib/data';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';

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

export const MorningGreeting = forwardRef<HTMLDivElement, MorningGreetingProps>(
  ({ profile, onComplete }, ref) => {
    const { speak, stop, isSpeaking, isLoading } = useElevenLabsTTS();
    const [verse] = useState(() => getDailyVerse(profile));
    const [hasSpoken, setHasSpoken] = useState(false);

    // Extract first name only for personalized greeting
    const firstName = profile.name.split(' ')[0];
    
    const dayName = getDayName();
    const formattedDate = getFormattedDate();
    const weekend = isWeekend();

    const greetingText = `Good morning, ${firstName}! Today is ${dayName}, ${formattedDate}. ${
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
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-4 border border-purple-300/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-800 text-sm uppercase tracking-wide font-medium">
                {dayName}
              </p>
              <p className="text-purple-700/70 text-sm">{formattedDate}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleAudio}
              disabled={isLoading}
              className="text-purple-700 hover:bg-purple-500/20"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isSpeaking ? (
                <Volume2 className="w-6 h-6" />
              ) : (
                <VolumeX className="w-6 h-6" />
              )}
            </Button>
          </div>

          <h1 className="text-2xl md:text-3xl text-purple-900 font-bold mb-2">
            Good morning, {firstName}!
          </h1>
          <p className="text-purple-800/80">
            {weekend
              ? "It's the weekend — a time for rest, family, and reflection."
              : "May the Most High guide your steps today."}
          </p>
        </div>

        {/* Daily Verse */}
        <div className="bg-purple-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
          <p className="text-sm text-purple-900 font-semibold uppercase tracking-wide mb-4">
            Today's Memory Verse
          </p>
          <p className="text-xl font-bold text-purple-900 leading-relaxed mb-4">
            "{verse.text}"
          </p>
          <p className="text-right text-purple-800 font-bold text-sm">
            — {verse.reference} (KJV)
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => speak(verse.text)}
              variant="outline"
              disabled={isLoading || isSpeaking}
              className="flex-1 gap-2 border-purple-400/50 text-purple-900 hover:bg-purple-500/20"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              Read Aloud
            </Button>
            <Button
              onClick={onComplete}
              className="flex-1 bg-purple-700 hover:bg-purple-800 text-white"
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
