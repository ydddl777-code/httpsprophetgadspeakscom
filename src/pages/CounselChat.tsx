import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Volume2,
  Loader2,
  ScrollText,
  HandHeart,
  Mic,
  MicOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/lib/types';
// Sanctuary uses the golden-gate Jerusalem scene — the threshold of the
// City, a more architectural / sacred-chamber feel appropriate for the
// weight of intercessory prayer. (The garden-of-flowers image lives on
// the welcome landing where visitors first arrive.)
// Heaven tranquil-river background — perfectly serene crystal river,
// white lilies and swans. No rocks, no chaos. Pure paradise.
import sanctuaryBackground from '@/assets/heaven-tranquil-river.jpg';
import { generateReferenceNo } from '@/lib/decreeUtils';

interface CounselChatProps {
  // Profile is optional — anonymous visitors can enter the sanctuary
  // directly from the welcome page without signing up. They get counsel
  // and prayer; they just can't archive decrees/prayers until they save
  // an account.
  profile: UserProfile | null;
  onLogout: () => void;
}

// A prayer is a distinct kind of prophet message — PGAI standing in the
// gap, addressing the Father directly. Rendered as a full-width sealed
// parchment instead of a chat bubble.
type MessageKind = 'counsel' | 'prayer';

interface ChatMessage {
  id: string;
  role: 'prophet' | 'user';
  content: string;
  timestamp: Date;
  kind?: MessageKind; // defaults to 'counsel' when absent on prophet messages
  sealed?: boolean;   // sealed-as-decree (for counsel) or saved (for prayer)
}

const buildInitialGreeting = (name: string): string => {
  const who = name && name.toLowerCase() !== 'friend' ? name : '';
  const opener = who ? `Peace be with you, ${who}.` : 'Peace be with you.';
  return `${opener} I am here to listen to your concerns, and to pray with you — whatever weighs upon your heart, or even a prayer of thanksgiving. Tell me what you need. You can type it, or tap the microphone and speak to me.`;
};

