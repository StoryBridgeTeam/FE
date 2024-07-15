import create from "zustand";

interface InfoState {
  password: string;
  confirmPassword: string;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
}

export const usePasswordStore = create<InfoState>((set) => ({
  password: "",
  confirmPassword: "",
  setPassword: (value) => set({ password: value }),
  setConfirmPassword: (value) => set({ confirmPassword: value }),
}));
