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

    // This is exactly what displays AND what gets read aloud
    const greetingMessage = "May the Most High guide your steps today.";
    const fullGreeting = `Good morning, ${firstName}. ${greetingMessage}`;

    useEffect(() => {
      if (profile.audioEnabled && !hasSpoken) {
        setHasSpoken(true);
        speak(fullGreeting);
      }
    }, [profile.audioEnabled, hasSpoken, speak, fullGreeting]);

    const handleToggleAudio = () => {
      if (isSpeaking) {
        stop();
      } else {
        speak(fullGreeting);
      }
    };

    return (
      <div ref={ref} className="w-full max-w-md mx-auto px-4">
        {/* Greeting Card - Compact with solid background */}
        <div className="bg-purple-900/80 backdrop-blur-md rounded-xl shadow-lg p-4 mb-3 border-2 border-yellow-500/60">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl text-white font-bold">
                Good morning, {firstName}!
              </h1>
              <p className="text-white/90 text-sm mt-1">
                {greetingMessage}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleAudio}
              disabled={isLoading}
              className="text-yellow-400 hover:bg-white/10 ml-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isSpeaking ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Daily Verse - Compact */}
        <div className="bg-purple-900/80 backdrop-blur-md rounded-xl p-4 border-2 border-yellow-500/60">
          <p className="text-xs text-yellow-400 font-semibold uppercase tracking-wide mb-2">
            Today's Memory Verse
          </p>
          <p className="text-base font-bold text-white leading-relaxed mb-2">
            "{verse.text}"
          </p>
          <p className="text-right text-yellow-300 font-bold text-xs mb-3">
            — {verse.reference} (KJV)
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={() => speak(verse.text)}
              variant="outline"
              size="sm"
              disabled={isLoading || isSpeaking}
              className="flex-1 gap-1 border-yellow-500/50 text-yellow-300 bg-transparent hover:bg-white/10 text-xs"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
              Read Aloud
            </Button>
            <Button
              onClick={onComplete}
              size="sm"
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-purple-900 font-bold text-xs"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

MorningGreeting.displayName = 'MorningGreeting';
