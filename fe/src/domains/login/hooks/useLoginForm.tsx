import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useAuthStore } from "../stores/useAuthStore";
import { useTranslation } from "react-i18next";

interface LoginFormValues {
  id: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  idError: string | null;
  passwordError: string | null;
}

export const useLoginForm = () => {
  const { t, i18n } = useTranslation();

  const [values, setValues] = useState<LoginFormValues>({
    id: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({
    idError: null,
    passwordError: null,
  });

  const toast = useToast();
  const login = useAuthStore((state) => state.login);

  const handleIdChange = (value: string) => {
    if (i18n.language === "ko") {
      let formattedNumber = value.replace(/[^0-9]/g, "");
      if (formattedNumber.length > 3) {
        formattedNumber = `${formattedNumber.slice(0, 3)}-${formattedNumber.slice(3)}`;
      }
      if (formattedNumber.length > 8) {
        formattedNumber = `${formattedNumber.slice(0, 8)}-${formattedNumber.slice(8)}`;
      }
      setValues((prev) => ({
        ...prev,
        id: formattedNumber,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        id: value,
      }));
    }
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

  const validateId = () => {
    const { id } = values;
    if (i18n.language === "ko") {
      const phoneRegex = /^010-[0-9]{4}-[0-9]{4}$/;
      if (!phoneRegex.test(id)) {
        setErrors((prev) => ({
          ...prev,
          idError: t("login.phoneError"),
        }));
        return false;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(id)) {
        setErrors((prev) => ({
          ...prev,
          idError: t("login.emailError"),
        }));
        return false;
      }
    }

    setErrors((prev) => ({
      ...prev,
      idError: null,
    }));

    return true;
  };

  const validatePassword = () => {
    const { password } = values;
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;

    if (!regex.test(password)) {
      setErrors((prev) => ({
        ...prev,
        passwordError: t("login.passwordError"),
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
    if (!values.id || !values.password) {
      toast({
        title: t("login.loginFail"),
        description: t("login.description"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (validateId() && validatePassword()) {
      const token = "dummy-token"; // 실제 토큰으로 대체

      login(token, values.rememberMe);
      toast({
        title: t("login.successTitle"),
        description: t("login.successDescription"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: t("login.failTitle"),
        description: t("login.failDescription"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return {
    id: values.id,
    password: values.password,
    rememberMe: values.rememberMe,
    idError: errors.idError,
    passwordError: errors.passwordError,
    handleIdChange,
    handlePasswordChange,
    toggleRememberMe,
    handleLogin,
  };
};
