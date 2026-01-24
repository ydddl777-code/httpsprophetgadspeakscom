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

        {/* Main Content with Tribal Banners */}
        <main className="flex-1 flex">
          {/* Left Tribal Banners */}
          <aside className="hidden lg:flex w-20 justify-center">
            <TribalBanners side="left" />
          </aside>

          {/* Central Content */}
          <div className="flex-1 flex flex-col items-center justify-center py-8 space-y-12">
            {/* Five Pillars */}
            <FivePillarsDisplay />

            {/* Who We Are Section */}
            <WhoWeAreSection />
          </div>

          {/* Right Tribal Banners */}
          <aside className="hidden lg:flex w-20 justify-center">
            <TribalBanners side="right" />
          </aside>
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-6 text-center">
          <p className="text-sm text-primary-foreground/80 drop-shadow-text">
            Remnant Seed © 2026
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;