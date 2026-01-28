import { useState, useRef } from 'react';
import { Play, Pause, Trash2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Track {
  id: string;
  filename: string;
  displayName: string;
  path: string;
  enabled: boolean;
}

// Parse filename into readable display name
const formatTrackName = (filename: string): string => {
  return filename
    .replace('.mp3', '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// Get initial tracks from localStorage or defaults
const getStoredTracks = (): Track[] => {
  const stored = localStorage.getItem('prophet-gad-music-catalog');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default catalog
  const defaultTracks = [
    'thunder-road-gospel.mp3',
    'prophets-soil.mp3',
    'prophets-warning.mp3',
    'seven-calls-to-fire.mp3',
    'unchanging-god.mp3',
    'watchman-on-zions-gate.mp3',
    'watchmans-call.mp3',
    'no-shadow-of-turning.mp3',
  ];
  
  return defaultTracks.map((filename, index) => ({
    id: `track-${index}`,
    filename,
    displayName: formatTrackName(filename),
    path: `/music/${filename}`,
    enabled: true,
  }));
};

export const MusicManager = () => {
  const [tracks, setTracks] = useState<Track[]>(getStoredTracks);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Save tracks to localStorage
  const saveTracks = (updatedTracks: Track[]) => {
    localStorage.setItem('prophet-gad-music-catalog', JSON.stringify(updatedTracks));
    setTracks(updatedTracks);
  };

  // Toggle track enabled/disabled
  const toggleTrack = (trackId: string) => {
    const updatedTracks = tracks.map((track) =>
      track.id === trackId ? { ...track, enabled: !track.enabled } : track
    );
    saveTracks(updatedTracks);
    toast({
      title: updatedTracks.find((t) => t.id === trackId)?.enabled
        ? 'Track enabled'
        : 'Track removed from rotation',
    });
  };

  // Delete track permanently
  const deleteTrack = (trackId: string) => {
    const track = tracks.find((t) => t.id === trackId);
    const updatedTracks = tracks.filter((t) => t.id !== trackId);
    saveTracks(updatedTracks);
    toast({
      title: 'Track deleted',
      description: `"${track?.displayName}" removed from catalog`,
    });
  };

  // Preview track
  const togglePreview = (track: Track) => {
    if (!audioRef.current) return;

    if (playingTrackId === track.id) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingTrackId(null);
    } else {
      audioRef.current.src = track.path;
      audioRef.current.play();
      setPlayingTrackId(track.id);
    }
  };

  const handleAudioEnded = () => {
    setPlayingTrackId(null);
  };

  const enabledCount = tracks.filter((t) => t.enabled).length;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <audio ref={audioRef} onEnded={handleAudioEnded} />

      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">🎵 Music Catalog</h2>
        <p className="text-white/70">
          {enabledCount} of {tracks.length} tracks in rotation
        </p>
      </div>

      {/* Track List */}
      <div className="space-y-3">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
              track.enabled
                ? 'bg-purple-900/60 border-accent/50'
                : 'bg-purple-900/30 border-white/20 opacity-60'
            }`}
          >
            {/* Play/Pause Preview */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => togglePreview(track)}
              className="text-white hover:bg-white/10"
            >
              {playingTrackId === track.id ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate">{track.displayName}</p>
              <p className="text-xs text-white/50 truncate">{track.filename}</p>
            </div>

            {/* Status Indicator */}
            {playingTrackId === track.id && (
              <Volume2 className="w-4 h-4 text-accent animate-pulse" />
            )}

            {/* Toggle In/Out of Rotation */}
            <Button
              variant={track.enabled ? 'outline' : 'default'}
              size="sm"
              onClick={() => toggleTrack(track.id)}
              className={
                track.enabled
                  ? 'border-accent/50 text-accent hover:bg-accent/20'
                  : 'bg-accent text-purple-900 hover:bg-accent/80'
              }
            >
              {track.enabled ? 'Remove' : 'Restore'}
            </Button>

            {/* Permanent Delete */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTrack(track.id)}
              className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {tracks.length === 0 && (
        <div className="text-center py-8 text-white/50">
          <p>No tracks in catalog.</p>
          <p className="text-sm mt-2">Upload music files to add them.</p>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
        <p className="text-sm text-white/70">
          <strong>Tip:</strong> "Remove" hides a track from rotation but keeps it in your catalog.
          The trash icon permanently deletes it.
        </p>
      </div>
    </div>
  );
};

// Export helper to get enabled tracks for the player
export const getEnabledTracks = (): string[] => {
  const stored = localStorage.getItem('prophet-gad-music-catalog');
  if (stored) {
    const tracks: Track[] = JSON.parse(stored);
    return tracks.filter((t) => t.enabled).map((t) => t.path);
  }
  // Fallback to all tracks
  return [
    '/music/thunder-road-gospel.mp3',
    '/music/prophets-soil.mp3',
    '/music/prophets-warning.mp3',
    '/music/seven-calls-to-fire.mp3',
    '/music/unchanging-god.mp3',
    '/music/watchman-on-zions-gate.mp3',
    '/music/watchmans-call.mp3',
    '/music/no-shadow-of-turning.mp3',
  ];
};
