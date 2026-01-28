import { LandingHeader } from '@/components/LandingHeader';
import { TribalBanners } from '@/components/TribalBanners';
import { SanctuaryAmbienceToggle } from '@/components/SanctuaryAmbienceToggle';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

interface WelcomeLandingProps {
  onEnterApp: () => void;
  onViewBeliefs: () => void;
}

export const WelcomeLanding = ({ onEnterApp, onViewBeliefs }: WelcomeLandingProps) => {
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
        {/* Tribal Banners - positioned at extreme top left and right */}
        <div className="hidden lg:block fixed left-1 top-4 bottom-4 w-16 z-20">
          <TribalBanners side="left" />
        </div>
        <div className="hidden lg:block fixed right-1 top-4 bottom-4 w-16 z-20">
          <TribalBanners side="right" />
        </div>

        {/* Header - Indented to make room for tribes */}
        <header className="relative z-10 px-4 py-6 lg:mx-20">
          <LandingHeader onEnterApp={onEnterApp} />
        </header>

        {/* Main Content - Centered friendly greeting */}
        <main className="flex-1 flex flex-col items-center justify-center py-8 px-4 lg:px-24">
          {/* Friendly Welcome Card */}
          <div 
            className="w-full max-w-xl p-8 rounded-xl border-2 border-accent text-center"
            style={{
              background: 'rgba(88, 28, 135, 0.85)',
              backdropFilter: 'blur(8px)'
            }}
          >
            {/* Welcoming Message */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Welcome, Friend
            </h2>
            
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              Come sit at the table. Prophet Gad is here to guide you with wisdom from the Scriptures.
            </p>
            
            {/* Praying Hands Emoji as placeholder for friendly imagery */}
            <div className="text-6xl mb-6">🙏</div>
            
            <p className="text-white/80 mb-8">
              Whether you need encouragement, have questions about the Word, or simply want a morning blessing — you are welcome here.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onEnterApp}
                className="tabernacle-button px-6 py-3 text-lg font-bold"
              >
                Enter & Receive Your Blessing
              </button>
              
              <button
                onClick={onViewBeliefs}
                className="px-6 py-3 text-lg font-bold rounded border-2 border-accent text-white hover:bg-accent/20 transition-colors"
              >
                What We Believe
              </button>
            </div>
          </div>
        </main>

        {/* Mini Music Player - Bottom Right Corner */}
        <div className="fixed bottom-6 right-6 z-30">
          <SanctuaryAmbienceToggle />
        </div>

        {/* Footer */}
        <footer className="relative z-10 py-6 text-center lg:mx-20">
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

export default WelcomeLanding;
