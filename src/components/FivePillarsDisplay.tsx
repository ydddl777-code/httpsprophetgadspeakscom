import { useState } from 'react';
import { FIVE_PILLARS, PillarContent } from '@/lib/pillarContent';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import pillarImage from '@/assets/pillar-column.jpg';

export const FivePillarsDisplay = () => {
  const [selectedPillar, setSelectedPillar] = useState<PillarContent | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Purple glass container around pillars */}
      <div 
        className="rounded-lg p-4 md:p-6 border-2 border-accent"
        style={{
          background: 'rgba(88, 28, 135, 0.75)',
          backdropFilter: 'blur(4px)'
        }}
      >
        {/* Five Pillars using the actual pillar image - all aligned on same plane */}
        <div className="flex justify-between items-end px-0 md:px-2">
          {FIVE_PILLARS.map((pillar, index) => {
            // Make "One God" (first pillar) slightly larger
            const isFirstPillar = index === 0;
            const pillarSize = isFirstPillar ? 'w-16 md:w-24' : 'w-14 md:w-20';
            
            return (
              <button
                key={pillar.id}
                onClick={() => setSelectedPillar(pillar)}
                className="group flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg"
                aria-label={`Learn about ${pillar.title}`}
              >
                {/* Title on TOP of pillar - fixed height container for alignment */}
                <div className="h-6 md:h-7 flex items-end justify-center mb-1">
                  <span 
                    className="text-[8px] md:text-[10px] text-primary-foreground text-center leading-tight px-1 py-0.5 rounded border border-accent whitespace-nowrap"
                    style={{ 
                      fontFamily: 'Arial, sans-serif', 
                      fontWeight: 'bold',
                      background: 'rgba(88, 28, 135, 0.95)',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {pillar.title}
                  </span>
                </div>
                
                {/* Pillar Image */}
                <div className="relative group-hover:brightness-110 transition-all duration-200">
                  <img 
                    src={pillarImage} 
                    alt="Pillar"
                    className={`${pillarSize} h-auto object-contain`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Platform Base with "Platform of Truth" label - sandy/beach yellow color */}
        <div className="mt-3 flex justify-center">
          <div 
            className="w-full h-6 md:h-7 rounded-sm shadow-lg flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(180deg, hsl(45 60% 70%) 0%, hsl(40 50% 55%) 50%, hsl(35 45% 45%) 100%)'
            }}
          >
            <span 
              className="text-[10px] md:text-sm text-primary-foreground tracking-widest uppercase px-4 py-0.5 rounded border-2 border-accent whitespace-nowrap"
              style={{ 
                fontFamily: 'Arial Black, Arial, sans-serif',
                fontWeight: 'normal',
                background: 'rgba(88, 28, 135, 0.85)',
                backdropFilter: 'blur(4px)'
              }}
            >
              Platform of Truth
            </span>
          </div>
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