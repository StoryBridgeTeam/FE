import {
  Box,
  Button,
  Stack,
  Text,
  Checkbox,
  useBreakpointValue, Tabs, TabList, Tab, TabPanels, TabPanel,
} from "@chakra-ui/react";
import { useLoginForm } from "../hooks/useLoginForm";
import { useTranslation } from "react-i18next";
import IdInput from "./IdInput";
import PasswordInput from "./PasswordInput";
import {GoogleLoginButton, KaKaoLoginButton, NaverLoginButton, SocialLogin} from "./SocailLogin";
import {useSocialLogin} from "../hooks/useSocialLogin";
import React from "react";

const LoginForm = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();
  const useSocialHook = useSocialLogin();

  const {
    id,
    password,
    rememberMe,
    idError,
    passwordError,
    handleIdChange,
    handlePasswordChange,
    toggleRememberMe,
    onSubmit,
    loginType,
    setLoginType
  } = useLoginForm();

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
      <form onSubmit={onSubmit}>
        <Text fontSize="2xl" fontWeight="600" mb={1} textAlign="center">
          {t(`login.login`)}
        </Text>
        <Text fontSize="sm" fontWeight="400" mb={6} textAlign="center">
          {t(`login.info`)}
        </Text>
        <Tabs isFitted variant={"enclosed"} mb={5} onChange={i => {
            handleIdChange("")
            handlePasswordChange("")
            if(i==0) setLoginType("tel");
            else setLoginType("email");
        }}>
          <TabList>
            <Tab>전화번호 로그인</Tab>
            <Tab>이메일 로그인</Tab>
          </TabList>
        </Tabs>
        <Stack spacing={4}>
          <IdInput id={id} idError={idError} handleIdChange={handleIdChange} type={loginType}/>
          <PasswordInput
              password={password}
              passwordError={passwordError}
              handlePasswordChange={handlePasswordChange}
          />
          <Button type="submit" bg="black" color="white">
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
          <KaKaoLoginButton/>
          <NaverLoginButton/>
          <GoogleLoginButton/>
        </Stack>
        <Text fontSize="xs" color="gray.500" mt={4} textAlign="center">
          By clicking continue, you agree to our Terms of Service and Privacy
          Policy
        </Text>
      </form>
    </Box>
  );
};

const LoginInputs = () => {
}

export default LoginForm;
