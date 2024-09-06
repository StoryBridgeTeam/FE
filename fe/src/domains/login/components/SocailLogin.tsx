import {useSocialLogin, UseSocialLoginReturn} from "../hooks/useSocialLogin";
import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import SocialLoginButton from "./SocialLoginButton";

interface SocialLoginProps{
    useSocialLoginHook : UseSocialLoginReturn
}
export const SocialLogin = ({useSocialLoginHook}:SocialLoginProps) => {

  return (
    <>
      <SocialLoginButton
          href={"aa"}
        icon={FcGoogle}
        text="Google"
        // colorScheme="gray"
          bg={"white"}
        border={"1px solid gray"}
      />
      <SocialLoginButton
          href={"aa"}
        icon={SiNaver}
        text="Naver"
        bg="#03C759"
        color="white"
      />
    </>
  );
};
export const GoogleLoginButton = ({token} :{token?:string|null}) => {
    return <SocialLoginButton
        href={token ? `${process.env["REACT_APP_API_BASE_URL"]}/oauth2/authorization/google?invite=${token}` : `${process.env["REACT_APP_API_BASE_URL"]}/oauth2/authorization/google`}
        icon={FcGoogle}
        text="Google"
        // colorScheme="gray"
        bg={"white"}
        border={"1px solid gray"}
    />
}
export const NaverLoginButton = ({token} :{token?:string|null}) => {
    return <SocialLoginButton
        href={token ? `${process.env["REACT_APP_API_BASE_URL"]}/oauth2/authorization/naver?invite=${token}` : `${process.env["REACT_APP_API_BASE_URL"]}/oauth2/authorization/naver`}
        icon={SiNaver}
        text="Naver"
        bg="#03C759"
        color="white"
    />
}
export const KaKaoLoginButton = ({token} :{token?:string|null}) => {
    return <SocialLoginButton
        href={token ? `${process.env["REACT_APP_API_BASE_URL"]}/oauth2/authorization/kakao?invite=${token}` : `${process.env["REACT_APP_API_BASE_URL"]}/oauth2/authorization/kakao`}
        icon={RiKakaoTalkFill}
        text="Kakao"
        bg="#FEE102"
    />
}
