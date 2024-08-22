import React, { useEffect, useRef } from "react";
import { Button, useToast } from "@chakra-ui/react";
import { useStepsStore } from "../stores/StepsStore";
import { useSignUpStore } from "../stores/SignUpStore";
import { usePhoneVerification } from "../hooks/usePhoneVerification";
import { useVerificationCode } from "../hooks/useVerificationCode";
import { useEmailVerification } from "../hooks/useEmailVerification";
import { useTranslation } from "react-i18next";
import { useNicknameForm } from "../hooks/useNicknameForm";
import { useSignUpComplete } from "../hooks/useSignUpComplete";
import { useNavigate } from "react-router-dom";

interface Step {
  currentStep: number;
}

const NextStepButton = ({ currentStep }: Step) => {
  const { t } = useTranslation();
  const { nextStep, conditions } = useStepsStore();
  // const region = useSignUpStore((state) => state.region);
  const { handleSendRequestPhone } = usePhoneVerification();
  const { isDuplicated, handleSendRequestEmail } = useEmailVerification();
  const { checkVerificationCode } = useVerificationCode();
  const { checkNickname } = useNicknameForm();
  const { region, nickname } = useSignUpStore();
  // const { handleSignUpComplete } = useSignUpComplete();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && conditions[currentStep] && buttonRef.current) {
        buttonRef.current.click();
      }
    };
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [conditions, currentStep]);

  const toast = useToast();
  const handleEmailVerification = async () => {
    try {
      const duplicated = await isDuplicated();
      if (duplicated) {
        toast({
          title: "Email already in use",
          description: "Please use a different email address",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        nextStep();
        await handleSendRequestEmail();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check email or send verification",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSignUpComplete = () => {
    navigate(`/login`);
  };

  const getButtonProps = () => {
    switch (currentStep) {
      case 2:
        return { text: t("signup.NextStepsButton.agree"), onClick: nextStep };
      case 3:
        if (region === "KR") {
          return {
            text: t("signup.NextStepsButton.VerificationRequest"),
            onClick: handleSendRequestPhone,
          };
        } else {
          return {
            text: t("signup.NextStepsButton.VerificationRequest"),
            // onClick: handleSendRequestEmail,
            onClick: handleEmailVerification,
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
      ref={buttonRef}
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
