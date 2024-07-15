import create from "zustand";

interface CodeState {
  //인증코드
  verificationCode: string;
  setVerficationCode: (code: string) => void;
}

export const useVerificationCodeStore = create<CodeState>((set) => ({
  verificationCode: "",
  setVerficationCode: (code) => set({ verificationCode: code }),
}));
