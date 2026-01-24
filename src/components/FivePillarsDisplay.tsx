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
      <h2 className="text-center text-xl md:text-2xl font-bold gold-text drop-shadow-text mb-6 tracking-widest uppercase">
        Platform of Truth
      </h2>

      {/* Five Pillars */}
      <div className="flex justify-center items-end gap-2 md:gap-4">
        {FIVE_PILLARS.map((pillar) => (
          <button
            key={pillar.id}
            onClick={() => setSelectedPillar(pillar)}
            className="group flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg"
            aria-label={`Learn about ${pillar.title}`}
          >
            {/* Title on TOP of pillar */}
            <span className="mb-2 text-[10px] md:text-xs font-bold text-primary-foreground drop-shadow-text text-center leading-tight max-w-16 md:max-w-20">
              {pillar.title}
            </span>
            
            {/* Pillar Capital */}
            <div className="w-12 md:w-16 h-2 md:h-3 rounded-t-sm bg-gradient-to-b from-amber-200 via-amber-100 to-amber-50 shadow-md" />
            
            {/* Pillar Column - clean marble look */}
            <div 
              className="relative w-10 md:w-14 group-hover:brightness-110 transition-all duration-200 shadow-lg"
              style={{ 
                height: '120px',
                background: 'linear-gradient(90deg, hsl(45 30% 85%) 0%, hsl(45 40% 95%) 30%, hsl(45 50% 98%) 50%, hsl(45 40% 95%) 70%, hsl(45 30% 85%) 100%)'
              }}
            >
              {/* Subtle fluting lines */}
              <div className="absolute inset-0 flex justify-evenly px-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-[1px] h-full"
                    style={{
                      background: 'linear-gradient(180deg, transparent 5%, hsl(45 20% 75% / 0.3) 20%, hsl(45 20% 70% / 0.4) 50%, hsl(45 20% 75% / 0.3) 80%, transparent 95%)'
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Pillar Base */}
            <div className="w-12 md:w-16 h-2 md:h-3 rounded-b-sm bg-gradient-to-t from-amber-200 via-amber-100 to-amber-50 shadow-md" />
          </button>
        ))}
      </div>

      {/* Platform Base */}
      <div className="mt-4 flex justify-center">
        <div className="w-full max-w-md h-3 md:h-4 rounded-sm bg-gradient-to-b from-amber-300 via-amber-200 to-amber-400 shadow-lg flex items-center justify-center">
          <span className="text-[8px] md:text-[10px] font-bold text-amber-900/70 tracking-widest uppercase">
            Platform
          </span>
        </div>
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