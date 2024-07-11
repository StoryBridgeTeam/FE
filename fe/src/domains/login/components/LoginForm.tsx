import React from "react";
import {
  Box,
  Button,
  Stack,
  Text,
  Input,
  IconButton,
  InputGroup,
  InputRightElement,
  Checkbox,
  useBreakpointValue,
} from "@chakra-ui/react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import SocialLoginButton from "./SocialLoginButton";
import { useLoginForm } from "../hooks/useLoginForm";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();

  const {
    id,
    password,
    rememberMe,
    idError,
    passwordError,
    handleIdChange,
    handlePasswordChange,
    toggleRememberMe,
    handleLogin,
  } = useLoginForm();

  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      bg="white"
      p={8}
      shadow={isMobile ? undefined : "xl"}
      border={isMobile ? undefined : "1px"}
      borderColor={isMobile ? undefined : "#CDCDCD"}
      maxW="md"
      w="full"
      borderRadius="3xl"
    >
      <Text fontSize="2xl" fontWeight="600" mb={1} textAlign="center">
        {t(`login.login`)}
      </Text>
      <Text fontSize="sm" fontWeight="400" mb={6} textAlign="center">
        {t(`login.info`)}
      </Text>
      <Stack spacing={4}>
        <Input
          type="text"
          placeholder={t(`login.id`)}
          value={id}
          onChange={(e) => handleIdChange(e.target.value)}
          isInvalid={!!idError}
        />
        {idError && (
          <Text fontSize="sm" color="red.500">
            {idError}
          </Text>
        )}
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder={t(`login.password`)}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            isInvalid={!!passwordError}
          />
          <InputRightElement width="3rem">
            <IconButton
              aria-label={showPassword ? "Hide password" : "Show password"}
              icon={showPassword ? <HiEyeOff /> : <HiEye />}
              color="gray"
              variant="ghost"
              onClick={togglePasswordVisibility}
              h="1.75rem"
            />
          </InputRightElement>
        </InputGroup>
        {passwordError && (
          <Text fontSize="sm" color="red.500">
            {passwordError}
          </Text>
        )}
        <Button bg="black" color="white" onClick={handleLogin}>
          {t(`login.login`)}
        </Button>
        <Checkbox
          colorScheme="gray"
          isChecked={rememberMe}
          onChange={toggleRememberMe}
          marginLeft={3}
          size="sm"
          fontSize="xs"
          color={"gray"}
        >
          {t(`login.rememberMe`)}
        </Checkbox>
        <hr />
        <SocialLoginButton icon={FcGoogle} text="Google" colorScheme="gray" />
        <SocialLoginButton
          icon={SiNaver}
          text="Naver"
          bg="#03C759"
          color="white"
        />
        <SocialLoginButton icon={RiKakaoTalkFill} text="Kakao" bg="#FEE102" />
      </Stack>
      <Text fontSize="xs" color="gray.500" mt={4} textAlign="center">
        By clicking continue, you agree to our Terms of Service and Privacy
        Policy
      </Text>
    </Box>
  );
};

export default LoginForm;
