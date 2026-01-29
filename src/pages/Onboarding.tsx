import { useState } from 'react';
import { ArrowLeft, ArrowRight, Bell, BellOff } from 'lucide-react';
import { AgeGroup, AGE_GROUP_LABELS } from '@/lib/types';
import { cn } from '@/lib/utils';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

interface OnboardingProps {
  onComplete: (name: string, ageGroup: AgeGroup, city: string, state: string, schoolDistrict?: string) => void;
  onBack?: () => void;
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

export const Onboarding = ({ onComplete, onBack }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | ''>('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [schoolDistrict, setSchoolDistrict] = useState('');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(name, ageGroup as AgeGroup, city, state, schoolDistrict || undefined);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length >= 2;
      case 2: return ageGroup !== '';
      case 3: return city.trim().length >= 2 && state !== '';
      default: return false;
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${goldenGateBackground})` }} />
      <div className="fixed inset-0 dark-overlay" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gold-text drop-shadow-text">REMNANT SEED</h1>
          <p className="text-primary-foreground/90 drop-shadow-text mt-2">Welcome to The Pillar</p>
        </div>

        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className={cn('w-3 h-3 rounded-full', s === step ? 'bg-accent' : s < step ? 'bg-accent/60' : 'bg-primary-foreground/30')} />
          ))}
        </div>

        <div 
          className="w-full max-w-md p-6 rounded-lg border border-accent"
          style={{
            background: 'rgba(88, 28, 135, 0.85)',
            backdropFilter: 'blur(4px)'
          }}
        >
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-primary-foreground text-center drop-shadow-text">What name would you like to be called?</h2>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full px-4 py-3 rounded-lg border-2 border-accent/50 bg-white/10 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-accent" autoFocus />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-primary-foreground text-center drop-shadow-text">Select your age group</h2>
              <div className="grid grid-cols-1 gap-2">
                {(Object.entries(AGE_GROUP_LABELS) as [AgeGroup, string][]).map(([key, label]) => (
                  <button key={key} onClick={() => setAgeGroup(key)} className={cn('px-4 py-3 rounded-lg border-2 text-left font-medium text-primary-foreground', ageGroup === key ? 'border-accent bg-accent/30' : 'border-accent/30 bg-white/10 hover:border-accent/50')}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-primary-foreground text-center drop-shadow-text">Where are you located?</h2>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full px-4 py-3 rounded-lg border-2 border-accent/50 bg-white/10 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-accent" />
              <select value={state} onChange={(e) => setState(e.target.value)} className="w-full px-4 py-3 rounded-lg border-2 border-accent/50 bg-white/10 text-primary-foreground focus:outline-none focus:border-accent">
                <option value="" className="bg-purple-900 text-white">Select State</option>
                {US_STATES.map((s) => (<option key={s} value={s} className="bg-purple-900 text-white">{s}</option>))}
              </select>
              {(ageGroup === 'child' || ageGroup === 'teen') && (
                <input type="text" value={schoolDistrict} onChange={(e) => setSchoolDistrict(e.target.value)} placeholder="School District (optional)" className="w-full px-4 py-3 rounded-lg border-2 border-accent/50 bg-white/10 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-accent" />
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-8">
            <button onClick={handleBack} disabled={step === 1 && !onBack} className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-primary-foreground', step === 1 && !onBack ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10')}>
              <ArrowLeft className="w-4 h-4" /> {step === 1 ? 'Exit' : 'Back'}
            </button>
            <button onClick={handleNext} disabled={!canProceed()} className={cn('flex items-center gap-2 px-6 py-2 rounded-lg font-semibold', canProceed() ? 'tabernacle-button' : 'bg-white/20 text-primary-foreground/50 cursor-not-allowed')}>
              {step === 3 ? 'Get Started' : 'Continue'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
