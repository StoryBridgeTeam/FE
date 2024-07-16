import React from "react";
import { Box, Text, Flex, useBreakpointValue } from "@chakra-ui/react";
import { FaRegBell } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface LoginAppBarProps {
  field1?: string;
  field2?: string;
  field1OnClick?: () => void;
  field2OnClick?: () => void;
}

const LoginAppBar: React.FC<LoginAppBarProps> = ({
  field1,
  field2,
  field1OnClick,
  field2OnClick,
}) => {
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const appBarHeight = isMobile ? "50px" : "60px";

  return (
    <Flex
      w="full"
      h={appBarHeight}
      borderBottom="1px"
      borderColor="#CDCDCD"
      justify="space-between"
      direction="row"
      position="fixed"
      top="0"
      bg="white"
      zIndex="1000"
    >
      <Text
        fontSize="2xl"
        fontWeight="700"
        paddingTop={isMobile ? "5px" : "10px"}
        paddingLeft={isMobile ? "15px" : "20px"}
      >
        StoryBridge
      </Text>
      <Flex direction="row" alignItems="center">
        {field1 && (
          <Text
            marginLeft={3}
            fontSize={isMobile ? "xs" : "md"}
            lineHeight={appBarHeight}
            fontWeight="400"
            cursor="pointer"
            onClick={field1OnClick}
          >
            {t(field1)}
          </Text>
        )}
        {field2 && (
          <Text
            marginLeft={3}
            fontSize={isMobile ? "xs" : "md"}
            lineHeight={appBarHeight}
            fontWeight="400"
            cursor="pointer"
            onClick={field2OnClick}
          >
            {t(field2)}
          </Text>
        )}
        <Box
          as={FaRegBell}
          fontSize="lg"
          marginLeft={3}
          marginRight={8}
          h={appBarHeight}
        />
      </Flex>
    </Flex>
  );
};

export default LoginAppBar;
