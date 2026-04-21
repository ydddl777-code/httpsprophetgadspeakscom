import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  onSignUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  onSignIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  onSuccess: () => void;
  onBack?: () => void;
}

const ARIAL = 'Arial, "Helvetica Neue", Helvetica, sans-serif';

// Cream/gold palette used across the product. Pulling these into local
// constants keeps the JSX readable and consistent with WelcomeLanding
// and the Sanctuary.
const TEXT_CREAM = '#fef5d7';
const TEXT_GOLD = '#fdf1c8';
const GOLD = 'rgba(212, 165, 63, 0.9)';
const GOLD_SOFT = 'rgba(212, 165, 63, 0.45)';

export const AuthForm = ({ onSignUp, onSignIn, onSuccess, onBack }: AuthFormProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please enter your email and password.',
        variant: 'destructive',
      });
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } =
        mode === 'signup'
          ? await onSignUp(email, password)
          : await onSignIn(email, password);

      if (error) {
        toast({
          title: mode === 'signup' ? 'Sign up failed' : 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: mode === 'signup' ? 'Account created!' : 'Welcome back!',
          description:
            mode === 'signup' ? "Let's set up your profile." : 'Good to see you again.',
        });
        onSuccess();
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputBaseStyle: React.CSSProperties = {
    fontFamily: ARIAL,
    background: 'rgba(255, 250, 230, 0.92)',
    color: '#2a1a08',
    border: `1.5px solid ${GOLD_SOFT}`,
  };

  return (
    <div className="w-full" style={{ fontFamily: ARIAL }}>
      {/* Mode Toggle — Sign In / Sign Up */}
      <div
        className="flex mb-6 rounded-full p-1"
        style={{
          background: 'rgba(255, 240, 200, 0.12)',
          border: `1px solid ${GOLD_SOFT}`,
        }}
      >
        <button
          type="button"
          onClick={() => setMode('signin')}
          className="flex-1 py-2.5 px-4 rounded-full text-base font-bold transition-all"
          style={{
            fontFamily: ARIAL,
            background: mode === 'signin' ? '#16a34a' : 'transparent',
            color: mode === 'signin' ? '#ffffff' : TEXT_CREAM,
            boxShadow: mode === 'signin' ? '0 2px 8px rgba(22,163,74,0.4)' : 'none',
            textShadow: mode === 'signin' ? 'none' : '0 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className="flex-1 py-2.5 px-4 rounded-full text-base font-bold transition-all"
          style={{
            fontFamily: ARIAL,
            background: mode === 'signup' ? '#16a34a' : 'transparent',
            color: mode === 'signup' ? '#ffffff' : TEXT_CREAM,
            boxShadow: mode === 'signup' ? '0 2px 8px rgba(22,163,74,0.4)' : 'none',
            textShadow: mode === 'signup' ? 'none' : '0 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-base font-semibold"
            style={{
              fontFamily: ARIAL,
              color: TEXT_GOLD,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: '#6B5A3A' }}
            />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isLoading}
              className="w-full h-12 pl-11 pr-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-accent/70"
              style={inputBaseStyle}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-base font-semibold"
            style={{
              fontFamily: ARIAL,
              color: TEXT_GOLD,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: '#6B5A3A' }}
            />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              disabled={isLoading}
              className="w-full h-12 pl-11 pr-11 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-accent/70"
              style={inputBaseStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
              style={{ color: '#6B5A3A' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password (signup only) */}
        {mode === 'signup' && (
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-base font-semibold"
              style={{
                fontFamily: ARIAL,
                color: TEXT_GOLD,
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: '#6B5A3A' }}
              />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Retype your password"
                disabled={isLoading}
                className="w-full h-12 pl-11 pr-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-accent/70"
                style={inputBaseStyle}
              />
            </div>
          </div>
        )}

        {/* Submit Button — green "go" button matching the landing Enter */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-full text-base font-bold inline-flex items-center justify-center gap-2 shadow-lg transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            fontFamily: ARIAL,
            background: '#16a34a',
            color: '#ffffff',
            border: `2px solid ${GOLD}`,
            boxShadow: '0 5px 18px rgba(22,163,74,0.4)',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {mode === 'signup' ? 'Creating account…' : 'Signing in…'}
            </>
          ) : mode === 'signup' ? (
            'Create Account'
          ) : (
            'Sign In'
          )}
        </button>

        {/* Back Button — quiet, cream text */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="w-full py-2 text-sm hover:underline underline-offset-4 transition-colors disabled:opacity-50"
            style={{
              fontFamily: ARIAL,
              color: TEXT_CREAM,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            ← Back
          </button>
        )}
      </form>
    </div>
  );
};
