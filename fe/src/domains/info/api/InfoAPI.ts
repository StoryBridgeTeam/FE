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
  entries: { id: number; title: string; content: string },
  imageIds: number[]
) => {
  try {
    const response = await axiosInstance.put(
      `/members/${nickname}/cover-letter/${entries.id}`,
      {
        title: entries.title,
        content: entries.content,
        imageIds,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to update cover letters:", error);
    throw error;
  }
};

export const postCoverLetters = async (
  nickname: string,
  entries: { title: string; content: string, imageIds:number[] }
) => {
  try {
    const response = await axiosInstance.post(
      `/members/${nickname}/cover-letter`,
        entries
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to update cover letters:", error);
    throw error;
  }
};
export const deleteCoverLetters = async (nickname: string, id: number) => {
  try {
    const response = await axiosInstance.delete(
      `/members/${nickname}/cover-letter/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to update cover letters:", error);
    throw error;
  }
};
