import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { LogIn } from 'lucide-react';

interface LoginButtonProps {
  loginOnly?: boolean;
}

export default function LoginButton({ loginOnly = false }: LoginButtonProps) {
  const { login, loginStatus, identity } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const disabled = loginStatus === 'logging-in';

  if (loginOnly && isAuthenticated) {
    return null;
  }

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={disabled}
      variant="default"
      size="sm"
      className="gap-2"
    >
      {loginStatus === 'logging-in' ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Logging in...
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          Login
        </>
      )}
    </Button>
  );
}
