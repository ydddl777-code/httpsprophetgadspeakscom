import { useUserProfile } from '@/hooks/useUserProfile';
import { Onboarding } from './Onboarding';
import { LandingPage } from './LandingPage';
import { AppHome } from './AppHome';
import { useState } from 'react';

const Index = () => {
  const { profile, isLoading, createProfile, logout } = useUserProfile();
  const [showApp, setShowApp] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show onboarding
  if (!profile) {
    return <Onboarding onComplete={createProfile} />;
  }

  // Logged in - show either Landing or App based on state
  if (showApp) {
    return <AppHome profile={profile} onLogout={logout} />;
  }

  return <LandingPage onEnterApp={() => setShowApp(true)} />;
};

export default Index;