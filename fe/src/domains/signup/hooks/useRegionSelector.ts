import { useSignUpStore } from "../stores/SignUpStore";
import { useStepsStore } from "../stores/StepsStore";

export const useRegionSelector = () => {
  const { setRegion, setSignupType } = useSignUpStore();
  const { nextStep } = useStepsStore();

  const handleSelectRegion = (type: "KR" | "OTHER") => {
    setRegion("OTHER");
    setSignupType(type==="KR" ? "phone" : "email")
    nextStep();
  };

  return {
    handleSelectRegion,
  };
};
