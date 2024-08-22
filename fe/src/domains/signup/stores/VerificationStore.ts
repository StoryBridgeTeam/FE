import create from "zustand";

interface VerificationState {
  inputCode: string;
  verificationCode: string;
  authAttempt: number;
  setInputCode: (code: string) => void;
  setVerificationCode: (code: string) => void;
  addAuthAttempt: () => void;
  resetAuthAttempt: () => void;
}

export const useVerificationStore = create<VerificationState>((set) => ({
  inputCode: "",
  verificationCode: "",
  authAttempt: 0,
  setInputCode: (code) => set({ inputCode: code }),
  setVerificationCode: (code) => set({ verificationCode: code }),
  addAuthAttempt: () =>
    set((state) => ({ authAttempt: state.authAttempt + 1 })),
  resetAuthAttempt: () => set({ authAttempt: 0 }),
}));
