import { useAuthStore } from "../../../common/stores/AuthStore";
import { useNavigate } from "react-router-dom";
import { useToastMessage } from "../../../common/hooks/useToastMessage";

export const useHandleLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useToastMessage();
  const { login } = useAuthStore();

  const handleLogin = async (
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean,
    nickname: string
  ) => {
    try {
      login(accessToken, refreshToken, rememberMe, nickname);
      showToast("login.successTitle", "login.successDescription", "success");
      navigate(`/${nickname}`, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      showToast("login.failTitle", "login.failDescription", "error");
    }
  };

  return handleLogin;
};
