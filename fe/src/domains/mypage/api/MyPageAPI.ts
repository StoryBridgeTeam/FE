import axiosInstance from "../../../common/api/axiosInstance";

export const getMyPageInfo = async () => {
  const nickname = localStorage.getItem("nickName");
  try {
    const response = await axiosInstance.get(`/members/${nickname}/my-page`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch my page info:", error);
    throw error;
  }
};

export const updateNickname = async (newNickname: string) => {
  try {
    const nickname = localStorage.getItem("nickName");

    const response = await axiosInstance.put(`/members/${nickname}`, {
      nickname: newNickname,
    });
    return response.data.data.nickname;
  } catch (error) {
    console.error("Failed to update nickname:", error);
    throw error;
  }
};

export const updateEmail = async (
  emailVerificationCode: string,
  changeEmail: string
) => {
  try {
    const response = await axiosInstance.put(`/accounts/email`, {
      emailVerificationCode,
      changeEmail,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to update email:", error);
    throw error;
  }
};

export const updatePassword = async (
  originPassword: string,
  newPassword: string
) => {
  try {
    const response = await axiosInstance.put(`/accounts/password`, {
      originPassword,
      newPassword,
    });
    return response.data.data.result;
  } catch (error) {
    console.error("Failed to update password:", error);
    throw error;
  }
};

export const requestEmailVerification = async (email: string) => {
  try {
    const response = await axiosInstance.post(`/identity-verifications/email`, {
      email,
    });
    return response.data.data.identityVerificationId;
  } catch (error) {
    console.error("Failed to request email verification:", error);
    throw error;
  }
};

export const identifyVertification = async (email: string, code: string) => {
  try {
    const response = await axiosInstance.post(
      `/identity-verifications/email/verify`,
      {
        email,
        code,
      }
    );
    return response.data.data.token;
  } catch (error) {
    console.error("Failed to request email verification:", error);
    throw error;
  }
};

export const uploadProfile = async (id: number) => {
    try {
      const response = await axiosInstance.put(`/profile/image`, {
        id,
      });
      return response.data.data;
    } catch (error) {
      console.error("Failed to request email verification:", error);
      throw error;
    }
  };