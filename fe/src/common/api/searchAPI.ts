import axiosInstance from "./axiosInstance";

export const getSearchResult = async (
  keyword: string,
  page: number,
  size: number
) => {
  try {
    const response = await axiosInstance.get("/members/search", {
      params: { keyword, page, size },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to search users:", error);
    throw error;
  }
};
