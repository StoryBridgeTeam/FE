import axiosInstance from "../../../common/api/axiosInstance";

export const getCoverLetters = async (nickname: string, token?: string) => {
  try {
    const response = await axiosInstance.get(
      `/members/${nickname}/cover-letter`,
      {
        params: {
          token,
        },
      }
    );
    return response.data.data;
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
        entries: entries.map(({ id, title, content }) => ({
          id: id === 1000 ? null : id,
          title,
          content,
          createdAt: null,
          modifiedAt: null,
        })),
      }
    );
    return response.data.data.entries;
  } catch (error) {
    console.error("Failed to update cover letters:", error);
    throw error;
  }
};
