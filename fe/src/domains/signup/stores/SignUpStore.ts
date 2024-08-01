import create from "zustand";

type UserType = "korea" | "non-korea";

interface SignUpState {
  userType: UserType;
  nickname: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  birth: string;
  gender: string;
  region: string;
  name: string;
  telecom: string;
  agreements: {
    required1: boolean;
    required2: boolean;
    optional1: boolean;
    optional2: boolean;
  };
  invitationToken: string;
  identityVerificationToken: string;

  setUserType: (type: UserType) => void;
  setNickname: (nickname: string) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setBirth: (birth: string) => void;
  setGender: (gender: string) => void;
  setRegion: (region: string) => void;
  setName: (name: string) => void;
  setTelecom: (telecom: string) => void;
  setAgreement: (key: keyof SignUpState["agreements"], value: boolean) => void;
  setAllAgreements: (value: boolean) => void;
  setInvitationToken: (token: string) => void;
  setIdentityVerificationToken: (token: string) => void;
}

export const useSignUpStore = create<SignUpState>((set) => ({
  userType: "korea",
  nickname: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  birth: "",
  gender: "",
  region: "",
  name: "",
  telecom: "",
  agreements: {
    required1: false,
    required2: false,
    optional1: false,
    optional2: false,
  },
  invitationToken: "",
  identityVerificationToken: "",

  setUserType: (type) => set({ userType: type }),
  setNickname: (nickname) => set({ nickname }),
  setEmail: (email) => set({ email }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setBirth: (birth) => set({ birth }),
  setGender: (gender) => set({ gender }),
  setRegion: (region) => set({ region }),
  setName: (name) => set({ name }),
  setTelecom: (telecom) => set({ telecom }),
  setAgreement: (key, value) =>
    set((state) => ({
      agreements: { ...state.agreements, [key]: value },
    })),
  setAllAgreements: (value) =>
    set({
      agreements: {
        required1: value,
        required2: value,
        optional1: value,
        optional2: value,
      },
    }),
  setInvitationToken: (token) => set({ invitationToken: token }),
  setIdentityVerificationToken: (token) =>
    set({ identityVerificationToken: token }),
}));
