import { Button } from "@chakra-ui/react";
import { useStepsStore } from "../stores/useStepsStore";
import { useUserTypeStore } from "../stores/useUserTypeStore";
import { usePhoneVerification } from "../hooks/usePhoneVerification";
import { useVerificationCode } from "../hooks/useVerificationCode";
import { useEmailVerification } from "../hooks/useEmailVerification";
import { useTranslation } from "react-i18next";
import { useNicknameForm } from "../hooks/useNicknameFormt";

interface Step {
  currentStep: number;
}

interface ButtonProps {
  text: string;
  onClick: () => void;
}
const NextStepButton = ({ currentStep }: Step) => {
  const { t } = useTranslation();
  const { nextStep, conditions } = useStepsStore((state) => ({
    conditions: state.conditions,
    nextStep: state.nextStep,
  }));
  const { userType } = useUserTypeStore((state) => ({
    userType: state.userType,
  }));
  const { handleSendRequestPhone } = usePhoneVerification();
  const { handleSendRequestEmail } = useEmailVerification();
  const { checkVerificationCode } = useVerificationCode();
  const { checkNickname } = useNicknameForm();

  const buttonProps = (): ButtonProps => {
    switch (currentStep) {
      case 2:
        return { text: t("signup.NextStepsButton.agree"), onClick: nextStep };
      case 3:
        if (userType === "korea") {
          return {
            text: t("signup.NextStepsButton.VerificationRequest"),
            onClick: handleSendRequestPhone,
          };
        } else {
          return {
            text: t("signup.NextStepsButton.VerificationRequest"),
            onClick: handleSendRequestEmail,
          };
        }
      case 4:
        return {
          text: t("signup.NextStepsButton.Verification"),
          onClick: checkVerificationCode,
        };
      case 6:
        return {
          text: t("signup.NextStepsButton.Next"),
          onClick: checkNickname,
        };
      case 7:
        return {
          text: t("signup.NextStepsButton.Complete"),
          onClick: () => {
            console.log("complete");
          },
        };
      default:
        return { text: t("signup.NextStepsButton.Next"), onClick: nextStep };
    }
  };

  return (
    <Button
      onClick={buttonProps().onClick}
      isDisabled={!conditions[currentStep]}
      w="full"
      bg="black"
      color="white"
      colorScheme="blackAlpha"
    >
      {buttonProps().text}
    </Button>
  );
};

export default NextStepButton;
