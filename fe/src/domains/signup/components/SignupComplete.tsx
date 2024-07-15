import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const SignupComplete = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Text fontSize="xl" fontWeight="800" mt={6} textAlign="left">
        {t("signup.SignupComplete.title")}
      </Text>
      <Stack mt={4}>
        <Text fontSize="lg" mt={6} ml={2} textAlign="left">
          -{t("signup.SignupComplete.description")}
        </Text>
        <Text fontSize="lg" mt={4} ml={2} textAlign="left">
          -{t("signup.SignupComplete.description2")}
        </Text>
      </Stack>
    </Box>
  );
};

export default SignupComplete;
