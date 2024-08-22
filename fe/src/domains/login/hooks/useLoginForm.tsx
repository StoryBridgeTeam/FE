import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToastMessage } from "../../../common/hooks/useToastMessage";
import { useHandleLogin } from "./useHandleLogin";
import { useLoginUser } from "../api/LoginAPI";
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
  const handleLogin = useHandleLogin();
  const { showToast } = useToastMessage();
  const { loginUser } = useLoginUser();

  const [values, setValues] = useState<LoginFormValues>({
    id: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({
    idError: null,
    passwordError: null,
  });

  const handleIdChange = (value: string) => {
    if (i18n.language === "ko") {
      let formattedNumber = value.replace(/[^0-9]/g, "");
      if (formattedNumber.length > 3) {
        formattedNumber = `${formattedNumber.slice(
          0,
          3
        )}-${formattedNumber.slice(3)}`;
      }
      if (formattedNumber.length > 8) {
        formattedNumber = `${formattedNumber.slice(
          0,
          8
        )}-${formattedNumber.slice(8)}`;
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

  const formatPhoneNumberWithoutHyphens = (phoneNumber: string) => {
    return phoneNumber.replace(/-/g, "");
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

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!values.id || !values.password) {
      showToast("login.loginFail", "login.description", "error");
      return;
    }

    const formattedId =
      i18n.language === "ko"
        ? formatPhoneNumberWithoutHyphens(values.id)
        : values.id;

    if (validateId() && validatePassword()) {
      const response = await loginUser({
        id: formattedId,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      try {
        if (response && response.accessToken && response.refreshToken) {
          const { accessToken, refreshToken, nickname } = response;
          await handleLogin(
            accessToken,
            refreshToken,
            values.rememberMe,
            nickname
          );
        }
      } catch {
        showToast("login.failTitle", "login.loginError", "error");
      }
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
    onSubmit,
  };
};
