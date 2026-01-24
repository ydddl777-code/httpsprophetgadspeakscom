import { ClockDisplay } from './ClockDisplay';

interface LandingHeaderProps {
  onEnterApp?: () => void;
}

export const LandingHeader = ({ onEnterApp }: LandingHeaderProps) => {
  return (
    <header className="relative z-10 px-4 py-6">
      <div className="max-w-6xl mx-auto flex items-start justify-between">
        {/* Logo/Title */}
        <div className="text-left">
          <p className="text-lg md:text-xl text-primary-foreground/90 drop-shadow-text mb-1">
            The Pillar
          </p>
          <h1 className="text-3xl md:text-5xl font-bold gold-text drop-shadow-text tracking-wide">
            REMNANT SEED
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 drop-shadow-text mt-1">
            Prophet Gad Speaks
          </p>
        </div>

        {/* Clock Display */}
        <div className="flex flex-col items-end gap-4">
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
    </header>
  );
};