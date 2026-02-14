import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Shield, LogIn, UserPlus } from 'lucide-react';

export default function AccessDeniedPage() {
  const { login, loginStatus } = useInternetIdentity();
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleLogin = async () => {
    setIsSigningUp(false);
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const handleSignUp = async () => {
    setIsSigningUp(true);
    sessionStorage.setItem('parcel-wala-signup-intent', 'true');
    try {
      await login();
    } catch (error: any) {
      console.error('Sign up error:', error);
      sessionStorage.removeItem('parcel-wala-signup-intent');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Shield className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Parcel Wala</h1>
          <p className="text-muted-foreground">
            Please log in or sign up with Internet Identity to get started.
          </p>
        </div>
        <div className="space-y-3">
          <Button
            onClick={handleLogin}
            disabled={loginStatus === 'logging-in'}
            size="lg"
            className="w-full gap-2"
          >
            {loginStatus === 'logging-in' && !isSigningUp ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Login with Internet Identity
              </>
            )}
          </Button>
          <Button
            onClick={handleSignUp}
            disabled={loginStatus === 'logging-in'}
            size="lg"
            variant="outline"
            className="w-full gap-2"
          >
            {loginStatus === 'logging-in' && isSigningUp ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Signing up...
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                Sign Up
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
