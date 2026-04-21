import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, Loader2 } from 'lucide-react';
import { BetaBadge } from '@/components/BetaBadge';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import landingBackground from '@/assets/heaven-garden-background.jpg';
import prophetGadModern from '@/assets/prophet-gad-modern.png';

interface WelcomeLandingProps {
  onEnterApp: () => void;
  onViewBeliefs: () => void;
}

const HYMN_TRACK = '/music/thunder-road-gospel.mp3';
const ARIAL = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
const PURPLE_PANEL = 'rgba(88, 28, 135, 0.85)';

// Strong text shadow used to make translucent text readable against the
// flower garden background — replaces the solid purple panels.
const TEXT_SHADOW_STRONG =
  '0 2px 6px rgba(0,0,0,0.85), 0 0 14px rgba(60,20,80,0.7)';

const GREETING_LINES = [
  'Welcome, Friend.',
  'Welcome To This Christian Counseling Application.',
  "What's The Burden On Your Heart?",
  'Let’s See What The Lord Can Do For You Today.',
];
const GREETING_TEXT = GREETING_LINES.join(' ');

const useNow = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
};

export const WelcomeLanding = ({ onEnterApp, onViewBeliefs }: WelcomeLandingProps) => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayTried, setAutoPlayTried] = useState(false);
  const { speak, stop, isSpeaking, isLoading } = useElevenLabsTTS();
  const now = useNow();

  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeString = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  useEffect(() => {
    if (autoPlayTried) return;
    setAutoPlayTried(true);
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.30;
    a.play().then(() => setIsPlaying(true)).catch(() => {});
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

  const speakInvitation = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(GREETING_TEXT);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: ARIAL }}>
      <audio ref={audioRef} src={HYMN_TRACK} loop preload="auto" />

      {/* Garden of heaven background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${landingBackground})` }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,245,210,0.05) 0%, rgba(80,40,10,0.18) 80%, rgba(30,15,5,0.35) 100%)',
        }}
      />
      {/* Soft halo on the doorway only */}
      <div
        className="fixed pointer-events-none"
        style={{
          left: '50%',
          top: '52%',
          transform: 'translate(-50%, -50%)',
          width: '18vw',
          height: '26vh',
          maxWidth: '300px',
          maxHeight: '360px',
          background:
            'radial-gradient(ellipse, rgba(255,255,225,0.55) 0%, rgba(255,230,150,0.25) 45%, transparent 75%)',
          filter: 'blur(10px)',
          mixBlendMode: 'screen',
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* TOP — centered wordmark above the gate, with date/time stacked
            beneath the tagline. No side-pinned clock. */}
        <header className="relative z-10 px-6 pt-5 pb-3 text-center">
          <h1
            className="inline-block font-bold tracking-wide text-3xl md:text-5xl px-4 py-1 rounded-lg"
            style={{
              fontFamily: ARIAL,
              color: '#F5D87A',
              background: 'rgba(88, 28, 135, 0.55)',
              textShadow: TEXT_SHADOW_STRONG,
            }}
          >
            FERVENT COUNSEL
          </h1>
          <div className="mt-2">
            <p
              className="inline-block italic text-sm md:text-base text-white px-3 py-0.5 rounded"
              style={{
                fontFamily: ARIAL,
                background: 'rgba(88, 28, 135, 0.55)',
                textShadow: '0 1px 3px rgba(0,0,0,0.7)',
              }}
            >
              Pastoral Counsel, Fervent Prayer. By God's Prophet.
            </p>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
            <span
              className="inline-block text-sm md:text-base font-semibold text-white px-3 py-0.5 rounded"
              style={{
                fontFamily: ARIAL,
                background: 'rgba(88, 28, 135, 0.55)',
                textShadow: '0 1px 3px rgba(0,0,0,0.7)',
              }}
            >
              {dateString}
            </span>
            <span
              className="inline-block text-base md:text-lg font-bold px-3 py-0.5 rounded"
              style={{
                fontFamily: ARIAL,
                color: '#F5D87A',
                background: 'rgba(88, 28, 135, 0.55)',
                textShadow: '0 1px 3px rgba(0,0,0,0.7)',
              }}
            >
              {timeString}
            </span>
          </div>
        </header>

        {/* MIDDLE — let the gate of heaven breathe */}
        <div className="flex-1" />

        {/* BOTTOM — only the prophet card keeps a translucent box. Music
            controls below it are bare buttons over the garden. */}
        <main className="relative z-10 px-4 pb-4">
          <div className="w-full max-w-5xl mx-auto flex justify-end items-end">
            <div className="w-full max-w-xs flex flex-col items-center gap-3 text-center">
              <img
                src={prophetGadModern}
                alt="Prophet Gad"
                className="w-28 h-28 rounded-lg object-cover object-top border-2 border-accent shadow-2xl"
              />

              <div className="flex flex-col gap-1 items-center">
                {GREETING_LINES.map((line) => (
                  <span
                    key={line}
                    className="inline-block px-2 py-0.5 rounded text-white text-sm italic leading-snug"
                    style={{
                      fontFamily: ARIAL,
                      background: 'rgba(88, 28, 135, 0.55)',
                      textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                    }}
                  >
                    {line}
                  </span>
                ))}
              </div>

              <button
                onClick={speakInvitation}
                disabled={isLoading}
                className="px-3 py-1 rounded-full border border-accent/50 text-white text-xs inline-flex items-center gap-1.5 transition-all disabled:opacity-50 backdrop-blur-sm hover:brightness-110"
                style={{ fontFamily: ARIAL, background: 'rgba(88, 28, 135, 0.75)' }}
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
                {isLoading ? '...' : isSpeaking ? 'Stop' : 'Hear it'}
              </button>

              <button
                onClick={onEnterApp}
                className="px-3 py-1 rounded text-white text-xs hover:underline underline-offset-4"
                style={{
                  fontFamily: ARIAL,
                  background: 'rgba(88, 28, 135, 0.55)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                }}
              >
                New or returning? Register to save your counsel
              </button>

              {/* Music controls — bare, no box. */}
              <div className="flex items-center gap-2 px-1 py-1 w-full justify-center">
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 flex-shrink-0 rounded-full bg-accent/80 hover:bg-accent border border-white/40 text-white flex items-center justify-center backdrop-blur-sm shadow-md"
                  title={isPlaying ? 'Pause' : 'Play'}
                  aria-label={isPlaying ? 'Pause hymn' : 'Play hymn'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <p
                  className="text-white font-semibold truncate px-3 py-0.5 rounded"
                  style={{
                    fontFamily: ARIAL,
                    fontSize: '13px',
                    background: 'rgba(88, 28, 135, 0.55)',
                    textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                  }}
                >
                  Thunder Road Gospel
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Centered Enter button — sits above the footer, page-centered */}
        <div className="relative z-10 flex justify-center pb-4 px-4">
          <button
            onClick={enterSanctuary}
            className="px-10 py-3 rounded-full bg-accent hover:bg-accent/90 border-2 border-white/40 text-white font-bold text-base shadow-2xl transition-all"
            style={{ fontFamily: ARIAL }}
          >
            Enter
          </button>
        </div>

        {/* FOOTER — translucent purple highlight behind the wordmark, with
            the gold BETA chip beside it (replaces the top BETA). */}
        <footer className="relative z-10 py-3 text-center px-4">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border border-accent/50"
            style={{ background: PURPLE_PANEL }}
          >
            <button
              onClick={onViewBeliefs}
              className="text-xs italic text-white underline underline-offset-2 hover:text-accent transition-colors"
              style={{ fontFamily: ARIAL }}
            >
              What We Believe
            </button>
            <span className="text-xs italic text-white/70" style={{ fontFamily: ARIAL }}>·</span>
            <span
              className="text-xs italic text-white"
              style={{ fontFamily: ARIAL }}
            >
              Remnant Seed LLC © 2026
            </span>
            <BetaBadge size="sm" />
          </span>
        </footer>
      </div>
    </div>
  );
};

export default WelcomeLanding;
