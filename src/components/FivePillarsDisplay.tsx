import { useState } from 'react';
import { FIVE_PILLARS, PillarContent } from '@/lib/pillarContent';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import pillarImage from '@/assets/pillar-example.jpeg';

export const FivePillarsDisplay = () => {
  const [selectedPillar, setSelectedPillar] = useState<PillarContent | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Section Heading - Black Arial regular, bigger */}
      <h2 className="text-center text-2xl md:text-3xl text-black drop-shadow-sm mb-6 tracking-widest uppercase" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'normal' }}>
        Platform of Truth
      </h2>

      {/* Five Pillars using the actual pillar image */}
      <div className="flex justify-center items-end gap-1 md:gap-3">
        {FIVE_PILLARS.map((pillar) => (
          <button
            key={pillar.id}
            onClick={() => setSelectedPillar(pillar)}
            className="group flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg"
            aria-label={`Learn about ${pillar.title}`}
          >
            {/* Title on TOP of pillar - more visible black text */}
            <span className="mb-1 text-[10px] md:text-xs font-bold text-black drop-shadow-md text-center leading-tight max-w-14 md:max-w-20" style={{ fontFamily: 'Arial, sans-serif', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>
              {pillar.title}
            </span>
            
            {/* Pillar Image - flat orientation with sandy/beach yellow tint */}
            <div className="relative group-hover:brightness-110 transition-all duration-200">
              <img 
                src={pillarImage} 
                alt="Pillar"
                className="w-12 md:w-16 h-auto object-contain"
                style={{ 
                  filter: 'sepia(30%) saturate(120%) hue-rotate(-10deg) brightness(1.05)'
                }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Platform Base - sandy/beach yellow color */}
      <div className="mt-2 flex justify-center">
        <div 
          className="w-full max-w-lg h-4 md:h-5 rounded-sm shadow-lg flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(180deg, hsl(45 60% 70%) 0%, hsl(40 50% 55%) 50%, hsl(35 45% 45%) 100%)'
          }}
        >
          <span className="text-[9px] md:text-[11px] font-bold text-black tracking-widest uppercase" style={{ fontFamily: 'Arial, sans-serif' }}>
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