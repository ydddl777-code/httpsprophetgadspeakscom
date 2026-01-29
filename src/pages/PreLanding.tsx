import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Music, 
  BookOpen, 
  ShoppingBag, 
  ChevronRight,
  Volume2,
  Loader2,
  Users,
  LogOut,
  Settings
} from 'lucide-react';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
// AGE_GROUP_GREETINGS not currently used
import { ClockDisplay } from '@/components/ClockDisplay';
import { getRandomKidAffirmation, isSchoolDay, getDayName, getTimeGreeting } from '@/lib/kidSafeContent';
import { Profile, ChildProfile } from '@/hooks/useAuth';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';
import prophetGadModern from '@/assets/prophet-gad-modern.png';

// Age-appropriate affirmations for adults
const getAdultAffirmation = (ageGroup?: string): string => {
  const affirmations: Record<string, string[]> = {
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
  profile: Profile | null;
  children?: ChildProfile[];
  onLearnMore: () => void;
  onManageChildren: () => void;
  onLogout: () => void;
}

export const PreLanding = ({ 
  profile, 
  children = [],
  onLearnMore, 
  onManageChildren,
  onLogout 
}: PreLandingProps) => {
  const navigate = useNavigate();
  const { speak, stop, isSpeaking, isLoading } = useElevenLabsTTS();
  
  // Use kid-safe affirmations for children, adult affirmations for others
  const [affirmation] = useState(() => {
    if (profile?.age_group === 'child') {
      return getRandomKidAffirmation().message;
    }
    return getAdultAffirmation(profile?.age_group);
  });
  
  
  // Build personalized greeting message
  const buildGreetingMessage = (): string => {
    const timeGreeting = getTimeGreeting();
    const name = profile?.name || 'friend';
    
    let message = `${timeGreeting}, ${name}.`;
    
    // Add school day message for children
    if (profile?.age_group === 'child' && isSchoolDay()) {
      message += ` Today is ${getDayName()}, a school day. Time to rise and shine! Help your family get ready for the day.`;
    } else if (profile?.age_group === 'child') {
      message += ` Today is ${getDayName()}. No school today! Enjoy your day.`;
    }
    
    // Add affirmation
    message += ` ${affirmation}`;
    
    return message;
  };
  
  // Manual greeting toggle only - no auto-play
  const toggleGreeting = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(buildGreetingMessage());
    }
  };

  // Check if this is a parent who can manage children
  const canManageChildren = profile?.age_group === 'parent' || profile?.age_group === 'adult';

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
          
          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <ClockDisplay />
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
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
            {profile?.age_group === 'child' && (
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

          {/* Parent Controls - Manage Children */}
          {canManageChildren && (
            <button
              onClick={onManageChildren}
              className="w-full max-w-md mb-4 p-4 rounded-xl border-2 border-accent/50 bg-primary/50 hover:bg-primary/70 backdrop-blur transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-accent" />
                <div className="text-left">
                  <h3 className="text-primary-foreground font-bold text-sm">Manage Children</h3>
                  <p className="text-primary-foreground/60 text-xs">
                    {children.length === 0 
                      ? "Add child profiles" 
                      : `${children.length} child${children.length > 1 ? 'ren' : ''} registered`
                    }
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-primary-foreground/60" />
            </button>
          )}
          
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
