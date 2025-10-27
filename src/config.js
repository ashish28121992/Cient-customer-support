// Centralized app configuration
// Set REACT_APP_API_BASE_URL in your environment to override the default

// Auto-detect protocol for production vs development
const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // In production, use HTTPS if the current page is HTTPS
  if (window.location.protocol === 'https:') {
    // Backend API domain (Cloudflare se HTTPS)
    return 'https://api.mydiamond99clientsupport.in';
  }
  
  // Development fallback
  return 'http://44.221.30.127:4000';
};

export const API_BASE_URL = getApiBaseUrl();


