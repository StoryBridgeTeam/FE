import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useStepsStore } from "../stores/StepsStore";
import { useVerificationStore } from "../stores/VerificationStore";
import { useTranslation } from "react-i18next";
import { useSignUpStore } from "../stores/SignUpStore";
import { verifyPhoneCode, verifyEmailCode } from "../api/auth";
import { AxiosError } from "axios";

export const useVerificationCode = () => {
  const { t } = useTranslation();
  const { nextStep, setCondition } = useStepsStore();
  const { inputCode, verificationCode, setInputCode, addAuthAttempt } =
    useVerificationStore();
  const { setIdentityVerificationToken } = useSignUpStore();
  const toast = useToast();

  const handleCodeChange = (value: string): void => {
    setInputCode(value);
  };

  const checkVerificationCode = async () => {
    const { region, email, phoneNumber } = useSignUpStore.getState();
    try {
      let response;
      if (region === "KR") {
        //확인필요
        response = await verifyPhoneCode(verificationCode, inputCode);
      } else {
        response = await verifyEmailCode(email, inputCode);
      }
      setIdentityVerificationToken(response.data.token);
      console.log("vsuccess:", response);
      nextStep();
    } catch (error) {
      console.error("verification failed:", error);
      let errorTitle = "";
      let errorMessage = "";

      if (error instanceof AxiosError && error.response?.data) {
        const errorCode = error.response.data.code;
        console.log("errorCode:", errorCode);
        switch (errorCode) {
          case 4010003: //인증코드가 잘못됨
            addAuthAttempt();
            const currentAttempt = useVerificationStore.getState().authAttempt;
            errorTitle = t("signup.VerificationCode.toast.invalidCode.title");
            errorMessage =
              t("signup.VerificationCode.toast.invalidCode.description") +
              ` [${currentAttempt}/5]`;
            break;
          case 4010105: //인증시간 초과
            errorTitle = t("signup.VerificationCode.toast.expiredCode.title");
            errorMessage = t(
              "signup.VerificationCode.toast.expiredCode.description"
            );
            break;
          case 4010106: //인증시도 횟수 초과
            addAuthAttempt();
            errorTitle = t(
              "signup.VerificationCode.toast.tooManyAttempts.title"
            );
            errorMessage = t(
              "signup.VerificationCode.toast.tooManyAttempts.description"
            );
            break;
          default:
            errorTitle = "Error";
            errorMessage = "unKnown error";
        }
      }

      toast({
        title: errorTitle,
        description: errorMessage,
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
