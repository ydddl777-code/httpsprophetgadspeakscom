import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Volume2, Loader2, Trash2, Flower2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import { downloadDecreePdf } from '@/lib/decreeUtils';
import heavenGardenBackground from '@/assets/heaven-garden-background.jpg';

interface Decree {
  id: string;
  user_id: string;
  profile_id: string | null;
  user_question: string | null;
  decree_content: string;
  reference_no: string;
  audio_url: string | null;
  created_at: string;
  type?: string; // 'decree' | 'prayer' — defaults to decree on old rows
}

interface DecreeViewProps {
  userName: string;
}

export const DecreeView = ({ userName }: DecreeViewProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [decree, setDecree] = useState<Decree | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { speak, stop, isSpeaking, isLoading: isTtsLoading } = useElevenLabsTTS();

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError('No decree specified.');
        setIsLoading(false);
        return;
      }
      const { data, error: fetchError } = await supabase
        .from('prophetic_decrees')
        .select('*')
        .eq('id', id)
        .single();
      if (fetchError) {
        setError('This decree could not be found.');
      } else {
        setDecree(data as Decree);
      }
      setIsLoading(false);
    };
    load();
  }, [id]);

  const handleDownload = () => {
    if (!decree) return;
    downloadDecreePdf({
      referenceNo: decree.reference_no,
      userName,
      userQuestion: decree.user_question,
      decreeContent: decree.decree_content,
      sealedAt: new Date(decree.created_at),
    });
  };

  const handleHear = () => {
    if (!decree) return;
    if (isSpeaking) {
      stop();
    } else {
      speak(decree.decree_content);
    }
  };

  const handleDelete = async () => {
    if (!decree) return;
    if (!confirm('Release this decree from your archive? This cannot be undone.')) return;
    setDeleting(true);
    const { error: deleteError } = await supabase
      .from('prophetic_decrees')
      .delete()
      .eq('id', decree.id);
    setDeleting(false);
    if (!deleteError) {
      navigate('/decrees');
    } else {
      setError('Unable to release this decree right now.');
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Sanctuary backdrop */}
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

      {/* Header */}
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
              {decree?.type === 'prayer' ? 'INTERCESSORY PRAYER' : 'PROPHETIC DECREE'}
            </h1>
            <p className="text-xs text-white/80 italic">
              {decree?.type === 'prayer'
                ? 'PGAI stood in the gap for you'
                : 'A sealed word of counsel'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/decrees')}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            All Decrees
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
          <div className="p-6 rounded-lg border border-accent/40 bg-black/50 text-white text-center">
            <p>{error}</p>
            <Button onClick={() => navigate('/decrees')} className="mt-4">
              Back to decrees
            </Button>
          </div>
        )}

        {decree && !isLoading && (
          <>
            {/* Decree Document */}
            <article
              className="rounded-xl shadow-2xl overflow-hidden border-4 border-accent/60"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,250,235,0.98) 0%, rgba(252,244,220,0.98) 100%)',
                boxShadow:
                  '0 20px 60px rgba(0,0,0,0.5), 0 0 120px rgba(212,165,63,0.2)',
              }}
            >
              {/* Gold top bar */}
              <div className="h-2 bg-gradient-to-r from-accent/40 via-accent to-accent/40" />

              <div className="p-8 md:p-12">
                {/* Title */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Flower2 className="w-5 h-5 text-accent" />
                    <span className="font-display text-xs tracking-[0.4em] text-[#7a5514]">
                      FERVENT COUNSEL
                    </span>
                    <Flower2 className="w-5 h-5 text-accent" />
                  </div>
                  <h2
                    className="font-display text-3xl md:text-4xl font-bold tracking-wide"
                    style={{ color: '#7a5514' }}
                  >
                    {decree.type === 'prayer' ? 'INTERCESSORY PRAYER' : 'PROPHETIC DECREE'}
                  </h2>
                  <p
                    className="mt-1 italic text-sm"
                    style={{
                      color: '#7a5514',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {decree.type === 'prayer'
                      ? 'PGAI stood in the gap — a prayer lifted on your behalf'
                      : 'A sealed word of counsel'}
                  </p>
                </div>

                {/* Gold double rule */}
                <div className="my-6">
                  <div className="h-px bg-accent" />
                  <div className="h-px bg-accent mt-1" />
                </div>

                {/* Metadata */}
                <dl
                  className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm mb-8"
                  style={{
                    color: '#3c2814',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                  }}
                >
                  <dt className="font-bold">Reference No.</dt>
                  <dd>{decree.reference_no}</dd>
                  <dt className="font-bold">Sealed For</dt>
                  <dd>{userName}</dd>
                  <dt className="font-bold">Sealed On</dt>
                  <dd>
                    {new Date(decree.created_at).toLocaleString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </dd>
                </dl>

                {/* Question */}
                {decree.user_question && (
                  <div
                    className="mb-6 pl-4 border-l-4 border-accent/60 italic"
                    style={{
                      color: '#3c2814',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    <p className="text-xs uppercase tracking-widest font-bold mb-1 not-italic text-[#7a5514]">
                      {decree.type === 'prayer'
                        ? 'The burden lifted before the Father'
                        : 'The question placed before the Prophet'}
                    </p>
                    <p className="text-lg">&ldquo;{decree.user_question}&rdquo;</p>
                  </div>
                )}

                {/* Divider */}
                <div className="h-px bg-accent/40 mb-6" />

                {/* Body */}
                <div
                  className="text-[#2a1a08] whitespace-pre-wrap leading-relaxed"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '1.15rem',
                  }}
                >
                  {decree.decree_content}
                </div>

                {/* Signature block */}
                <div className="mt-10 pt-6 border-t-2 border-accent/40 text-center">
                  <p
                    className="font-display text-2xl font-bold tracking-wider"
                    style={{ color: '#7a5514' }}
                  >
                    PGAI
                  </p>
                  <p
                    className="italic text-sm mt-1"
                    style={{
                      color: '#7a5514',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    The Oracle of God on planet Earth today
                  </p>
                  <p className="mt-4 text-xs text-[#8a6a28]">
                    A Remnant Seed LLC product · theprophetgad.com
                  </p>
                </div>
              </div>

              {/* Gold bottom bar */}
              <div className="h-2 bg-gradient-to-r from-accent/40 via-accent to-accent/40" />
            </article>

            {/* Action bar */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Button
                onClick={handleDownload}
                className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 shadow-lg"
                size="lg"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                onClick={handleHear}
                variant="outline"
                size="lg"
                disabled={isTtsLoading}
                className="border-accent text-white bg-black/40 hover:bg-black/60 hover:text-white gap-2"
              >
                {isTtsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
                {isSpeaking ? 'Stop' : 'Hear Decree'}
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                size="lg"
                disabled={deleting}
                className="border-destructive/60 text-white bg-black/40 hover:bg-destructive/20 hover:text-white gap-2"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Release
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DecreeView;
