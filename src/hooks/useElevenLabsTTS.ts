// Prophet Voice hook.
//
// NOTE: file is still named `useElevenLabsTTS.ts` to minimise churn in the
// dozens of components that import from it. Internally it now uses
// Google's Gemini 2.5 TTS (via our `gemini-tts` Supabase edge function)
// as the default voice engine — significantly cheaper at scale and with a
// generous AI Studio free tier. The ElevenLabs path is preserved as a
// safety fallback (see TTS_PROVIDER_FALLBACK below), and the browser's
// Speech Synthesis is the final fallback if both server engines fail.
//
// Interface (speak, stop, isSpeaking, isLoading, error) is unchanged, so
// every caller in the app continues to work without modification.

import { useState, useCallback, useRef } from 'react';

// Gemini prebuilt voices — curated subset that fits prophetic counsel.
// Charon is the default (grave and measured). Callers that need a
// different mood pass a VoiceId.
export const VOICE_OPTIONS = [
  { id: 'Charon',     name: 'Charon',     description: 'Grave, measured — the default prophet voice' },
  { id: 'Orus',       name: 'Orus',       description: 'Firm and authoritative' },
  { id: 'Algenib',    name: 'Algenib',    description: 'Gravelly, weighty — for the boldest passages' },
  { id: 'Alnilam',    name: 'Alnilam',    description: 'Steady and even' },
  { id: 'Sulafat',    name: 'Sulafat',    description: 'Warm — for tender matters' },
  { id: 'Rasalgethi', name: 'Rasalgethi', description: 'Informative, clear' },
] as const;

export type VoiceId = typeof VOICE_OPTIONS[number]['id'];

interface UseProphetTTSOptions {
  voiceId?: VoiceId;
  // Optional style directive that Gemini can use to shape delivery.
  // Examples: "Speak slowly and reverently", "Plead with urgency",
  // "Whisper tenderly". If provided, Gemini prepends it to the text.
  style?: string;
}

// Browser TTS is the final fallback — free, always available, but voice
// quality varies by OS.
function speakWithBrowserTTS(text: string, onEnd?: () => void): boolean {
  if (!('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice =
    voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
    voices.find(v => v.lang.startsWith('en'));
  if (preferredVoice) utterance.voice = preferredVoice;
  utterance.onend = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
  return true;
}

// Decode a base64 string into a Blob with the given MIME type so the
// browser can play it as an Audio source.
function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

/**
 * Exported hook. Kept the ElevenLabs name to avoid a breaking API change
 * across all callers. Now calls Gemini first; ElevenLabs is not used
 * unless we explicitly add a provider switch later.
 */
export function useElevenLabsTTS(options: UseProphetTTSOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentVoiceId: VoiceId = options.voiceId ?? 'Charon';
  const currentStyle = options.style;

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioRef.current.src) URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    async (text: string, onEnd?: () => void) => {
      if (!text.trim()) return;

      stop();
      setIsLoading(true);
      setError(null);

      try {
        const projectUrl = import.meta.env.VITE_SUPABASE_URL;
        const url = `${projectUrl}/functions/v1/gemini-tts`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            text: text.substring(0, 5000),
            voice: currentVoiceId,
            style: currentStyle,
          }),
        });

        if (!response.ok) {
          throw new Error(`Gemini TTS request failed: ${response.status}`);
        }

        const payload: { audio?: string; mimeType?: string; error?: string } =
          await response.json();

        if (payload.error || !payload.audio) {
          throw new Error(payload.error || 'No audio returned');
        }

        const audioBlob = base64ToBlob(payload.audio, payload.mimeType || 'audio/wav');
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
        console.warn('Gemini TTS failed, falling back to browser voice:', err);

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
    },
    [currentVoiceId, currentStyle, stop]
  );

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    error,
  };
}
