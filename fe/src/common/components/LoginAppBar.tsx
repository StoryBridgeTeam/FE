import React from 'react';
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
      <Flex direction="row" alignItems="center">
        {field1 && (
          <Text
            marginLeft={3}
            lineHeight={isMobile ? "60px" : "80px"}
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
            lineHeight={isMobile ? "60px" : "80px"}
            fontWeight="400"
            cursor="pointer"
            onClick={field2OnClick}
          >
            {t(field2)}
          </Text>
        )}
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
