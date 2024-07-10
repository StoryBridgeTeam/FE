import { Box, Text, Flex } from "@chakra-ui/react";
import { FaRegBell } from "react-icons/fa6";
import {useTranslation} from "react-i18next";

const LoginAppBar = () => {
  const {t} = useTranslation();

  return (
    <Flex
      w="full"
      h="80px"
      borderBottom="1px"
      borderColor="#CDCDCD"
      justify="space-between"
      direction="row"
    >
      <Text
        fontSize="2xl"
        fontWeight="700"
        paddingTop="19px"
        paddingLeft="40px"
      >
        StoryBridge
      </Text>
      <Flex direction="row">
        <Text lineHeight="80px" fontWeight="400">
        {t(`login.login`)}
        </Text>
        <Box
          as={FaRegBell}
          fontSize="xl"
          marginLeft={3}
          marginRight={8}
          h="80px"
        />
      </Flex>
    </Flex>
  );
};

export default LoginAppBar;
