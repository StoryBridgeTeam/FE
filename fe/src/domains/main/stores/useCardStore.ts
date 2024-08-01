import create from "zustand";

export interface CardState {
  id: number;
  title: string;
  content: string;
  isVisibleBriefCard: boolean;
}

interface CardStore {
  name: string;
  nickName: string;
  cards: CardState[];
  setName: (name: string) => void;
  setNickName: (nickName: string) => void;
  addCard: (card: Omit<CardState, "id">) => void;
  updateCard: (id: number, updatedCard: Partial<CardState>) => void;
  removeCard: (id: number) => void;
  realignIds: () => void;
}

export const useCardStore = create<CardStore>((set, get) => ({
  name: "",
  nickName: "",
  cards: [],
  setName: (name) => set({ name }),
  setNickName: (nickName) => set({ nickName }),
  addCard: (card) => 
    set((state) => {
      const newId =
        state.cards.length > 0
          ? Math.max(...state.cards.map((c) => c.id)) + 1
          : 1;
      return {
        cards: [...state.cards, { ...card, id: newId }],
      };
    }),
  updateCard: (id, updatedCard) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, ...updatedCard } : card
      ),
    })),
  removeCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
    })),
  realignIds: () =>
    set((state) => ({
      cards: state.cards.map((card, index) => ({ ...card, id: index + 1 })),
    })),
}));
