import axiosInstance from "../../../common/api/axiosInstance";

export const getPolicy = async () => {
  try {
    const response = await axiosInstance.get(`/admin/policy`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch policy:", error);
    throw error;
  }
};

export const updatePolicy = async (policyName: string, value: number) => {
  try {
    const response = await axiosInstance.put(`/admin/policy/${policyName}`, {
      value,
    });
    return response.data.data;
  } catch (error) {
    console.error(`Failed to update ${policyName}:`, error);
    throw error;
  }
};
