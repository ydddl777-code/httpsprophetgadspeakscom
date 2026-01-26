import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TribeData } from '@/lib/tribesAndArtifactsData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TribeModalProps {
  tribe: TribeData | null;
  tribeImage: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TribeModal = ({ tribe, tribeImage, isOpen, onClose }: TribeModalProps) => {
  if (!tribe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md border-2 border-accent p-0 overflow-hidden"
        style={{
          background: 'rgba(88, 28, 135, 0.95)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <DialogHeader className="p-4 pb-2 border-b border-accent/50">
          <DialogTitle className="text-primary-foreground font-bold text-xl text-center">
            {tribe.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-4 space-y-4">
            {/* Tribe Image */}
            <div className="flex justify-center">
              <img 
                src={tribeImage} 
                alt={tribe.title}
                className="w-24 h-24 object-contain rounded-lg border-2 border-accent"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
              />
            </div>

            {/* Meaning */}
            <div 
              className="rounded-lg p-3 border border-accent/50"
              style={{ background: 'rgba(0, 0, 0, 0.2)' }}
            >
              <h4 className="text-accent font-bold text-sm mb-1">Meaning</h4>
              <p className="text-primary-foreground text-sm">{tribe.meaning}</p>
            </div>

            {/* Symbol */}
            <div 
              className="rounded-lg p-3 border border-accent/50"
              style={{ background: 'rgba(0, 0, 0, 0.2)' }}
            >
              <h4 className="text-accent font-bold text-sm mb-1">Symbol</h4>
              <p className="text-primary-foreground text-sm">{tribe.symbol}</p>
            </div>

            {/* Lineage */}
            <div 
              className="rounded-lg p-3 border border-accent/50"
              style={{ background: 'rgba(0, 0, 0, 0.2)' }}
            >
              <h4 className="text-accent font-bold text-sm mb-1">Lineage</h4>
              <p className="text-primary-foreground text-sm">{tribe.lineage}</p>
            </div>

            {/* Biblical Facts */}
            <div 
              className="rounded-lg p-3 border border-accent/50"
              style={{ background: 'rgba(0, 0, 0, 0.2)' }}
            >
              <h4 className="text-accent font-bold text-sm mb-1">Biblical Facts</h4>
              <p className="text-primary-foreground text-sm leading-relaxed" style={{ fontFamily: 'Arial', fontSize: '14px' }}>
                {tribe.biblicalFacts}
              </p>
            </div>

            {/* Modern Theory */}
            <div 
              className="rounded-lg p-3 border border-accent/50"
              style={{ background: 'rgba(0, 0, 0, 0.2)' }}
            >
              <h4 className="text-accent font-bold text-sm mb-1">Modern Hebrew Israelite Theory</h4>
              <p className="text-primary-foreground text-sm leading-relaxed" style={{ fontFamily: 'Arial', fontSize: '14px' }}>
                {tribe.modernTheory}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
