import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/AuthForm';
import { Onboarding } from './Onboarding';
import { WelcomeLanding } from './WelcomeLanding';
import { PreLanding } from './PreLanding';
import { WhatWeBelieve } from './WhatWeBelieve';
import { ChildManagement } from '@/components/ChildManagement';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

// Flow: 
// - Not logged in: WelcomeLanding (intro/music) → Auth → Onboarding (profile) → PreLanding (personalized home)
// - Logged in with profile: PreLanding (personalized home) with access to WelcomeLanding via "Learn More"
// - Logged in without profile: Onboarding to create profile

type ViewState = 'intro' | 'auth' | 'profile' | 'home' | 'beliefs' | 'children';

const Index = () => {
  const { 
    user, 
    profile, 
    children,
    isLoading, 
    signUp, 
    signIn, 
    signOut, 
    createProfile,
    addChild,
    updateChild,
    deleteChild
  } = useAuth();
  
  // Determine initial view based on auth state
  const getInitialView = (): ViewState => {
    if (!user) return 'intro';
    if (!profile) return 'profile';
    return 'home';
  };
  
  const [currentView, setCurrentView] = useState<ViewState>(getInitialView);

  // Handle auth state changes
  const handleAuthStateChange = () => {
    if (!isLoading && !user && (currentView === 'home' || currentView === 'children' || currentView === 'profile')) {
      setCurrentView('intro');
    } else if (!isLoading && user && !profile && currentView === 'home') {
      setCurrentView('profile');
    }
  };

  // Run auth state handler (but not as useEffect to avoid loops)
  if (!isLoading) {
    if (!user && currentView !== 'intro' && currentView !== 'auth' && currentView !== 'beliefs') {
      // Handled inline below
    }
  }

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

  // Auth form (login/signup)
  if (currentView === 'auth') {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        {/* Background */}
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${goldenGateBackground})` }}
        />
        <div className="fixed inset-0 bg-black/70" />
        
        {/* Auth Card */}
        <div 
          className="relative z-10 w-full max-w-md p-6 rounded-2xl border-2 border-accent/50"
          style={{ background: 'rgba(88, 28, 135, 0.9)', backdropFilter: 'blur(12px)' }}
        >
          <h1 className="font-display text-2xl font-bold text-white text-center mb-1 tracking-wide">
            FERVENT COUNSEL
          </h1>
          <p className="text-center text-white/80 text-sm italic mb-6">
            Pastoral counsel, fervent prayer. By God's prophet.
          </p>
          <AuthForm
            onSignUp={signUp}
            onSignIn={signIn}
            onSuccess={() => {
              // After auth, check if profile exists
              if (profile) {
                setCurrentView('home');
              } else {
                setCurrentView('profile');
              }
            }}
            onBack={() => setCurrentView('intro')}
          />
        </div>
      </div>
    );
  }

  // Profile creation (onboarding)
  if (currentView === 'profile' || (user && !profile)) {
    return (
      <Onboarding 
        onComplete={async (name, ageGroup, city, state, schoolDistrict) => {
          await createProfile(name, ageGroup, city, state, schoolDistrict);
          setCurrentView('home');
        }} 
        onBack={() => {
          signOut();
          setCurrentView('intro');
        }} 
      />
    );
  }

  // What We Believe (heavy doctrine page)
  if (currentView === 'beliefs') {
    return <WhatWeBelieve onBack={() => setCurrentView(user ? 'home' : 'intro')} />;
  }

  // Child management (parent controls)
  if (currentView === 'children' && profile) {
    return (
      <ChildManagement
        children={children}
        onAddChild={addChild}
        onUpdateChild={updateChild}
        onDeleteChild={deleteChild}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  // Logged-in users: PreLanding is their personalized home
  if (user && profile) {
    return (
      <PreLanding 
        profile={profile}
        children={children}
        onLearnMore={() => setCurrentView('beliefs')}
        onManageChildren={() => setCurrentView('children')}
        onLogout={async () => {
          await signOut();
          setCurrentView('intro');
        }}
      />
    );
  }

  // Not logged in: WelcomeLanding is the intro page with music/Prophet Gad greeting
  return (
    <WelcomeLanding 
      onEnterApp={() => setCurrentView('auth')} 
      onViewBeliefs={() => setCurrentView('beliefs')}
    />
  );
};

export default Index;
