import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import SocialLoginButton from "./SocialLoginButton";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const { t } = useTranslation();
  return (
    <Box
      bg="white"
      p={8}
      shadow="xl"
      maxW="md"
      w="full"
      borderRadius="3xl"
      border="1px"
      borderColor="#CDCDCD"
    >
      <Text fontSize="2xl" fontWeight="600" mb={1} textAlign="center">
        {t(`login.login`)}
      </Text>
      <Text fontSize="sm" fontWeight="400" mb={6} textAlign="center">
        {t(`login.info`)}
      </Text>
      <Stack spacing={4}>
        <Input type="email" placeholder={t(`login.email`)} />
        <Input type="password" placeholder={t(`login.password`)} />
        <Button bg="black" color="white">
          {t(`login.login`)}
        </Button>
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
