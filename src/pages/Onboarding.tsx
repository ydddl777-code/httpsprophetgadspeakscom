import { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PillarIcon } from '@/components/PillarIcon';
import { AgeGroup, AGE_GROUP_LABELS } from '@/lib/types';
import { cn } from '@/lib/utils';

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="hero-gradient text-primary-foreground py-12 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex bg-accent/20 p-4 rounded-2xl mb-4">
            <PillarIcon className="w-16 h-16 text-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">THE PILLAR</h1>
          <p className="text-primary-foreground/80 text-lg">
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
                'h-1.5 flex-1 rounded-full transition-all duration-300',
                s <= step ? 'bg-accent' : 'bg-muted'
              )}
            />
          ))}
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-2xl text-primary mb-2">Welcome, friend</h2>
            <p className="text-muted-foreground mb-8">What should we call you?</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-foreground">Your Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-2 h-12 text-lg"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Age Group */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-2xl text-primary mb-2">Hello, {name}!</h2>
            <p className="text-muted-foreground mb-8">Which age group are you in?</p>
            <div className="grid grid-cols-2 gap-4">
              {(Object.entries(AGE_GROUP_LABELS) as [AgeGroup, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setAgeGroup(key)}
                  className={cn(
                    'p-6 rounded-2xl border-2 transition-all duration-200 text-left',
                    'hover:border-accent hover:shadow-md',
                    ageGroup === key
                      ? 'border-accent bg-accent/10 shadow-md'
                      : 'border-border bg-card'
                  )}
                >
                  <span className="text-2xl mb-2 block">
                    {key === 'child' && '👶'}
                    {key === 'teen' && '🧑'}
                    {key === 'parent' && '👨‍👩‍👧'}
                    {key === 'elder' && '👴'}
                  </span>
                  <span className="font-semibold text-foreground">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-2xl text-primary mb-2">Almost there!</h2>
            <p className="text-muted-foreground mb-8">Where are you located?</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="city" className="text-foreground">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Your city"
                  className="mt-2 h-12"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-foreground">State</Label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mt-2 w-full h-12 px-3 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="">Select a state</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {(ageGroup === 'child' || ageGroup === 'teen') && (
                <div>
                  <Label htmlFor="school" className="text-foreground">
                    School District (Optional)
                  </Label>
                  <Input
                    id="school"
                    value={schoolDistrict}
                    onChange={(e) => setSchoolDistrict(e.target.value)}
                    placeholder="Your school district"
                    className="mt-2 h-12"
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
              className="flex-1 h-12 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              'flex-1 h-12 gap-2 bg-primary hover:bg-primary/90',
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
