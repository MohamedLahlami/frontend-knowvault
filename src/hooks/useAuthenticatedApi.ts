import { useAuth } from 'react-oidc-context';
import { apiService } from '@/lib/api';

export const useAuthenticatedApi = () => {
  const auth = useAuth();

  const makeRequest = async <T>(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    endpoint: string,
    data?: any,
    requireAuth = true
  ): Promise<T> => {
    const token = auth.user?.access_token;
    
    if (requireAuth && !token) {
      throw new Error('No authentication token available');
    }

    return apiService[method]<T>(endpoint, data, {
      requireAuth,
      token,
    });
  };

  return {
    get: <T>(endpoint: string, requireAuth = true) => 
      makeRequest<T>('get', endpoint, undefined, requireAuth),
    
    post: <T>(endpoint: string, data?: any, requireAuth = true) => 
      makeRequest<T>('post', endpoint, data, requireAuth),
    
    put: <T>(endpoint: string, data?: any, requireAuth = true) => 
      makeRequest<T>('put', endpoint, data, requireAuth),
    
    delete: <T>(endpoint: string, requireAuth = true) => 
      makeRequest<T>('delete', endpoint, undefined, requireAuth),
    
    patch: <T>(endpoint: string, data?: any, requireAuth = true) => 
      makeRequest<T>('patch', endpoint, data, requireAuth),
    
    // Direct access to auth state for convenience
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user,
    token: auth.user?.access_token,
  };
}; 