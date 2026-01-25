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
          "relative p-2 rounded-lg border transition-all duration-300",
          "backdrop-blur-sm",
          isEnabled
            ? "bg-accent/30 border-accent text-accent hover:bg-accent/40"
            : "bg-card/30 border-accent/30 text-primary-foreground/70 hover:bg-card/50 hover:text-primary-foreground",
          isLoading && "opacity-50 cursor-wait"
        )}
        aria-label={isEnabled ? "Turn off sanctuary ambience" : "Turn on sanctuary ambience"}
        title={isEnabled ? "Sanctuary Ambience: ON" : "Sanctuary Ambience: OFF"}
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

        {/* Subtle glow effect when playing */}
        {isPlaying && (
          <div 
            className="absolute inset-0 rounded-lg opacity-30 pointer-events-none"
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
