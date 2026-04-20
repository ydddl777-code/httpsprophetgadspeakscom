import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoorOpen, Play, Pause } from 'lucide-react';
import { LandingHeader } from '@/components/LandingHeader';
import landingBackground from '@/assets/heaven-garden-background.jpg';
import prophetGadModern from '@/assets/prophet-gad-modern.png';

interface WelcomeLandingProps {
  // Kept for the existing Index.tsx flow — the tiny "Sign in to save"
  // link below calls this. Everyone else bypasses it via the main button.
  onEnterApp: () => void;
  onViewBeliefs: () => void;
}

const HYMN_TRACK = '/music/thunder-road-gospel.mp3';

export const WelcomeLanding = ({ onEnterApp, onViewBeliefs }: WelcomeLandingProps) => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayTried, setAutoPlayTried] = useState(false);

  // Try to start soft background music. Most browsers will block auto-play
  // until the user interacts; the "Play" button handles the manual case.
  useEffect(() => {
    if (autoPlayTried) return;
    setAutoPlayTried(true);
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.30;
    a.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay blocked — user will click play
      });
  }, [autoPlayTried]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
    } else {
      a.volume = 0.30;
      a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const enterSanctuary = () => {
    if (audioRef.current) audioRef.current.pause();
    navigate('/counsel');
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Hidden audio element for the ambient hymn */}
      <audio ref={audioRef} src={HYMN_TRACK} loop preload="auto" />

      {/* The garden of heaven — flowers framing the archway of light.
          Warm and welcoming on first breath. Slightly tilted like a
          hung artwork so it reads as vision, not stock photo. */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${landingBackground})`,
          transform: 'scale(1.04) rotate(-0.6deg)',
          transformOrigin: 'center center',
        }}
      />
      {/* Soft warm wash so header text reads without dimming the painting */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,245,210,0.08) 0%, rgba(150,90,20,0.18) 75%, rgba(50,25,5,0.35) 100%)',
        }}
      />
      {/* Soft breathing light exactly on the archway in the painting —
          positioned by the natural center where the doorway sits. */}
      <div
        className="fixed pointer-events-none"
        style={{
          left: '50%',
          top: '52%',
          transform: 'translate(-50%, -50%)',
          width: '20vw',
          height: '30vh',
          maxWidth: '340px',
          maxHeight: '400px',
          background:
            'radial-gradient(ellipse, rgba(255,255,225,0.75) 0%, rgba(255,230,150,0.40) 40%, transparent 75%)',
          filter: 'blur(8px)',
          mixBlendMode: 'screen',
          animation: 'doorBreath 4.5s ease-in-out infinite',
        }}
      />

      {/* River of life shimmer — a subtle flowing light band at the
          base of the painting. Three layered gradients drift at different
          speeds so the effect reads as gently moving water, not a static
          highlight. "A pure river of water of life, clear as crystal." */}
      <div className="fixed inset-x-0 bottom-0 h-[22vh] pointer-events-none overflow-hidden">
        {/* Base glow — warmest, closest to the painting's path */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(255,240,190,0.55) 0%, rgba(255,220,150,0.25) 40%, transparent 100%)',
            mixBlendMode: 'screen',
          }}
        />
        {/* First shimmer layer — moves left */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, transparent 0%, rgba(255,255,235,0.5) 30%, rgba(255,250,220,0.75) 50%, rgba(255,255,235,0.5) 70%, transparent 100%)',
            backgroundSize: '200% 100%',
            mixBlendMode: 'screen',
            animation: 'riverShimmer 7s ease-in-out infinite',
          }}
        />
        {/* Second shimmer layer — moves right, slower, offset */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(80deg, transparent 0%, rgba(225,240,255,0.35) 35%, rgba(200,230,255,0.55) 50%, rgba(225,240,255,0.35) 65%, transparent 100%)',
            backgroundSize: '220% 100%',
            mixBlendMode: 'screen',
            animation: 'riverShimmerReverse 11s ease-in-out infinite',
            opacity: 0.85,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header — small wordmark + date/time. That's it. */}
        <header className="relative z-10 px-5 md:px-8 pt-5 pb-2">
          <LandingHeader />
        </header>

        {/* Spacer so the painting's doorway shows through */}
        <div className="flex-1" />

        {/* Welcome area — sits low so it doesn't cover the door.
            Very translucent; the painting shows through. */}
        <main className="relative z-10 px-4 pb-4">
          <div className="w-full max-w-3xl mx-auto">
            <div
              className="rounded-2xl border border-accent/40 shadow-2xl backdrop-blur-md overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, rgba(40,20,5,0.35) 0%, rgba(60,30,10,0.55) 100%)',
              }}
            >
              <div className="p-5 md:p-6 flex items-center gap-4 md:gap-6">
                {/* Prophet Gad — the city-skyline / arms-open portrait */}
                <img
                  src={prophetGadModern}
                  alt="Prophet Gad"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover object-top border-2 border-accent shadow-xl shrink-0"
                />

                {/* Welcome line — no repeat of Fervent Counsel, just the invite */}
                <div className="flex-1 min-w-0 text-left">
                  <p
                    className="text-white/95 text-base md:text-xl leading-snug"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontStyle: 'italic',
                      textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                    }}
                  >
                    Come, sit at the table. Let's see what the Lord can do for
                    you today.
                  </p>
                </div>
              </div>

              {/* The one door in — direct to counseling, no password */}
              <div className="px-5 md:px-6 pb-5 md:pb-6">
                <button
                  onClick={enterSanctuary}
                  className="w-full px-6 py-3.5 rounded-full bg-accent hover:bg-accent/90 border-2 border-white/30 text-white font-bold text-lg tracking-wide shadow-2xl transition-all hover:scale-[1.01] flex items-center justify-center gap-3"
                  style={{
                    fontFamily: "'Cinzel', Georgia, serif",
                    boxShadow: '0 6px 24px rgba(212,165,63,0.55)',
                  }}
                >
                  <DoorOpen className="w-5 h-5" />
                  Enter the Sanctuary
                </button>

                {/* One-line quiet sign-in option */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-white/70 gap-2 flex-wrap">
                  <button
                    onClick={onEnterApp}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors"
                  >
                    Returning? Sign in to save your counsel
                  </button>
                  <button
                    onClick={onViewBeliefs}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors"
                  >
                    What we believe
                  </button>
                </div>
              </div>
            </div>

            {/* Tiny music bar — ambient hymn control */}
            <div
              className="mt-3 mx-auto max-w-xs flex items-center justify-center gap-3 px-4 py-2 rounded-full border border-accent/40 backdrop-blur-sm"
              style={{ background: 'rgba(40,20,5,0.5)' }}
            >
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-accent/90 hover:bg-accent text-accent-foreground flex items-center justify-center transition-all"
                title={isPlaying ? 'Pause hymn' : 'Play hymn'}
                aria-label={isPlaying ? 'Pause hymn' : 'Play hymn'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <p
                className="text-[11px] text-white/80 italic truncate"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                ♪ Thunder Road Gospel · softly
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-3 text-center px-4">
          <p className="text-[10px] text-white/60 italic">
            Fervent Counsel — A Remnant Seed LLC Product · © 2026 · Still in beta
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes doorBreath {
          0%, 100% {
            opacity: 0.55;
            transform: translate(-50%, -50%) scale(0.92);
          }
          50% {
            opacity: 0.95;
            transform: translate(-50%, -50%) scale(1.08);
          }
        }
        @keyframes riverShimmer {
          0%, 100% { background-position: 100% 50%; }
          50%      { background-position: 0% 50%; }
        }
        @keyframes riverShimmerReverse {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default WelcomeLanding;
