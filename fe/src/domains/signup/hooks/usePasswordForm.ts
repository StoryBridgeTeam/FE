import { useEffect } from "react";
import { useSignUpStore } from "../stores/SignUpStore";
import { useStepsStore } from "../stores/StepsStore";

export const usePasswordForm = () => {
  const { password, confirmPassword, setPassword, setConfirmPassword } =
    useSignUpStore();
  const { setCondition } = useStepsStore();

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
  };

  const isValidPasswordLength = (): boolean => {
    return 8 <= password.length && password.length <= 15;
  };

  const hasPasswordEngLetter = (): boolean => {
    return /[A-Za-z]/.test(password);
  };

  const hasPasswordNumber = (): boolean => {
    return /[0-9]/.test(password);
  };

  const hasPasswordSpecialChar = (): boolean => {
    return /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const isSamePassword = (): boolean => {
    return password === confirmPassword;
  };

  const isValidPassword = (): boolean => {
    return (
      isValidPasswordLength() &&
      hasPasswordEngLetter() &&
      hasPasswordNumber() &&
      hasPasswordSpecialChar()
    );
  };

  useEffect(() => {
    setCondition(5, isValidPassword() && isSamePassword());
  }, [password, confirmPassword, setCondition]);

  return {
    password,
    confirmPassword,
    handlePasswordChange,
    handleConfirmPasswordChange,
    isValidPasswordLength,
    hasPasswordEngLetter,
    hasPasswordNumber,
    hasPasswordSpecialChar,
    isValidPassword,
    isSamePassword,
  };
};
