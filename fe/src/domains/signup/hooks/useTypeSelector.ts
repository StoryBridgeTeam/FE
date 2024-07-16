import { useStepsStore } from "../stores/useStepsStore";
import { useUserTypeStore } from "../stores/useUserTypeStore";

export const useTypeSelector = () => {
  const { nextStep } = useStepsStore();
  const { setUserType } = useUserTypeStore();

  const handleSelectType = (type: "korea" | "non-korea") => {
    setUserType(type);
    nextStep();
  };

  return {
    handleSelectType,
  };
};
