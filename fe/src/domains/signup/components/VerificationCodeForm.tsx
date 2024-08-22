import { useState, useEffect } from "react";
import {
  Box,
  Input,
  Stack,
  Text,
  Button,
  InputGroup,
  InputRightElement,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import InputMask from "react-input-mask";
import { useVerificationCode } from "../hooks/useVerificationCode";
import { useEmailVerification } from "../hooks/useEmailVerification";
import { useVerificationStore } from "../stores/VerificationStore";

const VerificationCodeForm = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();
  const { inputCode, handleCodeChange } = useVerificationCode();
  const { handleSendRequestEmail } = useEmailVerification();
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const authAttempt = useVerificationStore((state) => state.authAttempt);

  useEffect(() => {
    if (authAttempt >= 5 || timeLeft <= 0) {
      setTimeLeft(0);
      handleCodeChange("");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [authAttempt]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleResend = () => {
    setTimeLeft(300);
    handleSendRequestEmail();
    useVerificationStore.getState().resetAuthAttempt();
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
            placeholder={
              isMobile
                ? "Please enter code"
                : t("signup.VerificationCode.placeholder")
            }
            disabled={timeLeft <= 0}
            as={InputMask}
            mask="999999"
            maskChar={null}
            value={inputCode}
            onChange={(e) => handleCodeChange(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            {timeLeft > 0 ? (
              <Text>{formatTime(timeLeft)}</Text>
            ) : (
              <Button
                size="md"
                onClick={handleResend}
                variant="ghost"
                colorScheme="blue"
              >
                {t("signup.VerificationCode.retry")}
              </Button>
            )}
          </InputRightElement>
        </InputGroup>
      </Stack>
    </Box>
  );
};

export default VerificationCodeForm;
