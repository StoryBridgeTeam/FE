import axiosInstance from "../../../common/api/axiosInstance";
import { EntryState } from "../types/cardTypes";
import { prepareEntriesForAPI } from "../utils/apiUtils";

export const getIsCreatedCard = async (nickname: string) => {
  const response = await axiosInstance.get(
    `/members/${nickname}/card/is-create`
  );
  console.log("getIsCreatedCard_response:", response.data);
  return response.data;
};

export const createCardInfo = async (
  nickname: string,
  entries: EntryState[]
) => {
  const preparedEntries = prepareEntriesForAPI(entries); // ID를 처리
  console.log("preparedEntries: ", preparedEntries);
  const response = await axiosInstance.post(`/members/${nickname}/card`, {
    entries: preparedEntries,
  });
  return response.data;
};

export const getOriginalCardInfo = async (
  nickname: string,
  type: string,
  token?: string
) => {
  const response = await axiosInstance.get(`/members/${nickname}/origin-card`, {
    params: { type, token },
  });
  return response.data;
};

export const updateOriginalCardInfo = async (
  nickname: string,
  entries: EntryState[]
) => {
  const preparedEntries = prepareEntriesForAPI(entries); // ID를 처리
  const response = await axiosInstance.put(`/members/${nickname}/origin-card`, {
    entries: preparedEntries,
  });
  return response.data;
};

export const getPublicCardInfo = async (
  nickname: string,
  type: string,
  token?: string
) => {
  console.log("nickname: ", nickname);
  const response = await axiosInstance.get(`/members/${nickname}/public-card`, {
    params: { type, token },
  });
  return response.data;
};

export const updatePublicCardInfo = async (
  nickname: string,
  entries: EntryState[]
) => {
  const preparedEntries = prepareEntriesForAPI(entries);
  const response = await axiosInstance.put(`/members/${nickname}/public-card`, {
    entries: preparedEntries,
  });
  return response.data;
};

// // 명함 부가정보(학력 및 경력) 조회
// export const getAdditionalInfo = async (nickname: string) => {
//   const response = await axiosInstance.get(`/members/${nickname}/card/additional-info`);
//   return response.data;
// };

// // 명함 부가정보(학력 및 경력) 삭제
// export const deleteAdditionalInfo = async (nickname: string, id: number) => {
//   const response = await axiosInstance.delete(`/members/${nickname}/card/additional-info/${id}`);
//   return response.data;
// };

// // 명함 부가정보(학력 및 경력) 수정
// export const updateAdditionalInfo = async (nickname: string, id: number, data: any) => {
//   const response = await axiosInstance.put(`/members/${nickname}/card/additional-info/${id}`, data);
//   return response.data;
// };

// // 명함 부가정보(학력 및 경력) 생성
// export const createAdditionalInfo = async (nickname: string, data: any) => {
//   const response = await axiosInstance.post(`/members/${nickname}/card/additional-info`, data);
//   return response.data;
// };
