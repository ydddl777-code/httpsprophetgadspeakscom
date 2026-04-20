import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoorOpen, Play, Pause, Volume2, Square, Loader2 } from 'lucide-react';
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

// Live clock + date — needed because we no longer render LandingHeader.
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

  const stopMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setIsPlaying(false);
  };

  const enterSanctuary = () => {
    if (audioRef.current) audioRef.current.pause();
    navigate('/counsel');
  };

  const speakInvitation = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak("Come, sit at the table. Let's see what the Lord can do for you today.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: ARIAL }}>
      <audio ref={audioRef} src={HYMN_TRACK} loop preload="auto" />

      {/* Garden of heaven background — flowers and the gate */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${landingBackground})` }}
      />
      {/* Gentle warm wash — no white veil along the bottom anymore so the
          flowers in bloom show through clearly */}
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
        {/* TOP — centered title on a purple panel so it pops */}
        <header className="relative z-10 px-4 pt-5 pb-3 flex justify-center">
          <div
            className="rounded-xl border border-accent/60 backdrop-blur-md px-6 py-3 shadow-2xl text-center max-w-2xl w-full"
            style={{ background: PURPLE_PANEL }}
          >
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <h1
                className="font-bold tracking-wide text-2xl md:text-4xl"
                style={{ fontFamily: ARIAL, color: '#F5D87A' }}
              >
                FERVENT COUNSEL
              </h1>
              <BetaBadge size="md" />
            </div>
            <p
              className="italic text-sm md:text-base mt-1 text-white/95"
              style={{ fontFamily: ARIAL }}
            >
              Pastoral counsel, fervent prayer. By God's prophet.
            </p>
            {/* Date + time on the same purple panel — no more gold-on-gold */}
            <div
              className="mt-2 flex items-center justify-center gap-3 text-white"
              style={{ fontFamily: ARIAL }}
            >
              <span className="text-sm md:text-base font-semibold">{dateString}</span>
              <span className="text-white/50">·</span>
              <span className="text-base md:text-lg font-bold" style={{ color: '#F5D87A' }}>
                {timeString}
              </span>
            </div>
          </div>
        </header>

        {/* MIDDLE — let the gate of heaven breathe */}
        <div className="flex-1" />

        {/* BOTTOM — compact prophet card on the right, music bar centered */}
        <main className="relative z-10 px-4 pb-4">
          <div className="w-full max-w-5xl mx-auto flex justify-end">
            {/* Compact square card — to the right of Heaven's gate */}
            <div
              className="rounded-xl border border-accent/60 backdrop-blur-md shadow-2xl overflow-hidden w-full max-w-xs"
              style={{ background: PURPLE_PANEL }}
            >
              <div className="p-4 flex flex-col items-center text-center gap-2">
                <img
                  src={prophetGadModern}
                  alt="Prophet Gad"
                  className="w-20 h-20 rounded-lg object-cover object-top border-2 border-accent shadow-lg"
                />
                <p
                  className="text-white/90 text-xs italic leading-snug"
                  style={{ fontFamily: ARIAL }}
                >
                  [Come, sit at the table. Let's see what the Lord can do for you today.]
                </p>

                {/* Audible greeting button */}
                <button
                  onClick={speakInvitation}
                  disabled={isLoading}
                  className="mt-1 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-accent/50 text-white text-xs inline-flex items-center gap-1.5 transition-all disabled:opacity-50"
                  style={{ fontFamily: ARIAL }}
                >
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Volume2 className="w-3 h-3" />
                  )}
                  {isLoading ? '...' : isSpeaking ? 'Stop' : 'Hear it'}
                </button>

                {/* Small Enter Sanctuary button */}
                <button
                  onClick={enterSanctuary}
                  className="mt-2 px-4 py-2 rounded-full bg-accent hover:bg-accent/90 border border-white/30 text-white font-bold text-sm shadow-lg inline-flex items-center justify-center gap-2 transition-all"
                  style={{ fontFamily: ARIAL }}
                >
                  <DoorOpen className="w-4 h-4" />
                  Enter the Sanctuary
                </button>

                <div className="mt-2 flex flex-col gap-1 text-xs text-white/80" style={{ fontFamily: ARIAL }}>
                  <button
                    onClick={onEnterApp}
                    className="hover:text-white hover:underline underline-offset-4"
                  >
                    Returning? Sign in to save your counsel
                  </button>
                  <button
                    onClick={onViewBeliefs}
                    className="hover:text-white hover:underline underline-offset-4"
                  >
                    What we believe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Music bar — centered, smaller play button, larger song title */}
          <div
            className="mt-3 mx-auto max-w-md flex items-center gap-3 px-4 py-2 rounded-full border border-accent/50 backdrop-blur-md"
            style={{ background: PURPLE_PANEL }}
          >
            <button
              onClick={stopMusic}
              className="w-9 h-9 flex-shrink-0 rounded-full bg-destructive hover:bg-destructive/90 border-2 border-white flex items-center justify-center shadow-md"
              title="Stop music"
              aria-label="Stop music"
            >
              <Square className="w-3.5 h-3.5 text-white fill-white" />
            </button>
            <button
              onClick={togglePlay}
              className="w-7 h-7 flex-shrink-0 rounded-full bg-accent hover:bg-accent/90 text-white flex items-center justify-center"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause hymn' : 'Play hymn'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <p
              className="flex-1 text-white text-sm font-semibold truncate"
              style={{ fontFamily: ARIAL }}
            >
              Thunder Road Gospel · softly
            </p>
          </div>
        </main>

        <footer className="relative z-10 py-3 text-center px-4">
          <p
            className="text-xs text-white/85 italic"
            style={{ fontFamily: ARIAL, textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
          >
            Fervent Counsel — A Remnant Seed LLC Product · © 2026 · Still in beta
          </p>
        </footer>
      </div>
    </div>
  );
};

export default WelcomeLanding;
