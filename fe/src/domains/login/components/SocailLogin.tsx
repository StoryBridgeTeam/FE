import { useSocialLogin } from "../hooks/useSocialLogin";
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import SocialLoginButton from "./SocialLoginButton";

export const SocialLogin = () => {
  const { handleGoogleLogin, handleNaverLogin, handleKakaoLogin } =
    useSocialLogin();

  return (
    <>
      <SocialLoginButton
        onClick={handleGoogleLogin}
        icon={FcGoogle}
        text="Google"
        colorScheme="gray"
      />
      <SocialLoginButton
        onClick={handleNaverLogin}
        icon={SiNaver}
        text="Naver"
        bg="#03C759"
        color="white"
      />
      <SocialLoginButton
        onClick={handleKakaoLogin}
        icon={RiKakaoTalkFill}
        text="Kakao"
        bg="#FEE102"
      />
    </>
  );
};
