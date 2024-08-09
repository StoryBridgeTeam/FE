import { create } from 'zustand';


interface Agreements {
  agreeRequired1: boolean;
  agreeRequired2: boolean;
  agreeOptional1: boolean;
  agreeOptional2: boolean;
}

interface TermsState {
  agreements: Agreements;
  handleAgreeChange: (name: keyof Agreements) => void;
  handleAgreeAll: () => void;
}

export const useTermsStore = create<TermsState>((set) => ({
  agreements: {
    agreeRequired1: false,
    agreeRequired2: false,
    agreeOptional1: false,
    agreeOptional2: false,
  },

  handleAgreeChange: (name) =>
    set((state) => ({
      agreements: {
        ...state.agreements,
        [name]: !state.agreements[name],
      },
    })),

  handleAgreeAll: () =>
    set((state) => {
      //agreements가 하나라도 false면 false로, 모두 true면 true로
      const newValue = !Object.values(state.agreements).every(Boolean);
      return {
        agreements: {
          agreeRequired1: newValue,
          agreeRequired2: newValue,
          agreeOptional1: newValue,
          agreeOptional2: newValue,
        },
      };
    }),
}));
