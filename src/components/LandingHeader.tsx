import { ClockDisplay } from './ClockDisplay';
import { SanctuaryAmbienceToggle } from './SanctuaryAmbienceToggle';

interface LandingHeaderProps {
  onEnterApp?: () => void;
}

export const LandingHeader = ({ onEnterApp }: LandingHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      {/* Logo/Title - Indented */}
      <div className="text-left">
        <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-text tracking-wide">
          REMNANT SEED
        </h1>
        <p className="text-base md:text-lg text-white/90 drop-shadow-text mt-1">
          Prophet Gad Speaks
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
