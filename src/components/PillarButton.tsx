import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PillarButtonProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  variant: 'spirit' | 'ear' | 'mouth' | 'wallet' | 'doctrine';
  className?: string;
}

const variantStyles = {
  spirit: 'hover:border-pillar-spirit/50 hover:shadow-[0_8px_30px_-8px_hsl(216_58%_23%/0.3)]',
  ear: 'hover:border-pillar-ear/50 hover:shadow-[0_8px_30px_-8px_hsl(280_60%_45%/0.3)]',
  mouth: 'hover:border-pillar-mouth/50 hover:shadow-[0_8px_30px_-8px_hsl(142_71%_35%/0.3)]',
  wallet: 'hover:border-pillar-wallet/50 hover:shadow-[0_8px_30px_-8px_hsl(43_65%_45%/0.3)]',
  doctrine: 'hover:border-pillar-doctrine/50 hover:shadow-[0_8px_30px_-8px_hsl(216_40%_35%/0.3)]',
};

const iconStyles = {
  spirit: 'text-pillar-spirit',
  ear: 'text-pillar-ear',
  mouth: 'text-pillar-mouth',
  wallet: 'text-pillar-wallet',
  doctrine: 'text-pillar-doctrine',
};

export const PillarButton = ({
  icon,
  title,
  subtitle,
  onClick,
  variant,
  className,
}: PillarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300',
        'bg-card border-2 border-border',
        'shadow-md hover:-translate-y-1',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
        variantStyles[variant],
        className
      )}
    >
      <div className={cn('w-14 h-14 mb-3 flex items-center justify-center', iconStyles[variant])}>
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground text-center">{subtitle}</p>
    </button>
  );
};