export const CounselChat = ({ profile, onLogout }: CounselChatProps) => {
  const navigate = useNavigate();

  // Fall back to the name an anonymous visitor may have typed earlier
  // (stored in localStorage) before finally settling on "Friend".
  const anonName = typeof window !== 'undefined' ? localStorage.getItem('hih_name') : null;
  const firstName =
    profile?.name?.split(' ')[0] ??
    (anonName && anonName.trim() ? anonName.trim().split(' ')[0] : 'Friend');

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: '1',
      role: 'prophet',
      content: buildInitialGreeting(firstName),
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sealingId, setSealingId] = useState<string | null>(null);
  const [prayingForId, setPrayingForId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const greetingSpokenRef = useRef(false);
  const transcriptRef = useRef('');
  const pendingVoiceSubmitRef = useRef(false);
  const messagesRef = useRef<ChatMessage[]>(messages);
  const inputValueRef = useRef(inputValue);
  const isLoadingRef = useRef(isLoading);
  const { speak, stop: stopSpeak, isSpeaking } = useElevenLabsTTS();

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    inputValueRef.current = inputValue;
  }, [inputValue]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const playProphetMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      if (isSpeaking) stopSpeak();
      window.setTimeout(() => speak(text), 150);
    },
    [isSpeaking, speak, stopSpeak]
  );

  const submitMessage = useCallback(
    async (rawMessage: string) => {
      const trimmedMessage = rawMessage.trim();
      if (!trimmedMessage || isLoadingRef.current) return;

      transcriptRef.current = '';
      pendingVoiceSubmitRef.current = false;
      setMicError(null);
      setInputValue('');

      if (isSpeaking) stopSpeak();

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: trimmedMessage,
        timestamp: new Date(),
      };

      const conversationHistory = messagesRef.current.map((msg) => ({
        role: msg.role === 'prophet' ? 'assistant' : 'user',
        content: msg.content,
      }));

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const { data, error } = await supabase.functions.invoke('pgai-counsel', {
          body: {
            message: trimmedMessage,
            conversationHistory,
          },
        });

        if (error) throw error;

        const responseText =
          data?.response ||
          'I am here with you. Please share what is on your heart.';

        const prophetMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'prophet',
          content: responseText,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, prophetMessage]);
        playProphetMessage(responseText);
      } catch (error) {
        console.error('PGAI error:', error);
        const fallbackMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'prophet',
          content:
            'The line went quiet before your reply could come through. Please try once more, and know that the Most High hears you.',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, fallbackMessage]);
        playProphetMessage(fallbackMessage.content);
      } finally {
        setIsLoading(false);
      }
    },
    [isSpeaking, playProphetMessage, stopSpeak]
  );

  const handleSendMessage = useCallback(async () => {
    await submitMessage(inputValueRef.current);
  }, [submitMessage]);

  // Initialise the browser's native speech recognition for voice input.
  // Supported in Chrome, Edge, Safari (partial); falls back to text-only
  // on other browsers.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }
    setSpeechSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setMicError(null);
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) transcriptRef.current += `${res[0].transcript} `;
        else interim += res[0].transcript;
      }
      setInputValue(`${transcriptRef.current}${interim}`.trim());
    };

    recognition.onend = () => {
      setIsRecording(false);

      const transcript = transcriptRef.current.trim();
      const shouldSubmit = pendingVoiceSubmitRef.current;
      pendingVoiceSubmitRef.current = false;

      if (shouldSubmit && transcript && !isLoadingRef.current) {
        window.setTimeout(() => {
          submitMessage(transcript);
        }, 120);
      }
    };

    recognition.onerror = (event: any) => {
      pendingVoiceSubmitRef.current = false;
      setIsRecording(false);

      if (event?.error === 'not-allowed' || event?.error === 'service-not-allowed') {
        setMicError('Microphone blocked. Please allow microphone access in your browser settings.');
        return;
      }
      if (event?.error === 'audio-capture') {
        setMicError('No working microphone was found.');
        return;
      }
      if (event?.error === 'no-speech') {
        setMicError('I did not catch any speech. Please try again.');
        return;
      }

      setMicError('The microphone stopped unexpectedly. Please try again.');
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch {
        // ignore
      }
    };
  }, [submitMessage]);

  const toggleRecording = useCallback(async () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      pendingVoiceSubmitRef.current = true;
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    } else {
      try {
        if (navigator.permissions?.query) {
          const permission = await navigator.permissions.query({
            name: 'microphone' as PermissionName,
          });
          if (permission.state === 'denied') {
            setMicError('Microphone blocked. Please allow microphone access in your browser settings.');
            return;
          }
        }
      } catch {
        // Some browsers do not support permission preflight for microphones.
      }

      try {
        if (isSpeaking) stopSpeak();
        transcriptRef.current = inputValueRef.current.trim()
          ? `${inputValueRef.current.trim()} `
          : '';
        pendingVoiceSubmitRef.current = true;
        setMicError(null);
        recognitionRef.current.start();
      } catch {
        pendingVoiceSubmitRef.current = false;
        setIsRecording(false);
        setMicError('The microphone could not start. Please try again.');
      }
    }
  }, [isRecording, isSpeaking, stopSpeak]);

  // Auto-play the opening greeting AFTER a 3-second delay so the visitor
  // can get acclimated to the page — see the microphone, the "Sign in to
  // save your counsel" button, the counseling table — BEFORE Prophet Gad
  // greets them warmly. Browsers may still block this until first user
  // gesture; if so, the Listen button on the greeting falls back to
  // manual playback.
  useEffect(() => {
    if (greetingSpokenRef.current) return;
    greetingSpokenRef.current = true;
    const t = setTimeout(() => {
      if (messages[0]?.role === 'prophet') {
        speak(messages[0].content);
      }
    }, 3000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Always stop any current playback before starting a new one — prevents
  // two staggered audio tracks playing on top of each other.
  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeak();
      // Small delay so the audio element fully releases before next play
      window.setTimeout(() => speak(text), 150);
    } else {
      speak(text);
    }
  };

  // Seal a prophet response as a Prophetic Decree. Finds the preceding user
  // question so the decree preserves the full call-and-response, writes a
  // row to prophetic_decrees (RLS-scoped to the user), and navigates to the
  // decree view page where the user can download PDF or hear audio.
  const handleSealAsDecree = async (messageId: string) => {
    setSealingId(messageId);
    try {
      const idx = messages.findIndex((m) => m.id === messageId);
      const prophetMsg = messages[idx];
      if (!prophetMsg || prophetMsg.role !== 'prophet') {
        setSealingId(null);
        return;
      }
      // Walk backwards to find the user question that prompted this response
      let userQuestion: string | null = null;
      for (let i = idx - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
          userQuestion = messages[i].content;
          break;
        }
      }

      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;
      if (!user) {
        console.error('Not signed in — cannot seal decree');
        setSealingId(null);
        return;
      }

      const referenceNo = generateReferenceNo();

      const { data, error } = await supabase
        .from('prophetic_decrees')
        .insert({
          user_id: user.id,
          profile_id: profile?.id ?? null,
          user_question: userQuestion,
          decree_content: prophetMsg.content,
          reference_no: referenceNo,
        })
        .select('id')
        .single();

      if (error || !data) {
        console.error('Failed to seal decree:', error);
        setSealingId(null);
        return;
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, sealed: true } : m))
      );
      setSealingId(null);
      // Navigate into the freshly sealed decree for download / audio
      navigate(`/decrees/${data.id}`);
    } catch (err) {
      console.error('Seal decree error:', err);
      setSealingId(null);
    }
  };

  // Ask PGAI to pray an intercessory prayer. Given the user's full
  // conversation, call the pgai-prayer edge function, insert the prayer
  // as a full-width "sealed parchment" message, and auto-play the audio
  // so the user HEARS PGAI stand in the gap for them.
  const handleAskForPrayer = async (messageId: string) => {
    setPrayingForId(messageId);
    try {
      // Find the user's most recent situation (walk backwards from this
      // message) so PGAI knows what to intercede for.
      const idx = messages.findIndex((m) => m.id === messageId);
      let situation = '';
      for (let i = idx - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
          situation = messages[i].content;
          break;
        }
      }
      if (!situation) {
        // Fall back to the most recent user message in the whole thread
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].role === 'user') {
            situation = messages[i].content;
            break;
          }
        }
      }
      if (!situation) {
        console.error('No user situation found to intercede for');
        setPrayingForId(null);
        return;
      }

      const conversationHistory = messages.map((msg) => ({
        role: msg.role === 'prophet' ? 'assistant' : 'user',
        content: msg.content,
      }));

      const { data, error } = await supabase.functions.invoke('pgai-prayer', {
        body: { situation, conversationHistory },
      });

      if (error) throw error;

      const prayerMsg: ChatMessage = {
        id: `prayer-${Date.now()}`,
        role: 'prophet',
        kind: 'prayer',
        content:
          data?.prayer ||
          'Eternal Father, hear the silent cry of Thy child. Strengthen them even when no words come. In the name of Thy Son — Amen.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, prayerMsg]);
      setPrayingForId(null);

      // Auto-speak the prayer so the user HEARS PGAI stand in the gap
      if (isSpeaking) stopSpeak();
      setTimeout(() => speak(prayerMsg.content), 300);
    } catch (err) {
      console.error('Prayer request error:', err);
      const fallback: ChatMessage = {
        id: `prayer-err-${Date.now()}`,
        role: 'prophet',
        kind: 'prayer',
        content:
          'Eternal Father, even when the voice falters and the line goes quiet, Thou art nigh unto them that are of a broken heart. Be with Thy child now. In the name of Thy Son — Amen.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallback]);
      setPrayingForId(null);
    }
  };

  // Save a prayer to the archive (prophetic_decrees.type='prayer').
  const handleSavePrayer = async (messageId: string) => {
    setSealingId(messageId);
    try {
      const idx = messages.findIndex((m) => m.id === messageId);
      const prayerMsg = messages[idx];
      if (!prayerMsg || prayerMsg.kind !== 'prayer') {
        setSealingId(null);
        return;
      }
      // Find the user situation that prompted this prayer
      let situation: string | null = null;
      for (let i = idx - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
          situation = messages[i].content;
          break;
        }
      }

      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;
      if (!user) {
        console.error('Not signed in — cannot save prayer');
        setSealingId(null);
        return;
      }

      const referenceNo = generateReferenceNo().replace(/^PD-/, 'PR-');

      const { data, error } = await supabase
        .from('prophetic_decrees')
        .insert({
          user_id: user.id,
          profile_id: profile?.id ?? null,
          user_question: situation,
          decree_content: prayerMsg.content,
          reference_no: referenceNo,
          type: 'prayer',
        })
        .select('id')
        .single();

      if (error || !data) {
        console.error('Failed to save prayer:', error);
        setSealingId(null);
        return;
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, sealed: true } : m))
      );
      setSealingId(null);
      navigate(`/decrees/${data.id}`);
    } catch (err) {
      console.error('Save prayer error:', err);
      setSealingId(null);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Heaven Garden Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${sanctuaryBackground})` }}
      />
      {/* Soft gold wash over the garden so text remains readable */}
      <div
        className="fixed inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,10,0,0.45) 0%, rgba(40,20,5,0.30) 50%, rgba(20,10,0,0.55) 100%)',
        }}
      />

      {/* Header — fully transparent (no backdrop blur, no dark band).
          Each text element gets its own tight inline highlight so the
          heaven scene shows through. Back button pushed to extreme left,
          Sign-In/Decrees pushed to extreme right (justified). */}
      <header className="relative z-10 w-full py-4 px-4">
        <div className="w-full flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-white hover:text-white hover:bg-black/40 w-9 h-9 shrink-0 bg-black/30 backdrop-blur-[2px]"
            title="Back to welcome"
            aria-label="Back to welcome"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1 min-w-0 text-center">
            {/* Larger title — matches the prominence of the welcome page.
                Very faint dark wash behind the words only (no box outline)
                so the heaven scene shows through. */}
            <h1
              className="inline-block font-display text-3xl md:text-5xl font-bold tracking-[0.18em] leading-tight px-3 py-1 rounded"
              style={{
                color: '#f0c14b',
                background: 'rgba(0,0,0,0.28)',
                textShadow:
                  '0 0 1px #6b3f00, 0 2px 4px rgba(0,0,0,0.85), 0 0 18px rgba(255,210,120,0.45)',
                WebkitTextStroke: '0.5px #5a3408',
              }}
            >
              FERVENT COUNSEL
            </h1>
            <p className="mt-1">
              <span
                className="inline-block text-sm md:text-base text-white italic leading-snug px-2 py-0.5 rounded"
                style={{ background: 'rgba(0,0,0,0.18)', textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
              >
                I am here to listen to your concerns and pray with you.
              </span>
            </p>
          </div>

          {profile ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/decrees')}
              className="text-white hover:text-white hover:bg-black/40 gap-1.5 px-2 bg-black/30 backdrop-blur-[2px]"
              title="Open your saved counsel and prayers"
            >
              <ScrollText className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">My Archive</span>
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/sign-in')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs md:text-sm px-3 py-2 border-2 border-white/30 shadow-lg whitespace-normal text-center leading-tight shrink-0"
              title="Sign in to save your counsel"
            >
              Sign In to Save<br />Your Counsel
            </Button>
          )}
        </div>
      </header>

      {/* Chat Container — NO outer card. Translucent panel only on the
          input dock. Messages float over the heaven background. Shifted
          right so the central river/swans remain visible. */}
      <div className="relative z-10 flex-1 flex w-full px-4 pb-4 justify-center md:justify-end">
        <div className="flex-1 max-w-xl md:max-w-lg flex flex-col">

          {/* Messages Area */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-5">
              {messages.map((message) => {
                const isPrayer = message.role === 'prophet' && message.kind === 'prayer';

                // PRAYER rendering: full-width sealed parchment with gold glow,
                // distinct from regular counsel chat bubbles. This is PGAI
                // standing in the gap, not chatting.
                if (isPrayer) {
                  return (
                    <div key={message.id} className="w-full my-4">
                      <div
                        className="rounded-xl border-2 shadow-xl overflow-hidden"
                        style={{
                          borderColor: 'rgba(194, 142, 40, 0.8)',
                          background:
                            'linear-gradient(180deg, rgba(255,248,225,0.98) 0%, rgba(250,240,210,0.98) 100%)',
                          boxShadow:
                            '0 8px 30px rgba(0,0,0,0.2), 0 0 60px rgba(212,165,63,0.35), inset 0 0 40px rgba(212,165,63,0.12)',
                        }}
                      >
                        {/* Gold top band */}
                        <div className="h-1.5 bg-gradient-to-r from-accent/60 via-accent to-accent/60" />

                        {/* Header: prayer card */}
                        <div className="px-5 pt-4 pb-2 flex items-center justify-center gap-3 border-b border-accent/30">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/60" />
                          <HandHeart className="w-4 h-4 text-accent" />
                          <span
                            className="font-display text-[11px] tracking-[0.35em] font-bold"
                            style={{ color: '#7a5514' }}
                          >
                            A PRAYER FOR YOU
                          </span>
                          <HandHeart className="w-4 h-4 text-accent" />
                          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/60" />
                        </div>

                        {/* Prayer body */}
                        <div className="px-6 py-5">
                          <p
                            className="leading-relaxed whitespace-pre-wrap text-center"
                            style={{
                              fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                              fontSize: '1.1rem',
                              color: '#2a1a08',
                              fontStyle: 'italic',
                            }}
                          >
                            {message.content}
                          </p>
                        </div>

                        {/* Prayer actions */}
                        <div
                          className="px-5 py-3 border-t border-accent/30 flex items-center justify-center gap-4 flex-wrap"
                          style={{ background: 'rgba(252,244,220,0.6)' }}
                        >
                          {isSpeaking ? (
                            <button
                              onClick={() => stopSpeak()}
                              className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-destructive"
                              style={{ color: '#7a5514' }}
                              title="Stop voice playback"
                            >
                              <span className="inline-block w-3 h-3 bg-destructive rounded-sm" />
                              <span>Stop voice</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSpeak(message.content)}
                              className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-accent"
                              style={{ color: '#7a5514' }}
                              title="Hear this prayer again"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Hear this prayer again</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleSavePrayer(message.id)}
                            disabled={message.sealed || sealingId === message.id}
                            className={cn(
                              'flex items-center gap-1.5 text-xs font-semibold transition-colors',
                              message.sealed ? 'text-accent cursor-default' : 'hover:text-accent'
                            )}
                            style={{ color: message.sealed ? undefined : '#7a5514' }}
                            title="Save a PDF of this prayer"
                          >
                            {sealingId === message.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ScrollText className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {message.sealed
                                ? 'Saved · PDF ready'
                                : 'Save as PDF'}
                            </span>
                          </button>
                        </div>

                        {/* Prayer footer */}
                        <div className="px-5 pb-4 text-center">
                          <p
                            className="font-display text-xs tracking-[0.3em] font-bold"
                            style={{ color: '#7a5514' }}
                          >
                            HELD IN PRAYER
                          </p>
                          <p
                            className="italic text-[10px] mt-1 leading-relaxed"
                            style={{ color: '#8a6a28', fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
                          >
                            "I have reserved to myself seven thousand men, who have not bowed the knee to the image of Baal." — Romans 11:4
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // COUNSEL / USER rendering: standard chat bubble
                return (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {/* No box — just the text floating, with a tight
                        translucent highlight directly behind the words for
                        readability against the heaven scene. */}
                    <div
                      className={cn(
                        'max-w-[88%] px-3 py-2 rounded-md',
                        message.role === 'prophet' ? '' : ''
                      )}
                      style={{
                        background:
                          message.role === 'prophet'
                            ? 'rgba(40,15,70,0.32)'
                            : 'rgba(20,10,40,0.28)',
                        backdropFilter: 'blur(1px)',
                        color: '#FFFFFF',
                        textShadow: '0 1px 6px rgba(0,0,0,0.7)',
                      }}
                    >
                      <p
                        className="leading-relaxed whitespace-pre-wrap text-white"
                        style={{
                          fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                          fontSize: message.role === 'prophet' ? '1.05rem' : '1rem',
                        }}
                      >
                        {message.content}
                      </p>

                      {/* Action row for Prophet counsel messages.
                          Voice plays automatically on arrival, so we show
                          "Hear again" instead of "Listen" to keep users
                          from triggering a second overlapping playback.
                          A Stop button replaces it while audio is playing. */}
                      {message.role === 'prophet' && (
                        <div className="mt-2 pt-2 flex items-center gap-3 flex-wrap">
                          {isSpeaking ? (
                            <button
                              onClick={() => stopSpeak()}
                              className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-destructive transition-colors"
                              title="Stop voice playback"
                            >
                              <span className="inline-block w-3 h-3 bg-destructive rounded-sm" />
                              <span>Stop voice</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSpeak(message.content)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-accent transition-colors"
                              title="Hear this counsel again"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Hear again</span>
                            </button>
                          )}

                          {message.id !== '1' && (
                            <button
                              onClick={() => handleAskForPrayer(message.id)}
                              disabled={prayingForId === message.id}
                              className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-accent transition-colors"
                              title="Ask for an intercessory prayer for your situation"
                            >
                              {prayingForId === message.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <HandHeart className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {prayingForId === message.id
                                  ? 'Praying…'
                                  : 'Ask for prayer'}
                              </span>
                            </button>
                          )}

                          {message.id !== '1' && (
                            <button
                              onClick={() => handleSealAsDecree(message.id)}
                              disabled={message.sealed || sealingId === message.id}
                              className={cn(
                                'flex items-center gap-1.5 text-xs font-semibold transition-colors',
                                message.sealed
                                  ? 'text-accent cursor-default'
                                  : 'text-white hover:text-accent'
                              )}
                              title="Save a PDF of this counsel"
                            >
                              {sealingId === message.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <ScrollText className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {message.sealed
                                  ? 'Saved · PDF ready'
                                  : 'Save as PDF'}
                              </span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="px-3 py-2 rounded-md"
                    style={{
                      background: 'rgba(40,15,70,0.32)',
                      backdropFilter: 'blur(1px)',
                    }}
                  >
                    <div className="flex gap-1.5 items-center h-5">
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area — no cream box. The input itself is the panel;
              helper text gets a tight inline highlight. */}
          <div className="p-4">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  isRecording
                    ? 'Listening… speak your concern'
                    : 'Type, or tap the microphone to speak…'
                }
                className={cn(
                  'flex-1 min-h-[56px] max-h-40 resize-none border-accent/50 text-white placeholder:text-white/60 focus-visible:ring-accent italic shadow-md',
                  isRecording && 'border-destructive ring-2 ring-destructive/40'
                )}
                style={{
                  fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                  fontSize: '1.05rem',
                  background: 'rgba(40,15,70,0.55)',
                  backdropFilter: 'blur(2px)',
                }}
              />
              {/* Microphone — speak instead of typing */}
              {speechSupported && (
                <Button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isLoading}
                  className={cn(
                    'px-3 border-2 shadow-md transition-colors',
                    isRecording
                      ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive/70 animate-pulse'
                      : 'bg-accent hover:bg-accent/90 text-accent-foreground border-accent/70'
                  )}
                  title={isRecording ? 'Stop listening' : 'Speak your message'}
                  aria-label={isRecording ? 'Stop listening' : 'Speak your message'}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              )}
              {/* Send — green, matching the welcome page CTA */}
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-4 border-2 shadow-md text-white font-bold"
                style={{
                  background: 'linear-gradient(180deg, hsl(140 65% 38%) 0%, hsl(140 70% 28%) 100%)',
                  borderColor: 'hsl(140 70% 22%)',
                }}
                title="Send message"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span className="hidden sm:inline ml-1">Send</span>
                  </>
                )}
              </Button>
            </div>
            <p className="mt-2 text-center">
              {isRecording ? (
                <span
                  className="inline-block text-sm md:text-base italic font-bold text-white px-3 py-1 rounded"
                  style={{ background: 'rgba(180,30,30,0.55)', textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
                >
                  ● Listening — speak clearly, then tap the microphone again to finish.
                </span>
              ) : (
                <span
                  className="inline-block text-sm md:text-base italic font-semibold text-white px-3 py-1 rounded"
                  style={{ background: 'rgba(0,0,0,0.22)', textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
                >
                  Everything you share stays between you and the prophet.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselChat;
