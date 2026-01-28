import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MusicManager } from '@/components/MusicManager';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

const MusicSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${goldenGateBackground})` }}
      />
      <div className="fixed inset-0 dark-overlay" />
      <div className="fixed inset-0 linen-overlay pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 min-h-screen py-8 px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div
            className="p-6 rounded-xl border-2 border-accent"
            style={{
              background: 'rgba(88, 28, 135, 0.85)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <MusicManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicSettings;
