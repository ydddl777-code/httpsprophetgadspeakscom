import { useState } from 'react';
import { ARTIFACTS_DATA, ARTIFACTS_ORDER, ArtifactName } from '@/lib/tribesAndArtifactsData';
import { ArtifactModal } from './ArtifactModal';

// Import all artifact images
import arkImg from '@/assets/artifacts/ark-of-covenant.jpg';
import menorahImg from '@/assets/artifacts/menorah.jpg';
import showbreadImg from '@/assets/artifacts/table-showbread.jpg';
import altarImg from '@/assets/artifacts/altar-incense.jpg';
import breastplateImg from '@/assets/artifacts/high-priest-breastplate.jpg';

const artifactImages: Record<ArtifactName, string> = {
  Ark: arkImg,
  Menorah: menorahImg,
  Showbread: showbreadImg,
  Altar: altarImg,
  Breastplate: breastplateImg,
};

export const ArtifactGallery = () => {
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactName | null>(null);

  const handleArtifactClick = (artifact: ArtifactName) => {
    setSelectedArtifact(artifact);
  };

  const selectedArtifactData = selectedArtifact ? ARTIFACTS_DATA[selectedArtifact] : null;
  const selectedArtifactImage = selectedArtifact ? artifactImages[selectedArtifact] : '';

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div 
          className="text-center mb-6 py-3 px-6 rounded border border-accent mx-auto inline-block"
          style={{
            background: 'rgba(88, 28, 135, 0.85)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-primary drop-shadow-text">
            TABERNACLE ARTIFACTS
          </h2>
        </div>

        {/* Artifacts Grid */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {ARTIFACTS_ORDER.map((artifactKey) => {
            const artifact = ARTIFACTS_DATA[artifactKey];
            return (
              <button
                key={artifactKey}
                onClick={() => handleArtifactClick(artifactKey)}
                className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent rounded-lg p-2"
                title={`Click to learn about ${artifact.title}`}
              >
                <div 
                  className="rounded-lg border-2 border-accent overflow-hidden"
                  style={{
                    background: 'rgba(88, 28, 135, 0.85)',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <img
                    src={artifactImages[artifactKey]}
                    alt={artifact.title}
                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                  />
                </div>
                {/* Artifact name with purple glass style */}
                <span 
                  className="text-[10px] md:text-xs font-bold text-primary-foreground mt-2 px-2 py-1 rounded border border-accent text-center"
                  style={{
                    background: 'rgba(88, 28, 135, 0.85)',
                    backdropFilter: 'blur(4px)',
                    maxWidth: '80px'
                  }}
                >
                  {artifact.title.replace('The ', '').replace('Table of ', '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ArtifactModal
        artifact={selectedArtifactData}
        artifactImage={selectedArtifactImage}
        isOpen={!!selectedArtifact}
        onClose={() => setSelectedArtifact(null)}
      />
    </>
  );
};
