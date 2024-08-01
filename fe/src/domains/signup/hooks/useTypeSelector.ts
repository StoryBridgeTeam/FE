import { useSignUpStore } from "../stores/SignUpStore";
import { useStepsStore } from "../stores/StepsStore";

export const useTypeSelector = () => {
  const { setUserType } = useSignUpStore();
  const { nextStep } = useStepsStore();

  const handleSelectType = (type: "korea" | "non-korea") => {
    setUserType(type);
    nextStep();
  };

  return {
    handleSelectType,
  };
};
