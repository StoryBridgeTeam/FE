import { Button } from "@chakra-ui/react";
import { useStepsStore } from "../stores/StepsStore";
import { useSignUpStore } from "../stores/SignUpStore";
import { usePhoneVerification } from "../hooks/usePhoneVerification";
import { useVerificationCode } from "../hooks/useVerificationCode";
import { useEmailVerification } from "../hooks/useEmailVerification";
import { useTranslation } from "react-i18next";
import { useNicknameForm } from "../hooks/useNicknameForm";
import { useSignUpComplete } from "../hooks/useSignUpComplete";

interface Step {
  currentStep: number;
}

const NextStepButton = ({ currentStep }: Step) => {
  const { t } = useTranslation();
  const { nextStep, conditions } = useStepsStore();
  const userType = useSignUpStore((state) => state.userType);
  const { handleSendRequestPhone } = usePhoneVerification();
  const { handleSendRequestEmail } = useEmailVerification();
  const { checkVerificationCode } = useVerificationCode();
  const { checkNickname } = useNicknameForm();
  const { handleSignUpComplete } = useSignUpComplete();

  const getButtonProps = () => {
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
          onClick: handleSignUpComplete,
        };
      default:
        return { text: t("signup.NextStepsButton.Next"), onClick: nextStep };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <Button
      onClick={buttonProps.onClick}
      isDisabled={!conditions[currentStep]}
      w="full"
      bg="black"
      color="white"
      colorScheme="blackAlpha"
    >
      {buttonProps.text}
    </Button>
  );
};

export default NextStepButton;
