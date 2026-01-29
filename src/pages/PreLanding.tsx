import { useState, useRef, useEffect } from 'react';
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
  Settings,
  Play,
  Pause,
  SkipForward,
  Square
} from 'lucide-react';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import { ClockDisplay } from '@/components/ClockDisplay';
import { getRandomKidAffirmation, isSchoolDay, getDayName, getTimeGreeting } from '@/lib/kidSafeContent';
import { Profile, ChildProfile } from '@/hooks/useAuth';
import { getEnabledTracks } from '@/components/MusicManager';
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

// Mini Music Player Component
const MiniMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTrackName, setCurrentTrackName] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playlist, setPlaylist] = useState<string[]>([]);

  useEffect(() => {
    const tracks = getEnabledTracks();
    // Shuffle but keep first track as Thunder Road Gospel if available
    const thunderIndex = tracks.findIndex(t => t.includes('thunder-road'));
    let shuffled: string[];
    if (thunderIndex >= 0) {
      const thunder = tracks.splice(thunderIndex, 1)[0];
      shuffled = [thunder, ...tracks.sort(() => Math.random() - 0.5)];
    } else {
      shuffled = tracks.sort(() => Math.random() - 0.5);
    }
    setPlaylist(shuffled);
  }, []);

  useEffect(() => {
    if (playlist.length > 0) {
      const name = playlist[currentTrackIndex]
        ?.split('/').pop()
        ?.replace('.mp3', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()) || '';
      setCurrentTrackName(name);
    }
  }, [currentTrackIndex, playlist]);

  const togglePlay = () => {
    if (!audioRef.current || playlist.length === 0) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.src = playlist[currentTrackIndex];
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTrack = () => {
    if (playlist.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    if (audioRef.current && isPlaying) {
      audioRef.current.src = playlist[nextIndex];
      audioRef.current.play();
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const handleTrackEnd = () => {
    skipTrack();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <audio ref={audioRef} onEnded={handleTrackEnd} />
      
      {currentTrackName && isPlaying && (
        <p className="text-xs text-accent font-medium">♪ {currentTrackName}</p>
      )}
      
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-accent/80 hover:bg-accent text-white transition-colors"
          title={isPlaying ? 'Pause' : 'Play Music'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        
        <button
          onClick={skipTrack}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Next Track"
        >
          <SkipForward className="w-4 h-4" />
        </button>
        
        {isPlaying && (
          <button
            onClick={stopMusic}
            className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
            title="Stop"
          >
            <Square className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
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

  // Check if user is signed in
  const isSignedIn = !!profile;

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
        {/* Top Header - Prophet Gad Family Counseling Hub */}
        <header className="text-center mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-accent drop-shadow-lg">
            Prophet Gad Family Counseling Hub
          </h1>
          <p className="text-xs text-white/70">Wisdom • Guidance • Community</p>
        </header>

        {/* Secondary Header - Clock & Actions */}
        <div className="flex justify-between items-center mb-2">
          <ClockDisplay />
          <div className="flex items-center gap-2">
            {isSignedIn && canManageChildren && (
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
            {isSignedIn && (
              <button
                onClick={onLogout}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Personalized Greeting or Sign Up CTA */}
        <div className="text-center mb-2">
          {isSignedIn ? (
            <p className="text-white/80 text-sm">
              {getTimeGreeting()}, {profile?.name || 'Friend'}
            </p>
          ) : (
            <div className="bg-primary/60 backdrop-blur-sm rounded-lg px-4 py-2 inline-block border border-accent/30">
              <p className="text-white text-sm mb-1">Sign up for personalized greetings from the Prophet</p>
              <button
                onClick={() => navigate('/')}
                className="text-accent text-xs font-medium hover:underline"
              >
                Create your profile →
              </button>
            </div>
          )}
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
            </div>
            
            {/* Spoke Buttons - Rearranged */}
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
              icon={<ShoppingBag className="w-5 h-5" />}
              label="Store"
              sublabel="Merchandise"
              onClick={() => navigate('/store')}
              position="bottom"
            />
            
            <SpokeButton
              icon={<BookOpen className="w-5 h-5" />}
              label="Books"
              sublabel="Wisdom"
              onClick={() => navigate('/book-store')}
              position="left"
            />
          </div>
        </main>

        {/* Bottom Section - Spread Out */}
        <div className="space-y-4 py-4">
          {/* Mini Music Player */}
          <div className="flex justify-center">
            <MiniMusicPlayer />
          </div>

          {/* Morning Greeting Section */}
          {isSignedIn && (
            <div className="text-center">
              <p className="text-white/70 text-xs italic mb-2 max-w-xs mx-auto">
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
                {isLoading ? "Loading..." : isSpeaking ? "Stop" : "Hear Morning Greeting"}
              </button>
            </div>
          )}
          
          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-white/50">
            <button
              onClick={onLearnMore}
              className="hover:text-white/80 transition-colors"
            >
              About Prophet Gad
            </button>
            <span>•</span>
            <button
              onClick={() => navigate('/settings')}
              className="hover:text-white/80 transition-colors"
            >
              Set Alarm Time
            </button>
            <span>•</span>
            <button
              onClick={() => navigate('/music-settings')}
              className="hover:text-white/80 transition-colors"
            >
              Manage Music
            </button>
          </div>
          
          <p className="text-center text-xs text-white/30">Remnant Seed © 2026</p>
        </div>
      </div>
    </div>
  );
};

export default PreLanding;
