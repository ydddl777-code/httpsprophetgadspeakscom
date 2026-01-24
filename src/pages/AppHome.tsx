import { useNavigate } from 'react-router-dom';
import { Flame, Music, Wheat, Scale, ScrollText, Settings, LogOut } from 'lucide-react';
import { FIVE_DISCIPLINES } from '@/lib/pillarContent';
import { UserProfile } from '@/lib/types';
import { ClockDisplay } from '@/components/ClockDisplay';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

interface AppHomeProps {
  profile: UserProfile;
  onLogout: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  candle: <Flame className="w-6 h-6" />,
  music: <Music className="w-6 h-6" />,
  wheat: <Wheat className="w-6 h-6" />,
  scale: <Scale className="w-6 h-6" />,
  scroll: <ScrollText className="w-6 h-6" />,
};

export const AppHome = ({ profile, onLogout }: AppHomeProps) => {
  const navigate = useNavigate();
  const firstName = profile.name.split(' ')[0];

  const handleDisciplineClick = (id: string) => {
    // Navigate to the corresponding discipline page
    switch (id) {
      case 'devotion':
        navigate('/spirit'); // Sabbath/devotion features
        break;
      case 'praise':
        navigate('/ear'); // Music/hymnal
        break;
      case 'sustenance':
        navigate('/mouth'); // Food/diet
        break;
      case 'stewardship':
        navigate('/wallet'); // Finances
        break;
      case 'study':
        navigate('/doctrine'); // Doctrine Q&A
        break;
      default:
        break;
    }
  };

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
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold gold-text drop-shadow-text">
                REMNANT SEED
              </h1>
              <p className="text-sm text-primary-foreground/90 drop-shadow-text">
                Welcome back, {firstName}
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <ClockDisplay size="small" />
              
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/settings')}
                  className="p-2 rounded-lg bg-card/30 backdrop-blur-sm border border-accent/30 text-primary-foreground hover:bg-card/50 transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg bg-card/30 backdrop-blur-sm border border-accent/30 text-primary-foreground hover:bg-card/50 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Section Title */}
            <h2 className="text-center text-xl md:text-2xl font-bold gold-text drop-shadow-text mb-8">
              THE FIVE DISCIPLINES
            </h2>

            {/* Discipline Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FIVE_DISCIPLINES.map((discipline) => (
                <button
                  key={discipline.id}
                  onClick={() => handleDisciplineClick(discipline.id)}
                  className="tabernacle-button flex-col items-start text-left p-5 h-auto"
                >
                  <div className="flex items-center gap-3 mb-2 w-full">
                    <div className="p-2 rounded-lg bg-accent/20 text-accent">
                      {iconMap[discipline.icon]}
                    </div>
                    <span className="font-bold text-lg">{discipline.title}</span>
                  </div>
                  <p className="text-sm text-primary-foreground/80 mb-3">
                    {discipline.description}
                  </p>
                  <p className="text-xs italic text-primary-foreground/60 border-t border-primary-foreground/20 pt-2 w-full">
                    {discipline.scripture}
                  </p>
                </button>
              ))}
            </div>

            {/* Prophet Gad's Counsel Section */}
            <section className="mt-12">
              <h3 className="text-lg font-bold gold-text drop-shadow-text mb-4">
                PROPHET GAD'S COUNSEL
              </h3>
              <div className="parchment-bg p-4 space-y-2">
                <CounselTopic 
                  title="No Contemporary Worship Music for the Israelites" 
                  description="Music & Worship warnings" 
                />
                <CounselTopic 
                  title="No Dogs for the Israelites" 
                  description="Pet idolatry (Inordinate Affection)" 
                />
                <CounselTopic 
                  title="No King" 
                  description="The King's Meat - Food and health" 
                />
                <CounselTopic 
                  title="The Heavy Burden of Education" 
                  description="False Wisdom - Debt and finances" 
                />
              </div>
            </section>

            {/* Back to Landing */}
            <div className="mt-10 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground hover:underline drop-shadow-text"
              >
                View The Five Pillars
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center">
          <p className="text-xs text-primary-foreground/70 drop-shadow-text italic">
            "Five Pillars That Stand When Everything Falls"
          </p>
        </footer>
      </div>
    </div>
  );
};

interface CounselTopicProps {
  title: string;
  description: string;
}

const CounselTopic = ({ title, description }: CounselTopicProps) => (
  <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg hover:bg-card/50 cursor-pointer transition-colors">
    <div>
      <span className="font-semibold text-foreground">{title}</span>
      <span className="text-sm text-muted-foreground ml-2">({description})</span>
    </div>
    <span className="text-accent">→</span>
  </div>
);

export default AppHome;