import { LandingHeader } from '@/components/LandingHeader';
import { FivePillarsDisplay } from '@/components/FivePillarsDisplay';
import { TribalBanners } from '@/components/TribalBanners';
import { WhoWeAreSection } from '@/components/WhoWeAreSection';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage = ({ onEnterApp }: LandingPageProps) => {
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
        {/* Header */}
        <LandingHeader onEnterApp={onEnterApp} />

        {/* Main Content with Tribal Banners at extremes */}
        <main className="flex-1 flex relative">
          {/* Left Tribal Banners - extreme left edge */}
          <aside className="hidden lg:flex absolute left-0 top-0 bottom-0 w-16 justify-start pl-1">
            <TribalBanners side="left" />
          </aside>

          {/* Central Content */}
          <div className="flex-1 flex flex-col items-center justify-center py-8 space-y-12 lg:px-20">
            {/* Five Pillars */}
            <FivePillarsDisplay />

            {/* Who We Are Section */}
            <WhoWeAreSection />
          </div>

          {/* Right Tribal Banners - extreme right edge */}
          <aside className="hidden lg:flex absolute right-0 top-0 bottom-0 w-16 justify-end pr-1">
            <TribalBanners side="right" />
          </aside>
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
            <p className="text-sm text-primary-foreground drop-shadow-text">
              Remnant Seed © 2026
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;