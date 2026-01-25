import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PenTool, Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/lib/types';

interface CounselChatProps {
  profile: UserProfile;
  onLogout: () => void;
}

interface ChatMessage {
  id: string;
  role: 'prophet' | 'user';
  content: string;
  timestamp: Date;
}

const INITIAL_GREETING = "Peace be with you, beloved. I am here to listen. What weighs upon your heart today?";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { speak, isSpeaking } = useElevenLabsTTS();

  const firstName = profile.name.split(' ')[0];

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
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
        content: data.response || "I am here, my child. Please share what is on your heart.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, prophetMessage]);
    } catch (error) {
      console.error('PGAI error:', error);
      // Fallback response if AI fails
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'prophet',
        content: "My child, there seems to be a moment of silence in the connection. Please try again, and know that the Most High hears you always.\n\n— PGAI (Prophet Gad AI)",
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary via-primary/95 to-primary/90">
      {/* Header */}
      <header className="w-full py-4 px-4 border-b border-accent/30">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="w-12 h-12 border-2 border-accent">
              <AvatarImage src="/placeholder.svg" alt="Prophet Gad" />
              <AvatarFallback className="bg-accent text-accent-foreground font-bold">PG</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">Prophet Gad</h1>
              <p className="text-xs text-primary-foreground/70">The Shepherd is Listening</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container - Parchment Style */}
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4">
        <div 
          className="flex-1 rounded-xl border-2 border-accent/50 shadow-lg overflow-hidden flex flex-col"
          style={{ 
            backgroundColor: '#FDFBF7',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 0 40px rgba(139, 119, 101, 0.1)'
          }}
        >
          {/* Messages Area */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
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
                    <Avatar className="w-10 h-10 border-2 border-accent shrink-0">
                      <AvatarImage src="/placeholder.svg" alt="Prophet Gad" />
                      <AvatarFallback className="bg-accent text-accent-foreground text-sm font-bold">PG</AvatarFallback>
                    </Avatar>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
                      message.role === 'prophet'
                        ? 'rounded-tl-sm'
                        : 'rounded-tr-sm'
                    )}
                    style={{
                      backgroundColor: message.role === 'prophet' ? '#E5DCC5' : '#F3F0FF',
                      color: message.role === 'prophet' ? '#3D2B1F' : '#1F1F1F',
                    }}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {/* Speak button for Prophet messages */}
                    {message.role === 'prophet' && (
                      <button
                        onClick={() => handleSpeak(message.content)}
                        disabled={isSpeaking}
                        className={cn(
                          'mt-2 flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity',
                          isSpeaking && 'opacity-40 cursor-not-allowed'
                        )}
                        style={{ color: '#5C4A3D' }}
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    )}
                  </div>

                  {/* User Avatar placeholder (right side) - keeping symmetry */}
                  {message.role === 'user' && (
                    <Avatar className="w-10 h-10 border-2 border-primary/30 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                        {firstName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div 
            className="p-4 border-t"
            style={{ borderColor: '#D4C9B8', backgroundColor: '#FAF8F5' }}
          >
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Share your burden..."
                className="flex-1 border-accent/40 bg-white/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-accent"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-4"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <PenTool className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselChat;

