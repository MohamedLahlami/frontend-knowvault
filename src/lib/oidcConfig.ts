export const oidcConfig = {
  onSignIn: async () => {
    window.location.hash = "";
  },
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
  client_secret: import.meta.env.VITE_OIDC_CLIENT_SECRET,
  onSigninCallback: async () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
  response_type: 'code',
  scope: 'openid profile email',
  automaticSilentRenew: true,
  loadUserInfo: true,
}; 