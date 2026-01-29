import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  onSignUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  onSignIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  onSuccess: () => void;
  onBack?: () => void;
}

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
        title: "Missing information",
        description: "Please enter your email and password.",
        variant: "destructive"
      });
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = mode === 'signup' 
        ? await onSignUp(email, password)
        : await onSignIn(email, password);

      if (error) {
        toast({
          title: mode === 'signup' ? "Sign up failed" : "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: mode === 'signup' ? "Account created!" : "Welcome back!",
          description: mode === 'signup' 
            ? "Let's set up your profile." 
            : "Good to see you again."
        });
        onSuccess();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Mode Toggle */}
      <div className="flex mb-6 bg-muted rounded-lg p-1">
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'signin' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'signup' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password (signup only) */}
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
            </>
          ) : (
            mode === 'signup' ? 'Create Account' : 'Sign In'
          )}
        </Button>

        {/* Back Button */}
        {onBack && (
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full" 
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
        )}
      </form>
    </div>
  );
};
