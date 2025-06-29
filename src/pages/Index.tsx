import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

const Index = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    // Wait for auth to load before redirecting
    if (auth.isLoading) return;
    
    // Redirect based on authentication status
    if (auth.isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/public-shelves');
    }
  }, [navigate, auth.isAuthenticated, auth.isLoading]);

  // Show loading spinner while checking authentication
  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return null;
};

export default Index;
