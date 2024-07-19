import { useEffect } from "react";
import { useNicknameStore } from "../stores/useNicknameStore";
import { useStepsStore } from "../stores/useStepsStore";
import { useTranslation } from "react-i18next";
import { useToast } from "@chakra-ui/react";

export const useNicknameForm = () => {
  const { nickname, setNickname } = useNicknameStore();
  const { setCondition } = useStepsStore();
  const { nextStep } = useStepsStore();
  const { t } = useTranslation();

  const toast = useToast();

  const handleNicknameChange = (value: string) => {
    setNickname(value);
  };

  const isDuplicated = (): boolean => {
    //중복확인 api
    return false;
  };

  const isValidLength = (): boolean => {
    return 3 <= nickname.length && nickname.length <= 10;
  };

  const checkNickname = () => {
    if (!isDuplicated()) nextStep();
    else
      toast({
        title: t("signup.NicknameForm.toast.error"), // "닉네임 중복",
        description: t("signup.NicknameForm.toast.description"), // "이미 사용중인 닉네임입니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
  };

  useEffect(() => {
    if (isValidLength()) {
      setCondition(6, true);
    } else {
      setCondition(6, false);
    }
  }, [nickname]);

  return {
    nickname,
    handleNicknameChange,
    isDuplicated,
    isValidLength,
    checkNickname,
  };
};
