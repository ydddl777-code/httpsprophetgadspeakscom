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

// Browser TTS fallback helper
function speakWithBrowserTTS(text: string, onEnd?: () => void): boolean {
  if (!('speechSynthesis' in window)) return false;
  
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) 
    || voices.find(v => v.lang.startsWith('en'));
  if (preferredVoice) utterance.voice = preferredVoice;
  
  utterance.onend = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
  return true;
}

export function useElevenLabsTTS(options: UseElevenLabsTTSOptions = {}) {
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
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    if (!text.trim()) return;

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
          text: text.substring(0, 5000),
          voiceId: currentVoiceId 
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      
      if (audioBlob.type.includes('json')) {
        throw new Error('ElevenLabs API unavailable');
      }
      
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
      console.warn('ElevenLabs TTS failed, using browser fallback:', err);
      
      const success = speakWithBrowserTTS(text, () => {
        setIsSpeaking(false);
        onEnd?.();
      });
      
      if (success) {
        setIsSpeaking(true);
        setIsLoading(false);
        setError(null);
      } else {
        setError('Text-to-speech not available');
        setIsLoading(false);
      }
    }
  }, [currentVoiceId, stop]);

  return { 
    speak, 
    stop, 
    isSpeaking, 
    isLoading,
    error,
  };
}
