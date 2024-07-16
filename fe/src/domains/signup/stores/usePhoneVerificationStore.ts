import create from "zustand";

interface PhoneVerificationState {
  username: string;
  gender: string;
  birthDate: string;
  phoneNumber: string;
  telecom: string;
  setGender: (g: string) => void;
  setBirthDate: (date: string) => void;
  setPhoneNumber: (number: string) => void;
  setUsername: (name: string) => void;
  setTelecom: (telecom: string) => void;
}

export const usePhoneVerificationStore = create<PhoneVerificationState>(
  (set) => ({
    username: "",
    gender: "",
    birthDate: "",
    phoneNumber: "",
    telecom: "",
    setGender: (g) => set({ gender: g }),
    setBirthDate: (date) => set({ birthDate: date }),
    setPhoneNumber: (number) => set({ phoneNumber: number }),
    setUsername: (name) => set({ username: name }),
    setTelecom: (telecom) => set({ telecom: telecom }),
  })
);
