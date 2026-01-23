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
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

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

  const firstName = profile.name.split(' ')[0];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `url(${goldenGateBackground})` 
      }}
    >
      <AppHeader userName={firstName} onLogout={onLogout} showLogout />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 gap-2 text-purple-900 hover:text-purple-700 hover:bg-purple-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex bg-purple-600/20 backdrop-blur-sm p-3 rounded-xl mb-3">
            <Music className="w-10 h-10 text-purple-800" />
          </div>
          <h1 className="text-2xl text-purple-900 font-bold mb-1">EAR PILLAR</h1>
          <p className="text-purple-800/80 text-sm">Music Checker</p>
        </div>

        {/* Input Form */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-300/30 p-5 mb-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="song" className="text-purple-900 font-medium">Song Name</Label>
              <Input
                id="song"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                placeholder="Enter song title"
                className="mt-2 h-12 bg-white/50 border-purple-300/50 text-purple-900 placeholder:text-purple-600/50"
              />
            </div>
            <div>
              <Label htmlFor="artist" className="text-purple-900 font-medium">Artist</Label>
              <Input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Enter artist name"
                className="mt-2 h-12 bg-white/50 border-purple-300/50 text-purple-900 placeholder:text-purple-600/50"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleCheck}
                disabled={!song.trim() || !artist.trim() || isChecking}
                className="flex-1 h-12 bg-purple-700 hover:bg-purple-800 text-white gap-2"
              >
                <Search className="w-4 h-4" />
                {isChecking ? 'Checking...' : 'Check Music'}
              </Button>
              {result && (
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="h-12 border-purple-400/50 text-purple-900 hover:bg-purple-500/20"
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
              'rounded-2xl p-5 border backdrop-blur-sm',
              result.status === 'safe' && 'bg-green-500/20 border-green-400/30',
              result.status === 'caution' && 'bg-yellow-500/20 border-yellow-400/30',
              result.status === 'danger' && 'bg-red-500/20 border-red-400/30'
            )}
          >
            <div className="flex items-start gap-4">
              <StatusIcon
                className={cn(
                  'w-8 h-8 mt-1 flex-shrink-0',
                  result.status === 'safe' && 'text-green-700',
                  result.status === 'caution' && 'text-yellow-700',
                  result.status === 'danger' && 'text-red-700'
                )}
              />
              <div className="flex-1">
                <h3
                  className={cn(
                    'text-xl font-bold mb-1',
                    result.status === 'safe' && 'text-green-800',
                    result.status === 'caution' && 'text-yellow-800',
                    result.status === 'danger' && 'text-red-800'
                  )}
                >
                  {result.status === 'safe' && 'SAFE'}
                  {result.status === 'caution' && 'CAUTION'}
                  {result.status === 'danger' && 'DANGER'}
                </h3>
                <p className="text-purple-900 font-medium mb-2">
                  "{result.song}" by {result.artist}
                </p>
                <p className="text-purple-800/80 mb-3">
                  BPM: {result.bpm}
                </p>
                <p className="text-sm text-purple-900/80">
                  {result.reason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-6 bg-purple-900/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
          <h4 className="font-semibold text-purple-900 mb-2 text-sm">How It Works</h4>
          <ul className="text-sm text-purple-900/80 space-y-1">
            <li><strong>Safe:</strong> BPM under 110, not on red-flag list</li>
            <li><strong>Caution:</strong> BPM between 110-130</li>
            <li><strong>Danger:</strong> BPM over 130 OR artist associated with false doctrine</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default EarPillar;
