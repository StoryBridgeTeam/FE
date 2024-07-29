import axios from "axios";
import { useToastMessage } from "../../../common/hooks/useToastMessage";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useLoginUser = () => {
  const { showToast } = useToastMessage();
  const loginUser = async (credentials: {
    id: string;
    password: string;
    rememberMe: boolean;
  }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: credentials.id,
        password: credentials.password,
        rememberMe: credentials.rememberMe,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.code === 4010203) {
          showToast(`login.failTitle`, `login.loginError`, "error");
        } else {
          showToast(`login.failTitle`, `login.error`, "error");
        }
      } else {
        showToast(`login.failTitle`, `login.error`, "error");
      }
    }
  };

  return { loginUser };
};
