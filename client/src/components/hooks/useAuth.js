// client/src/hooks/useAuth.js
import { useAuth0 } from '@auth0/auth0-react';

export function useAuth() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  // Get user roles from Auth0 user metadata
  const roles = user?.['https://landivo.us.auth0.com/roles'] || [];
  const isAdmin = roles.includes('admin');

  // Function to get auth token for API calls
  const getToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    roles,
    isAdmin,
    loginWithRedirect,
    logout,
    getToken,
  };
}