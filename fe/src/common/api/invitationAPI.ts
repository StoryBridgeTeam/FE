import axiosInstance from "./axiosInstance";

export const getInvitationToken = async () => {
  try {
    const nickName = localStorage.getItem("nickName");
    const response = await axiosInstance.post(
      `/members/${nickName}/invitation-tickets`
    );
    return response.data.data.token;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
