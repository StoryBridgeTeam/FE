import { Box, Input, InputGroup, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useEmailVerification } from "../hooks/useEmailVerification";

const EmailVerificationForm = () => {
  const { t } = useTranslation();
  const { email, handleEmailChange } = useEmailVerification();

  return (
    <Box>
      <Text fontSize="xl" fontWeight="800" mt={6} mb={14} textAlign="left">
        Please enter your email for verification
      </Text>
      <Stack spacing={10} mt={4} mb={6}>
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
