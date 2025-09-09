// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';

export const initializeGoogleAuth = () => {
  return new Promise((resolve) => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: resolve,
      });
    }
  });
};

export const handleGoogleLogin = (callback) => {
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: callback,
    });
    
    window.google.accounts.id.prompt();
  } else {
    console.error('Google Identity Services not loaded');
  }
};
