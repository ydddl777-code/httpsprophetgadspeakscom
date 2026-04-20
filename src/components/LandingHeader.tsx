import { BetaBadge } from './BetaBadge';
import { ClockDisplay } from './ClockDisplay';

interface LandingHeaderProps {
  // Kept for backwards compatibility with the existing Index.tsx flow,
  // but the landing no longer needs a prominent "Enter" button here.
  onEnterApp?: () => void;
}

export const LandingHeader = ({ onEnterApp: _onEnterApp }: LandingHeaderProps) => {
  // Today's date for the right-side display
  const dateString = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex items-start justify-between gap-4">
      {/* Wordmark — rich bronze reads clean on the gold Jerusalem
          backdrop. A soft cream stroke so it glows rather than shouts. */}
      <div className="text-left min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h1
            className="font-display text-2xl md:text-4xl font-bold tracking-wide"
            style={{
              color: '#4a2c10',
              textShadow:
                '0 1px 0 rgba(255,240,200,0.6), 0 0 22px rgba(255,220,150,0.35)',
            }}
          >
            FERVENT COUNSEL
          </h1>
          <BetaBadge size="md" className="mt-1" />
        </div>
        <p
          className="font-serif italic text-sm md:text-base mt-1"
          style={{
            color: '#5c3814',
            textShadow: '0 1px 3px rgba(255,240,200,0.6)',
          }}
        >
          Pastoral counsel, fervent prayer. By God's prophet.
        </p>
      </div>

      {/* Right side — date + clock only, no clutter */}
      <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
        <p
          className="text-xs md:text-sm font-semibold"
          style={{
            color: '#4a2c10',
            textShadow: '0 1px 2px rgba(255,240,200,0.6)',
          }}
        >
          {dateString}
        </p>
        <div style={{ filter: 'drop-shadow(0 1px 2px rgba(255,240,200,0.6))' }}>
          <ClockDisplay size="small" />
        </div>
      </div>
    </div>
  );
};
