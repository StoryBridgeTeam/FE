import axiosInstance from "../../../common/api/axiosInstance";
import { getNicknameToken } from "../../login/api/nickname";
import axios from "axios";

export const getCard = async (token?: string) => {
  try {
    const nickname = getNicknameToken();
    const response = await axiosInstance.get(`/members/${nickname}/card`, {
      params: {
        type: "DETAIL",
        token,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.code === 4040000) {
        return null;
      }
    }
  }
};
