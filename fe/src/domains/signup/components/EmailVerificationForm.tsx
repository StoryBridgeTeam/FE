import { Box, Input, InputGroup, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useEmailVerification } from "../hooks/useEmailVerification";
import { useSignUpStore } from "../stores/SignUpStore";

const EmailVerificationForm = () => {
  const { t } = useTranslation();
  const { email, handleEmailChange } = useEmailVerification();
  const { name, setName } = useSignUpStore();

  return (
    <Box>
      <Text fontSize="xl" fontWeight="800" mt={6} mb={14} textAlign="left">
        Please enter your email and real name for verification
      </Text>
      <Stack spacing={10} mt={4} mb={6}>
        <InputGroup>
          <Input
            ml="2"
            variant="flushed"
            type="email"
            borderColor="gray.300"
            placeholder="Enter your real name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Input
            ml="2"
            variant="flushed"
            type="email"
            borderColor="gray.300"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
          />
        </InputGroup>
      </Stack>
    </Box>
  );
};

export default EmailVerificationForm;
