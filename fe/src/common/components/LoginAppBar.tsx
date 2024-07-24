import React from "react";
import {
  Box,
  Text,
  Flex,
  Input,
  useBreakpointValue,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FaRegBell, FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../domains/login/stores/useAuthStore";

interface LoginAppBarProps {
  field1?: string;
  field2?: string;
  field1OnClick?: () => void;
  field2OnClick?: () => void;
  isShowSearch?: boolean;
}

const LoginAppBar: React.FC<LoginAppBarProps> = ({
  field1,
  field2,
  field1OnClick,
  field2OnClick,
  isShowSearch,
}) => {
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const appBarHeight = isMobile ? "50px" : "60px";
  const navigate = useNavigate();
  const { getNickName } = useAuthStore();

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
      alignItems="center"
    >
      <Text
        fontSize={isMobile ? "md" : "2xl"}
        fontWeight="700"
        align={"center"}
        paddingLeft={isMobile ? "15px" : "20px"}
        onClick={() => {
          // navigate(`/${getNickName}`, { replace: true });
          navigate(`/nickName`, { replace: true }); //api연결 전
        }}
      >
        StoryBridge
      </Text>
      {isShowSearch && !isMobile && (
        <Flex flex="1" justify="center" alignItems="center" ml={14}>
          <InputGroup maxW="md">
            <InputLeftElement
              height="100%"
              display="flex"
              alignItems="center"
              pointerEvents="none"
            >
              <Box as={FaSearch} color="gray.600" />
            </InputLeftElement>
            <Input
              size="sm"
              bg="white"
              border="2px"
              borderColor="#CDCDCD"
              w="full"
              borderRadius="3xl"
            />
          </InputGroup>
        </Flex>
      )}
      <Flex direction="row" alignItems="center">
        {isShowSearch && isMobile && (
          <Text
            marginLeft={3}
            fontSize={isMobile ? "xs" : "md"}
            lineHeight={appBarHeight}
            fontWeight="400"
            cursor="pointer"
            onClick={field1OnClick}
            as={FaSearch}
          ></Text>
        )}
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
