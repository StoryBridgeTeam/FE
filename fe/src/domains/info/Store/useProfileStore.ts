import create from "zustand";

interface ProfileState {
  isEdit: boolean;
  setEdit: (value: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  isEdit: false,
  setEdit: (value) => set({ isEdit: value }),
}));
