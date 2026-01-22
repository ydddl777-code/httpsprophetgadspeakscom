import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, Calculator, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppHeader } from '@/components/AppHeader';
import { UserProfile, WalletCalculation } from '@/lib/types';
import { cn } from '@/lib/utils';

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

  return (
    <div className="min-h-screen bg-background">
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
          <div className="inline-flex bg-pillar-wallet/10 p-4 rounded-2xl mb-4">
            <Wallet className="w-12 h-12 text-pillar-wallet" />
          </div>
          <h1 className="font-display text-3xl text-primary mb-2">WALLET PILLAR</h1>
          <p className="text-muted-foreground">Money Calculator</p>
        </div>

        {/* Input Form */}
        <div className="bg-card rounded-3xl shadow-lg border border-border p-8 mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="income" className="text-foreground">Monthly Income ($)</Label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="income"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="0"
                  className="h-12 pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="payment" className="text-foreground">Monthly Payment/Debt ($)</Label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="payment"
                  type="number"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  placeholder="0"
                  className="h-12 pl-8"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleCalculate}
                disabled={!income || parseFloat(income) <= 0}
                className="flex-1 h-12 bg-pillar-wallet hover:bg-pillar-wallet/90 text-primary-foreground gap-2"
              >
                <Calculator className="w-4 h-4" />
                Calculate
              </Button>
              {result && (
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
              'rounded-2xl p-6 border animate-slide-up',
              result.status === 'safe' && 'bg-success/10 border-success/20',
              result.status === 'warning' && 'bg-warning/10 border-warning/20',
              result.status === 'danger' && 'bg-danger/10 border-danger/20'
            )}
          >
            <div className="flex items-start gap-4">
              {result.status === 'safe' ? (
                <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
              ) : result.status === 'warning' ? (
                <AlertTriangle className="w-8 h-8 text-warning flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-danger flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3
                  className={cn(
                    'font-display text-xl mb-3',
                    result.status === 'safe' && 'text-success',
                    result.status === 'warning' && 'text-warning',
                    result.status === 'danger' && 'text-danger'
                  )}
                >
                  {result.status === 'safe' && '✅ SAFE'}
                  {result.status === 'warning' && '⚠️ WARNING'}
                  {result.status === 'danger' && '🔴 DANGER'}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Payment</p>
                    <p className="text-lg font-semibold text-foreground">
                      {formatCurrency(result.payment)}
                    </p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Of Income</p>
                    <p className="text-lg font-semibold text-foreground">
                      {result.percentage}%
                    </p>
                  </div>
                </div>

                <p className="text-foreground/80 text-sm italic">
                  {result.scripture}
                </p>

                {result.status !== 'safe' && (
                  <div className="mt-4 p-3 bg-background/50 rounded-lg">
                    <p className="text-sm text-foreground/80">
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
        <div className="mt-8 bg-muted rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-foreground">Guidelines</h4>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>✅ <strong>Safe:</strong> Payment ≤ 10% of income</li>
            <li>⚠️ <strong>Warning:</strong> Payment 10-15% of income</li>
            <li>🔴 <strong>Danger:</strong> Payment &gt; 15% of income</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default WalletPillar;
