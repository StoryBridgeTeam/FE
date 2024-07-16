import { useState, useEffect } from "react";
import {
  Box,
  Input,
  Stack,
  Text,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import InputMask from "react-input-mask";
import { useVerificationCode } from "../hooks/useVerificationCode";

const VerificationCodeForm = () => {
  const { t } = useTranslation();
  const { inputCode, handleCodeChange } = useVerificationCode();
  const [timeLeft, setTimeLeft] = useState<number>(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="800" mt={6} mb={14} textAlign="left">
        {t("signup.VerificationCode.title")}
      </Text>
      <Stack spacing={10} mt={4} mb={6}>
        <InputGroup>
          <Input
            ml="2"
            variant="flushed"
            borderColor="gray.300"
            placeholder={t("signup.VerificationCode.placeholder")}
            as={InputMask}
            mask="999999"
            maskChar={null}
            value={inputCode}
            onChange={(e) => handleCodeChange(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Text>{formatTime(timeLeft)}</Text>
          </InputRightElement>
        </InputGroup>
      </Stack>
    </Box>
  );
};

export default VerificationCodeForm;
