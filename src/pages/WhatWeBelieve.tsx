import { ArrowLeft } from 'lucide-react';
import { FivePillarsDisplay } from '@/components/FivePillarsDisplay';
import { WhoWeAreSection } from '@/components/WhoWeAreSection';
import { ArtifactGallery } from '@/components/ArtifactGallery';
import { TribalBanners } from '@/components/TribalBanners';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

interface WhatWeBelieveProps {
  onBack: () => void;
}

export const WhatWeBelieve = ({ onBack }: WhatWeBelieveProps) => {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${goldenGateBackground})` }}
      />
      
      {/* Dark Overlay for readability */}
      <div className="fixed inset-0 dark-overlay" />
      
      {/* Linen Texture Overlay */}
      <div className="fixed inset-0 linen-overlay pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Tribal Banners at extreme edges */}
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-16 justify-start pl-1 z-20">
          <TribalBanners side="left" />
        </aside>
        <aside className="hidden lg:flex fixed right-0 top-0 bottom-0 w-16 justify-end pr-1 z-20">
          <TribalBanners side="right" />
        </aside>

        {/* Header with Back Button */}
        <header className="relative z-10 px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-accent transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold">Back to Welcome</span>
            </button>
            
            <div 
              className="inline-block py-3 px-6 rounded border border-accent"
              style={{
                background: 'rgba(88, 28, 135, 0.85)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <h1 className="text-2xl md:text-4xl font-bold text-white tracking-wide">
                WHAT WE BELIEVE
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center py-8 space-y-12 lg:px-20">
          {/* Five Pillars */}
          <FivePillarsDisplay />

          {/* Who We Are Section */}
          <WhoWeAreSection />

          {/* Tabernacle Artifacts Gallery */}
          <ArtifactGallery />
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-6 text-center">
          <div 
            className="inline-block py-2 px-6 rounded border border-accent mx-auto"
            style={{
              background: 'rgba(88, 28, 135, 0.85)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <p className="text-sm text-white font-bold">
              Remnant Seed © 2026
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WhatWeBelieve;
