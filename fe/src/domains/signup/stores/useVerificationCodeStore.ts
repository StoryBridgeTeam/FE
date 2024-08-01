import { create } from "zustand";

interface CodeState {
  //입력받은 코드
  inputCode: string;
  setInputCode: (code: string) => void;
  //인증코드
  verificationCode: string;
  setVerficationCode: (code: string) => void;
}

export const useVerificationCodeStore = create<CodeState>((set) => ({
  inputCode: "",
  setInputCode: (value) => set({ inputCode: value }),
  verificationCode: "",
  setVerficationCode: (code) => set({ verificationCode: code }),
}));
