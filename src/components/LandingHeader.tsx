import { ClockDisplay } from './ClockDisplay';
import { SanctuaryAmbienceToggle } from './SanctuaryAmbienceToggle';
import { BetaBadge } from './BetaBadge';

interface LandingHeaderProps {
  onEnterApp?: () => void;
}

export const LandingHeader = ({ onEnterApp }: LandingHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      {/* Logo/Title - Indented */}
      <div className="text-left">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-gradient-gold drop-shadow-text tracking-wide">
            HAND IN HAND
          </h1>
          <BetaBadge size="md" className="mt-1" />
        </div>
        <p className="font-serif italic text-base md:text-lg text-white/90 drop-shadow-text mt-1">
          As Enoch walked and talked with You
        </p>
        <p className="font-serif text-xs md:text-sm text-white/70 drop-shadow-text mt-0.5">
          A family devotional companion · by Remnant Seed LLC
        </p>
      </div>

      {/* Right side controls */}
      <div className="flex flex-col items-end gap-3">
        {/* Sanctuary Ambience Toggle */}
        <SanctuaryAmbienceToggle showInvitation />
        
        <ClockDisplay size="medium" />
        
        {onEnterApp && (
          <button
            onClick={onEnterApp}
            className="tabernacle-button text-sm px-4 py-2"
          >
            Enter The App
          </button>
        )}
      </div>
    </div>
  );
};
