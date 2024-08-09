import axiosInstance from "../../../common/api/axiosInstance";
import axios from "axios";

export const getCard = async (nickname: string, token?: string) => {
  try {
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

export const getAdditionalInfo = async (nickname: string) => {
  try {
    const response = await axiosInstance.get(
      `/members/${nickname}/card/additional-info`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching additional info:", error);
    return [];
  }
};

export const updateAdditionalInfo = async (
  nickname: string,
  id: number,
  startDate: string,
  endDate: string,
  content: string
) => {
  try {
    const response = await axiosInstance.put(
      `/members/${nickname}/card/additional-info/${id}`,
      {
        startDate,
        endDate,
        content,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating additional info:", error);
    throw error;
  }
};

export const createAdditionalInfo = async (
  nickname: string,
  startDate: string,
  endDate: string,
  content: string
) => {
  try {
    const response = await axiosInstance.post(
      `/members/${nickname}/card/additional-info`,
      {
        startDate,
        endDate,
        content,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating additional info:", error);
    throw error;
  }
};

export const deleteAdditionalInfo = async (nickname: string, id: number) => {
  try {
    const response = await axiosInstance.delete(
      `/members/${nickname}/card/additional-info/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting additional info:", error);
    throw error;
  }
};
