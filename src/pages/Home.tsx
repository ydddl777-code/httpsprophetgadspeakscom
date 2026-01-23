import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { MorningGreeting } from '@/components/MorningGreeting';
import { FivePillarsNav } from '@/components/FivePillarsNav';
import { UserProfile } from '@/lib/types';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

interface HomeProps {
  profile: UserProfile;
  onLogout: () => void;
}

export const Home = ({ profile, onLogout }: HomeProps) => {
  const navigate = useNavigate();
  const [showGreeting, setShowGreeting] = useState(true);

  // Extract first name only
  const firstName = profile.name.split(' ')[0];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `url(${goldenGateBackground})` 
      }}
    >
      <AppHeader
        userName={firstName}
        onSettingsClick={() => navigate('/settings')}
        onLogout={onLogout}
        showLogout
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {showGreeting ? (
          <MorningGreeting profile={profile} onComplete={() => setShowGreeting(false)} />
        ) : (
          <div>
            {/* Welcome back message */}
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl text-purple-900 font-bold mb-2">
                Good morning, {firstName}
              </h2>
              <p className="text-purple-800/80">
                Choose a pillar to begin your journey today
              </p>
            </div>

            {/* Five Pillars Navigation */}
            <FivePillarsNav />

            {/* Show greeting again button */}
            <div className="mt-10 text-center">
              <button
                onClick={() => setShowGreeting(true)}
                className="text-sm text-purple-700 hover:text-purple-900 hover:underline"
              >
                Show today's verse again
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center">
        <p className="text-xs text-purple-800/70 font-bold italic">
          "Five Pillars That Stand When Everything Falls"
        </p>
      </footer>
    </div>
  );
};

export default Home;
