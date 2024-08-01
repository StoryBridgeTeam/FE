import { create } from 'zustand';


type UserType = "korea" | "non-korea";

interface UserTypeState {
  //유저타입(내국인, 외국인)
  userType: UserType;
  setUserType: (type: UserType) => void;
}

export const useUserTypeStore = create<UserTypeState>((set) => ({
  userType: "korea", //기본상태
  setUserType: (type) => set({ userType: type }),
}));
