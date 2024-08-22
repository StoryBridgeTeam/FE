import { useEffect } from "react";
import { useSignUpStore } from "../stores/SignUpStore";
import { useVerificationStore } from "../stores/VerificationStore";
import { useStepsStore } from "../stores/StepsStore";
import { requestEmailVerification, checkIdDuplication } from "../api/auth";

export const useEmailVerification = () => {
  const { email, setEmail } = useSignUpStore();
  const { setVerificationCode } = useVerificationStore();
  const { nextStep, setCondition } = useStepsStore();

  const handleEmailChange = async (value: string) => {
    setEmail(value);
  };

  const handleSendRequestEmail = async () => {
    try {
      const response = await requestEmailVerification(email);
      setVerificationCode(response.data.identityVerificationId);
      console.log("email success:", response);
    } catch (error) {
      //에러 처리 따로 추가하기
    }
  };

  const isDuplicated = async (): Promise<boolean> => {
    try {
      console.log("email:", email);
      const response = await checkIdDuplication(email);
      console.log("isDuplicated,data:", response);
      return response.data.isDuplication;
    } catch (error) {
      console.error("Nickname duplication check faileed:", error);
      return false;
    }
  };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setCondition(3, emailRegex.test(email));
  }, [email, setCondition]);

  return {
    email,
    isDuplicated,
    handleEmailChange,
    handleSendRequestEmail,
  };
};
