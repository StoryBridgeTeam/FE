import { useEffect } from "react";
import { usePasswordStore } from "../stores/usePasswordStore";
import { useStepsStore } from "../stores/useStepsStore";

export const usePasswordForm = () => {
  const { password, confirmPassword, setPassword, setConfirmPassword } =
    usePasswordStore();
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
    if (isValidPassword() && isSamePassword()) {
      setCondition(5, true);
    } else {
      setCondition(5, false);
    }
  }, [password, confirmPassword]);

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
