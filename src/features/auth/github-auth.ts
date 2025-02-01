import { create } from 'zustand';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || '';
const GITHUB_REDIRECT_URI = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5173/auth/callback'  // Vite's default port
  : 'https://your-production-domain.com/auth/callback';

const API_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:3001'
  : 'https://your-api-domain.com';

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  handleAuthCallback: (code: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('gh_token'),
  username: localStorage.getItem('gh_username'),
  isAuthenticated: !!localStorage.getItem('gh_token'),

  login: () => {
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: GITHUB_REDIRECT_URI,
      scope: 'gist',
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  },

  logout: () => {
    localStorage.removeItem('gh_token');
    localStorage.removeItem('gh_username');
    set({ token: null, username: null, isAuthenticated: false });
  },

  handleAuthCallback: async (code: string) => {
    try {
      // Exchange code for token using your backend
      const response = await fetch(`${API_URL}/api/auth/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      const { access_token, username } = await response.json();
      
      localStorage.setItem('gh_token', access_token);
      localStorage.setItem('gh_username', username);
      
      set({ 
        token: access_token,
        username,
        isAuthenticated: true
      });
    } catch (error) {
      console.error('Auth error:', error);
    }
  }
})); 