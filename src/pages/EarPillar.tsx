import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppHeader } from '@/components/AppHeader';
import { UserProfile, MusicCheckResult } from '@/lib/types';
import { RED_FLAG_ARTISTS } from '@/lib/data';
import { cn } from '@/lib/utils';

interface EarPillarProps {
  profile: UserProfile;
  onLogout: () => void;
}

const checkMusic = (song: string, artist: string): MusicCheckResult => {
  const artistLower = artist.toLowerCase().trim();
  const isRedFlagArtist = RED_FLAG_ARTISTS.some((a) => artistLower.includes(a));

  // Simulate BPM (in real app, would use Spotify API)
  const simulatedBpm = Math.floor(Math.random() * 80) + 80; // 80-160 BPM range

  let status: 'safe' | 'caution' | 'danger';
  let reason: string;

  if (isRedFlagArtist) {
    status = 'danger';
    reason = 'This artist is associated with false doctrine (Hillsong, Bethel, Elevation, etc.)';
  } else if (simulatedBpm > 130) {
    status = 'danger';
    reason = `High BPM (${simulatedBpm}) - May incite carnal behavior`;
  } else if (simulatedBpm > 110) {
    status = 'caution';
    reason = `Moderate BPM (${simulatedBpm}) - Exercise discernment`;
  } else {
    status = 'safe';
    reason = `Acceptable BPM (${simulatedBpm}) - Not on red-flag list`;
  }

  return { song, artist, bpm: simulatedBpm, status, reason };
};

export const EarPillar = ({ profile, onLogout }: EarPillarProps) => {
  const navigate = useNavigate();
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [result, setResult] = useState<MusicCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = () => {
    if (!song.trim() || !artist.trim()) return;
    
    setIsChecking(true);
    // Simulate API delay
    setTimeout(() => {
      const checkResult = checkMusic(song, artist);
      setResult(checkResult);
      setIsChecking(false);
    }, 1000);
  };

  const handleClear = () => {
    setSong('');
    setArtist('');
    setResult(null);
  };

  const StatusIcon = result?.status === 'safe' 
    ? CheckCircle 
    : result?.status === 'caution' 
      ? AlertTriangle 
      : XCircle;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader userName={profile.name} onLogout={onLogout} showLogout />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-pillar-ear/10 p-4 rounded-2xl mb-4">
            <Music className="w-12 h-12 text-pillar-ear" />
          </div>
          <h1 className="font-display text-3xl text-primary mb-2">EAR PILLAR</h1>
          <p className="text-muted-foreground">Music Checker</p>
        </div>

        {/* Input Form */}
        <div className="bg-card rounded-3xl shadow-lg border border-border p-8 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="song" className="text-foreground">Song Name</Label>
              <Input
                id="song"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                placeholder="Enter song title"
                className="mt-2 h-12"
              />
            </div>
            <div>
              <Label htmlFor="artist" className="text-foreground">Artist</Label>
              <Input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Enter artist name"
                className="mt-2 h-12"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleCheck}
                disabled={!song.trim() || !artist.trim() || isChecking}
                className="flex-1 h-12 bg-pillar-ear hover:bg-pillar-ear/90 text-primary-foreground gap-2"
              >
                <Search className="w-4 h-4" />
                {isChecking ? 'Checking...' : 'Check Music'}
              </Button>
              {result && (
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="h-12"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div
            className={cn(
              'rounded-2xl p-6 border animate-slide-up',
              result.status === 'safe' && 'bg-success/10 border-success/20',
              result.status === 'caution' && 'bg-warning/10 border-warning/20',
              result.status === 'danger' && 'bg-danger/10 border-danger/20'
            )}
          >
            <div className="flex items-start gap-4">
              <StatusIcon
                className={cn(
                  'w-8 h-8 mt-1 flex-shrink-0',
                  result.status === 'safe' && 'text-success',
                  result.status === 'caution' && 'text-warning',
                  result.status === 'danger' && 'text-danger'
                )}
              />
              <div className="flex-1">
                <h3
                  className={cn(
                    'font-display text-xl mb-1',
                    result.status === 'safe' && 'text-success',
                    result.status === 'caution' && 'text-warning',
                    result.status === 'danger' && 'text-danger'
                  )}
                >
                  {result.status === 'safe' && '🟢 SAFE'}
                  {result.status === 'caution' && '🟡 CAUTION'}
                  {result.status === 'danger' && '🔴 DANGER'}
                </h3>
                <p className="text-foreground font-medium mb-2">
                  "{result.song}" by {result.artist}
                </p>
                <p className="text-foreground/70 mb-3">
                  BPM: {result.bpm}
                </p>
                <p className="text-sm text-foreground/80">
                  {result.reason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-muted rounded-2xl p-6">
          <h4 className="font-semibold text-foreground mb-2">How It Works</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>🟢 <strong>Safe:</strong> BPM under 110, not on red-flag list</li>
            <li>🟡 <strong>Caution:</strong> BPM between 110-130</li>
            <li>🔴 <strong>Danger:</strong> BPM over 130 OR artist associated with false doctrine</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default EarPillar;
