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
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Five Pillars using the actual pillar image - spread wider */}
      <div className="flex justify-between items-end px-4 md:px-8">
        {FIVE_PILLARS.map((pillar) => (
          <button
            key={pillar.id}
            onClick={() => setSelectedPillar(pillar)}
            className="group flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg"
            aria-label={`Learn about ${pillar.title}`}
          >
            {/* Title on TOP of pillar - purple glass style with gold rim */}
            <span 
              className="mb-1 text-[10px] md:text-xs text-primary-foreground text-center leading-tight px-2 py-1 rounded border-2 border-accent"
              style={{ 
                fontFamily: 'Arial, sans-serif', 
                fontWeight: 'bold',
                background: 'rgba(88, 28, 135, 0.85)',
                backdropFilter: 'blur(4px)'
              }}
            >
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

      {/* Platform Base with "Platform of Truth" label - sandy/beach yellow color */}
      <div className="mt-2 flex justify-center">
        <div 
          className="w-full h-5 md:h-6 rounded-sm shadow-lg flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(180deg, hsl(45 60% 70%) 0%, hsl(40 50% 55%) 50%, hsl(35 45% 45%) 100%)'
          }}
        >
          <span 
            className="text-[10px] md:text-sm text-primary-foreground tracking-widest uppercase px-3 py-0.5 rounded border-2 border-accent"
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