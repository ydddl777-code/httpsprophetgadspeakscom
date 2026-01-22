import { useUserProfile } from '@/hooks/useUserProfile';
import { Onboarding } from './Onboarding';
import { Home } from './Home';

const Index = () => {
  const { profile, isLoading, createProfile, logout } = useUserProfile();

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

  if (!profile) {
    return <Onboarding onComplete={createProfile} />;
  }

  return <Home profile={profile} onLogout={logout} />;
};

export default Index;
