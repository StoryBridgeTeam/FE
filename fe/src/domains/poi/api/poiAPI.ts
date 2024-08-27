import axiosInstance from "../../../common/api/axiosInstance";

interface POI {
  id: number | null;
  title: string;
  content: string;
  images: string[];
  index: number;
}

export const getTitles = async (
  nickname: string,
  page: number,
  size: number,
  token?: string
) => {
  const params: Record<string, any> = {
    size: size,
    page: page,
  };

  if (token && token.trim() !== "") {
    params.token = token;
  }

  const response = await axiosInstance.get(`/members/${nickname}/poies`, {
    params,
  });
  console.log("getTitles_response:", response.data);
  return response.data;
};

export const getPOI = async (
  nickname: string,
  poiId: number,
  token?: string
) => {
  const params: Record<string, any> = {};
  if (token && token.trim() !== "") {
    params.token = token;
  }

  const response = await axiosInstance.get(
    `/poies/${poiId}/members/${nickname}`,
    { params }
  );
  return response.data;
};

export const createPOI = async (nickname: string, poiData: POI) => {
  console.log("createPOI_poiData:", poiData);
  const response = await axiosInstance.post(
    `members/${nickname}/poies`,
    poiData
  );
  return response.data;
};

export const updatePOI = async (poiId: number, poiData: POI) => {
  const response = await axiosInstance.put(`/poies/${poiId}`, poiData);
  return response.data;
};

export const deletePOI = async (poiId: number) => {
  const response = await axiosInstance.delete(`/poies/${poiId}`);
  return response.data;
};

export const updatePOIIndexes = async (
  nickname: string,
  modifyList: { id: number; index: number }[]
) => {
  const response = await axiosInstance.put(`/members/${nickname}/poies/index`, {
    modifyList,
  });
  return response.data;
};

export const createPOIComment = async (
  poiId: number,
  nickname: string,
  content: string,
  token?: string
) => {
  const params: Record<string, any> = {};
  if (token && token.trim() !== "") {
    params.token = token;
  }

  const response = await axiosInstance.post(
    `/poies/${poiId}/comment`,
    {
      nickName: nickname,
      content: content,
    },
    { params }
  );
  return response.data;
};

export const getPOIComments = async (
  poiId: number,
  page: number,
  size: number,
  token?: string
) => {
  const params: Record<string, any> = {
    page: page,
    size: size,
  };

  if (token && token.trim() !== "") {
    params.token = token;
  }

  const response = await axiosInstance.get(`/poies/${poiId}/comments`, {
    params,
  });
  return response.data;
};

export const linkPOICommentTag = async (
  poiId: number,
  commentId: number,
  startIndex: number,
  lastIndex: number,
  token?: string
) => {
  const params: Record<string, any> = {};
  if (token && token.trim() !== "") {
    params.token = token;
  }

  const response = await axiosInstance.post(
    `/poies/${poiId}/comments/${commentId}/tag-link`,
    {
      startIndex: startIndex,
      lastIndex: lastIndex,
    },
    { params }
  );

  return response.data;
};
