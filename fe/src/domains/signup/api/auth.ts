import axiosInstance from "../../../common/api/axiosInstance";

export const requestPhoneVerification = async (phoneVerificationData: {
  phoneNumber: string;
  name: string;
  telCompany: string;
  birth: string;
  gender: string;
}) => {
  const response = await axiosInstance.post(
    "/identity-verifications/sms",
    phoneVerificationData
  );
  return response.data;
};

export const verifyPhoneCode = async (
  identityVerificationId: string,
  code: string
) => {
  const response = await axiosInstance.post(
    "/identity-verifications/sms/verify",
    {
      identityVerificationId,
      code,
    }
  );
  return response.data;
};

export const requestEmailVerification = async (email: string) => {
  const response = await axiosInstance.post("/identity-verifications/email", {
    email,
  });
  return response.data;
};

export const verifyEmailCode = async (email: string, code: string) => {
  const response = await axiosInstance.post(
    "/identity-verifications/email/verify",
    {
      email,
      code,
    }
  );
  return response.data;
};

export const checkNicknameDuplication = async (nickname: string) => {
  const response = await axiosInstance.get(
    `/accounts/dupe-check/nickname?nickname=${nickname}`
  );
  return response.data;
};

export const registerMember = async (memberData: {
  nickname: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  birth?: string;
  gender?: string;
  region: string;
  name: string;
  identityVerificationToken: string;
  invitationToken: string;
  terms1: boolean;
  terms2: boolean;
}) => {
  const response = await axiosInstance.post("/accounts/normal", memberData);
  return response.data;
};
