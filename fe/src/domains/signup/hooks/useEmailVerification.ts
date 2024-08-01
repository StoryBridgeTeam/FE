import { useEffect } from "react";
import { useSignUpStore } from "../stores/SignUpStore";
import { useVerificationStore } from "../stores/VerificationStore";
import { useStepsStore } from "../stores/StepsStore";
import { requestEmailVerification } from "../api/auth";

export const useEmailVerification = () => {
  const { email, setEmail } = useSignUpStore();
  const { setVerificationCode } = useVerificationStore();
  const { nextStep, setCondition } = useStepsStore();

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleSendRequestEmail = async () => {
    try {
      const response = await requestEmailVerification(email);
      setVerificationCode(response.data.identityVerificationId);
      nextStep();
    } catch (error) {
      //에러 처리 따로 추가하기
    }
  };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setCondition(3, emailRegex.test(email));
  }, [email, setCondition]);

  return {
    email,
    handleEmailChange,
    handleSendRequestEmail,
  };
};
