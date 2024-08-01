import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useStepsStore } from "../stores/StepsStore";
import { useVerificationStore } from "../stores/VerificationStore";
import { useTranslation } from "react-i18next";
import { useSignUpStore } from "../stores/SignUpStore";
import { verifyPhoneCode, verifyEmailCode } from "../api/auth";

export const useVerificationCode = () => {
  const { t } = useTranslation();
  const { nextStep, setCondition } = useStepsStore();
  const { inputCode, verificationCode, setInputCode } = useVerificationStore();
  const { setIdentityVerificationToken } = useSignUpStore();
  const toast = useToast();

  const handleCodeChange = (value: string): void => {
    setInputCode(value);
  };

  const checkVerificationCode = async () => {
    const { userType, email, phoneNumber } = useSignUpStore.getState();
    try {
      let response;
      if (userType === "korea") {
        response = await verifyPhoneCode(verificationCode, inputCode);
      } else {
        response = await verifyEmailCode(email, inputCode);
      }
      setIdentityVerificationToken(response.data.token);
      nextStep();
    } catch (error) {
      console.error("verification failed:", error);
      toast({
        title: t("signup.VerificationCode.toast.error"), //인증실패
        description: t("signup.VerificationCode.toast.description"), //인증번호가 일치하지 않습니다.
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setCondition(4, inputCode.length === 6);
  }, [inputCode, setCondition]);

  return {
    inputCode,
    handleCodeChange,
    checkVerificationCode,
  };
};
