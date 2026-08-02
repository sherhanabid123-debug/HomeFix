// ==========================================================================
// HomeFix - Official Google Sign-In & Token Client Service
// ==========================================================================

export const DEFAULT_GOOGLE_CLIENT_ID = "272713080705-ih8t7ritnpmmga6oa35kqkkuht0hahui.apps.googleusercontent.com";

export const getGoogleClientId = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID;
  }
  return localStorage.getItem('homefix_custom_google_client_id') || DEFAULT_GOOGLE_CLIENT_ID;
};

/**
 * Decodes Google's OAuth ID Token (JWT) safely
 */
export function parseGoogleJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing Google JWT token:", e);
    return null;
  }
}

/**
 * Request Google Sign-In Native Popup Window
 */
export function triggerGoogleLoginPopup({ clientId = getGoogleClientId(), onSuccess, onError }) {
  if (typeof window === 'undefined' || !window.google || !window.google.accounts) {
    if (onError) onError("Google SDK loading... Please click again in a second.");
    return false;
  }

  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      callback: async (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          try {
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });
            const profile = await userInfoRes.json();
            if (profile && profile.email) {
              onSuccess({
                email: profile.email,
                name: profile.name || profile.given_name || profile.email.split('@')[0],
                picture: profile.picture,
                googleId: profile.sub
              });
            } else {
              if (onError) onError("Failed to fetch Google profile info.");
            }
          } catch (fetchErr) {
            console.error("Error fetching Google userinfo:", fetchErr);
            if (onError) onError("Network error fetching Google profile.");
          }
        } else {
          if (onError) onError("Google login popup cancelled.");
        }
      }
    });

    tokenClient.requestAccessToken({ prompt: 'select_account' });
    return true;
  } catch (err) {
    console.error("Google OAuth token client error:", err);
    if (onError) onError("Google OAuth error: " + err.message);
    return false;
  }
}

/**
 * Legacy GSI initializer fallback
 */
export function initGoogleSignIn({ clientId = getGoogleClientId(), onSuccess, onError }) {
  return triggerGoogleLoginPopup({ clientId, onSuccess, onError });
}
