import React from 'react';
import { useAuth } from 'react-oidc-context';
import { Button } from '@/components/ui/button';
import { Lock, LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const auth = useAuth();
  
  // Helper function to check user roles
  const hasRole = (role: string): boolean => {
    if (!auth.user) return false;
    // Access roles from the user object (Keycloak specific)
    const userRoles = (auth.user as any).realm_access?.roles || [];
    return userRoles.includes(role);
  };

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="max-w-md w-full mx-auto text-center space-y-6 p-6">
          <div className="space-y-2">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">
              Authentification requise
            </h1>
            <p className="text-muted-foreground">
              Vous devez vous connecter pour accéder à cette page.
            </p>
          </div>
          
          <Button 
            onClick={() => auth.signinRedirect()} 
            className="w-full bg-green-600 flex items-center gap-2"
            size="lg"
          >
            <LogIn className="h-4 w-4" />
            Se connecter
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <p>
              Retourner à la{' '}
              <a 
                href="/public-shelves" 
                className="text-primary hover:underline"
              >
                page d'accueil
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="max-w-md w-full mx-auto text-center space-y-6 p-6">
          <div className="space-y-2">
            <Lock className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">
              Accès refusé
            </h1>
            <p className="text-muted-foreground">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
          </div>
          
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
            className="w-full"
          >
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 