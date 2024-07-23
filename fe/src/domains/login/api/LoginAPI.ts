import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const loginUser = async (credentials: {
  id: string;
  password: string;
  rememberMe: boolean;
}) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/token/refresh`,
    {},
    {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        REFRESH_TOKEN: refreshToken,
      },
    }
  );
  return response.data;
};
