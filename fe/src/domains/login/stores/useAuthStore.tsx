import { create } from "zustand";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  nickName?: string;
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean
  ) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  getNickName: () => string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  login: (accessToken: string, refreshToken: string, rememberMe: boolean) => {
    const expires = rememberMe ? 30 : 0.5;
    Cookies.set("accessToken", accessToken, {
      expires,
      secure: true,
      sameSite: "Strict",
    });
    Cookies.set("refreshToken", refreshToken, {
      expires,
      secure: true,
      sameSite: "Strict",
    });
    set({ isAuthenticated: true, accessToken, refreshToken });
  },
  logout: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
    });
  },
  checkAuth: async () => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (accessToken && refreshToken) {
      set({ isAuthenticated: true, accessToken, refreshToken });
    } else {
      set({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
      });
    }
  },
  getNickName: () => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      console.warn("No accessToken found");
      return null;
    }

    try {
      // JWT 디코딩
      const decoded = jwtDecode<JwtPayload>(accessToken);

      // nickName 추출
      if (decoded.nickName) {
        return decoded.nickName;
      } else {
        console.warn("nickName not found in token");
        return null;
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  },
}));
