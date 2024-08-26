import axiosInstance from "./axiosInstance";

export const uploadImage = async (uploadType: string, formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      `/files/images?type=${uploadType}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const deleteImage = async (imageId: number) => {
  try {
    const response = await axiosInstance.delete(`/files/images/${imageId}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};
