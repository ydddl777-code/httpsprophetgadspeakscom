import { useState } from 'react';
import { FIVE_PILLARS, PillarContent } from '@/lib/pillarContent';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export const FivePillarsDisplay = () => {
  const [selectedPillar, setSelectedPillar] = useState<PillarContent | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Section Heading */}
      <h2 className="text-center text-xl md:text-2xl font-bold gold-text drop-shadow-text mb-8 tracking-wide">
        ON THESE WE STAND
      </h2>

      {/* Five Pillars */}
      <div className="flex justify-center items-end gap-3 md:gap-6">
        {FIVE_PILLARS.map((pillar) => (
          <button
            key={pillar.id}
            onClick={() => setSelectedPillar(pillar)}
            className="group flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg"
            aria-label={`Learn about ${pillar.title}`}
          >
            {/* Pillar Capital */}
            <div className="w-14 md:w-20 h-3 md:h-4 pillar-capital rounded-t-sm" />
            
            {/* Pillar Column with fluting effect */}
            <div 
              className="relative w-12 md:w-16 pillar-column group-hover:brightness-105 transition-all duration-200"
              style={{ height: '140px' }}
            >
              {/* Fluting lines */}
              <div className="absolute inset-0 flex justify-evenly px-1 pt-2 pb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-[2px] h-full rounded-full"
                    style={{
                      background: 'linear-gradient(180deg, transparent 0%, hsl(20 15% 70% / 0.4) 20%, hsl(20 15% 60% / 0.5) 50%, hsl(20 15% 70% / 0.4) 80%, transparent 100%)'
                    }}
                  />
                ))}
              </div>
              
              {/* Title on pillar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className="text-[10px] md:text-xs font-bold text-foreground/80 text-center leading-tight px-1"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                >
                  {pillar.title}
                </span>
              </div>
            </div>
            
            {/* Pillar Base */}
            <div className="w-14 md:w-20 h-3 md:h-4 pillar-base rounded-b-sm" />
            
            {/* Label below */}
            <span className="mt-3 text-xs md:text-sm font-bold text-primary-foreground drop-shadow-text text-center">
              {pillar.title}
            </span>
          </button>
        ))}
      </div>

      {/* Pillar Detail Modal */}
      <Dialog open={!!selectedPillar} onOpenChange={() => setSelectedPillar(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] parchment-bg border-accent">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary text-center">
              {selectedPillar?.fullTitle}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Main Content */}
              <div className="text-foreground leading-relaxed whitespace-pre-line">
                {selectedPillar?.content}
              </div>
              
              {/* Scriptures */}
              <div className="space-y-3 pt-4 border-t border-accent/30">
                <h4 className="font-bold text-primary">Scripture:</h4>
                {selectedPillar?.scriptures.map((scripture, index) => (
                  <p key={index} className="italic text-foreground/90 pl-4 border-l-2 border-accent/50">
                    {scripture}
                  </p>
                ))}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};