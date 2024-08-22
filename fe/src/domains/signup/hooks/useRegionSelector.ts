import { useSignUpStore } from "../stores/SignUpStore";
import { useStepsStore } from "../stores/StepsStore";

export const useRegionSelector = () => {
  const { setRegion } = useSignUpStore();
  const { nextStep } = useStepsStore();

  const handleSelectRegion = (type: "KR" | "OTHER") => {
    setRegion(type);
    nextStep();
  };

  return {
    handleSelectRegion,
  };
};
