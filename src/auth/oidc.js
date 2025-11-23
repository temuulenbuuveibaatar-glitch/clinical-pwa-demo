export async function signIn(){
  const clientId = import.meta.env.VITE_OIDC_CLIENT_ID;
  const redirect = window.location.origin + '/callback';
  const authUrl = `${import.meta.env.VITE_OIDC_AUTH_URL}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&scope=openid%20profile%20email`;
  window.location.href = authUrl;
}