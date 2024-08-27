import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  nickName: string;
  login: (
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean,
    nickName: string
  ) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  nickName: "",
  login: (
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean,
    nickName: string
  ) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("nickName", nickName);
    set({ isAuthenticated: true, accessToken, refreshToken, nickName });
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("nickName");
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
    });
  },
  checkAuth: async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const nickName = localStorage.getItem("nickName");

    if (accessToken && refreshToken && nickName) {
      set({ isAuthenticated: true, accessToken, refreshToken });
    } else {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("token");

      if (token) {
        set({
          isAuthenticated: true,
          accessToken: null,
          refreshToken: null,
        });
      } else {
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
        });
      }
    }
  },
}));
