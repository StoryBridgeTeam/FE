import {Box, FormLabel, Input, InputGroup, Stack, Text} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useEmailVerification } from "../hooks/useEmailVerification";
import { useSignUpStore } from "../stores/SignUpStore";

const EmailVerificationForm = () => {
  const { t } = useTranslation();
  const { email, handleEmailChange } = useEmailVerification();
  const { name, setName } = useSignUpStore();

  return (
    <Box>
      {/*<Text fontSize="xl" fontWeight="800" mt={6} mb={14} textAlign="left">*/}
      {/*  Please enter your email and real name for verification*/}
      {/*</Text>*/}
    <Text fontSize="xl" fontWeight="800" mt={6} textAlign="left">
        인증을 위한 정보를 입력해주세요
    </Text>
    {/*<Text fontSize="sm" mb={10} textAlign="left">*/}
    {/*    * 표시된 사항은 필수입니다.*/}
    {/*</Text>*/}
      <Stack spacing={10} mt={4} mb={6}>
        <InputGroup>
            {/*<FormLabel>*</FormLabel>*/}
          <Input
            ml="2"
            variant="flushed"
            type="email"
            borderColor="gray.300"
            // placeholder="Enter your real name"
            placeholder="실명"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
            {/*<FormLabel>*</FormLabel>*/}
          <Input
            ml="2"
            variant="flushed"
            type="email"
            borderColor="gray.300"
            // placeholder="Enter your email address"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
          />
        </InputGroup>
      </Stack>
    </Box>
  );
};

export default EmailVerificationForm;
