import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useRegionSelector } from "../hooks/useRegionSelector";
import { useTranslation } from "react-i18next";

const RegionSelector = () => {
  const { t } = useTranslation();
  const { handleSelectRegion } = useRegionSelector();

  return (
    <Box>
      {/*<Text fontSize="xl" fontWeight="800" mt={6} textAlign="left">*/}
      {/*  거주 국가를 선택해주세요*/}
      {/*</Text>*/}
        <Text fontSize="xl" fontWeight="800" mt={6} textAlign="left">
            회원가입 방법을 선택해주세요
        </Text>
      {/*<Text fontSize="sm" ml={1} textAlign="left">*/}
      {/*  Please select your country of residence.*/}
      {/*</Text>*/}
      <Stack spacing={16} mt={20} align="center">
        <Button
          onClick={() => handleSelectRegion("KR")}
          width="16rem"
          height="5rem"
          variant="outline"
          borderRadius="2xl"
          shadow="md"
        >
            휴대폰 인증
        </Button>
        <Button
          onClick={() => handleSelectRegion("OTHER")}
          width="16rem"
          height="5rem"
          variant="outline"
          borderRadius="2xl"
          shadow="md"
        >
            이메일 인증
        </Button>
      </Stack>
    </Box>
  );
};

export default RegionSelector;
