import create from "zustand";

interface VerificationState {
  inputCode: string;
  verificationCode: string;
  setInputCode: (code: string) => void;
  setVerificationCode: (code: string) => void;
}

export const useVerificationStore = create<VerificationState>((set) => ({
  inputCode: "",
  verificationCode: "",
  setInputCode: (code) => set({ inputCode: code }),
  setVerificationCode: (code) => set({ verificationCode: code }),
}));
