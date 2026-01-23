import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, Calculator, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppHeader } from '@/components/AppHeader';
import { UserProfile, WalletCalculation } from '@/lib/types';
import { cn } from '@/lib/utils';
import goldenGateBackground from '@/assets/golden-gate-background.jpg';

interface WalletPillarProps {
  profile: UserProfile;
  onLogout: () => void;
}

const calculatePayment = (income: number, payment: number): WalletCalculation => {
  const percentage = income > 0 ? (payment / income) * 100 : 0;
  
  let status: 'safe' | 'warning' | 'danger';
  if (percentage <= 10) {
    status = 'safe';
  } else if (percentage <= 15) {
    status = 'warning';
  } else {
    status = 'danger';
  }

  return {
    income,
    payment,
    percentage: Math.round(percentage * 10) / 10,
    status,
    scripture: 'Proverbs 22:7 - "The rich ruleth over the poor, and the borrower is servant to the lender."',
  };
};

export const WalletPillar = ({ profile, onLogout }: WalletPillarProps) => {
  const navigate = useNavigate();
  const [income, setIncome] = useState('');
  const [payment, setPayment] = useState('');
  const [result, setResult] = useState<WalletCalculation | null>(null);

  const handleCalculate = () => {
    const incomeNum = parseFloat(income) || 0;
    const paymentNum = parseFloat(payment) || 0;
    
    if (incomeNum > 0 && paymentNum >= 0) {
      const calculation = calculatePayment(incomeNum, paymentNum);
      setResult(calculation);
    }
  };

  const handleClear = () => {
    setIncome('');
    setPayment('');
    setResult(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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
            <Wallet className="w-10 h-10 text-purple-800" />
          </div>
          <h1 className="text-2xl text-purple-900 font-bold mb-1">WALLET PILLAR</h1>
          <p className="text-purple-800/80 text-sm">Money Calculator</p>
        </div>

        {/* Input Form */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-300/30 p-5 mb-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="income" className="text-purple-900 font-medium">Monthly Income ($)</Label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-700">$</span>
                <Input
                  id="income"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="0"
                  className="h-12 pl-8 bg-white/50 border-purple-300/50 text-purple-900 placeholder:text-purple-600/50"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="payment" className="text-purple-900 font-medium">Monthly Payment/Debt ($)</Label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-700">$</span>
                <Input
                  id="payment"
                  type="number"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  placeholder="0"
                  className="h-12 pl-8 bg-white/50 border-purple-300/50 text-purple-900 placeholder:text-purple-600/50"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleCalculate}
                disabled={!income || parseFloat(income) <= 0}
                className="flex-1 h-12 bg-purple-700 hover:bg-purple-800 text-white gap-2"
              >
                <Calculator className="w-4 h-4" />
                Calculate
              </Button>
              {result && (
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
              result.status === 'safe' && 'bg-green-500/20 border-green-400/30',
              result.status === 'warning' && 'bg-yellow-500/20 border-yellow-400/30',
              result.status === 'danger' && 'bg-red-500/20 border-red-400/30'
            )}
          >
            <div className="flex items-start gap-4">
              {result.status === 'safe' ? (
                <CheckCircle className="w-8 h-8 text-green-700 flex-shrink-0" />
              ) : (
                <AlertTriangle className={cn(
                  'w-8 h-8 flex-shrink-0',
                  result.status === 'warning' ? 'text-yellow-700' : 'text-red-700'
                )} />
              )}
              <div className="flex-1">
                <h3
                  className={cn(
                    'text-xl font-bold mb-3',
                    result.status === 'safe' && 'text-green-800',
                    result.status === 'warning' && 'text-yellow-800',
                    result.status === 'danger' && 'text-red-800'
                  )}
                >
                  {result.status === 'safe' && 'SAFE'}
                  {result.status === 'warning' && 'WARNING'}
                  {result.status === 'danger' && 'DANGER'}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm text-purple-700">Payment</p>
                    <p className="text-lg font-semibold text-purple-900">
                      {formatCurrency(result.payment)}
                    </p>
                  </div>
                  <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm text-purple-700">Of Income</p>
                    <p className="text-lg font-semibold text-purple-900">
                      {result.percentage}%
                    </p>
                  </div>
                </div>

                <p className="text-purple-900/80 text-sm italic">
                  {result.scripture}
                </p>

                {result.status !== 'safe' && (
                  <div className="mt-4 p-3 bg-white/30 backdrop-blur-sm rounded-lg">
                    <p className="text-sm text-purple-900/80">
                      <strong>Counsel:</strong>{' '}
                      {result.status === 'warning'
                        ? 'This payment is significant. Consider ways to reduce this debt or increase income.'
                        : 'This payment is burdensome. Debt at this level can lead to bondage. Seek to reduce or eliminate it.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-6 bg-purple-900/20 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-800" />
            <h4 className="font-semibold text-purple-900 text-sm">Guidelines</h4>
          </div>
          <ul className="text-sm text-purple-900/80 space-y-1">
            <li><strong>Safe:</strong> Payment 10% or less of income</li>
            <li><strong>Warning:</strong> Payment 10-15% of income</li>
            <li><strong>Danger:</strong> Payment greater than 15% of income</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default WalletPillar;
