// Centralized app configuration
// Set REACT_APP_API_BASE_URL in your environment to override the default

// Auto-detect protocol for production vs development
const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // In production, use HTTPS if the current page is HTTPS
  if (window.location.protocol === 'https:') {
    // CLOUDFLARE SETUP KE BAAD YEH LINE UPDATE KARO:
    // return 'https://api.yourdomain.com'; // Cloudflare domain
    return 'https://44.221.30.127:4000'; // Temporary: Direct EC2 IP
  }
  
  // Development fallback
  return 'http://44.221.30.127:4000';
};

export const API_BASE_URL = getApiBaseUrl();


