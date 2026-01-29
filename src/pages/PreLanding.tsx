import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Music, 
  BookOpen, 
  ShoppingBag, 
  Volume2,
  Loader2,
  Users,
  LogOut,
  Settings
} from 'lucide-react';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
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

// Spoke button component for the wheel layout
interface SpokeButtonProps {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  onClick: () => void;
  position: 'top' | 'right' | 'bottom' | 'left';
}

const SpokeButton = ({ icon, label, sublabel, onClick, position }: SpokeButtonProps) => {
  // Position styles for each spoke
  const positionStyles: Record<string, string> = {
    top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
    right: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
    left: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <button
      onClick={onClick}
      className={`absolute ${positionStyles[position]} z-20 group`}
    >
      <div 
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-accent/60 bg-primary/80 backdrop-blur-md flex flex-col items-center justify-center transition-all hover:scale-110 hover:border-accent hover:bg-primary/90 shadow-lg shadow-black/30"
      >
        <div className="text-accent mb-0.5">
          {icon}
        </div>
        <span className="text-primary-foreground font-bold text-xs">{label}</span>
        <span className="text-primary-foreground/60 text-[10px]">{sublabel}</span>
      </div>
    </button>
  );
};

export const PreLanding = ({ 
  profile, 
  children = [],
  onLearnMore, 
  onManageChildren,
  onLogout 
}: PreLandingProps) => {
  const navigate = useNavigate();
  const { speak, stop, isSpeaking, isLoading } = useElevenLabsTTS();
  
  const [affirmation] = useState(() => {
    if (profile?.age_group === 'child') {
      return getRandomKidAffirmation().message;
    }
    return getAdultAffirmation(profile?.age_group);
  });
  
  const buildGreetingMessage = (): string => {
    const timeGreeting = getTimeGreeting();
    const name = profile?.name || 'friend';
    
    let message = `${timeGreeting}, ${name}.`;
    
    if (profile?.age_group === 'child' && isSchoolDay()) {
      message += ` Today is ${getDayName()}, a school day. Time to rise and shine!`;
    } else if (profile?.age_group === 'child') {
      message += ` Today is ${getDayName()}. No school today!`;
    }
    
    message += ` ${affirmation}`;
    return message;
  };
  
  const toggleGreeting = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(buildGreetingMessage());
    }
  };

  const canManageChildren = profile?.age_group === 'parent' || profile?.age_group === 'adult';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${goldenGateBackground})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col p-4">
        {/* Compact Header */}
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <ClockDisplay />
          </div>
          <div className="flex items-center gap-2">
            {canManageChildren && (
              <button
                onClick={onManageChildren}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Manage Children"
              >
                <Users className="w-4 h-4" />
              </button>
            )}
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

        {/* Minimized Greeting */}
        <div className="text-center mb-2">
          <p className="text-white/80 text-sm">
            {getTimeGreeting()}, {profile?.name || 'Friend'}
          </p>
        </div>
        
        {/* Main Hub - The Wheel */}
        <main className="flex-1 flex items-center justify-center">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
            {/* Connecting Lines (decorative spokes) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              <div className="absolute w-0.5 h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
            </div>

            {/* Center Hub - Prophet Gad */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full border-4 border-accent overflow-hidden shadow-2xl shadow-accent/20"
                style={{
                  background: 'rgba(88, 28, 135, 0.9)',
                }}
              >
                <img 
                  src={prophetGadModern} 
                  alt="Prophet Gad" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Inner ring label */}
              <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
                <div className="bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full border border-accent/50">
                  <p className="text-xs text-accent font-semibold">Family Counseling Hub</p>
                </div>
              </div>
            </div>
            
            {/* Spoke Buttons */}
            <SpokeButton
              icon={<MessageCircle className="w-5 h-5" />}
              label="Counseling"
              sublabel="Ask Prophet Gad"
              onClick={() => navigate('/counsel')}
              position="top"
            />
            
            <SpokeButton
              icon={<Music className="w-5 h-5" />}
              label="Music"
              sublabel="Songs & Hymns"
              onClick={() => navigate('/music-store')}
              position="right"
            />
            
            <SpokeButton
              icon={<BookOpen className="w-5 h-5" />}
              label="Books"
              sublabel="Wisdom"
              onClick={() => navigate('/book-store')}
              position="bottom"
            />
            
            <SpokeButton
              icon={<ShoppingBag className="w-5 h-5" />}
              label="Store"
              sublabel="Merchandise"
              onClick={() => navigate('/store')}
              position="left"
            />
          </div>
        </main>

        {/* Hear Greeting Button & Affirmation */}
        <div className="text-center py-4">
          <p className="text-white/70 text-xs italic mb-3 max-w-xs mx-auto">
            "{affirmation}"
          </p>
          <button
            onClick={toggleGreeting}
            disabled={isLoading}
            className="px-4 py-2 rounded-full bg-accent/80 hover:bg-accent border border-white/30 text-white text-xs font-medium inline-flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Volume2 className="w-3 h-3" />
            )}
            {isLoading ? "Loading..." : isSpeaking ? "Stop" : "Hear Greeting"}
          </button>
        </div>
        
        {/* Footer */}
        <footer className="text-center pb-2">
          <button
            onClick={onLearnMore}
            className="text-white/50 hover:text-white/80 text-xs transition-colors"
          >
            Learn about Prophet Gad's Mission →
          </button>
          <p className="text-xs text-white/30 mt-1">Remnant Seed © 2026</p>
        </footer>
      </div>
    </div>
  );
};

export default PreLanding;
