import { Box, Text, Flex, useBreakpointValue } from "@chakra-ui/react";
import { FaRegBell } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const LoginAppBar = () => {
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      w="full"
      h={isMobile ? "60px" : "80px"}
      borderBottom="1px"
      borderColor="#CDCDCD"
      justify="space-between"
      direction="row"
    >
      <Text
        fontSize="2xl"
        fontWeight="700"
        paddingTop={isMobile ? "10px" : "20px"}
        paddingLeft={isMobile ? "20px" : "40px"}
      >
        StoryBridge
      </Text>
      <Flex direction="row">
        <Text lineHeight={isMobile ? "60px" : "80px"} fontWeight="400">
          {t(`login.login`)}
        </Text>
        <Box
          as={FaRegBell}
          fontSize="xl"
          marginLeft={3}
          marginRight={8}
          h={isMobile ? "60px" : "80px"}
          />
      </Flex>
    </Flex>
  );
};

export default LoginAppBar;
