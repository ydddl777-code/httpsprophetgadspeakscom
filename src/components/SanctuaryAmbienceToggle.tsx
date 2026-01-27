import { Music2, Volume2 } from 'lucide-react';
import { useSanctuaryAmbienceContext } from '@/contexts/SanctuaryAmbienceContext';
import { cn } from '@/lib/utils';

interface SanctuaryAmbienceToggleProps {
  className?: string;
  showInvitation?: boolean;
}

export const SanctuaryAmbienceToggle = ({ 
  className,
  showInvitation = false 
}: SanctuaryAmbienceToggleProps) => {
  const { isEnabled, isPlaying, isLoading, toggle } = useSanctuaryAmbienceContext();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Subtle invitation text when OFF and showInvitation is true */}
      {showInvitation && !isEnabled && (
        <span className="text-xs text-primary-foreground/60 italic hidden sm:block">
          Enter the Sanctuary
        </span>
      )}
      
      <button
        onClick={toggle}
        disabled={isLoading}
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300",
          "backdrop-blur-sm font-semibold text-sm",
          isEnabled
            ? "bg-accent/40 border-accent text-white hover:bg-accent/50"
            : "bg-purple-900/60 border-accent/50 text-white hover:bg-purple-900/80",
          isLoading && "opacity-50 cursor-wait"
        )}
        aria-label={isEnabled ? "Turn off sanctuary music" : "Turn on sanctuary music"}
        title={isEnabled ? "Sanctuary Music: ON" : "Sanctuary Music: OFF"}
      >
        {/* Icon with subtle animation when playing */}
        <div className={cn(
          "transition-transform",
          isPlaying && "animate-pulse"
        )}>
          {isEnabled ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <Music2 className="w-5 h-5" />
          )}
        </div>
        
        {/* Label text */}
        <span>{isEnabled ? (isPlaying ? "Music On" : "Starting...") : "Play Music"}</span>

        {/* Subtle glow effect when playing */}
        {isPlaying && (
          <div 
            className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)',
            }}
          />
        )}
      </button>
    </div>
  );
};

export default SanctuaryAmbienceToggle;
