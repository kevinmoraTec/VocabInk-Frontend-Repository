import api from '@/lib/api';
import { API_URL } from '@/utils/constants';

export interface LinkedInStatus {
  connected: boolean;
  linkedinId?: string;
  connectedAt?: string;
}

/**
 * Initiates LinkedIn OAuth flow by redirecting to backend
 * The backend will validate the session cookie and redirect to LinkedIn
 */
export const connectLinkedIn = (): void => {
  // Redirect to backend endpoint - cookies will be sent automatically
  window.location.href = `${API_URL}/v1/auth/linkedin/connect`;
};

/**
 * Check if user has LinkedIn connected
 */
export const getLinkedInStatus = async (): Promise<LinkedInStatus> => {
  const response = await api.get('/v1/auth/linkedin/status');
  return response.data;
};

/**
 * Disconnect LinkedIn account
 */
export const disconnectLinkedIn = async (): Promise<void> => {
  await api.post('/v1/auth/linkedin/disconnect');
};

/**
 * Check URL params for LinkedIn connection status
 */
export const checkLinkedInCallback = (): { success: boolean; error?: string } | null => {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.has('linkedin')) {
    const status = urlParams.get('linkedin');
    const errorMsg = urlParams.get('error');
    
    // Clean up URL after reading params
    const url = new URL(window.location.href);
    url.searchParams.delete('linkedin');
    url.searchParams.delete('error');
    window.history.replaceState({}, '', url.toString());
    
    if (status === 'connected') {
      return { success: true };
    } else if (status === 'error') {
      return { success: false, error: errorMsg || 'Connection failed' };
    }
  }
  
  return null;
};
