import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Music, 
  BookOpen, 
  ShoppingBag, 
  ChevronRight,
  Volume2,
  Loader2
} from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import { AGE_GROUP_GREETINGS } from '@/lib/types';
import { ClockDisplay } from '@/components/ClockDisplay';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';
import prophetGadModern from '@/assets/prophet-gad-modern.png';

// Get time-appropriate greeting
const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

// Check if today is a school day (Monday-Friday)
const isSchoolDay = (): boolean => {
  const day = new Date().getDay();
  return day >= 1 && day <= 5;
};

// Get day name
const getDayName = (): string => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
};

// Age-appropriate affirmations
const getAffirmation = (ageGroup?: string): string => {
  const affirmations: Record<string, string[]> = {
    child: [
      "The Lord loves you and watches over you!",
      "You are fearfully and wonderfully made!",
      "God has big plans for you today!",
      "You are a blessing to your family!"
    ],
    teen: [
      "The Lord is your strength and shield.",
      "You are chosen for a purpose.",
      "Walk in faith, not in fear.",
      "Your voice matters to the Most High."
    ],
    youngAdult: [
      "Trust in the Lord with all your heart.",
      "Your path is being prepared before you.",
      "You are equipped for every good work.",
      "The Lord goes before you today."
    ],
    parent: [
      "You are raising up the next generation in truth.",
      "The Lord honors your faithfulness.",
      "Your household is blessed.",
      "Strength and honor are your clothing."
    ],
    adult: [
      "The Lord is your refuge and fortress.",
      "You are walking in divine purpose.",
      "His mercies are new this morning.",
      "You are more than a conqueror."
    ],
    elder: [
      "Your wisdom is a treasure to many.",
      "The Lord crowns you with loving kindness.",
      "Your years of faithfulness bear fruit.",
      "You are honored among the people."
    ]
  };
  
  const group = ageGroup || 'adult';
  const list = affirmations[group] || affirmations.adult;
  return list[Math.floor(Math.random() * list.length)];
};

interface PreLandingProps {
  onEnterApp: () => void;
  onLearnMore: () => void;
}

