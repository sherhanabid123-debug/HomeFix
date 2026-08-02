// ==========================================================================
// HomeFix - Official Google Sign-In & JWT Token Decoder Service
// ==========================================================================

export const DEFAULT_GOOGLE_CLIENT_ID = "108392819281-homefixkerala.apps.googleusercontent.com";

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
 * Initialize Google Identity Services (GSI) Client
 */
export function initGoogleSignIn({ clientId = DEFAULT_GOOGLE_CLIENT_ID, onSuccess, onError }) {
  if (typeof window === 'undefined' || !window.google || !window.google.accounts) {
    console.warn("Google GSI Client SDK not yet loaded.");
    return false;
  }

  try {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response && response.credential) {
          const payload = parseGoogleJwt(response.credential);
          if (payload) {
            onSuccess({
              email: payload.email,
              name: payload.name || payload.given_name || payload.email.split('@')[0],
              picture: payload.picture,
              googleId: payload.sub
            });
          } else {
            onError("Failed to parse Google credential token.");
          }
        } else {
          onError("No credential returned from Google.");
        }
      }
    });

    return true;
  } catch (err) {
    console.error("Google Identity initialization error:", err);
    return false;
  }
}
