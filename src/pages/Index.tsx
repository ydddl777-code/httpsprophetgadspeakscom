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

  // Auth form (login/signup) — styled to match the landing page:
  // Jerusalem golden-gate background visible behind a translucent purple
  // card with gold border and gold accent stripe.
  if (currentView === 'auth') {
    const ARIAL = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
    return (
      <div
        className="min-h-screen relative flex items-center justify-center p-4"
        style={{ fontFamily: ARIAL }}
      >
        {/* Jerusalem golden-gate background — LIGHT overlay so painting is visible */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${goldenGateBackground})` }}
        />
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(40,20,5,0.2) 0%, rgba(40,20,5,0.45) 100%)',
          }}
        />

        {/* Auth Card — translucent purple, gold border, matching landing card */}
        <div
          className="relative z-10 w-full max-w-md rounded-2xl backdrop-blur-sm shadow-2xl overflow-hidden"
          style={{
            background: 'rgba(88, 28, 135, 0.82)',
            border: '2px solid rgba(212, 165, 63, 0.9)',
            boxShadow:
              '0 10px 30px rgba(0,0,0,0.4), 0 0 40px rgba(212,165,63,0.25), inset 0 0 0 1px rgba(255,240,200,0.15)',
            fontFamily: ARIAL,
          }}
        >
          {/* Gold accent stripe at top */}
          <div className="h-1.5 bg-gradient-to-r from-accent/60 via-accent to-accent/60" />

          <div className="p-6 md:p-8">
            <h1
              className="text-3xl md:text-4xl font-black text-center mb-2 tracking-wider"
              style={{
                fontFamily: ARIAL,
                color: '#fdf1c8',
                textShadow: '0 2px 6px rgba(0,0,0,0.55), 0 0 18px rgba(255,220,150,0.3)',
                letterSpacing: '0.08em',
              }}
            >
              FERVENT COUNSEL
            </h1>
            <p
              className="text-center text-base italic mb-6"
              style={{
                fontFamily: ARIAL,
                color: '#fef5d7',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              Pastoral counsel, fervent prayer.
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

          {/* Gold accent stripe at bottom */}
          <div className="h-1.5 bg-gradient-to-r from-accent/60 via-accent to-accent/60" />
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
