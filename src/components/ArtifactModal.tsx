import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArtifactData } from '@/lib/tribesAndArtifactsData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArtifactModalProps {
  artifact: ArtifactData | null;
  artifactImage: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ArtifactModal = ({ artifact, artifactImage, isOpen, onClose }: ArtifactModalProps) => {
  if (!artifact) return null;

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
            {artifact.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-4 space-y-4">
            {/* Artifact Image */}
            <div className="flex justify-center">
              <img 
                src={artifactImage} 
                alt={artifact.title}
                className="w-32 h-32 object-contain rounded-lg border-2 border-accent"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
              />
            </div>

            {/* Significance */}
            <div 
              className="rounded-lg p-3 border border-accent/50"
              style={{ background: 'rgba(0, 0, 0, 0.2)' }}
            >
              <h4 className="text-accent font-bold text-sm mb-1">Significance</h4>
              <p className="text-primary-foreground text-sm leading-relaxed" style={{ fontFamily: 'Arial', fontSize: '14px' }}>
                {artifact.significance}
              </p>
            </div>

            {/* Details */}
            <div 
              className="rounded-lg p-3 border border-accent/50"
              style={{ background: 'rgba(0, 0, 0, 0.2)' }}
            >
              <h4 className="text-accent font-bold text-sm mb-1">Biblical Details</h4>
              <p className="text-primary-foreground text-sm leading-relaxed" style={{ fontFamily: 'Arial', fontSize: '14px' }}>
                {artifact.details}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
