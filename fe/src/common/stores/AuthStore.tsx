import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  nickname: string;
  login: (
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean,
    nickname: string
  ) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  nickname: "",
  login: (
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean,
    nickname: string
  ) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("nickName", nickname);
    set({ isAuthenticated: true, accessToken, refreshToken });
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
      set({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
      });
    }
  },
}));
