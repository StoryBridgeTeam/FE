import axiosInstance from "../../../common/api/axiosInstance";

export const getCoverLetters = async (nickname: string, token?: string) => {
  try {
    const response = await axiosInstance.get(
      `/members/${nickname}/cover-letter`,
      {
        params: {
          token: token || "",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cover letters:", error);
    throw error;
  }
};

export const putCoverLetters = async (
  nickname: string,
  entries: { id: number | null; title: string; content: string }[]
) => {
  try {
    const response = await axiosInstance.put(
      `/members/${nickname}/cover-letter`,
      {
        entries,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update cover letters:", error);
    throw error;
  }
};
