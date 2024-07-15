import create from "zustand";

interface PhoneVerificationState {
  username: string;
  phoneNumber: string;
  telecom: string;
  setPhoneNumber: (number: string) => void;
  setUsername: (name: string) => void;
  setTelecom: (telecom: string) => void;
}

export const usePhoneVerificationStore = create<PhoneVerificationState>(
  (set) => ({
    username: "",
    phoneNumber: "",
    telecom: "",
    setPhoneNumber: (number) => set({ phoneNumber: number }),
    setUsername: (name) => set({ username: name }),
    setTelecom: (telecom) => set({ telecom: telecom }),
  })
);
