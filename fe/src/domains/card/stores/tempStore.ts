import create from "zustand";
import { EntryState } from "../types/cardTypes";

interface TempStore {
  tempEntries: EntryState[];
  // limitReached: boolean;
  // limitVisibleCardReached: boolean;
  setTempEntries: (tempEntries: EntryState[]) => void;
  addTempEntry: () => void;
  deleteTempEntry: (id: number) => void;
  modifyTempEntry: (id: number, updatedEntry: Partial<EntryState>) => void;
  reorderEntries: (startIndex: number, endIndex: number) => void;
}

export const useTempStore = create<TempStore>((set, get) => ({
  tempEntries: [],
  // limitReached: false,
  // limitVisibleCardReached: false,
  setTempEntries: (tempEntries) => set({ tempEntries }),
  addTempEntry: () =>
    set((state) => {
      // if (state.tempEntries.length >= 10) {
      //   return { tempEntries: state.tempEntries, limitReached: true };
      // }
      const newEntry: EntryState = {
        id: -Date.now(), //임시용
        title: "",
        content: "",
        index: state.tempEntries.length + 1,
        isVisibleBriefCard: true,
      };
      return {
        tempEntries: [...state.tempEntries, newEntry],
        // limitReached: false,
      };
    }),
  deleteTempEntry: (id) => {
    set((state) => ({
      tempEntries: state.tempEntries.filter((entry) => entry.id !== id),
    }));
  },
  // deleteTempEntry: (id) => {
  //   set((state) => {
  //     const newTempEntries = state.tempEntries.filter(
  //       (entry) => entry.id !== id
  //     );
  //     return {
  //       tempEntries: newTempEntries,
  //       limitReached: newTempEntries.length >= 10,
  //     };
  //   });
  // },
  modifyTempEntry: (id, updatedEntry) => {
    // set((state) => ({
    //   tempEntries: state.tempEntries.map((entry) =>
    //     entry.id === id ? { ...entry, ...updatedEntry } : entry
    //   ),
    // }));
    set((state) => {
      const visibleCount = state.tempEntries.filter(
        (e) => e.isVisibleBriefCard
      ).length;
      if (
        updatedEntry.isVisibleBriefCard &&
        visibleCount >= 6 &&
        !state.tempEntries.find((e) => e.id === id)?.isVisibleBriefCard
      ) {
        console.log("최대 6개의 항목만 표시할 수 있습니다.");
        return state;
      }
      return {
        tempEntries: state.tempEntries.map((entry) =>
          entry.id === id ? { ...entry, ...updatedEntry } : entry
        ),
      };
    });
  },
  reorderEntries: (startIndex, endIndex) => {
    set((state) => {
      const result = Array.from(state.tempEntries);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { tempEntries: result };
    });
  },
}));
