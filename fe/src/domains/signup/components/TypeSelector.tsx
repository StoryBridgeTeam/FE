import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useTypeSelector } from "../hooks/useTypeSelector";
import { useTranslation } from "react-i18next";

const TypeSelector = () => {
  const { t } = useTranslation();
  const { handleSelectType } = useTypeSelector();

  return (
    <Box>
      <Text fontSize="xl" fontWeight="800" mt={6} textAlign="left">
        {t("signup.SignupTypeSelector.title")}
      </Text>
      <Text fontSize="sm" ml={1} textAlign="left">
        Please select your country of residence.
      </Text>
      <Stack spacing={16} mt={20} align="center">
        <Button
          onClick={() => handleSelectType("korea")}
          width="16rem"
          height="5rem"
          variant="outline"
          borderRadius="2xl"
          shadow="md"
        >
          Korea
        </Button>
        <Button
          onClick={() => handleSelectType("non-korea")}
          width="16rem"
          height="5rem"
          variant="outline"
          borderRadius="2xl"
          shadow="md"
        >
          Other Countries
        </Button>
      </Stack>
    </Box>
  );
};

export default TypeSelector;
