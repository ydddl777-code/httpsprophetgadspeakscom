import { useState, useRef, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
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
// Heaven crystal-river background — therapeutic waterfall scene with
// white doves, lilies and willow trees. Calming for counseling.
import sanctuaryBackground from '@/assets/heaven-crystal-river.jpg';
// Warrior portrait — matches the welcome landing card so the user
// immediately recognises Prophet Gad. Larger and clearer than the
// modern suit photo.
import prophetGadAvatar from '@/assets/prophet-gad-warrior-portrait.png';
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
  return `${opener} How can I help you today? Tell me what brings you here — whatever weighs upon your heart. You can type it, or tap the microphone and speak to me.`;
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const greetingSpokenRef = useRef(false);
  const { speak, stop: stopSpeak, isSpeaking } = useElevenLabsTTS();

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

    let finalTranscript = '';
    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalTranscript += res[0].transcript;
        else interim += res[0].transcript;
      }
      setInputValue((finalTranscript + interim).trim());
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch {
        // ignore
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsRecording(false);
    } else {
      try {
        // Stop any audio playing so the mic doesn't pick up Prophet Gad
        if (isSpeaking) stopSpeak();
        setInputValue('');
        recognitionRef.current.start();
        setIsRecording(true);
      } catch {
        setIsRecording(false);
      }
    }
  };

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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === 'prophet' ? 'assistant' : 'user',
        content: msg.content,
      }));

      const { data, error } = await supabase.functions.invoke('pgai-counsel', {
        body: {
          message: userMessage.content,
          conversationHistory,
        },
      });

      if (error) throw error;

      const prophetMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'prophet',
        content:
          data.response ||
          'I am here, my child. Please share what is on your heart.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, prophetMessage]);
    } catch (error) {
      console.error('PGAI error:', error);
      // Fallback response if AI fails
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'prophet',
        content:
          'My child, there seems to be a moment of silence in the connection. Please try again, and know that the Most High hears you always.\n\n— PGAI',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSpeak = (text: string) => {
    speak(text);
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

      {/* Header — minimal. The counseling chat IS the landing page, so the
          FERVENT COUNSEL wordmark lives here. Tiny gear icon in the corner for
          returning users who want to sign in to save their counsel. */}
      <header className="relative z-10 w-full py-4 px-4 border-b border-accent/40 backdrop-blur-sm bg-black/30">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white hover:bg-white/10 w-9 h-9 shrink-0"
            title="Back to welcome"
            aria-label="Back to welcome"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 border-accent ring-2 ring-accent/30 shrink-0 shadow-2xl">
            <img
              src={prophetGadAvatar}
              alt="Prophet Gad"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-base md:text-lg font-bold text-gradient-gold tracking-[0.2em] leading-tight">
              FERVENT COUNSEL
            </h1>
            <p className="text-sm text-white/85 italic leading-tight">
              Prophet Gad is here — how can I help you today?
            </p>
          </div>

          {profile ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/decrees')}
              className="text-white/80 hover:text-white hover:bg-white/10 gap-1.5 px-2"
              title="View your sealed decrees"
            >
              <ScrollText className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Decrees</span>
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/sign-in')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs md:text-sm px-3 py-2 border-2 border-white/30 shadow-lg whitespace-normal text-center leading-tight"
              title="Sign in to save your counsel"
            >
              Sign In to Save<br />Your Counsel
            </Button>
          )}
        </div>
      </header>

      {/* Chat Container — translucent purple-glass panel, narrower and
          shifted to the right side so the gate-of-heaven garden behind
          remains visible. NO big white blob covering the central image. */}
      <div className="relative z-10 flex-1 flex w-full px-4 pb-4 justify-center md:justify-end">
        <div
          className="flex-1 max-w-xl md:max-w-lg rounded-2xl border-2 border-accent/60 shadow-2xl overflow-hidden flex flex-col backdrop-blur-md"
          style={{
            background:
              'linear-gradient(180deg, rgba(88,28,135,0.55) 0%, rgba(60,20,110,0.55) 100%)',
            boxShadow:
              '0 10px 40px rgba(0,0,0,0.4), 0 0 80px rgba(212,165,63,0.15), inset 0 0 60px rgba(212,165,63,0.10)',
          }}
        >

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

                        {/* Header: PGAI stands in the gap */}
                        <div className="px-5 pt-4 pb-2 flex items-center justify-center gap-3 border-b border-accent/30">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/60" />
                          <HandHeart className="w-4 h-4 text-accent" />
                          <span
                            className="font-display text-[11px] tracking-[0.35em] font-bold"
                            style={{ color: '#7a5514' }}
                          >
                            PGAI STANDS IN THE GAP
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
                          <button
                            onClick={() => handleSpeak(message.content)}
                            disabled={isSpeaking}
                            className={cn(
                              'flex items-center gap-1.5 text-xs font-semibold transition-colors',
                              isSpeaking ? 'opacity-40 cursor-not-allowed' : 'hover:text-accent'
                            )}
                            style={{ color: '#7a5514' }}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isSpeaking ? 'Praying aloud…' : 'Hear this prayer again'}</span>
                          </button>

                          <button
                            onClick={() => handleSavePrayer(message.id)}
                            disabled={message.sealed || sealingId === message.id}
                            className={cn(
                              'flex items-center gap-1.5 text-xs font-semibold transition-colors',
                              message.sealed ? 'text-accent cursor-default' : 'hover:text-accent'
                            )}
                            style={{ color: message.sealed ? undefined : '#7a5514' }}
                          >
                            {sealingId === message.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ScrollText className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {message.sealed
                                ? 'Saved · Keep this prayer'
                                : 'Save this prayer'}
                            </span>
                          </button>
                        </div>

                        {/* PGAI signature */}
                        <div className="px-5 pb-4 text-center">
                          <p
                            className="font-display text-xs tracking-[0.3em] font-bold"
                            style={{ color: '#7a5514' }}
                          >
                            — PGAI
                          </p>
                          <p
                            className="italic text-[10px] mt-1 leading-relaxed"
                            style={{ color: '#8a6a28', fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}
                          >
                            "I have reserved to myself seven thousand men, who have not bowed the knee to the image of Baal." — Romans 11:4
                            <br />
                            PGAI is one of them.
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
                    {/* Prophet Avatar (left side) */}
                    {message.role === 'prophet' && (
                      <Avatar className="w-10 h-10 border-2 border-accent shrink-0 ring-2 ring-accent/20">
                        <AvatarImage src={prophetGadAvatar} alt="Prophet Gad" />
                        <AvatarFallback className="bg-accent text-accent-foreground text-sm font-bold">
                          PG
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={cn(
                        'max-w-[78%] rounded-2xl px-4 py-3 shadow-md',
                        message.role === 'prophet'
                          ? 'rounded-tl-sm border border-accent/30'
                          : 'rounded-tr-sm border border-primary/20'
                      )}
                      style={{
                        backgroundColor:
                          message.role === 'prophet'
                            ? 'rgba(255, 250, 235, 0.95)'
                            : 'rgba(247, 241, 227, 0.95)',
                        color: '#3D2B1F',
                      }}
                    >
                      <p
                        className="leading-relaxed whitespace-pre-wrap"
                        style={{
                          fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
                          fontSize: message.role === 'prophet' ? '1.05rem' : '1rem',
                        }}
                      >
                        {message.content}
                      </p>

                      {/* Action row for Prophet counsel messages */}
                      {message.role === 'prophet' && (
                        <div className="mt-3 pt-2 border-t border-accent/20 flex items-center gap-3 flex-wrap">
                          <button
                            onClick={() => handleSpeak(message.content)}
                            disabled={isSpeaking}
                            className={cn(
                              'flex items-center gap-1.5 text-xs text-accent-foreground/70 hover:text-accent-foreground transition-colors',
                              isSpeaking && 'opacity-40 cursor-not-allowed'
                            )}
                            style={{ color: '#5C4A3D' }}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </button>

                          {/* Ask PGAI to pray — available on all prophet messages
                              except the initial greeting (which has no situation yet) */}
                          {message.id !== '1' && (
                            <button
                              onClick={() => handleAskForPrayer(message.id)}
                              disabled={prayingForId === message.id}
                              className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-accent"
                              style={{ color: '#7a5514' }}
                              title="Ask PGAI to pray an intercessory prayer for your situation"
                            >
                              {prayingForId === message.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <HandHeart className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {prayingForId === message.id
                                  ? 'Praying…'
                                  : 'Ask PGAI to pray for you'}
                              </span>
                            </button>
                          )}

                          {/* Seal as Prophetic Decree */}
                          {message.id !== '1' && (
                            <button
                              onClick={() => handleSealAsDecree(message.id)}
                              disabled={message.sealed || sealingId === message.id}
                              className={cn(
                                'flex items-center gap-1.5 text-xs font-semibold transition-colors',
                                message.sealed
                                  ? 'text-accent cursor-default'
                                  : 'text-[#5C4A3D] hover:text-accent'
                              )}
                            >
                              {sealingId === message.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <ScrollText className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {message.sealed
                                  ? 'Sealed as Decree · PGAI'
                                  : 'Seal as Prophetic Decree'}
                              </span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* User Avatar placeholder (right side) - keeping symmetry */}
                    {message.role === 'user' && (
                      <Avatar className="w-10 h-10 border-2 border-accent/40 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                          {firstName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start gap-3">
                  <Avatar className="w-10 h-10 border-2 border-accent shrink-0">
                    <AvatarImage src={prophetGadAvatar} alt="Prophet Gad" />
                    <AvatarFallback className="bg-accent text-accent-foreground text-sm font-bold">
                      PG
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className="rounded-2xl rounded-tl-sm px-4 py-3 border border-accent/30 shadow-md"
                    style={{ backgroundColor: 'rgba(255, 250, 235, 0.95)' }}
                  >
                    <div className="flex gap-1.5 items-center h-5">
                      <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div
            className="p-4 border-t border-accent/40"
            style={{
              background:
                'linear-gradient(180deg, rgba(252,244,220,0.95) 0%, rgba(248,238,208,0.95) 100%)',
            }}
          >
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  isRecording
                    ? 'Listening… speak your concern'
                    : 'Type, or tap the microphone to speak…'
                }
                className={cn(
                  'flex-1 border-accent/50 bg-white/90 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-accent italic',
                  isRecording && 'border-destructive ring-2 ring-destructive/40'
                )}
                style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif', fontSize: '1.05rem' }}
              />
              {/* Microphone — talk to Prophet Gad instead of typing */}
              {speechSupported && (
                <Button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isLoading}
                  className={cn(
                    'px-3 border shadow-md transition-colors',
                    isRecording
                      ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive/70 animate-pulse'
                      : 'bg-accent/15 hover:bg-accent/25 text-accent-foreground border-accent/40'
                  )}
                  title={isRecording ? 'Stop listening' : 'Speak to Prophet Gad'}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              )}
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 border border-accent/60 shadow-md"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            {isRecording ? (
              <p className="mt-2 text-center text-sm md:text-base italic text-destructive font-bold">
                ● Listening — speak clearly, then tap the microphone again to finish.
              </p>
            ) : (
              <p className="mt-2 text-center text-sm md:text-base italic font-semibold text-[#3D2B1F]">
                Everything you share stays between you and Prophet Gad.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselChat;
