//import { useHandleLogin } from "./useHandleLogin";


export interface UseSocialLoginReturn {
  handleGoogleLogin : ()=>void,
  handleNaverLogin: ()=>void,
  handleKakaoLogin:()=>void
}
export const useSocialLogin= (token?:string|null) : UseSocialLoginReturn => {
 // const handleLogin = useHandleLogin();
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // const onSubmit = async () => {
    //   const token = "dummy-token";
    //   await handleLogin(token, values.id, values.rememberMe);
    // };
  };

  const handleNaverLogin = () => {
    console.log("Naver login clicked");
  };

  const handleKakaoLogin = () => {
  };

  return {
    handleGoogleLogin,
    handleNaverLogin,
    handleKakaoLogin,
  };
};
