import create from "zustand";
import {type} from "os";

type region = "KR" | "OTHER";
type gender = "MALE" | "FEMALE";
type telCompany = "SKT" | "KT" | "LGU" | "SKT_MVNO" | "KT_MVNO" | "LGU_MVNO";

interface SignUpState {
  signupType:string,
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
  isNational: boolean; //확정x
  agreements: {
    required1: boolean;
    required2: boolean;
    optional1: boolean;
    optional2: boolean;
  };
  invitationToken: string;
  identityVerificationToken: string;

  setSignupType: (signupType: string) => void;
  setNickname: (nickname: string) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setBirth: (birth: string) => void;
  setGender: (type: gender) => void;
  setRegion: (type: region) => void;
  setName: (name: string) => void;
  setTelecom: (type: telCompany) => void;
  setAgreement: (key: keyof SignUpState["agreements"], value: boolean) => void;
  setAllAgreements: (value: boolean) => void;
  setInvitationToken: (token: string) => void;
  setIdentityVerificationToken: (token: string) => void;
  setIsNational: (value: boolean) => void;
}

export const useSignUpStore = create<SignUpState>((set) => ({
  signupType:"",
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
  isNational: true, //확정x
  agreements: {
    required1: false,
    required2: false,
    optional1: false,
    optional2: false,
  },
  invitationToken: "", //테스트용
  identityVerificationToken: "",

  setSignupType : (signupType) => set({signupType}),
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
  setIsNational: (value) => set({ isNational: value }),
}));
