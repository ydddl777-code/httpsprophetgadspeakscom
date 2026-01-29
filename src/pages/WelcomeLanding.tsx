import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Volume2, Loader2, SkipForward } from 'lucide-react';
import { LandingHeader } from '@/components/LandingHeader';
import { TribalBanners } from '@/components/TribalBanners';
import { getEnabledTracks } from '@/components/MusicManager';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import { useSanctuaryAmbienceContext } from '@/contexts/SanctuaryAmbienceContext';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';
import prophetGadTribal from '@/assets/prophet-gad.png';
import prophetGadModern from '@/assets/prophet-gad-modern.png';

interface WelcomeLandingProps {
  onEnterApp: () => void;
  onViewBeliefs: () => void;
}

// Shuffle array helper - keeps first track in place, shuffles the rest
const shuffleArrayKeepFirst = <T,>(array: T[]): T[] => {
  if (array.length <= 1) return [...array];
  const [first, ...rest] = array;
  const shuffled = [...rest];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return [first, ...shuffled];
};

export const WelcomeLanding = ({ onEnterApp, onViewBeliefs }: WelcomeLandingProps) => {
  const navigate = useNavigate();
  const { speak, stop: stopTts, isSpeaking, isLoading } = useElevenLabsTTS();
  const { stop: stopSanctuaryAmbience } = useSanctuaryAmbienceContext();
  
  // Get enabled tracks from managed catalog
  const [playlist] = useState(() => shuffleArrayKeepFirst(getEnabledTracks()));
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Auto-play disabled
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get human-readable track name from path
  const getCurrentTrackName = (): string => {
    const path = playlist[currentTrackIndex] || '';
    const filename = path.split('/').pop() || 'Unknown';
    return filename
      .replace('.mp3', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // The welcome message Prophet Gad speaks
  const welcomeMessage = "Welcome, dear friend. Come sit at the table. Prophet Gad is here to guide with wisdom from the Scriptures.";

  // Play/pause welcome voice using TTS (manual only - no auto-play)
  const toggleWelcomeVoice = () => {
    if (isSpeaking) {
      stopTts();
    } else {
      speak(welcomeMessage);
    }
  };

  // Handle track end - move to next track
  const handleTrackEnd = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  // Skip to next track
  const skipToNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  // Play/pause control
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Stop music completely
  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Stop *all* audio sources (landing playlist + sanctuary ambience + TTS)
  const stopAllAudio = () => {
    stopMusic();
    stopSanctuaryAmbience();
    stopTts();
  };

  // Update volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Set initial volume and autoplay
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  // When track changes, play the new track
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked, user interaction required
      });
    }
  }, [currentTrackIndex]);

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${goldenGateBackground})` }}
      />
      
      {/* Dark Overlay for readability */}
      <div className="fixed inset-0 dark-overlay" />
      
      {/* Linen Texture Overlay */}
      <div className="fixed inset-0 linen-overlay pointer-events-none" />

      {/* Music Audio Element - No autoPlay */}
      <audio
        ref={audioRef}
        src={playlist[currentTrackIndex]}
        onEnded={handleTrackEnd}
      />
      

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Tribal Banners - positioned at extreme top left and right */}
        <div className="hidden lg:block fixed left-1 top-4 bottom-4 w-16 z-20">
          <TribalBanners side="left" />
        </div>
        <div className="hidden lg:block fixed right-1 top-4 bottom-4 w-16 z-20">
          <TribalBanners side="right" />
        </div>

        {/* Header - Indented to make room for tribes */}
        <header className="relative z-10 px-4 py-6 lg:mx-20">
          <LandingHeader onEnterApp={onEnterApp} />
        </header>

        {/* Main Content - Centered friendly greeting */}
        <main className="flex-1 flex flex-col items-center justify-center py-8 px-4 lg:px-24">
          {/* Friendly Welcome Card */}
          <div 
            className="w-full max-w-xl p-8 rounded-xl border-2 border-accent text-center"
            style={{
              background: 'rgba(88, 28, 135, 0.85)',
              backdropFilter: 'blur(8px)'
            }}
          >
            {/* Welcoming Message */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Welcome, Dear Friend
            </h2>
            
            <p className="text-lg text-white/90 mb-2 leading-relaxed">
              Come sit at the table. Prophet Gad is here to guide with wisdom from the Scriptures.
            </p>

            {/* Hear Prophet Gad Button */}
            <button
              onClick={toggleWelcomeVoice}
              disabled={isLoading}
              className="mb-4 px-4 py-2 rounded-full bg-accent/80 hover:bg-accent border-2 border-white/30 text-white font-bold flex items-center gap-2 mx-auto transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
              {isLoading ? "Loading..." : isSpeaking ? "Stop" : "Hear Prophet Gad"}
            </button>

            {/* Prophet Gad Images - Oval Tribal flanking Wide Modern */}
            <div className="my-4 flex items-center justify-center gap-4">
              {/* Left Tribal Image - Oval */}
              <img 
                src={prophetGadTribal} 
                alt="Prophet Gad Emblem" 
                className="w-20 h-24 md:w-24 md:h-28 rounded-full object-cover border-3 border-accent shadow-xl"
              />
              
              {/* Center Modern Image - 16:9 Wide to show background */}
              <img 
                src={prophetGadModern} 
                alt="Prophet Gad" 
                className="w-40 h-24 md:w-48 md:h-28 rounded-lg object-cover object-top border-4 border-accent shadow-lg"
              />
              
              {/* Right Tribal Image - Oval */}
              <img 
                src={prophetGadTribal} 
                alt="Prophet Gad Emblem" 
                className="w-20 h-24 md:w-24 md:h-28 rounded-full object-cover border-3 border-accent shadow-xl"
              />
            </div>
            
            {/* Compact Music Player with Controls */}
            <div className="my-4 flex flex-col items-center gap-3">
              {/* Song name display */}
              <div className="text-center">
                <p className="text-sm font-semibold text-white">
                  🎵 {getCurrentTrackName()}
                </p>
                <p className="text-xs text-white/60">
                  Track {currentTrackIndex + 1} of {playlist.length}
                </p>
              </div>
              
              {/* Controls Row */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-accent hover:bg-accent/80 border-2 border-white/30 shadow flex items-center justify-center transition-all"
                  title={isPlaying ? "Pause" : "Play"}
                  aria-label={isPlaying ? "Pause Music" : "Play Music"}
                >
                  <span className="text-white text-lg font-bold">
                    {isPlaying ? "❚❚" : "▶"}
                  </span>
                </button>

                {/* Skip/Next Track Button */}
                <button
                  onClick={skipToNextTrack}
                  className="w-10 h-10 rounded-full bg-accent/60 hover:bg-accent border-2 border-white/30 shadow flex items-center justify-center transition-all"
                  title="Next Track"
                  aria-label="Skip to Next Track"
                >
                  <SkipForward className="w-5 h-5 text-white" />
                </button>

                {/* Volume Slider */}
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                  <span className="text-white text-sm">🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-2 accent-accent cursor-pointer"
                    title={`Volume: ${Math.round(volume * 100)}%`}
                  />
                </div>

                {/* Big Red Stop Button */}
                <button
                  onClick={stopAllAudio}
                  className="w-12 h-12 rounded-full bg-destructive hover:bg-destructive/80 border-4 border-destructive/60 shadow-lg flex items-center justify-center transition-all"
                  title="Stop All Audio"
                  aria-label="Stop All Audio"
                >
                  <span className="text-white text-xl font-bold">■</span>
                </button>

                {/* Music Catalog Button - More Visible */}
                <button
                  onClick={() => navigate('/music-settings')}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/30 shadow transition-all"
                  title="Manage Music Catalog"
                  aria-label="Music Settings"
                >
                  <Settings className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-medium hidden sm:inline">Catalog</span>
                </button>
              </div>
            </div>
            
            <p className="text-white/80 mb-6">
              Whether you need encouragement, have questions about the Word, or simply want a morning blessing — you are welcome here.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onEnterApp}
                className="tabernacle-button px-6 py-3 text-lg font-bold"
              >
                Enter & Receive Your Blessing
              </button>
              
              <button
                onClick={onViewBeliefs}
                className="px-6 py-3 text-lg font-bold rounded border-2 border-accent text-white hover:bg-accent/20 transition-colors"
              >
                What We Believe
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-6 text-center lg:mx-20">
          <div 
            className="inline-block py-2 px-6 rounded border border-accent mx-auto"
            style={{
              background: 'rgba(88, 28, 135, 0.85)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <p className="text-sm text-white font-bold">
              Remnant Seed © 2026
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WelcomeLanding;
