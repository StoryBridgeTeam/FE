import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useToastMessage } from "../../../common/hooks/useToastMessage";

export const useHandleLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useToastMessage();
  const { login } = useAuthStore();

  const handleLogin = async (
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean
  ) => {
    try {
      const nickName = localStorage.getItem("nickName");
      login(accessToken, refreshToken, rememberMe);
      showToast("login.successTitle", "login.successDescription", "success");
      navigate(`/${nickName}`, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      showToast("login.failTitle", "login.failDescription", "error");
    }
  };

  return handleLogin;
};
