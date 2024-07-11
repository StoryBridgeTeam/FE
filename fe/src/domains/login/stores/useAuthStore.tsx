// useAuthStore.ts
import create from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, rememberMe: boolean) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  login: (token: string, rememberMe: boolean) => {
    const expires = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000; // 30일 또는 30분
    const expiryDate = new Date().getTime() + expires;
    localStorage.setItem('token', token);
    localStorage.setItem('expiry', expiryDate.toString());
    set({ isAuthenticated: true, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
    set({ isAuthenticated: false, token: null });
  },
  checkAuth: () => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiry');
    if (token && expiry && new Date().getTime() < parseInt(expiry)) {
      set({ isAuthenticated: true, token });
    } else {
      set({ isAuthenticated: false, token: null });
    }
  },
}));
