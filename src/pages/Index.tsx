import { useUserProfile } from '@/hooks/useUserProfile';
import { Onboarding } from './Onboarding';
import { WelcomeLanding } from './WelcomeLanding';
import { WhatWeBelieve } from './WhatWeBelieve';
import { AppHome } from './AppHome';
import { useState } from 'react';

type ViewState = 'welcome' | 'beliefs' | 'app';

const Index = () => {
  const { profile, isLoading, createProfile, logout } = useUserProfile();
  const [currentView, setCurrentView] = useState<ViewState>('welcome');

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

  // Logged in - show appropriate view based on state
  if (currentView === 'app') {
    return <AppHome profile={profile} onLogout={logout} />;
  }

  if (currentView === 'beliefs') {
    return <WhatWeBelieve onBack={() => setCurrentView('welcome')} />;
  }

  return (
    <WelcomeLanding 
      onEnterApp={() => setCurrentView('app')} 
      onViewBeliefs={() => setCurrentView('beliefs')}
    />
  );
};

export default Index;