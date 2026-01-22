import { cn } from '@/lib/utils';

interface PillarIconProps {
  className?: string;
  variant?: 'spirit' | 'ear' | 'mouth' | 'wallet' | 'doctrine';
}

const variantColors = {
  spirit: 'text-pillar-spirit',
  ear: 'text-pillar-ear',
  mouth: 'text-pillar-mouth',
  wallet: 'text-pillar-wallet',
  doctrine: 'text-pillar-doctrine',
};

export const PillarIcon = ({ className, variant = 'spirit' }: PillarIconProps) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-12 h-12', variantColors[variant], className)}
    >
      {/* Pillar base */}
      <rect x="16" y="52" width="32" height="6" rx="1" fill="currentColor" opacity="0.9" />
      {/* Pillar column */}
      <rect x="20" y="16" width="24" height="36" rx="2" fill="currentColor" opacity="0.7" />
      {/* Pillar capital */}
      <rect x="14" y="10" width="36" height="8" rx="2" fill="currentColor" />
      {/* Decorative lines */}
      <rect x="22" y="20" width="2" height="28" fill="currentColor" opacity="0.3" />
      <rect x="30" y="20" width="2" height="28" fill="currentColor" opacity="0.3" />
      <rect x="38" y="20" width="2" height="28" fill="currentColor" opacity="0.3" />
    </svg>
  );
};
