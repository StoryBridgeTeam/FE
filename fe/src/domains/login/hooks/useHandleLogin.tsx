import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useToastMessage } from "../../../common/hooks/useToastMessage";

export const useHandleLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useToastMessage();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (
    token: string,
    id: string,
    rememberMe: boolean
  ) => {
    try {
      login(token, id, rememberMe);
      showToast("login.successTitle", "login.successDescription", "success");
      navigate(`/${id}/info`, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      showToast("login.failTitle", "login.failDescription", "error");
    }
  };

  return handleLogin;
};
