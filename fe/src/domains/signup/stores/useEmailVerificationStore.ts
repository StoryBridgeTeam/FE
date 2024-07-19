import create from "zustand";

interface EmailVerficationState {
  //이메일
  email: string;
  setEmail: (email: string) => void;
}

export const useEmailVerificationStore = create<EmailVerficationState>(
  (set) => ({
    email: "",
    setEmail: (value) => set({ email: value }),
  })
);
