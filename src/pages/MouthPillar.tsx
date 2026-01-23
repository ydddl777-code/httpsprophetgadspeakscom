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
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

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

  const firstName = profile.name.split(' ')[0];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `url(${goldenGateBackground})` 
      }}
    >
      <AppHeader userName={firstName} onLogout={onLogout} showLogout />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 gap-2 text-purple-900 hover:text-purple-700 hover:bg-purple-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex bg-purple-600/20 backdrop-blur-sm p-3 rounded-xl mb-3">
            <Utensils className="w-10 h-10 text-purple-800" />
          </div>
          <h1 className="text-2xl text-purple-900 font-bold mb-1">MOUTH PILLAR</h1>
          <p className="text-purple-800/80 text-sm">Food Checker</p>
        </div>

        {/* Input Form */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-300/30 p-5 mb-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="food" className="text-purple-900 font-medium">Food Name</Label>
              <Input
                id="food"
                value={food}
                onChange={(e) => setFood(e.target.value)}
                placeholder="Enter food name (e.g., chicken, shrimp)"
                className="mt-2 h-12 bg-white/50 border-purple-300/50 text-purple-900 placeholder:text-purple-600/50"
                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleCheck}
                disabled={!food.trim()}
                className="flex-1 h-12 bg-purple-700 hover:bg-purple-800 text-white gap-2"
              >
                <Search className="w-4 h-4" />
                Check Food
              </Button>
              {(result || notFound) && (
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="h-12 border-purple-400/50 text-purple-900 hover:bg-purple-500/20"
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
              'rounded-2xl p-5 border backdrop-blur-sm',
              result.status === 'clean' && 'bg-green-500/20 border-green-400/30',
              result.status === 'unclean' && 'bg-red-500/20 border-red-400/30'
            )}
          >
            <div className="flex items-start gap-4">
              {result.status === 'clean' ? (
                <CheckCircle className="w-8 h-8 text-green-700 flex-shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-red-700 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3
                  className={cn(
                    'text-xl font-bold mb-1',
                    result.status === 'clean' ? 'text-green-800' : 'text-red-800'
                  )}
                >
                  {result.status === 'clean' ? 'CLEAN' : 'UNCLEAN'}
                </h3>
                <p className="text-purple-900 font-medium text-lg mb-2 capitalize">
                  {result.food}
                </p>
                <p className="text-purple-900/80">
                  {result.reference}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Not Found */}
        {notFound && (
          <div className="rounded-2xl p-5 border border-purple-400/30 bg-purple-200/20 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-8 h-8 text-purple-700 flex-shrink-0" />
              <div>
                <h3 className="text-xl text-purple-900 font-bold mb-1">Not Found</h3>
                <p className="text-purple-800/80">
                  We don't have information about "{food}" in our database. Try a more specific term or consult Leviticus 11 directly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4" />
              Clean Examples
            </h4>
            <ul className="text-sm text-purple-900/80 space-y-1">
              <li>Chicken, Turkey, Duck</li>
              <li>Beef, Lamb, Deer</li>
              <li>Salmon, Tuna, Cod</li>
            </ul>
          </div>
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4">
            <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2 text-sm">
              <XCircle className="w-4 h-4" />
              Unclean Examples
            </h4>
            <ul className="text-sm text-purple-900/80 space-y-1">
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
