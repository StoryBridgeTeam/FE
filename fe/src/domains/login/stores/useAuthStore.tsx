import { create } from "zustand";
import Cookies from "js-cookie";

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
    const expires = rememberMe ? 30 : 0.5; // 30 days or 30 minutes
    Cookies.set("token", token, { expires, secure: true, sameSite: "Strict" });
    Cookies.set("id", id, { expires, secure: true, sameSite: "Strict" });
    set({ isAuthenticated: true, token, id });
  },
  logout: () => {
    Cookies.remove("token");
    Cookies.remove("id");
    set({ isAuthenticated: false, token: null, id: null });
  },
  checkAuth: async () => {
    const token = Cookies.get("token");
    const id = Cookies.get("id");

    if (token && id) {
      set({ isAuthenticated: true, token, id });
    } else {
      set({ isAuthenticated: false, token: null, id: null });
    }
  },
}));
