import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/AppHeader';
import { UserProfile, DailyVerse } from '@/lib/types';
import { DAILY_VERSES } from '@/lib/data';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import templeBackground from '@/assets/temple-background.jpg';

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
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.9)), url(${templeBackground})` 
      }}
    >
      <AppHeader userName={firstName} onLogout={onLogout} showLogout />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-pillar-spirit/10 p-4 rounded-2xl mb-4">
            <Sparkles className="w-12 h-12 text-pillar-spirit" />
          </div>
          <h1 className="text-3xl text-primary font-bold mb-2">SPIRIT PILLAR</h1>
          <p className="text-muted-foreground">Daily Devotional</p>
        </div>

        {/* Verse Card */}
        <div className="bg-card rounded-3xl shadow-lg border border-border p-8 mb-6 gold-border-frame">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-accent font-semibold uppercase tracking-wide">
              Today's Verse
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReadAloud}
              disabled={isLoading || isSpeaking}
              className="gap-2 text-accent hover:bg-accent/10"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              Read Aloud
            </Button>
          </div>

          <blockquote className="verse-display text-primary mb-6">
            "{verse.text}"
          </blockquote>
          <p className="text-right text-muted-foreground font-bold">
            — {verse.reference} (KJV)
          </p>
        </div>

        {/* Counsel */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 mb-6 border border-primary/10 gold-border-frame">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">PGAI Counsel</span>
          </div>
          <p className="text-foreground/80 leading-relaxed">{counsel}</p>
        </div>

        {/* Memorize Section */}
        {!showMemorize ? (
          <Button
            onClick={() => setShowMemorize(true)}
            className="w-full h-14 text-lg bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          >
            Try to Memorize
          </Button>
        ) : (
          <div className="bg-success/10 rounded-2xl p-6 border border-success/20">
            <h3 className="text-xl text-success font-bold mb-3">Great Choice!</h3>
            <p className="text-foreground/80 mb-4">
              Memorizing Scripture strengthens your spirit. Try reading it 3 times, then close your eyes and recite it.
            </p>
            <p className="text-sm text-muted-foreground">
              Tip: Break it into smaller parts and master each section before moving on.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SpiritPillar;