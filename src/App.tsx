import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { SanctuaryAmbienceProvider } from "@/contexts/SanctuaryAmbienceContext";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import AppHome from "./pages/AppHome";
import SpiritPillar from "./pages/SpiritPillar";
import EarPillar from "./pages/EarPillar";
import MouthPillar from "./pages/MouthPillar";
import WalletPillar from "./pages/WalletPillar";
import DoctrinePillar from "./pages/DoctrinePillar";
import CounselChat from "./pages/CounselChat";
import Settings from "./pages/Settings";
import MusicSettings from "./pages/MusicSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { profile, updateProfile, logout, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If no profile, show onboarding via Index
  if (!profile) {
    return (
      <Routes>
        <Route path="*" element={<Index />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/app" element={<AppHome profile={profile} onLogout={logout} />} />
      <Route path="/spirit" element={<SpiritPillar profile={profile} onLogout={logout} />} />
      <Route path="/ear" element={<EarPillar profile={profile} onLogout={logout} />} />
      <Route path="/mouth" element={<MouthPillar profile={profile} onLogout={logout} />} />
      <Route path="/wallet" element={<WalletPillar profile={profile} onLogout={logout} />} />
      <Route path="/doctrine" element={<DoctrinePillar profile={profile} onLogout={logout} />} />
      <Route path="/counsel" element={<CounselChat profile={profile} onLogout={logout} />} />
      <Route path="/settings" element={<Settings profile={profile} onUpdateProfile={updateProfile} onLogout={logout} />} />
      <Route path="/music-settings" element={<MusicSettings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SanctuaryAmbienceProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SanctuaryAmbienceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;