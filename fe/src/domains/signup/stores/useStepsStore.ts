import create from "zustand";

interface StepsState {
  step: number;
  conditions: boolean[];
  nextStep: () => void;
  setCondition: (index: number, value: boolean) => void;
}

export const useStepsStore = create<StepsState>((set) => ({
  step: 1,
  conditions: [true, false, false, false],
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  setCondition: (index: number, value: boolean) =>
    set((state) => {
      const newConditions = [...state.conditions];
      newConditions[index] = value;
      return { conditions: newConditions };
    }),
}));
