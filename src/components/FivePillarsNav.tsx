import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PillarData {
  id: string;
  name: string;
  path: string;
  colorClass: string;
}

const pillars: PillarData[] = [
  { id: 'spirit', name: 'SPIRIT', path: '/spirit', colorClass: 'bg-primary' },
  { id: 'ear', name: 'EAR', path: '/ear', colorClass: 'bg-pillar-ear' },
  { id: 'mouth', name: 'MOUTH', path: '/mouth', colorClass: 'bg-pillar-mouth' },
  { id: 'wallet', name: 'WALLET', path: '/wallet', colorClass: 'bg-pillar-wallet' },
  { id: 'doctrine', name: 'DOCTRINE', path: '/doctrine', colorClass: 'bg-pillar-doctrine' },
];

export const FivePillarsNav = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Title */}
      <h2 className="text-center text-xl font-bold text-primary mb-6">
        The Five Pillars
      </h2>
      
      {/* Five Pillars Visual */}
      <div className="flex justify-center items-end gap-2 md:gap-4 mb-4">
        {pillars.map((pillar, index) => (
          <button
            key={pillar.id}
            onClick={() => navigate(pillar.path)}
            className={cn(
              'flex flex-col items-center group cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg'
            )}
          >
            {/* Pillar Column */}
            <div
              className={cn(
                'relative w-14 md:w-20 rounded-t-lg',
                'group-hover:scale-105 group-hover:shadow-lg',
                'border-2 border-foreground/20',
                pillar.colorClass
              )}
              style={{
                height: `${120 + (index % 2) * 20}px`,
              }}
            >
              {/* Pillar Top Cap */}
              <div className={cn(
                'absolute -top-3 left-1/2 -translate-x-1/2',
                'w-16 md:w-24 h-3 rounded-t-sm',
                'bg-accent',
                'border-2 border-foreground/20'
              )} />
              
              {/* Pillar segments (5 blocks) */}
              <div className="absolute inset-x-0 top-14 bottom-0 flex flex-col justify-evenly px-1">
                {[1, 2, 3, 4, 5].map((segment) => (
                  <div
                    key={segment}
                    className="h-[1px] bg-foreground/20 mx-1"
                  />
                ))}
              </div>
            </div>
            
            {/* Pillar Base */}
            <div className={cn(
              'w-16 md:w-24 h-4 rounded-b-sm',
              'bg-muted',
              'border-2 border-t-0 border-foreground/20'
            )} />
            
            {/* Label */}
            <span className="mt-2 text-xs md:text-sm font-bold text-foreground text-center">
              {pillar.name}
            </span>
          </button>
        ))}
      </div>
      
      {/* Instruction */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Tap a pillar to begin
      </p>
    </div>
  );
};
