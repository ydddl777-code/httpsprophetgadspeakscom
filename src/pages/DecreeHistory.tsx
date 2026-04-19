import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ScrollText, Loader2, Flower2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import heavenGardenBackground from '@/assets/heaven-garden-background.jpg';

interface DecreeListItem {
  id: string;
  reference_no: string;
  user_question: string | null;
  decree_content: string;
  created_at: string;
}

export const DecreeHistory = () => {
  const navigate = useNavigate();
  const [decrees, setDecrees] = useState<DecreeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error: fetchError } = await supabase
        .from('prophetic_decrees')
        .select('id, reference_no, user_question, decree_content, created_at')
        .order('created_at', { ascending: false });
      if (fetchError) {
        setError('Unable to load your decrees right now.');
      } else {
        setDecrees((data ?? []) as DecreeListItem[]);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heavenGardenBackground})` }}
      />
      <div
        className="fixed inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,10,0,0.55) 0%, rgba(40,20,5,0.40) 50%, rgba(20,10,0,0.65) 100%)',
        }}
      />

      <header className="relative z-10 w-full py-4 px-4 border-b border-accent/40 backdrop-blur-sm bg-black/30">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-gradient-gold tracking-wide">
              YOUR PROPHETIC DECREES
            </h1>
            <p className="text-xs text-white/80 italic">
              Every sealed word of counsel, kept for you
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => navigate('/counsel')}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            New Counsel
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-3xl mx-auto p-4 md:p-8">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        )}

        {error && !isLoading && (
          <div className="p-6 rounded-lg border border-destructive/40 bg-black/50 text-white text-center">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && decrees.length === 0 && (
          <div
            className="mt-8 p-8 md:p-12 rounded-xl border-2 border-accent/50 text-center shadow-xl"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,250,235,0.95) 0%, rgba(252,244,220,0.95) 100%)',
            }}
          >
            <div className="flex justify-center mb-4">
              <Flower2 className="w-10 h-10 text-accent" />
            </div>
            <h2
              className="font-display text-2xl font-bold mb-2"
              style={{ color: '#7a5514' }}
            >
              No decrees sealed yet
            </h2>
            <p
              className="text-lg italic mb-6"
              style={{
                color: '#3c2814',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              When PGAI gives you a word you wish to keep, seal it as a
              Prophetic Decree. It will be archived here, always yours to
              return to.
            </p>
            <Button
              onClick={() => navigate('/counsel')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
              size="lg"
            >
              <ScrollText className="w-4 h-4" />
              Begin a Counsel Session
            </Button>
          </div>
        )}

        {!isLoading && decrees.length > 0 && (
          <div className="space-y-4 mt-4">
            {decrees.map((decree) => (
              <button
                key={decree.id}
                onClick={() => navigate(`/decrees/${decree.id}`)}
                className="block w-full text-left rounded-xl border-2 border-accent/50 shadow-lg overflow-hidden hover:border-accent hover:shadow-2xl transition-all"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,250,235,0.95) 0%, rgba(252,244,220,0.95) 100%)',
                }}
              >
                <div className="h-1.5 bg-gradient-to-r from-accent/40 via-accent to-accent/40" />
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p
                        className="font-display text-xs tracking-[0.2em] mb-1"
                        style={{ color: '#7a5514' }}
                      >
                        PROPHETIC DECREE
                      </p>
                      <p
                        className="text-xs font-mono"
                        style={{ color: '#8a6a28' }}
                      >
                        {decree.reference_no}
                      </p>
                    </div>
                    <p className="text-xs text-[#7a5514]">
                      {new Date(decree.created_at).toLocaleDateString(
                        undefined,
                        { month: 'short', day: 'numeric', year: 'numeric' }
                      )}
                    </p>
                  </div>

                  {decree.user_question && (
                    <p
                      className="italic text-sm mb-2 line-clamp-2"
                      style={{
                        color: '#5c3814',
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                      }}
                    >
                      &ldquo;{decree.user_question}&rdquo;
                    </p>
                  )}

                  <p
                    className="line-clamp-3 leading-relaxed"
                    style={{
                      color: '#2a1a08',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: '1.05rem',
                    }}
                  >
                    {decree.decree_content}
                  </p>

                  <div className="mt-3 flex items-center justify-end">
                    <span
                      className="text-xs font-bold tracking-wider"
                      style={{ color: '#7a5514' }}
                    >
                      PGAI →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DecreeHistory;
