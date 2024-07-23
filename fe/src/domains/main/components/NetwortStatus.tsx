import {
  Avatar,
  Box,
  useBreakpointValue,
  VStack,
  Text,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const NetworkStatus: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Box
      bg="#F6F6F6"
      borderRadius="3xl"
      h="100%"
      w="100%"
      p={4}
      color="#CDCDCD"
      border={isMobile ? "" : "1px solid"}
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <VStack
        align="flex-start"
        width="100%"
        color="black"
        flex="1"
        overflow="auto"
      >
        <Flex alignItems="center" justifyContent="center" gap={4}>
          <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
          <Text>박지현 (Ji-hyun Park)</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="center" gap={4}>
          <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
          <Text>최영민 (Young-min Choi)</Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default NetworkStatus;
