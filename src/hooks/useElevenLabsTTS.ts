import { useState, useCallback, useRef } from 'react';

// Available voice options
export const VOICE_OPTIONS = [
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'Warm, mature male voice' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Friendly female voice' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', description: 'Clear, authoritative male' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', description: 'Gentle female voice' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', description: 'Deep, resonant male voice' },
] as const;

export type VoiceId = typeof VOICE_OPTIONS[number]['id'];

interface UseElevenLabsTTSOptions {
  voiceId?: VoiceId;
}

export const useElevenLabsTTS = (options: UseElevenLabsTTSOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentVoiceId = options.voiceId || 'JBFqnCBsd6RMkjVDRZzb';

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    if (!text.trim()) return;

    // Stop any current playback
    stop();
    setIsLoading(true);
    setError(null);

    try {
      const projectUrl = import.meta.env.VITE_SUPABASE_URL;
      const url = `${projectUrl}/functions/v1/elevenlabs-tts`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          text: text.substring(0, 5000), // ElevenLabs limit
          voiceId: currentVoiceId 
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        setIsLoading(false);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        onEnd?.();
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setIsLoading(false);
        setError('Audio playback failed');
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      await audio.play();
    } catch (err) {
      console.error('ElevenLabs TTS error:', err);
      setError(err instanceof Error ? err.message : 'TTS failed');
      setIsLoading(false);
      setIsSpeaking(false);
    }
  }, [currentVoiceId, stop]);

  return { 
    speak, 
    stop, 
    isSpeaking, 
    isLoading,
    error,
  };
};
