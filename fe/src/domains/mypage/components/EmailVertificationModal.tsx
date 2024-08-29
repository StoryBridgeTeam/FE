import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  Input,
  Button,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { updateEmail, identifyVertification } from "../api/MyPageAPI";

interface EmailVerificationModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  email,
  isOpen,
  onClose,
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVerify = async () => {
    if (verificationCode.length === 0) {
      toast({
        title: "본인 인증",
        description: "본인 인증 코드를 입력해주세요",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = await identifyVertification(email, verificationCode);

      await updateEmail(token, email);
      toast({
        title: "이메일 변경",
        description: "이메일이 성공적으로 변경되었습니다",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "이메일 변경 실패",
        description: "이메일 변경에 실패했습니다",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setVerificationCode("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Email Verification</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={4}>
            <FormControl>
              <Input
                placeholder="Enter the verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </FormControl>
            <Text color="red.500">
              남은 시간: {Math.floor(timeLeft / 60)}:
              {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
            </Text>
            <Button onClick={handleVerify} colorScheme="blue">
              Verify
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EmailVerificationModal;
