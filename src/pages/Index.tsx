import { useUserProfile } from '@/hooks/useUserProfile';
import { Onboarding } from './Onboarding';
import { WelcomeLanding } from './WelcomeLanding';
import { PreLanding } from './PreLanding';
import { WhatWeBelieve } from './WhatWeBelieve';
import { useState } from 'react';

// Flow: 
// - Not logged in: WelcomeLanding (intro/music) → Onboarding → PreLanding (personalized home)
// - Logged in: PreLanding (personalized home) with access to WelcomeLanding via "Learn More"

type ViewState = 'intro' | 'home' | 'beliefs' | 'onboarding';

const Index = () => {
  const { profile, isLoading, createProfile } = useUserProfile();
  
  // Default view: logged in users go to home, others see intro
  const [currentView, setCurrentView] = useState<ViewState>(() => 
    profile ? 'home' : 'intro'
  );

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

  // Show onboarding when user explicitly wants to sign up (not logged in)
  if (!profile && currentView === 'onboarding') {
    return (
      <Onboarding 
        onComplete={(name, ageGroup, city, state, schoolDistrict) => {
          createProfile(name, ageGroup, city, state, schoolDistrict);
          setCurrentView('home'); // Go to personalized home after signup
        }} 
        onBack={() => setCurrentView('intro')} 
      />
    );
  }

  // What We Believe (heavy doctrine page)
  if (currentView === 'beliefs') {
    return <WhatWeBelieve onBack={() => setCurrentView(profile ? 'home' : 'intro')} />;
  }

  // Logged-in users: PreLanding is their personalized home
  if (profile && currentView === 'home') {
    return (
      <PreLanding 
        onEnterApp={() => {}} // Already home
        onLearnMore={() => setCurrentView('beliefs')}
      />
    );
  }

  // Not logged in: WelcomeLanding is the intro page with music/Prophet Gad greeting
  return (
    <WelcomeLanding 
      onEnterApp={() => setCurrentView('onboarding')} 
      onViewBeliefs={() => setCurrentView('beliefs')}
    />
  );
};

export default Index;