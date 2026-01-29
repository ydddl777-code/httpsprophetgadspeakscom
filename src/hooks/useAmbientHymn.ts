import { useRef, useState, useCallback } from 'react';

// Generate a gentle, sustained chord using Web Audio API
// This creates a soft, organ-like ambient background
export const useAmbientHymn = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Frequencies for a soft G major chord (gentle and reverent)
  // G3, B3, D4, G4 - creates a warm, church-like sound
  const chordFrequencies = [196.0, 246.94, 293.66, 392.0];

  const start = useCallback(() => {
    if (isPlaying) return;

    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioContextRef.current;

      // Create master gain for volume control
      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.gain.setValueAtTime(0, ctx.currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2); // Very soft fade in
      gainNodeRef.current.connect(ctx.destination);

      // Create oscillators for each note in the chord
      oscillatorsRef.current = chordFrequencies.map((freq, index) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        // Use sine wave for soft, organ-like tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        // Slight detuning for warmth
        osc.detune.setValueAtTime(index * 2 - 3, ctx.currentTime);
        
        // Individual volume for each note
        oscGain.gain.setValueAtTime(0.25 - (index * 0.03), ctx.currentTime);
        
        osc.connect(oscGain);
        oscGain.connect(gainNodeRef.current!);
        osc.start();
        
        return osc;
      });

      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to start ambient hymn:', error);
    }
  }, [isPlaying]);

  const stop = useCallback(() => {
    if (!isPlaying) return;

    try {
      // Fade out gracefully
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 1);
      }

      // Stop oscillators after fade
      setTimeout(() => {
        oscillatorsRef.current.forEach(osc => {
          try {
            osc.stop();
          } catch (e) {
            // Ignore if already stopped
          }
        });
        oscillatorsRef.current = [];

        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
      }, 1000);

      setIsPlaying(false);
    } catch (error) {
      console.error('Failed to stop ambient hymn:', error);
    }
  }, [isPlaying]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  return { isPlaying, start, stop, toggle };
};
