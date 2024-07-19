import { useEffect } from "react";
import { useStepsStore } from "../stores/useStepsStore";
import { useEmailVerificationStore } from "../stores/useEmailVerificationStore";
import { useVerificationCodeStore } from "../stores/useVerificationCodeStore";

export const useEmailVerification = () => {
  const { nextStep, setCondition } = useStepsStore();
  const { email, setEmail } = useEmailVerificationStore();
  const { setVerficationCode } = useVerificationCodeStore();

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleSendRequestEmail = () => {
    // 인증코드 발송 API 호출, d이후 setVerficationCode에 저장
    setVerficationCode("123456");
    console.log("Email: " + email);
    nextStep();
  };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setCondition(3, true);
    } else {
      setCondition(3, false);
    }
  }, [email]);

  return {
    email,
    handleEmailChange,
    handleSendRequestEmail,
  };
};
