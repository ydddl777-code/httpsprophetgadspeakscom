import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Utensils, Search, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppHeader } from '@/components/AppHeader';
import { UserProfile, FoodCheckResult } from '@/lib/types';
import { CLEAN_FOODS, UNCLEAN_FOODS } from '@/lib/data';
import { cn } from '@/lib/utils';
import templeBackground from '@/assets/temple-background.jpg';

interface MouthPillarProps {
  profile: UserProfile;
  onLogout: () => void;
}

const checkFood = (food: string): FoodCheckResult | null => {
  const foodLower = food.toLowerCase().trim();
  
  const isClean = CLEAN_FOODS.some((f) => foodLower.includes(f) || f.includes(foodLower));
  const isUnclean = UNCLEAN_FOODS.some((f) => foodLower.includes(f) || f.includes(foodLower));

  if (isClean) {
    return {
      food,
      status: 'clean',
      reference: 'Leviticus 11:3 - This is approved for consumption.',
    };
  }
  
  if (isUnclean) {
    return {
      food,
      status: 'unclean',
      reference: 'Leviticus 11:12 - This is an abomination and should not be eaten.',
    };
  }

  return null;
};

export const MouthPillar = ({ profile, onLogout }: MouthPillarProps) => {
  const navigate = useNavigate();
  const [food, setFood] = useState('');
  const [result, setResult] = useState<FoodCheckResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleCheck = () => {
    if (!food.trim()) return;
    
    const checkResult = checkFood(food);
    if (checkResult) {
      setResult(checkResult);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const handleClear = () => {
    setFood('');
    setResult(null);
    setNotFound(false);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.9)), url(${templeBackground})` 
      }}
    >
      <AppHeader userName={profile.name} onLogout={onLogout} showLogout />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-pillar-mouth/10 p-4 rounded-2xl mb-4">
            <Utensils className="w-12 h-12 text-pillar-mouth" />
          </div>
          <h1 className="text-3xl text-primary font-bold mb-2">MOUTH PILLAR</h1>
          <p className="text-muted-foreground">Food Checker</p>
        </div>

        {/* Input Form */}
        <div className="bg-card rounded-3xl shadow-lg border border-border p-8 mb-6 gold-border-frame">
          <div className="space-y-4">
            <div>
              <Label htmlFor="food" className="text-foreground">Food Name</Label>
              <Input
                id="food"
                value={food}
                onChange={(e) => setFood(e.target.value)}
                placeholder="Enter food name (e.g., chicken, shrimp)"
                className="mt-2 h-12"
                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleCheck}
                disabled={!food.trim()}
                className="flex-1 h-12 bg-pillar-mouth hover:bg-pillar-mouth/90 text-primary-foreground gap-2"
              >
                <Search className="w-4 h-4" />
                Check Food
              </Button>
              {(result || notFound) && (
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="h-12"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div
            className={cn(
              'rounded-2xl p-6 border',
              result.status === 'clean' && 'bg-success/10 border-success/20',
              result.status === 'unclean' && 'bg-danger/10 border-danger/20'
            )}
          >
            <div className="flex items-start gap-4">
              {result.status === 'clean' ? (
                <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-danger flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3
                  className={cn(
                    'text-xl font-bold mb-1',
                    result.status === 'clean' ? 'text-success' : 'text-danger'
                  )}
                >
                  {result.status === 'clean' ? 'CLEAN' : 'UNCLEAN'}
                </h3>
                <p className="text-foreground font-medium text-lg mb-2 capitalize">
                  {result.food}
                </p>
                <p className="text-foreground/80">
                  {result.reference}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Not Found */}
        {notFound && (
          <div className="rounded-2xl p-6 border border-muted bg-muted/50">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-8 h-8 text-muted-foreground flex-shrink-0" />
              <div>
                <h3 className="text-xl text-foreground font-bold mb-1">Not Found</h3>
                <p className="text-muted-foreground">
                  We don't have information about "{food}" in our database. Try a more specific term or consult Leviticus 11 directly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-success/5 border border-success/10 rounded-2xl p-5">
            <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Clean Examples
            </h4>
            <ul className="text-sm text-foreground/70 space-y-1">
              <li>Chicken, Turkey, Duck</li>
              <li>Beef, Lamb, Deer</li>
              <li>Salmon, Tuna, Cod</li>
            </ul>
          </div>
          <div className="bg-danger/5 border border-danger/10 rounded-2xl p-5">
            <h4 className="font-semibold text-danger mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Unclean Examples
            </h4>
            <ul className="text-sm text-foreground/70 space-y-1">
              <li>Pork, Bacon, Ham</li>
              <li>Shrimp, Crab, Lobster</li>
              <li>Catfish, Eel, Shark</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MouthPillar;