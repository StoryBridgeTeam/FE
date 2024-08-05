import { create } from 'zustand';

interface InfoState {
  nickname: string;
  setNickname: (nickname: string) => void;
}

export const useNicknameStore = create<InfoState>((set) => ({
  nickname: "",
  setNickname: (value) => set({ nickname: value }),
}));
