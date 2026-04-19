import { cn } from '@/lib/utils';

interface BetaBadgeProps {
  /** visual size: 'sm' for inline next to headings, 'md' for standalone */
  size?: 'sm' | 'md';
  /** extra classes for positioning */
  className?: string;
}

/**
 * Small gold "BETA" chip shown next to the app wordmark throughout the app.
 * Tells users the site is still in active development so they aren't
 * discouraged by placeholder pages or dead links.
 */
export const BetaBadge = ({ size = 'sm', className }: BetaBadgeProps) => {
  const sizeClasses =
    size === 'sm'
      ? 'text-[10px] px-1.5 py-0.5'
      : 'text-xs px-2 py-1';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-display font-bold tracking-[0.2em] uppercase',
        'bg-accent/90 text-accent-foreground border border-accent',
        'shadow-sm',
        sizeClasses,
        className
      )}
      title="This app is still in beta — some features are still being built"
    >
      Beta
    </span>
  );
};
