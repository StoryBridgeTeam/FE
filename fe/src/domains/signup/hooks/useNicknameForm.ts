import { useEffect } from "react";
import { useSignUpStore } from "../stores/SignUpStore";
import { useStepsStore } from "../stores/StepsStore";
import { useTranslation } from "react-i18next";
import { useToast } from "@chakra-ui/react";
import { checkNicknameDuplication } from "../api/auth";
import { useSignUpComplete } from "./useSignUpComplete";

export const useNicknameForm = () => {
  const { nickname, setNickname } = useSignUpStore();
  const { setCondition, nextStep } = useStepsStore();
  const { t } = useTranslation();
  const toast = useToast();
  const { handleSignUpComplete } = useSignUpComplete();

  const handleNicknameChange = (value: string) => {
    setNickname(value);
  };

  const isDuplicated = async (): Promise<boolean> => {
    try {
      const response = await checkNicknameDuplication(nickname);
      console.log("isDuplicated:", response);
      return response.data.isDuplication;
    } catch (error) {
      console.error("Nickname duplication check faileed:", error);
      return false;
    }
  };

  const isValidLength = (): boolean => {
    return 3 <= nickname.length && nickname.length <= 10;
  };

  const checkNickname = async () => {
    const duplicated = await isDuplicated();
    if (!duplicated) {
      handleSignUpComplete();
    } else {
      toast({
        title: t("signup.NicknameForm.toast.error"), //중복확인 실패
        description: t("signup.NicknameForm.toast.description"), //닉네임 중복확인에 실패했습니다.
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setCondition(6, isValidLength());
  }, [nickname, setCondition]);

  return {
    nickname,
    handleNicknameChange,
    isDuplicated,
    isValidLength,
    checkNickname,
  };
};
