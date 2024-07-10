import { useState } from "react";
import { useToast } from "@chakra-ui/react";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  passwordError: string | null;
}

export const useLoginForm = () => {
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({
    passwordError: null,
  });

  const toast = useToast();

  const handleEmailChange = (value: string) => {
    setValues((prev) => ({
      ...prev,
      email: value,
    }));
  };

  const handlePasswordChange = (value: string) => {
    setValues((prev) => ({
      ...prev,
      password: value,
    }));
  };

  const toggleRememberMe = () => {
    setValues((prev) => ({
      ...prev,
      rememberMe: !prev.rememberMe,
    }));
  };

  const validatePassword = () => {
    const { password } = values;
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;

    if (!regex.test(password)) {
      setErrors((prev) => ({
        ...prev,
        passwordError:
          "비밀번호는 8자 이상 15자 이하이어야 하며, 영어, 숫자, 특수문자를 모두 포함해야 합니다.",
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      passwordError: null,
    }));

    return true;
  };

  const handleLogin = () => {
    if (!values.email || !values.password) {
      toast({
        title: "로그인 실패",
        description: "이메일과 비밀번호를 모두 입력해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (validatePassword()) {
      console.log("Email:", values.email);
      console.log("Password:", values.password);
      console.log("Remember Me:", values.rememberMe);
      // 여기에 실제 로그인 처리 로직을 추가할 수 있습니다.
      // 예를 들어, 서버로 요청을 보내고 응답을 처리하는 등의 동작을 수행합니다.
    } else {
      // 비밀번호 유효성 검사 실패 시
      toast({
        title: "로그인 실패",
        description: "유효하지 않은 비밀번호입니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return {
    email: values.email,
    password: values.password,
    rememberMe: values.rememberMe,
    passwordError: errors.passwordError,
    handleEmailChange,
    handlePasswordChange,
    toggleRememberMe,
    handleLogin,
  };
};
