import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/AppHeader';
import { UserProfile, DailyVerse } from '@/lib/types';
import { DAILY_VERSES } from '@/lib/data';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

interface SpiritPillarProps {
  profile: UserProfile;
  onLogout: () => void;
}

const getDailyVerse = (profile: UserProfile): DailyVerse => {
  const verses = DAILY_VERSES[profile.ageGroup];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return verses[dayOfYear % verses.length];
};

const getCounsel = (verse: DailyVerse, ageGroup: string): string => {
  const counsels: Record<string, string> = {
    'Ephesians 6:1': 'Honor and obedience to parents brings blessings. When you listen to your parents, you are also listening to the Most High.',
    'Proverbs 20:11': 'Your actions speak louder than words. Let your deeds show that you walk in righteousness.',
    'Psalm 119:9': 'Keep your path pure by following the Word. Let Scripture guide every decision you make.',
    'Proverbs 22:6': 'Train children in the ways of the Most High, and they will carry this wisdom throughout their lives.',
    'Ecclesiastes 12:1': 'Youth is the best time to build a relationship with your Creator. Do not wait until old age.',
    '1 Timothy 4:12': 'Your youth is not a weakness. Be an example to others in faith, love, and purity.',
    'Proverbs 3:5-6': 'Trust completely in the Most High. Your own understanding is limited, but His wisdom is infinite.',
    'Deuteronomy 6:7': 'Teach your children diligently. Every moment is an opportunity for instruction.',
    'Proverbs 22:7': 'Debt brings bondage. Be wise with your finances and avoid unnecessary borrowing.',
    'Proverbs 31:27': 'A righteous household requires diligence. Watch over your home with care.',
    'Psalm 92:14': 'Age does not diminish your purpose. Continue to bear fruit and bring glory to the Most High.',
    'Proverbs 16:31': 'Gray hair is a crown of glory when found in righteousness. Age brings wisdom.',
    'Titus 2:2': 'Elders are called to be examples of sobriety, patience, and sound faith.',
  };
  return counsels[verse.reference] || 'Let this word dwell in your heart today. Meditate on it and let it guide your actions.';
};

export const SpiritPillar = ({ profile, onLogout }: SpiritPillarProps) => {
  const navigate = useNavigate();
  const { speak, isSpeaking, isLoading } = useElevenLabsTTS();
  const [verse] = useState(() => getDailyVerse(profile));
  const [showMemorize, setShowMemorize] = useState(false);
  const counsel = getCounsel(verse, profile.ageGroup);
  const firstName = profile.name.split(' ')[0];

  const handleReadAloud = () => {
    speak(`${verse.reference}. ${verse.text}. ${counsel}`);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `url(${goldenGateBackground})` 
      }}
    >
      <AppHeader userName={firstName} onLogout={onLogout} showLogout />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 gap-2 text-purple-900 hover:text-purple-700 hover:bg-purple-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex bg-purple-600/20 backdrop-blur-sm p-3 rounded-xl mb-3">
            <Sparkles className="w-10 h-10 text-purple-800" />
          </div>
          <h1 className="text-2xl text-purple-900 font-bold mb-1">SPIRIT PILLAR</h1>
          <p className="text-purple-800/80 text-sm">Daily Devotional</p>
        </div>

        {/* Verse Card */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-300/30 p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-purple-900 font-semibold uppercase tracking-wide">
              Today's Memory Verse
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReadAloud}
              disabled={isLoading || isSpeaking}
              className="gap-2 text-purple-700 hover:bg-purple-500/20"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              Read Aloud
            </Button>
          </div>

          <blockquote className="text-xl font-bold text-purple-900 mb-4 leading-relaxed">
            "{verse.text}"
          </blockquote>
          <p className="text-right text-purple-800 font-bold text-sm">
            — {verse.reference} (KJV)
          </p>
        </div>

        {/* Counsel */}
        <div className="bg-purple-900/20 backdrop-blur-sm rounded-xl p-4 mb-4 border border-purple-400/30">
          <p className="font-semibold text-purple-900 mb-2 text-sm">Prophet Gad Says:</p>
          <p className="text-purple-900/90 leading-relaxed text-sm">{counsel}</p>
        </div>

        {/* Memorize Section */}
        {!showMemorize ? (
          <Button
            onClick={() => setShowMemorize(true)}
            className="w-full h-12 text-base bg-purple-700 hover:bg-purple-800 text-white gap-2 shadow-lg"
          >
            Try to Memorize
          </Button>
        ) : (
          <div className="bg-purple-100/30 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
            <h3 className="text-lg text-purple-900 font-bold mb-2">Great Choice!</h3>
            <p className="text-purple-900/80 mb-3 text-sm">
              Memorizing Scripture strengthens your spirit. Try reading it 3 times, then close your eyes and recite it.
            </p>
            <p className="text-xs text-purple-800/70">
              Tip: Break it into smaller parts and master each section before moving on.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SpiritPillar;