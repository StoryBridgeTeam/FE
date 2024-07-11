import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  id: string | null;
  login: (token: string, id: string, rememberMe: boolean) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  id: null,
  login: (token: string, id: string, rememberMe: boolean) => {
    const expires = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000;
    const expiryDate = new Date().getTime() + expires;
    localStorage.setItem("token", token);
    localStorage.setItem("id", id);
    localStorage.setItem("expiry", expiryDate.toString());
    set({ isAuthenticated: true, token, id });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("expiry");
    set({ isAuthenticated: false, token: null, id: null });
  },
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const expiry = localStorage.getItem("expiry");
    if (token && id && expiry && new Date().getTime() < parseInt(expiry)) {
      set({ isAuthenticated: true, token, id });
    } else {
      set({ isAuthenticated: false, token: null });
    }
  },
}));
