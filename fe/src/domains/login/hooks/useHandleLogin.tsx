import { useAuthStore } from "../../../common/stores/AuthStore";
import { useNavigate } from "react-router-dom";
import { useToastMessage } from "../../../common/hooks/useToastMessage";
import {ImageRes} from "../../../common/hooks/useImage";

export const useHandleLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useToastMessage();
  const { login } = useAuthStore();

  const handleLogin = async (
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean,
    nickname: string,
    memberId:number,
    profileImage:ImageRes
  ) => {
    try {
      login(accessToken, refreshToken, rememberMe, nickname, memberId, profileImage);
      showToast("login.successTitle", "login.successDescription", "success");
      navigate(`/${nickname}`, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      showToast("login.failTitle", "login.failDescription", "error");
    }
  };

  return handleLogin;
};
