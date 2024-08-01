import { Box, Input, InputGroup, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNicknameForm } from "../hooks/useNicknameForm";

const NicknameForm = () => {
  const { t } = useTranslation();
  const { nickname, handleNicknameChange, isValidLength } = useNicknameForm();

  return (
    <Box>
      <Text fontSize="xl" fontWeight="800" mt={6} mb={2} textAlign="left">
        {t("signup.NicknameForm.title")}
      </Text>
      <Text fontSize="sm" ml={1} mb={14} textAlign="left">
        {t("signup.NicknameForm.subtitle")}
      </Text>
      <Stack spacing={2} mt={4} mb={6}>
        <Input
          ml="2"
          isInvalid={nickname !== "" && !isValidLength()}
          variant="flushed"
          borderColor="gray.300"
          placeholder={t("signup.NicknameForm.placeholder")}
          value={nickname}
          onChange={(e) => handleNicknameChange(e.target.value)}
        />
      </Stack>
    </Box>
  );
};

export default NicknameForm;