export const PreLanding = ({ onEnterApp, onLearnMore }: PreLandingProps) => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { speak, stop, isSpeaking, isLoading } = useElevenLabsTTS();
  
  const [affirmation] = useState(() => getAffirmation(profile?.ageGroup));
  const hasPlayedGreetingRef = useRef(false);
  
  // Build personalized greeting message
  const buildGreetingMessage = (): string => {
    const timeGreeting = getTimeGreeting();
    const name = profile?.name || 'friend';
    const ageTitle = profile?.ageGroup ? AGE_GROUP_GREETINGS[profile.ageGroup] : '';
    
    let message = `${timeGreeting}, ${name}.`;
    
    // Add school day message for children
    if (profile?.ageGroup === 'child' && isSchoolDay()) {
      message += ` Today is ${getDayName()}, a school day. Time to rise and shine!`;
    } else if (profile?.ageGroup === 'child') {
      message += ` Today is ${getDayName()}. No school today!`;
    }
    
    // Add affirmation
    message += ` ${affirmation}`;
    
    return message;
  };
  
  // Auto-play personalized greeting on first interaction
  useEffect(() => {
    if (!profile) return; // Only for logged-in users
    
    const playGreetingOnce = () => {
      if (!hasPlayedGreetingRef.current && !isSpeaking && !isLoading) {
        hasPlayedGreetingRef.current = true;
        speak(buildGreetingMessage());
      }
    };
    
    document.addEventListener('click', playGreetingOnce, { once: true });
    document.addEventListener('touchstart', playGreetingOnce, { once: true });
    
    return () => {
      document.removeEventListener('click', playGreetingOnce);
      document.removeEventListener('touchstart', playGreetingOnce);
    };
  }, [profile, speak, isSpeaking, isLoading]);
  
  const toggleGreeting = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(buildGreetingMessage());
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${goldenGateBackground})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col p-4 sm:p-6">
        {/* Header with Clock */}
        <header className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <img 
              src={prophetGadModern} 
              alt="Prophet Gad" 
              className="w-12 h-12 rounded-full border-2 border-accent object-cover"
            />
            <div>
              <h1 className="text-lg font-bold text-white">Prophet Gad</h1>
              <p className="text-xs text-white/70">Family Counseling Hub</p>
            </div>
          </div>
          
          {/* Subtle Clock Display */}
          <div className="text-right">
            <ClockDisplay />
          </div>
        </header>
        
        {/* Main Greeting Card */}
        <main className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
          <div 
            className="w-full p-6 rounded-2xl border-2 border-accent/50 text-center mb-6"
            style={{
              background: 'rgba(88, 28, 135, 0.85)',
              backdropFilter: 'blur(12px)'
            }}
          >
            {/* Personalized Greeting */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {getTimeGreeting()}, {profile?.name || 'Friend'}!
            </h2>
            
            {/* School Day Indicator (for children) */}
            {profile?.ageGroup === 'child' && (
              <p className="text-sm text-accent mb-2">
                {isSchoolDay() 
                  ? `📚 Today is ${getDayName()} — a school day!` 
                  : `🎉 Today is ${getDayName()} — no school!`
                }
              </p>
            )}
            
            {/* Affirmation */}
            <p className="text-lg text-white/90 italic mb-4">
              "{affirmation}"
            </p>
            
            {/* Hear Greeting Button */}
            <button
              onClick={toggleGreeting}
              disabled={isLoading}
              className="px-4 py-2 rounded-full bg-accent/80 hover:bg-accent border border-white/30 text-white text-sm font-medium flex items-center gap-2 mx-auto transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              {isLoading ? "Loading..." : isSpeaking ? "Stop" : "Hear Your Greeting"}
            </button>
          </div>
          
          {/* Action Buttons Grid */}
          <div className="w-full grid grid-cols-2 gap-3 mb-6">
            {/* Counseling Hub */}
            <button
              onClick={() => navigate('/counsel')}
              className="p-4 rounded-xl border-2 border-accent/50 bg-primary/70 hover:bg-primary/80 backdrop-blur transition-all text-left group"
            >
              <MessageCircle className="w-8 h-8 text-accent mb-2" />
              <h3 className="text-primary-foreground font-bold text-sm">Counseling</h3>
              <p className="text-primary-foreground/60 text-xs">Ask Prophet Gad</p>
            </button>
            
            {/* Music Store */}
            <button
              onClick={() => navigate('/music-store')}
              className="p-4 rounded-xl border-2 border-accent/50 bg-primary/70 hover:bg-primary/80 backdrop-blur transition-all text-left group"
            >
              <Music className="w-8 h-8 text-accent mb-2" />
              <h3 className="text-primary-foreground font-bold text-sm">Music</h3>
              <p className="text-primary-foreground/60 text-xs">Prophet Gad Songs</p>
            </button>
            
            {/* Book Store */}
            <button
              onClick={() => navigate('/book-store')}
              className="p-4 rounded-xl border-2 border-accent/50 bg-primary/70 hover:bg-primary/80 backdrop-blur transition-all text-left group"
            >
              <BookOpen className="w-8 h-8 text-accent mb-2" />
              <h3 className="text-primary-foreground font-bold text-sm">Books</h3>
              <p className="text-primary-foreground/60 text-xs">Wisdom & Teachings</p>
            </button>
            
            {/* Merchandise Store */}
            <button
              onClick={() => navigate('/store')}
              className="p-4 rounded-xl border-2 border-accent/50 bg-primary/70 hover:bg-primary/80 backdrop-blur transition-all text-left group"
            >
              <ShoppingBag className="w-8 h-8 text-accent mb-2" />
              <h3 className="text-primary-foreground font-bold text-sm">Store</h3>
              <p className="text-primary-foreground/60 text-xs">Merchandise</p>
            </button>
          </div>
          
          {/* Learn More Link */}
          <button
            onClick={onLearnMore}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
          >
            Learn more about Prophet Gad's Mission
            <ChevronRight className="w-4 h-4" />
          </button>
        </main>
        
        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-xs text-white/50">Remnant Seed © 2026</p>
        </footer>
      </div>
    </div>
  );
};

export default PreLanding;
