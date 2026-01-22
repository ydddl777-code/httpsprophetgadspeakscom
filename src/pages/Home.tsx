import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Music, Utensils, Wallet, BookOpen } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { MorningGreeting } from '@/components/MorningGreeting';
import { PillarButton } from '@/components/PillarButton';
import { UserProfile } from '@/lib/types';

interface HomeProps {
  profile: UserProfile;
  onLogout: () => void;
}

export const Home = ({ profile, onLogout }: HomeProps) => {
  const navigate = useNavigate();
  const [showGreeting, setShowGreeting] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        userName={profile.name}
        onSettingsClick={() => navigate('/settings')}
        onLogout={onLogout}
        showLogout
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {showGreeting ? (
          <MorningGreeting profile={profile} onComplete={() => setShowGreeting(false)} />
        ) : (
          <div className="animate-fade-in">
            {/* Welcome back message */}
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-primary mb-2">
                Shalom, {profile.name}
              </h2>
              <p className="text-muted-foreground">
                Choose a pillar to begin your journey today
              </p>
            </div>

            {/* Pillars Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <PillarButton
                icon={<Sparkles className="w-10 h-10" />}
                title="SPIRIT"
                subtitle="Daily Devotional"
                onClick={() => navigate('/spirit')}
                variant="spirit"
              />
              <PillarButton
                icon={<Music className="w-10 h-10" />}
                title="EAR"
                subtitle="Music Checker"
                onClick={() => navigate('/ear')}
                variant="ear"
              />
              <PillarButton
                icon={<Utensils className="w-10 h-10" />}
                title="MOUTH"
                subtitle="Food Checker"
                onClick={() => navigate('/mouth')}
                variant="mouth"
              />
              <PillarButton
                icon={<Wallet className="w-10 h-10" />}
                title="WALLET"
                subtitle="Money Calculator"
                onClick={() => navigate('/wallet')}
                variant="wallet"
              />
              <PillarButton
                icon={<BookOpen className="w-10 h-10" />}
                title="DOCTRINE"
                subtitle="Ask Counsel"
                onClick={() => navigate('/doctrine')}
                variant="doctrine"
                className="col-span-2 lg:col-span-1"
              />
            </div>

            {/* Show greeting again button */}
            <div className="mt-10 text-center">
              <button
                onClick={() => setShowGreeting(true)}
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Show today's verse again
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center">
        <p className="text-xs text-muted-foreground font-display">
          "Five Pillars That Stand When Everything Falls"
        </p>
      </footer>
    </div>
  );
};

export default Home;
