import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';

const STORAGE_KEY = 'sanctuary_ambience_enabled';
const VOLUME_STORAGE_KEY = 'sanctuary_ambience_volume';
const FADE_DURATION = 2000;
const DEFAULT_VOLUME = 0.15;
const MIN_VOLUME = 0.05;
const MAX_VOLUME = 0.30;

interface SanctuaryAmbienceContextValue {
  isEnabled: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  minVolume: number;
  maxVolume: number;
  toggle: () => void;
  setVolume: (volume: number) => void;
}

const SanctuaryAmbienceContext = createContext<SanctuaryAmbienceContextValue | null>(null);

export function SanctuaryAmbienceProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  });
  const [volume, setVolumeState] = useState<number>(() => {
    const stored = localStorage.getItem(VOLUME_STORAGE_KEY);
    return stored ? parseFloat(stored) : DEFAULT_VOLUME;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const hasInteractedRef = useRef(false);
  const audioUrlRef = useRef<string | null>(null);
  const targetVolumeRef = useRef(volume);

  const clearFadeInterval = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  const fadeVolume = useCallback((targetVolume: number, onComplete?: () => void) => {
    clearFadeInterval();
    
    if (!audioRef.current) {
      onComplete?.();
      return;
    }

    const audio = audioRef.current;
    const startVolume = audio.volume;
    const volumeDiff = targetVolume - startVolume;
    const steps = 40;
    const stepDuration = FADE_DURATION / steps;
    let currentStep = 0;

    fadeIntervalRef.current = window.setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      audio.volume = Math.max(0, Math.min(1, startVolume + (volumeDiff * easeProgress)));

      if (currentStep >= steps) {
        clearFadeInterval();
        audio.volume = targetVolume;
        onComplete?.();
      }
    }, stepDuration);
  }, [clearFadeInterval]);

  // Use local Prophet Gad music file
  const getAudioUrl = useCallback((): string => {
    return '/music/prophet-gad-track-1.mp3';
  }, []);

  const initAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;

    const audioUrl = getAudioUrl();

    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';
    audioRef.current = audio;

    audio.addEventListener('error', () => {
      console.error('Sanctuary ambience audio failed to load');
      setIsPlaying(false);
    });

    return audio;
  }, [getAudioUrl]);

  const play = useCallback(async () => {
    if (!hasInteractedRef.current) return;
    
    setIsLoading(true);
    try {
      const audio = initAudio();
      
      audio.volume = 0;
      
      await audio.play();
      setIsPlaying(true);
      fadeVolume(targetVolumeRef.current);
    } catch (error) {
      console.error('Failed to play ambient audio:', error);
    } finally {
      setIsLoading(false);
    }
  }, [initAudio, fadeVolume]);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    
    fadeVolume(0, () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    });
  }, [fadeVolume]);

  const toggle = useCallback(() => {
    hasInteractedRef.current = true;
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem(STORAGE_KEY, String(newState));

    if (newState) {
      play();
    } else {
      stop();
    }
  }, [isEnabled, play, stop]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(MIN_VOLUME, Math.min(MAX_VOLUME, newVolume));
    setVolumeState(clampedVolume);
    targetVolumeRef.current = clampedVolume;
    localStorage.setItem(VOLUME_STORAGE_KEY, String(clampedVolume));
    
    // Apply volume immediately if playing
    if (audioRef.current && isPlaying) {
      audioRef.current.volume = clampedVolume;
    }
  }, [isPlaying]);

  // Handle user interaction to enable audio playback
  useEffect(() => {
    const handleInteraction = () => {
      hasInteractedRef.current = true;
      if (isEnabled && !isPlaying && !isLoading) {
        play();
      }
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [isEnabled, isPlaying, isLoading, play]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearFadeInterval();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, [clearFadeInterval]);

  return (
    <SanctuaryAmbienceContext.Provider value={{ 
      isEnabled, 
      isPlaying, 
      isLoading, 
      volume, 
      minVolume: MIN_VOLUME, 
      maxVolume: MAX_VOLUME, 
      toggle, 
      setVolume 
    }}>
      {children}
    </SanctuaryAmbienceContext.Provider>
  );
}

export function useSanctuaryAmbienceContext() {
  const context = useContext(SanctuaryAmbienceContext);
  if (!context) {
    throw new Error('useSanctuaryAmbienceContext must be used within a SanctuaryAmbienceProvider');
  }
  return context;
}
