import { useSignUpStore } from "../stores/SignUpStore";
import { useStepsStore } from "../stores/StepsStore";
import { registerMember } from "../api/auth";
import { useToast } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import axios from "axios";

export const useSignUpComplete = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { nextStep } = useStepsStore();
  const {
    nickname,
    email,
    phoneNumber,
    password,
    birth,
    gender,
    region,
    name,
    agreements,
    identityVerificationToken,
    invitationToken,
  } = useSignUpStore();

  const handleSignUpComplete = async () => {
    try {
      const response = await registerMember({
        nickname,
        email,
        phoneNumber,
        password,
        birth,
        gender,
        region,
        name,
        identityVerificationToken,
        invitationToken,
        terms1: agreements.required1,
        terms2: agreements.required2,
      });

      console.log("Signup successful:", response);
      toast({
        // title: t("signup.success.title"),
        // description: t("signup.success.description"),
        // status: "success",
        // duration: 3000,
        // isClosable: true,
      });
      nextStep(); // 성공 후 다음 단계로 이동
    } catch (error) {
      console.error("Signup failed:", error);
      let errorMessage = t("signup.error.defaultMessage");

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast({
        title: t("signup.error.title"),
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return { handleSignUpComplete };
};
