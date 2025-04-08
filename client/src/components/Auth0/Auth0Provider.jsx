// client/src/components/Auth0Provider/Auth0ProviderWithNavigate.jsx
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  // Handle Auth0 callback after successful authentication
  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  // Configure Auth0Provider with your Auth0 application details
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN || ''}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || ''}
      authorizationParams={{
        redirect_uri: window.location.origin,
        scope: "openid profile email" // Always include these scopes
      }}
      cacheLocation="localstorage" // Store auth state in localStorage
      useRefreshTokens={true} // Enable automatic refresh of expired tokens
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};