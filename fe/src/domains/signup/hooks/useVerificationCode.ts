import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useStepsStore } from "../stores/useStepsStore";
import { useVerificationCodeStore } from "../stores/useVerificationCodeStore";
import { useTranslation } from "react-i18next";

export const useVerificationCode = () => {
  const { t } = useTranslation();
  const { nextStep, setCondition } = useStepsStore();
  const { inputCode, verificationCode, setInputCode } =
    useVerificationCodeStore();
  const toast = useToast();

  const handleCodeChange = (value: string): void => {
    setInputCode(value);
  };

  const checkVerificationCode = () => {
    if (verificationCode === inputCode) nextStep();
    else
      toast({
        title: t("signup.VerificationCode.toast.error"), // "인증 실패",
        description: t("signup.VerificationCode.toast.description"), // "인증번호가 일치하지 않습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
  };

  useEffect(() => {
    if (inputCode.length === 6) {
      setCondition(4, true);
    } else {
      setCondition(4, false);
    }
  }, [inputCode]);

  return {
    inputCode,
    handleCodeChange,
    checkVerificationCode,
  };
};
