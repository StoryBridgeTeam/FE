import { Button } from "@chakra-ui/react";
import { useStepsStore } from "../stores/useStepsStore";
import { usePhoneVerification } from "../hooks/usePhoneVerification";

interface Step {
  currentStep: number;
}

const NextStepButton = ({ currentStep }: Step) => {
  const { step, nextStep, conditions } = useStepsStore((state) => ({
    step: state.step,
    conditions: state.conditions,
    nextStep: state.nextStep,
  }));

  const { handleVerification } = usePhoneVerification();

  const buttonText = () => {
    switch (currentStep) {
      case 2:
        return "동의";
      case 3:
        return "인증요청";
      case 4:
        return "인증";
      default:
        return "다음";
    }
  };

  return (
    <Button
      onClick={currentStep === 4 ? () => handleVerification() : nextStep}
      isDisabled={currentStep === 4 ? false : !conditions[currentStep]}
      w="full"
      bg="black"
      color="white"
      colorScheme="blackAlpha"
    >
      {buttonText()}
    </Button>
  );
};

export default NextStepButton;
