import { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PillarIcon } from '@/components/PillarIcon';
import { AgeGroup, AGE_GROUP_LABELS } from '@/lib/types';
import { cn } from '@/lib/utils';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

interface OnboardingProps {
  onComplete: (name: string, ageGroup: AgeGroup, city: string, state: string, schoolDistrict?: string) => void;
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

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [schoolDistrict, setSchoolDistrict] = useState('');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(name, ageGroup!, city, state, schoolDistrict || undefined);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return name.trim().length >= 2;
      case 2:
        return ageGroup !== null;
      case 3:
        return city.trim().length >= 2 && state.length > 0;
      default:
        return false;
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `url(${goldenGateBackground})` 
      }}
    >
      {/* Header */}
      <div className="py-12 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex bg-purple-600/20 backdrop-blur-sm p-4 rounded-2xl mb-4">
            <PillarIcon className="w-16 h-16 text-purple-800" />
          </div>
          <h1 className="text-3xl font-bold text-purple-900 mb-2">THE PILLAR</h1>
          <p className="text-purple-800/80 text-lg">
            Five Pillars That Stand When Everything Falls
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-md mx-auto w-full px-6 py-6">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'h-1.5 flex-1 rounded-full',
                s <= step ? 'bg-purple-700' : 'bg-purple-300/50'
              )}
            />
          ))}
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-300/30">
            <h2 className="text-2xl text-purple-900 font-bold mb-2">Welcome, friend</h2>
            <p className="text-purple-800/80 mb-8">What should we call you?</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-purple-900 font-medium">Your Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-2 h-12 text-lg bg-white/50 border-purple-300/50 text-purple-900 placeholder:text-purple-600/50"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Age Group */}
        {step === 2 && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-300/30">
            <h2 className="text-2xl text-purple-900 font-bold mb-2">Hello, {name}!</h2>
            <p className="text-purple-800/80 mb-8">Which age group are you in?</p>
            <div className="grid grid-cols-2 gap-4">
              {(Object.entries(AGE_GROUP_LABELS) as [AgeGroup, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setAgeGroup(key)}
                  className={cn(
                    'p-6 rounded-2xl border-2 text-left backdrop-blur-sm',
                    'hover:border-purple-500 hover:shadow-md transition-all',
                    ageGroup === key
                      ? 'border-purple-600 bg-purple-500/30 shadow-md'
                      : 'border-purple-300/50 bg-white/30'
                  )}
                >
                  <span className="text-2xl mb-2 block">
                    {key === 'child' && '👶'}
                    {key === 'teen' && '🧑'}
                    {key === 'parent' && '👨‍👩‍👧'}
                    {key === 'elder' && '👴'}
                  </span>
                  <span className="font-semibold text-purple-900">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-300/30">
            <h2 className="text-2xl text-purple-900 font-bold mb-2">Almost there!</h2>
            <p className="text-purple-800/80 mb-8">Where are you located?</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="city" className="text-purple-900 font-medium">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Your city"
                  className="mt-2 h-12 bg-white/50 border-purple-300/50 text-purple-900 placeholder:text-purple-600/50"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-purple-900 font-medium">State</Label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mt-2 w-full h-12 px-3 rounded-lg border border-purple-300/50 bg-white/50 text-purple-900"
                >
                  <option value="">Select a state</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {(ageGroup === 'child' || ageGroup === 'teen') && (
                <div>
                  <Label htmlFor="school" className="text-purple-900 font-medium">
                    School District (Optional)
                  </Label>
                  <Input
                    id="school"
                    value={schoolDistrict}
                    onChange={(e) => setSchoolDistrict(e.target.value)}
                    placeholder="Your school district"
                    className="mt-2 h-12 bg-white/50 border-purple-300/50 text-purple-900 placeholder:text-purple-600/50"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-10">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 h-12 gap-2 border-purple-400/50 text-purple-900 hover:bg-purple-500/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              'flex-1 h-12 gap-2 bg-purple-700 hover:bg-purple-800 text-white',
              step === 1 && 'w-full'
            )}
          >
            {step === 3 ? 'Get Started' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
