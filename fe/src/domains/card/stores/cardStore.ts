import create from "zustand";
import { getOriginalCardInfo, getPublicCardInfo } from "../api/cardAPI";
// import { transformCardData, transformCardDataForApi } from "../utils/apiUtils";
import axios from "axios";
import { EntryState } from "../types/cardTypes";

interface CardStore {
  id: number;
  name: string;
  nickName: string;
  hasCard: boolean;
  publicEntries: EntryState[];
  originalEntries: EntryState[];
  setNickName: (nickName: string) => void;
  setPublicEntries: (entries: EntryState[]) => void;
  setOriginalEntries: (entries: EntryState[]) => void;
  setHasCard: (hasCard: boolean) => void;
  fetchPublicEntries: (nickName: string, token?: string) => Promise<void>;
  fetchOriginalEntries: (nickName: string) => Promise<void>;
  // addEntry: (entry: EntryState) => void;
  // updateEntry: (index: number, updates: Partial<EntryState>) => void;
  // deleteEntry: (index: number) => void;
  // reorderEntries: (startIndex: number, endIndex: number) => void;
  // clearEntries: () => void;
  // savePublicEntries: (entries: EntryStateForAPI[]) => Promise<void>;
  // saveOriginalEntries: (entries: EntryStateForAPI[]) => Promise<void>;
}

export const useCardStore = create<CardStore>((set, get) => ({
  id: 0,
  name: "",
  nickName: "",
  hasCard: true,
  publicEntries: [],
  originalEntries: [],
  setNickName: (nickName) => set({ nickName }),
  setPublicEntries: (entries) => set({ publicEntries: entries }),
  setOriginalEntries: (entries) => set({ originalEntries: entries }),
  setHasCard: (hasCard: boolean) => set({ hasCard }),
  fetchPublicEntries: async (nickName, token) => {
    try {
      const response = await getPublicCardInfo(nickName, token);
      set({
        id: response.data.id,
        name: response.data.name,
        nickName: response.data.nickName,
        publicEntries: response.data.entries,
      });
      console.log("fetch성공: ", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.code === 4040000) {
          set({ hasCard: false });
          console.error(`명함카드 미생성자:`, error);
        } else {
          console.error(`카드 정보 Fetch:`, error);
        }
      } else {
        console.error("알 수 없는 오류가 발생했습니다:", error);
      }
    }
  },
  fetchOriginalEntries: async (nickName) => {
    try {
      const response = await getOriginalCardInfo(nickName);
      set({
        id: response.data.id,
        name: response.data.name,
        nickName: response.data.nickName,
        originalEntries: response.data.entries,
      });
      console.log("fetch성공: ", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.code === 4040000) {
          set({ hasCard: false });
          console.error(`명함카드 미생성자:`, error);
        } else {
          console.error(`카드 정보 Fetch:`, error);
        }
      } else {
        console.error("알 수 없는 오류가 발생했습니다:", error);
      }
      throw error;
    }
  },
  // savePublicEntries: async () => {
  //   try {
  //     const { nickName, publicEntries } = get();
  //     const response = await updatePublicCardInfo(nickName, publicEntries);
  //     set({
  //       id: response.data.id,
  //       publicEntries: response.data.entries,
  //       name: response.data.name,
  //       nickName: response.data.nickName,
  //     });
  //     console.log("공개용카드가 성공적으로 저장되었습니다.");
  //   } catch (error) {
  //     console.error("공개용카드를 저장하는데 실패했습니다:", error);
  //   }
  // },
  // saveOriginalEntries: async () => {
  //   try {
  //     const { nickName, originalEntries } = get();
  //     const response = await updateOriginalCardInfo(nickName, originalEntries);
  //     set({
  //       id: response.data.id,
  //       originalEntries: response.data.entries,
  //       name: response.data.name,
  //       nickName: response.data.nickName,
  //     });
  //     console.log("원본용카드가 성공적으로 저장되었습니다.");
  //   } catch (error) {
  //     console.error("원본용카드를 저장하는데 실패했습니다:", error);
  //   }
  // },
}));

// import create from "zustand";
// import { getCardInfo, updateCardInfo } from "../api/cardAPI";
// import { transformCardData, transformCardDataForApi } from "../utils/apiUtils";

// export enum FetchType {
//   BRIEF = "BRIEF",
//   DETAIL = "DETAIL",
// }

// interface CardStore {
//   id: number;
//   name: string;
//   nickName: string;
//   entries: EntryState[];
//   setnickName: (nickName: string) => void;
//   addEntry: (entry: Omit<EntryState, "id" | "index">) => void;
//   modifyEntry: (id: number, updatedEntry: Partial<EntryState>) => void;
//   removeEntry: (id: number) => void;
//   reorderEntries: (startIndex: number, endIndex: number) => void;
//   saveEntries: () => Promise<void>;
//   fetchEntries: (
//     nickName: string,
//     type: FetchType,
//     token?: string
//   ) => Promise<void>;
// }

// export const useCardStore = create<CardStore>((set, get) => ({
//   id: 0,
//   name: "",
//   nickName: "",
//   entries: [],
//   setnickName: (nickName) => set({ nickName }),
//   fetchEntries: async (nickName, type, token) => {
//     try {
//       const response = await getCardInfo(nickName, type, token);
//       set({
//         id: response.data.id,
//         name: response.data.name,
//         nickName: response.data.nickName,
//         entries: transformCardData(response.data.entries),
//       });
//       console.log("rdrd: ", response.data);
//       return response.data;
//     } catch (error) {
//       console.error(`${type} 카드 정보를 가져오는데 실패했습니다:`, error);
//       throw error;
//     }
//   },
//   addEntry: (entry) => {
//     set((state) => ({
//       entries: [
//         ...state.entries,
//         { ...entry, id: -Date.now(), index: state.entries.length },
//       ],
//     }));
//   },
//   modifyEntry: (id, updatedEntry) => {
//     set((state) => ({
//       entries: state.entries.map((entry) =>
//         entry.id === id ? { ...entry, ...updatedEntry } : entry
//       ),
//     }));
//   },
//   removeEntry: (id) => {
//     set((state) => ({
//       entries: state.entries.filter((entry) => entry.id !== id),
//     }));
//   },
//   reorderEntries: (startIndex, endIndex) => {
//     set((state) => {
//       const result = Array.from(state.entries);
//       const [removed] = result.splice(startIndex, 1);
//       result.splice(endIndex, 0, removed);
//       return {
//         entries: result.map((entry, index) => ({ ...entry, index })),
//       };
//     });
//   },
//   saveEntries: async () => {
//     try {
//       const { nickName, entries } = get();
//       const response = await updateCardInfo(
//         nickName,
//         transformCardDataForApi(entries)
//       );
//       set({
//         id: response.data.id,
//         entries: transformCardData(response.data.entries),
//         name: response.data.name,
//         nickName: response.data.nickName,
//       });
//       console.log("카드가 성공적으로 저장되었습니다.");
//     } catch (error) {
//       console.error("카드를 저장하는데 실패했습니다:", error);
//     }
//   },
// }));
