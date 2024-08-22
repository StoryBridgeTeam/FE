import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const requestPhoneVerification = async (phoneVerificationData: {
  phoneNumber: string;
  name: string;
  telCompany: string;
  birth: string;
  gender: string;
}) => {
  const response = await axios.post(
    `${API_BASE_URL}/identity-verifications/sms`,
    phoneVerificationData
  );
  return response.data;
};

export const verifyPhoneCode = async (
  identityVerificationId: string,
  code: string
) => {
  const response = await axios.post(
    `${API_BASE_URL}/identity-verifications/sms/verify`,
    {
      identityVerificationId,
      code,
    }
  );
  return response.data;
};

export const requestEmailVerification = async (email: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/identity-verifications/email`,
    {
      email,
    }
  );
  return response.data;
};

export const verifyEmailCode = async (email: string, code: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/identity-verifications/email/verify`,
    {
      email,
      code,
    }
  );
  return response.data;
};

export const checkIdDuplication = async (id: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/identity-verifications/id/dup-check`,
    {
      id,
    }
  );
  return response.data;
};

export const checkNicknameDuplication = async (nickname: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/accounts/dupe-check/nickname?nickname=${nickname}`
  );
  return response.data;
};

export const registerMember = async (memberData: {
  nickname: string;
  email?: string;
  phoneNumber?: string;
  birth?: string;
  gender?: string;
  region: string;
  password: string;
  name: string;
  identityVerificationToken: string;
  invitationToken: string;
  terms1: boolean;
  terms2: boolean;
}) => {
  const { invitationToken, ...restData } = memberData;
  console.log("memberData:", memberData);
  const cleanedMemberData = Object.fromEntries(
    Object.entries(memberData).map(([key, value]) => [
      key,
      value === "" ? null : value,
    ])
  );

  const response = await axios.post(
    `${API_BASE_URL}/accounts/normal?token=${invitationToken}`,
    cleanedMemberData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// import axiosInstance from "../../../common/api/axiosInstance";

// export const requestPhoneVerification = async (phoneVerificationData: {
//   phoneNumber: string;
//   name: string;
//   telCompany: string;
//   birth: string;
//   gender: string;
// }) => {
//   const response = await axiosInstance.post(
//     "/identity-verifications/sms",
//     phoneVerificationData
//   );
//   return response.data;
// };

// export const verifyPhoneCode = async (
//   identityVerificationId: string,
//   code: string
// ) => {
//   const response = await axiosInstance.post(
//     "/identity-verifications/sms/verify",
//     {
//       identityVerificationId,
//       code,
//     }
//   );
//   return response.data;
// };

// export const requestEmailVerification = async (email: string) => {
//   const response = await axiosInstance.post("/identity-verifications/email", {
//     email,
//   });
//   return response.data;
// };

// export const verifyEmailCode = async (email: string, code: string) => {
//   const response = await axiosInstance.post(
//     "/identity-verifications/email/verify",
//     {
//       email,
//       code,
//     }
//   );
//   return response.data;
// };

// export const checkIdDuplication = async (id: string) => {
//   console.log("id:", id);
//   const response = await axiosInstance.post(
//     `/identity-verifications/id/dup-check`,
//     {
//       id,
//     }
//   );
//   console.log("checkIdDuplication:", response);
//   return response.data;
// };

// export const checkNicknameDuplication = async (nickname: string) => {
//   const response = await axiosInstance.get(
//     `/accounts/dupe-check/nickname?nickname=${nickname}`
//   );
//   return response.data;
// };

// export const registerMember = async (memberData: {
//   nickname: string;
//   email?: string;
//   phoneNumber?: string;
//   birth?: string;
//   gender?: string;
//   region: string;
//   password: string;
//   name: string;
//   identityVerificationToken: string;
//   invitationToken: string;
//   terms1: boolean;
//   terms2: boolean;
// }) => {
//   const cleanedMemberData = Object.fromEntries(
//     Object.entries(memberData).map(([key, value]) => [
//       key,
//       value === "" ? null : value,
//     ])
//   );

//   const response = await axiosInstance.post(
//     "/accounts/normal",
//     cleanedMemberData
//   );
//   return response.data;
// };
