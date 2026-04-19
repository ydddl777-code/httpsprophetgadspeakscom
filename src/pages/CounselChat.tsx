import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Volume2, Loader2, ScrollText, Flower2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/lib/types';
import heavenGardenBackground from '@/assets/heaven-garden-background.jpg';
import prophetGadAvatar from '@/assets/prophet-gad-modern.png';
import { generateReferenceNo } from '@/lib/decreeUtils';

interface CounselChatProps {
  profile: UserProfile;
  onLogout: () => void;
}

interface ChatMessage {
  id: string;
  role: 'prophet' | 'user';
  content: string;
  timestamp: Date;
  sealed?: boolean;
}

const INITIAL_GREETING =
  'Peace be with you, beloved. Come, sit a while. I am here to listen. What weighs upon your heart today?';

export const CounselChat = ({ profile, onLogout }: CounselChatProps) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'prophet',
      content: INITIAL_GREETING,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sealingId, setSealingId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { speak, isSpeaking } = useElevenLabsTTS();

  const firstName = profile.name.split(' ')[0];

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
          profile_id: profile.id ?? null,
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

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Heaven Garden Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heavenGardenBackground})` }}
      />
      {/* Soft gold wash over the garden so text remains readable */}
      <div
        className="fixed inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,10,0,0.45) 0%, rgba(40,20,5,0.30) 50%, rgba(20,10,0,0.55) 100%)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 w-full py-4 px-4 border-b border-accent/40 backdrop-blur-sm bg-black/30">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3 flex-1">
            <Avatar className="w-12 h-12 border-2 border-accent ring-2 ring-accent/30">
              <AvatarImage src={prophetGadAvatar} alt="Prophet Gad" />
              <AvatarFallback className="bg-accent text-accent-foreground font-bold">
                PG
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-lg font-bold text-gradient-gold tracking-wide">
                PROPHET GAD
              </h1>
              <p className="text-xs text-white/80 italic">
                The Shepherd is Listening
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/decrees')}
            className="text-white/80 hover:text-white hover:bg-white/10 gap-2"
            title="View your sealed decrees"
          >
            <ScrollText className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Decrees</span>
          </Button>
        </div>
      </header>

      {/* Chat Container - Sanctuary Style */}
      <div className="relative z-10 flex-1 flex flex-col max-w-2xl mx-auto w-full p-4">
        <div
          className="flex-1 rounded-2xl border-2 border-accent/60 shadow-2xl overflow-hidden flex flex-col backdrop-blur-md"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,250,235,0.92) 0%, rgba(252,244,220,0.92) 100%)',
            boxShadow:
              '0 10px 40px rgba(0,0,0,0.4), 0 0 80px rgba(212,165,63,0.15), inset 0 0 60px rgba(212,165,63,0.08)',
          }}
        >
          {/* Decorative gold rule with flower */}
          <div className="flex items-center justify-center gap-3 py-2 px-4 bg-gradient-to-r from-transparent via-accent/20 to-transparent border-b border-accent/40">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/60" />
            <Flower2 className="w-4 h-4 text-accent" />
            <span className="font-display text-xs tracking-[0.3em] text-accent/90">
              THE SANCTUARY
            </span>
            <Flower2 className="w-4 h-4 text-accent" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/60" />
          </div>

          {/* Messages Area */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-5">
              {messages.map((message) => (
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
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: message.role === 'prophet' ? '1.05rem' : '1rem',
                      }}
                    >
                      {message.content}
                    </p>

                    {/* Action row for Prophet messages */}
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
              ))}

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
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Share your burden, beloved..."
                className="flex-1 border-accent/50 bg-white/90 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-accent italic"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.05rem' }}
              />
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
            <p className="mt-2 text-center text-[11px] italic text-[#5C4A3D]/70">
              Every counsel you choose to seal becomes a Prophetic Decree — archived with your name.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselChat;
